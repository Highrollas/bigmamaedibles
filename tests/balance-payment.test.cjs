const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(filename, dependencies = {}) {
      const source = fs.readFileSync(path.join(__dirname, '..', filename), 'utf8');
      const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
      const module = { exports: {} };
      const requireMock = name => {
            if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
            return dependencies[name];
      };
      new Function('require', 'module', 'exports', compiled)(requireMock, module, module.exports);
      return module.exports;
}

const { getStockRequirements } = load('libs/orderStock.ts');
const single = (id, qty = 1) => ({ productType: 'Single', cartQty: qty, productObj: { _id: id } });
const query = value => ({ session() { return this; }, lean: async () => value, then(resolve, reject) { return Promise.resolve(value).then(resolve, reject); } });

function settlement(stock) {
      const state = {
            order: { orderId: 'HR-1009', _gid: 'user-1', status: 'pending', amountTotal: '25.00', useBalance: '5.00', cartItems: [single('a', 2), single('b')], billingObj: { email: 'customer@example.com' } },
            stock: { ...stock }, credits: [], emails: [], commission: 0, balance: 0, emailFailures: 0,
      };
      let failUpdate = false;
      const Order = {
            findOne: () => query(structuredClone(state.order)),
            findOneAndUpdate(filter, update) {
                  if ('paymentEmailSentAt' in filter && (state.order.paymentEmailSentAt || state.order.paymentEmailSendingAt)) return query(null);
                  const previous = structuredClone(state.order);
                  Object.assign(state.order, update.$set || {});
                  return query(filter.paymentEmailSentAt === null ? previous : structuredClone(state.order));
            },
            async updateOne(filter, update) {
                  Object.assign(state.order, update.$set || {});
                  for (const key of Object.keys(update.$unset || {})) delete state.order[key];
            },
      };
      const mongoose = { startSession: async () => ({
            async withTransaction(callback) {
                  const before = structuredClone(state);
                  try { return await callback(); } catch (error) { Object.assign(state, before); throw error; }
            }, endSession: async () => {},
      }) };
      const module = load('libs/paymentSettlement.ts', {
            mongoose, '@/models/Order': Order,
            '@/models/Products': {
                  findById: id => query(state.stock[id] === undefined ? null : { stockQty: state.stock[id] }),
                  async updateOne(filter, update) {
                        if (failUpdate && filter._id === 'b') throw new Error('Injected stock write failure');
                        state.stock[filter._id] += update.$inc.stockQty;
                        return { modifiedCount: 1 };
                  },
            },
            '@/models/User': { exists: async () => true },
            '@/app/Helper/server': {
                  payOrderCommission: async () => { state.commission++; },
                  rollbackOrderUsedParams: async existing => {
                        if (existing.checkoutRolledBack) return;
                        state.balance += Number(existing.useBalance);
                        state.order.checkoutRolledBack = true;
                  },
            },
            '@/libs/balance': { changeBalance: async entry => { const { session, ...record } = entry; state.credits.push(record); state.balance += entry.amount; } },
            '@/libs/orderStock': { getStockRequirements },
            '@/libs/emailService': { sendEmail: async entry => { state.emails.push(entry); if (state.emailFailures > 0) { state.emailFailures--; return false; } return true; } },
            '@/constants': { TEMPLATE_MAP: { 'on-hold': { subject: 'Order Confirmed', template: 'order-on-hold' } } },
      });
      return { state, ...module, failStockWrite() { failUpdate = true; } };
}

test('stock requirements combine repeated products across singles, bundles, and deals', () => {
      const items = [single('a', 2), {
            productType: 'Bundles', cartQty: 3, productObj: {}, bundleVariation: { selectFields: [{ productId: 'a' }, { productId: 'a' }, { productId: 'b' }] },
      }, { productType: 'CheekyDeals', cartQty: 2, productObj: {}, cheekyVariation: [{ selectFields: [{ productId: 'b' }] }, { selectFields: [{ productId: 'a' }] }] }];
      assert.deepEqual([...getStockRequirements(items)], [['a', 10], ['b', 5]]);
});

test('invalid quantities cannot alter stock', () => {
      for (const qty of [0, -1, 1.5, NaN]) assert.throws(() => getStockRequirements([single('a', qty)]));
});

test('paid order with available stock is confirmed exactly once', async () => {
      const fixture = settlement({ a: 3, b: 1 });
      await fixture.settlePaidOrder('HR-1009');
      await fixture.settlePaidOrder('HR-1009');
      assert.equal(fixture.state.order.status, 'on-hold');
      assert.deepEqual(fixture.state.stock, { a: 1, b: 0 });
      assert.equal(fixture.state.commission, 1);
      assert.equal(fixture.state.credits.length, 0);
      assert.equal(fixture.state.emails.length, 1);
      assert.equal(fixture.state.emails[0].template, 'order-on-hold');
});

