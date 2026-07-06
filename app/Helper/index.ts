/* eslint-disable @typescript-eslint/no-explicit-any */

import { AuthUser, CheckoutObj, filterQuery, OrderObj, orderStatus } from '@/Interface';
import { jwtVerify, SignJWT } from 'jose';
import { SafeParseError } from 'zod';
import useAlertStore from '../hooks/store/alert';
import { CURRENCY_SYMBOL } from '@/constants';

/**
 * Generates a random alphanumeric string.
 * @param length - The desired length of the string (default is 16)
 * @returns Random string
 */
export function generateRandomString(length: number = 16): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function generateRandomNumber(length: number = 6): string {
      const chars = '0123456789';
      return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}


/**
 * Capitalizes the first letter of a string.
 * @param str - The input string
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a specified length and appends ellipsis if necessary.
 * @param str - The input string
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string
 */
export function truncate(
      str: string,
      maxLength: number = 50,
      mobileLength?: number
): string {
      // if mobileLength is provided, use it when screen is small
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640; // Tailwind's "sm" breakpoint
      const limit = isMobile && mobileLength !== undefined ? mobileLength : maxLength;

      return str.length > limit ? str.slice(0, limit) + '...' : str;
}
/**
 * Checks if a value is empty (null, undefined, empty string, or array/object with no keys)
 * @param val - The value to check
 * @returns Boolean
 */
export function isEmpty(val: unknown): boolean {
      if (val == null) return true;
      if (typeof val === 'string' && val.trim() === '') return true;
      if (Array.isArray(val) && val.length === 0) return true;
      if (typeof val === 'object' && Object.keys(val).length === 0) return true;
      return false;
}

/**
 * Formats a date to a readable string (e.g., Apr 25, 2026)
 * @param date - The input date
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
      const d = new Date(date);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateNum(date: string | Date): string {
      const d = new Date(date);
      return d.toLocaleDateString();
}

export function getTimeAgo(input: Date | string): string {
      const date = typeof input === 'string' ? new Date(input) : input;
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      const intervals = [
            { label: 'year', seconds: 365 * 24 * 60 * 60 },
            { label: 'month', seconds: 30 * 24 * 60 * 60 },
            { label: 'day', seconds: 24 * 60 * 60 },
            { label: 'hour', seconds: 60 * 60 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 },
      ];

      for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count > 0) {
                  return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
            }
      }

      return 'just now';
}


export function getStatusClass(status: orderStatus) {
      if (status === "on-hold") {
            return "order-on-hold";
      } else if (status === "cancelled") {
            return "order-cancelled";
      } else if (status === "processing") {
            return "order-processing";
      } else if (status === "completed") {
            return "order-completed";
      } else if (status === "pending") {
            return "order-pending";
      } else return status;
}

export function getOrderStatusText(status: orderStatus) {
      if (status === "on-hold") {
            return "Preparing";
      } else if (status === "cancelled") {
            return "Cancelled";
      } else if (status === "processing") {
            return "On Its Way";
      } else if (status === "completed") {
            return "Delivered";
      } else if (status === "pending") {
            return "Pending";
      } else return status;
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function scrollIntoViewById(
      id: string,
      options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }
) {
      const element = document.getElementById(id);
      if (element) {
            element.scrollIntoView(options);
      }
}

export function clickElement(id: string) {
      const e = document.getElementById(id);
      if (e) e.click();
}

export function clickClassElements(selector: string) {
      const elements = document.querySelectorAll<HTMLElement>('.' + selector);
      elements.forEach((el) => el.click())
}


export function signToken({ data, secret, expiry }: { data: Record<string, unknown>, secret: string; expiry: string }) {
      return new Promise<string | null>((resolve) => {
            const _secret = new TextEncoder().encode(secret);
            new SignJWT({ ...data })
                  .setProtectedHeader({ alg: 'HS256' })
                  .setExpirationTime(expiry)
                  .sign(_secret).then((token) => {
                        resolve(token)
                  }, () => {
                        resolve(null);
                  })
      })
}

export function verifyToken(token: string, _secret: string, rBool = true) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new Promise<AuthUser & any>((resolve, reject) => {
            const secret = new TextEncoder().encode(_secret);
            jwtVerify(token, secret).then((data) => {
                  resolve(data.payload as unknown as AuthUser)
            }, (err) => {
                  reject(rBool ? false : err);
            })
      });
};


export function flattenErrorMessage(result: SafeParseError<unknown>) {
      return Object.values(result.error.flatten().fieldErrors)
            .flat()
            .filter(Boolean)
            .join(', ')
}

export function sendFirstErrorMessage(result: SafeParseError<unknown>) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)
            .flat()
            .find(Boolean);

      console.error('Validation Error:', result);

      return firstError == "Required" ? "All Input Field Are Required" : firstError || 'An unknown error occurred';
}

export const copyToClipboard = (text: string, m: string) => {
      navigator.clipboard.writeText(text);
      useAlertStore.getState().setModalMessage(m)
}

export const getQueryString = (queryObj: filterQuery): string => {
      const query = new URLSearchParams();

      Object.entries(queryObj).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                  query.append(key, String(value));
            }
      });

      return `?${query.toString()}`;
};


export const generateMeta = ({ title, description, keywords, imageUrl }: { title: string, description?: string, keywords?: string[], imageUrl?: string }) => {

      const meta = {
            title: "Big Mamas Edibles | UK’s #1 Cannabis Dispensary | Premium Quality",
            description: "Yes This Is Exactly What You Think It Is. The UK’s #1 Online Dispensary. What You Waiting For? A Red Carpet? Get In Here…",
            keywords: ["Bigmamasedibles"],
            openGraph: {
                  title: "Big Mamas Edibles | UK’s #1 Cannabis Dispensary | Premium Quality",
                  description: "Yes This Is Exactly What You Think It Is. The UK’s #1 Online Dispensary. What You Waiting For? A Red Carpet? Get In Here…",
                  images: [
                        {
                              url: "/assets/images/logo.png",
                              width: 1200,
                              height: 630,
                              alt: "Bigmamasedibles logo",
                        },
                  ],
            },
            twitter: {
                  card: "summary_large_image",
                  title: "Big Mamas Edibles | UK’s #1 Cannabis Dispensary",
                  description: "Yes This Is Exactly What You Think It Is. The UK’s #1 Online Dispensary. What You Waiting For? A Red Carpet? Get In Here…",
                  images: ["/assets/images/logo.png"],
            },
            icons: {
                  icon: "/assets/images/logo.png",
                  shortcut: "/assets/images/logo.png",
                  apple: "/assets/images/logo.png",
            },
            applicationName: "Bigmamasedibles"
      };

      if (title) meta.title = title;
      if (description) meta.description = description;
      if (keywords) meta.keywords = keywords;
      if (imageUrl) {
            meta.openGraph.images = [
                  {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: "Bigmamasedibles logo",
                  }
            ];
            meta.twitter.images = [imageUrl];
      }

      return meta;
}


export const htmlToText = (html: string) => {
      if (!html) return '';

      // Replace common HTML entities manually
      const entityMap: { [key: string]: string } = {
            '&rlm': '',
            '&lrm': '',
            '&nbsp;': ' ',
            '&amp;': '&',
            '&quot;': '"',
            '&#39;': "'",
            '&lt;': '<',
            '&gt;': '>',
            '&pound': CURRENCY_SYMBOL,
            ';': '',
      };

      let text = html
            .replace(/<div[^>]*>/gi, ' ')
            .replace(/<[^>]+>/g, '') // Remove remaining tags
            .replace(/\s+/g, ' ')    // Collapse multiple spaces
            .trim();

      // Decode entities
      Object.keys(entityMap).forEach(entity => {
            text = text.replace(new RegExp(entity, 'g'), entityMap[entity]);
      });

      return text;
};



export const generateKeywords = (name: string): string => {
      const cleaned = name.trim().toLowerCase();

      const keywords = [
            `${cleaned}`,
            `buy ${cleaned}`,
            'buy high quality cannabis online',
            `${cleaned} review`,
            `high quality ${cleaned}`,
            `${cleaned} near me`,
            `${cleaned} for sale`,
            'healthy cannabis',
            `${cleaned} benefits`,
            'Bigmamasedibles',
            `${cleaned} cannabis`,
            'buy cannabis online',
            `${cleaned} Bigmamasedibles`,
            'Highroller',
            'Highrolla',
            'high thc weed',
            'CBD',
            'CBD oil',
            `shop ${cleaned}`,
            'THC',
            'High roller weed',
            'CBD pods',
            `quality ${cleaned}`,
            'cannabis vapes',
            'weed pens',
            'vape pods',
            `${cleaned} effects`,
            'natural cannabis',
            'herbal remedy',
            `natural ${cleaned}`,
            'plant-based healing',
            'calm and relax',
            'sleep support',
            'pain relief',
            'anxiety relief',
            'buy CBD online',
            'weed',
            'marijuana',
            'health cannabis',
            'medical cannabis',
            'CBD',
            'THC',
            `trusted ${cleaned} products`,
            'hemp wellness',
            'natural remedies',
            'plant medicine',
            'cannabis benefits',
            'chronic pain relief',
            'mental health',
            'anxiety relief',
            'stress relief',
            'sleep support',
            'cannabis education',
            'green living',
            'sustainable wellness',
            'High Rolla',
            'high thc weed'
      ];

      return Array.from(new Set(keywords)).join(', ');
};


export const generateCategoryKeywords = (name: string): string => {
      const cleaned = name.trim().toLowerCase();

      const base = [
            `${cleaned}`,
            `buy ${cleaned}`,
            `buy high quality ${cleaned}`,
            `buy ${cleaned} Bigmamasedibles`,
            'Bigmamasedibles',
            `premium ${cleaned}`,
            `organic ${cleaned}`,
            `quality ${cleaned}`,
            `${cleaned} for sale`,
            `${cleaned} Bigmamasedibles`,
            `best ${cleaned} online`,
            `${cleaned} cannabis`,
            `order ${cleaned} online`,
            `${cleaned} near me`,
            `healthy ${cleaned}`,
            `natural ${cleaned}`,
            `Bigmamasedibles ${cleaned}`,
            `shop ${cleaned}`,
            `high quality ${cleaned}`,
            `buy ${cleaned} for wellness`,
            `${cleaned} from healthy cannabis store`,
            `trusted ${cleaned} products`,
      ];

      const healthTags = [
            'CBD',
            'THC',
            'natural remedies',
            'plant-based healing',
            'herbal cannabis',
            'hemp wellness',
            'anxiety relief',
            'sleep aid',
            'stress relief',
            'chronic pain support',
            'medical cannabis',
            'relaxation products',
            'healthy cannabis lifestyle',
            'buy CBD online',
            'green wellness',
            'calm and balance',
      ];

      return Array.from(new Set([...base, ...healthTags])).join(', ');
};

export const generatePostKeywords = (name: string): string => {
      const cleaned = name.trim().toLowerCase();

      const base = [
            `${cleaned}`,
            `${cleaned} Bigmamasedibles`,
            'Bigmamasedibles',
      ];

      const healthTags = [
            'CBD',
            'THC',
            'natural remedies',
            'plant-based healing',
            'herbal cannabis',
            'hemp wellness',
            'anxiety relief',
            'sleep aid',
            'stress relief',
            'chronic pain support',
            'medical cannabis',
            'relaxation products',
            'healthy cannabis lifestyle',
            'buy CBD online',
            'green wellness',
            'calm and balance',
      ];

      return Array.from(new Set([...base, ...healthTags])).join(', ');
};

export const buildAddress = (order: OrderObj | CheckoutObj) => {

      const { billingObj } = order;
      const { firstName, lastName, addressObj } = billingObj;

      return `
            ${firstName} ${lastName}<br>
            ${addressObj.street}<br>
            ${addressObj.city}${addressObj.state ? ', ' + addressObj.state : ''}<br>
            ${addressObj.postcode}<br>
            ${addressObj.country}<br>
      `;
};

export const printShippingLabels = (orderArray: OrderObj[]) => {

      const labelPages = orderArray.map((order) => {

            const shippingAddress = buildAddress(order);
            const orderId = order.orderId;

            return `
                  <div style="width: 450px;page-break-after: always; padding: 5px">
                  <div style="border:5px solid;width:100%">
                  <div>
                        <div style="display: flex; border-bottom: 5px solid black;">
                        <div style="width: 30%; display: flex; align-items: center; justify-content: center; background: black; color: white;">
                        <strong style="font-size: 380%;">24</strong>
                        <div style="margin-top:-30px;font-weight:600">hr</div>
                        </div>
                        <div style="width: 70%; text-align: center;">
                        <p style="font-weight: 500; font-size: 170%;">Tracked 24 - <br>No Signature</p>
                        </div>
                        </div>
                        <div style="border-bottom: 5px solid black; padding: 10px; height: 400px;">
                        <p style="font-weight: 550; padding-top: 20px; font-size: 200%;">
                        Ship To: <br><br>
                        ${shippingAddress}
                        </p>
                        </div>
                  </div>
                  <div style="display: flex;">
                        <div style="width: 50%; text-align: center; border-right: 5px solid black;">
                        <div style="font-weight: 500; padding-top: 20px;font-size:90%">
                        Order Number ${orderId}
                        </div>
                        <div>
                        <img style="width: 80%; height: 60px; margin-top: 6px; margin-bottom: 6px;"
                              src="/assets/images/barcode.png" alt="Barcode">
                        </div>
                        </div>
                        <div style="width: 23%; display: flex; align-items: center; justify-content: end; text-align: center;">
                        <strong>Return <br> Address</strong>
                        </div>
                        <div style="width: 27%; display: flex; align-items: center; justify-content: center;">
                        <img style="width: 80px; height: 80px;"
                        src="/assets/images/return-qrcode.png">
                        </div>
                  </div>
                  </div>
                  </div>
            `;
      }).join('');

      const fullHTML = `
                  <html>
                        <head>
                              <style type="text/css">
                              body {
                              margin: 0;
                              padding: 0;
                              font-family: "Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif;
                              }
                              @media print {
                              body {
                                    -webkit-print-color-adjust: exact;
                                    print-color-adjust: exact;
                              }
                              }
                              </style>
                        </head>
                        <body onload="window.print(); setTimeout(() => window.close(), 500)">
                              ${labelPages}
                        </body>
                  </html>
            `;

      const printWindow = window.open('', '_blank', 'width=400,height=600');
      if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(fullHTML);
            printWindow.document.close();
      }
}

export const getClearedMessages = (chatId: string) => {
      const data = localStorage.getItem(`clearedMessages_${chatId}`)
      return data ? JSON.parse(data) as string[] : []
}

export const addClearedMessages = (chatId: string, messageIds: string[]) => {
      const existing = getClearedMessages(chatId)
      const updated = Array.from(new Set([...existing, ...messageIds]))
      localStorage.setItem(`clearedMessages_${chatId}`, JSON.stringify(updated))
}

/* ---------- Muted Chats Handling ---------- */