test('stock cancellation refunds payment and restores spent balance without consuming other stock', async () => {
      const fixture = settlement({ a: 3, b: 0 });
      await fixture.settlePaidOrder('HR-1009');
      await fixture.settlePaidOrder('HR-1009');
      assert.equal(fixture.state.order.status, 'cancelled');
      assert.equal(fixture.state.order.cancelReason, 'out-of-stock-during-payment');
      assert.equal(fixture.state.order.balanceCredited, '30.00');
      assert.ok(fixture.state.order.paymentReceivedAt);
      assert.deepEqual(fixture.state.stock, { a: 3, b: 0 });
      assert.equal(fixture.state.balance, 30);
      assert.equal(fixture.state.credits.length, 1);
      assert.equal(fixture.state.credits[0].reason, 'Out of Stock');
      assert.equal(fixture.state.commission, 0);
      assert.equal(fixture.state.emails.length, 1);
      assert.equal(fixture.state.emails[0].template, 'order-out-of-stock');
});

test('missing product cancels a paid order and previously restored balance is not refunded twice', async () => {
      const fixture = settlement({ a: 3 });
      fixture.state.order.status = 'cancelled';
      fixture.state.order.checkoutRolledBack = true;
      fixture.state.balance = 5;
      await fixture.settlePaidOrder('HR-1009');
      assert.equal(fixture.state.balance, 30);
      assert.equal(fixture.state.order.cancelReason, 'out-of-stock-during-payment');
});

test('stock write failure rolls back the whole outcome and sends no email', async () => {
      const fixture = settlement({ a: 3, b: 1 });
      fixture.failStockWrite();
      await assert.rejects(fixture.settlePaidOrder('HR-1009'), /Injected stock write failure/);
      assert.deepEqual(fixture.state.stock, { a: 3, b: 1 });
      assert.equal(fixture.state.order.status, 'pending');
      assert.equal(fixture.state.order.paymentReceivedAt, undefined);
      assert.equal(fixture.state.emails.length, 0);
});

test('failed outcome email can retry without repeating stock deductions or refunds', async () => {
      const fixture = settlement({ a: 3, b: 0 });
      fixture.state.emailFailures = 1;
      await fixture.settlePaidOrder('HR-1009');
      assert.equal(fixture.state.order.paymentEmailSentAt, undefined);
      await fixture.settlePaidOrder('HR-1009');
      await fixture.settlePaidOrder('HR-1009');
      assert.equal(fixture.state.balance, 30);
      assert.equal(fixture.state.credits.length, 1);
      assert.equal(fixture.state.emails.length, 2);
      assert.ok(fixture.state.order.paymentEmailSentAt);
});

test('admin balance changes record the difference and duplicate event keys do not change it again', async () => {
      const state = { user: { _id: 'user-1', _gid: 'gid', email: 'test@example.com', balance: '100.00' }, entries: [] };
      const module = load('libs/balance.ts', {
            mongoose: {},
            '@/models/User': { findOne: () => query(state.user), updateOne: async (filter, update) => Object.assign(state.user, update.$set) },
            '@/models/BalanceTransaction': {
                  findOne: filter => query(state.entries.find(entry => entry.eventKey === filter.eventKey)),
                  create: async entries => { state.entries.push(...entries); },
            },
      });
      await module.changeBalance({ userId: 'user-1', targetBalance: 120, reason: 'Refund', counterparty: 'BM', eventKey: 'one', session: {} });
      assert.equal(state.user.balance, '120.00');
      assert.equal(state.entries[0].amount, 20);
      await module.changeBalance({ userId: 'user-1', targetBalance: 120, reason: 'Refund', counterparty: 'BM', eventKey: 'one', session: {} });
      assert.equal(state.entries.length, 1);
      await module.changeBalance({ userId: 'user-1', targetBalance: 105, reason: 'Refund', counterparty: 'BM', eventKey: 'two', session: {} });
      assert.equal(state.entries[1].amount, -15);
      assert.equal(state.user.balance, '105.00');
});

test('paid stock cancellations count as revenue without product, postage, or profit costs', () => {
      const { calcTotals } = load('controllers/Stats.ts', {
            'next/server': {}, '@/models/Order': {}, '@/models/Products': {}, 'date-fns': {},
            '@/app/Helper/server': {},
            '@/constants': { FREE_DELIVERY_MIN_AMOUNT: 100, POST_OFFICE_PARCEL_COST: 4 },
      });
      const accepted = { status: 'on-hold', amountTotal: '40', amountSubTotal: '40', cartItems: [single('a')], billingObj: { email: 'first@example.com' } };
      const cancelled = { ...accepted, status: 'cancelled', amountTotal: '25', cancelReason: 'out-of-stock-during-payment' };
      const totals = calcTotals([accepted, cancelled], new Map([['a', { costPrice: '8' }]]));
      assert.equal(totals.totalRevenue, 65);
      assert.equal(totals.costOfProducts, 8);
      assert.equal(totals.netProfit, 32);
      assert.equal(totals.postOfficeTotal, 4);
      assert.equal(totals.totalOrders, 1);
});