export interface MutedChat {
      id: string
      expiresAt: number | null // null = forever
}

/**
 * Returns valid muted chats, automatically purging expired ones.
 */
export const getMutedChats = (): MutedChat[] => {
      const data = localStorage.getItem('mutedChats')
      const list = data ? (JSON.parse(data) as MutedChat[]) : []
      const now = Date.now()
      const valid = list.filter(c => !c.expiresAt || c.expiresAt > now)

      // cleanup if any expired
      if (valid.length !== list.length)
            localStorage.setItem('mutedChats', JSON.stringify(valid))

      return valid
}

/**
 * Mutes a chat for a duration (in ms) or "always".
 * @param chatId - Chat ID to mute
 * @param duration - number (milliseconds) or "always"
 */
export const addMutedChat = (chatId: string, duration?: number | 'always') => {
      const existing = getMutedChats()
      let expiresAt: number | null = null

      if (typeof duration === 'number') expiresAt = Date.now() + duration
      else if (duration === 'always') expiresAt = null

      // Replace or insert
      const updated = existing.filter(c => c.id !== chatId)
      updated.push({ id: chatId, expiresAt })
      localStorage.setItem('mutedChats', JSON.stringify(updated))
}

export const removeMutedChat = (chatId: string) => {
      const existing = getMutedChats()
      const updated = existing.filter(c => c.id !== chatId)
      localStorage.setItem('mutedChats', JSON.stringify(updated))
}

/* ---------- Optional cleanup of expired mutes ---------- */
export const purgeExpiredMutes = () => {
      const existing = getMutedChats()
      const now = Date.now()
      const filtered = existing.filter(c => !c.expiresAt || c.expiresAt > now)
      if (filtered.length !== existing.length) {
            localStorage.setItem('mutedChats', JSON.stringify(filtered))
      }
      return filtered
}


export const isPWA = () => {
      if (typeof window === "undefined") return false;

      return (
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone === true || // for iOS Safari
            document.referrer.includes("android-app://")
      );
};