test('balance overview rejects unauthenticated and non-AA admins before querying money data', async () => {
      let admin = null;
      const { GET } = load('app/api/admin/balances/route.ts', {
            '@/app/Helper/server': { getAdminFromSession: async () => admin },
            '@/models/BalanceTransaction': {}, '@/libs/balance': {},
            'next/server': { NextResponse: { json: (body, options) => ({ body, ...options }) } },
      });
      assert.equal((await GET({})).status, 401);
      for (const accessLevel of ['A', 'B', 'C', 'D']) {
            admin = { accessLevel };
            assert.equal((await GET({})).status, 403);
      }
});

test('guest refunds are recorded as pending credit, and verified registration claims each credit once', async () => {
      const state = { user: null, entries: [] };
      const session = { withTransaction: async callback => callback(), endSession: async () => {} };
      const module = load('libs/balance.ts', {
            mongoose: { startSession: async () => session },
            '@/models/User': {
                  findOne: () => query(state.user), findById: () => query(state.user),
                  updateOne: async (filter, update) => Object.assign(state.user, update.$set),
            },
            '@/models/BalanceTransaction': {
                  findOne: filter => query(state.entries.find(entry => entry.eventKey === filter.eventKey)),
                  aggregate: () => query([{ amount: state.entries.filter(entry => entry.pendingAccount).reduce((sum, entry) => sum + entry.amount, 0) }]),
                  create: async entries => { for (const entry of entries) state.entries.push({ ...entry, _id: String(state.entries.length) }); },
                  find: filter => ({ sort: () => query(state.entries.filter(entry => entry.email === filter.email && entry.pendingAccount)) }),
                  updateOne: async (filter, update) => Object.assign(state.entries.find(entry => entry._id === filter._id), update.$set),
            },
      });
      await module.changeBalance({ _gid: 'guest', email: 'test@example.com', amount: 25, reason: 'Out of Stock', counterparty: 'BM', eventKey: 'guest-refund', allowPendingAccount: true, session });
      assert.equal(state.entries[0].pendingAccount, true);
      state.user = { _id: 'new-user', _gid: 'new-gid', email: 'test@example.com', balance: '0.00' };
      await module.claimPendingBalance('new-user');
      await module.claimPendingBalance('new-user');
      assert.equal(state.user.balance, '25.00');
      assert.equal(state.entries.length, 1);
      assert.equal(state.entries[0].pendingAccount, false);
      assert.equal(state.entries[0].userId, 'new-user');
});

test('Onramp rejects missing and incorrect callback tokens before mutating any transaction', async () => {
      const module = load('controllers/Transaction.ts', {
            '@/app/Helper': {}, '@/app/Helper/server': {}, '@/constants': {}, '@/models/Order': {},
            '@/models/Transaction': { findOne: () => ({ select: () => query({ webhookToken: 'private-token' }) }) },
            '@/models/User': {}, '@/schema': {}, axios: {}, './Order': {}, '@/libs/balance': {}, '@/libs/paymentSettlement': {}, crypto: require('node:crypto'),
            'next/server': { NextResponse: { json: (body, options) => ({ body, ...options }) } },
      });
      const request = { url: 'https://example.com/callback?pending=0&txid_out=fake' };
      assert.equal((await module.handleOnrampWebhook(request, 'HR-1009')).status, 401);
      assert.equal((await module.handleOnrampWebhook(request, 'HR-1009', 'incorrect')).status, 401);
});

test('out-of-stock email renders refund amount and guest instructions without the general cancellation template', () => {
      const handlebars = require('handlebars').create();
      handlebars.registerPartial('contact-btn', 'Contact Us');
      handlebars.registerPartial('footer', 'Big Mamas Edibles');
      const template = handlebars.compile(fs.readFileSync(path.join(__dirname, '..', 'emails/order-out-of-stock.hbs'), 'utf8'));
      const html = template({ checkoutObj: { orderId: 'HR-1009', billingObj: { firstName: 'Test' } }, creditedAmount: '30.00', pendingAccount: true });
      assert.match(html, /out of stock/);
      assert.match(html, /&pound;30.00/);
      assert.match(html, /Register an account using this email address/);
      assert.doesNotMatch(html, /Changed Your Mind|Being Packaged/);
});
