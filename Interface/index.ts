
import { Document } from 'mongoose';


export type ProductType = 'CheekyDeals' | 'Bundles' | 'Single';
export type contentStatus = 'published' | 'draft';
export type ShippingCountries = "England" | "Scotland" | "Nothern Ireland" | "Wales" | "";
export type orderStatus = "completed" | "pending" | "on-hold" | "cancelled" | "processing";

export interface ReqResp {
      status: "failed" | "success";
      message: string;
}

export interface IAdmin extends AdminObj, Document<string> { }

export interface AdminObj {
      _id: string;
      email: string;
      password?: string;
      username: string;
      balance: string;
      firstName: string;
      lastName: string;
      status: 'active' | 'disabled' | 'unverified';
      token: string;
      accessLevel: 'AA' | 'A' | 'B' | 'C' | 'D', // AA - Super Admin, A - Admin, B -Investor, C - SEO Content upload, D - order packer
      verificationCode: string;
      verificationCodeExpiresAt: Date;
      shortLived: boolean;
}


export interface filterQuery {
      dateStart?: Date | string;
      dateEnd?: Date | string;
      page: number;
      itemsPerPage: number;
      category?: string;
      nameSearch?: string;
      orderStatus?: string;
      month?: string;
      startFromReset?: string;
}

export interface IProduct extends ProductObj, Document<string> { }

export interface ProductObj {
      _id: string;
      _isBundleOutOfStock?: boolean;
      name: string;
      slug: string;
      description?: string;
      shortDescription?: string;
      price: number;
      categories?: string[];
      images: string[];
      stockQty: number;
      productType: ProductType;
      variations?: VariationObj[];
      status?: contentStatus;
      costPrice?: string;
      createdAt?: Date;
      updatedAt?: Date;
      lastStockUpdate?: Date;
      metadata?: Metadata;
      viewsCount?: number;
      csort?: number;
}



export interface selectField {
      value: string;
      productId: string;
}

export interface VariationObj {
      label: string,
      category: string;
      products?: ProductObj[],
      price: number;
      selectFields: selectField[]
}

export interface CartItem {
      id: string;
      productObj: ProductObj;
      cartQty: number;
      bundleVariation?: VariationObj | null;
      cheekyVariation?: VariationObj[];
      productType: ProductType
}


export interface CategoryObj {
      _id: string;
      name: string;
      slug: string;
      imageUrl?: string;
      description: string;
      views?: number;
      createdAt?: Date;
      updatedAt?: Date;
      metadata: Metadata;
}

export interface ICategory extends CategoryObj, Document<string> { }

export interface AddressObj {
      street: string;
      city: string;
      state?: string;
      country: ShippingCountries;
      postcode: string;
      nickname?: string;
}

export interface TransactionObj {
      _gid: string;
      refrenceId: string;
      amount: string;
      gatewayFee?: string;
      amountUsd: string;
      amountEur: string;
      paymentGateway: object;
      address: string;
      amountCrypto: string;
      coin: string;
      network: string;
      paymentLink?: string;
      provider?: string;
      addressIn?: string;
      txidIn?: string;
      txidOut?: string;
      valueCoin?: string;
      valueForwardedCoin?: string;
      amountPaidUsd?: string;
      amountRequiredUsd?: string;
      balanceCredited?: string;
      webhookData?: object;
      status: "completed" | "pending" | "cancelled" | string;
      createdAt?: string;
}

export interface ITransaction extends TransactionObj, Document<string> { }

export interface ICheckout extends CheckoutObj, Document<string> {
      paymentGateway: PaymentMethod;
      shippingMethod: DeliveryMethodObj;
      _gid?: string;
      orderFilled?: Date;
      isPatched?: boolean
}

export interface CheckoutObj {
      cartItems: CartItem[];
      billingObj: BillingObj;
      paymentGatewayAlias: string;
      shippingMethodAlias: string;
      termsAndCondtionAccepted: boolean;
      coupons: VoucherObj[];
      useBalance: string;
      status?: orderStatus;
      orderId?: string;
      amountTotal?: string;
      amountSubTotal?: string;
      paymentGateway?: PaymentMethod;
      finalTotal?: number;
      createdAt?: string;
      updatedAt?: string;
      refSource?: string;
}

export interface OrderObj {
      _id: string;
      _gid: string;
      cartItems: CartItem[];
      billingObj: BillingObj;
      shippingMethod: DeliveryMethodObj;
      termsAndCondtionAccepted: boolean;
      coupons: VoucherObj[];
      useBalance: string;
      status: orderStatus;
      orderId: string;
      amountTotal: string;
      amountSubTotal: string;
      paymentGateway: PaymentMethod;
      orderFilled?: Date;
      createdAt: string;
      updatedAt: string;
      refSource?: string;
      formChecked?: boolean;
      isFirstTime?: boolean;
      isPatched?: boolean;
}


export interface BillingObj {
      firstName: string;
      lastName: string;
      email: string;
      addressObj: AddressObj;
      default?: boolean;
}

export interface DeliveryMethodObj {
      name: string;
      fee: number;
      alias: string;
      minOrderAmount: number;
      maxOrderAmount: number;
      type: "free" | "paid";
      time: number;
}


export interface ShippingCountriesObj {
      name: ShippingCountries;
      imageUrl: string;
}

export interface _PaymentMethod {
      alias: string,
      name: string,
      image: string,
      details: string[]
      fee: string,
      tutorialLink: string | null;
      imageIcon?: string;
      cardColor?: string;
      accountPopups?: {
            image: string;
            text: string;
      }[];
      orderPopups?: {
            image: string;
            text: string;
      }[];
}

export interface PaymentMethod {
      alias: string,
      name: string,
      image: string | null,
      details: { text: string, color: string }[]
      fee: string,
      tutorialLink: string | null;
      imageIcon?: string;
      cardColor?: string;
      imageText?: string;
      accountPopups?: {
            image: string;
            text: string;
      }[];
      orderPopups?: {
            image: string;
            text: string;
      }[];
}

export interface IUser extends UserObj, Document<string> { }

export interface UserObj {
      _id: string;
      _gid: string;
      email: string;
      password?: string;
      referralCoupon: string;
      referralCouponUsed: boolean;
      verificationCode: string;
      username: string;
      balance: string;
      firstName: string;
      lastName: string;
      billingObj: BillingObj[],
      avatar: string;
      coupon: string;
      status: 'active' | 'disabled' | 'unverified';
      token: string;
      role?: "admin" | "user"
}

export interface AuthUser {
      _id: string;
      _gid: string;
      user: UserObj;
      email: string;
      username: string;
      auth: "user" | "guest"
}

export interface IVoucher extends VoucherObj, Document<string> { }

export interface VoucherObj {
      _id: string
      code: string;
      usageCount: number;
      useageLimit: number;
      usageLimitPerUser: number;
      restrictedUsersIds: string[];
      usageUserIds: string[];
      status: "active" | "inactive";
      cartDiscount: number;
      discountType: "fixedAmount" | "discount",
      voucherType: "referral" | "voucher",
      userId: string;
}

export interface RegistrationObj {
      username: string;
      email: string;
      password: string;
      rePassword: string;
      referralCoupon: string;
      verificationCode: string;
      billingObj: BillingObj;
      avatar: string;
}

export interface IPost extends PostObj, Document<string> { }

export interface PostObj {
      _id: string;
      title: string;
      slug: string;
      content: string;
      viewsCount: number;
      metadata: Metadata;
      creatorId?: string;
      status: contentStatus;
      type: "post" | "blog";
      coverImage: string;
}

export interface BlogObj {
      _id: string;
      title: string;
      slug: string;
      content: string;
      viewsCount: number;
      metadata: Metadata;
      creatorId?: string;
      status: contentStatus;
      type: "post" | "blog";
      coverImage: string;
}

export interface ChatMessage {
      id: string;
      message?: string,
      type: "text" | "media",
      mediaUrl?: string,
      createdAt: string,
      updatedAt: string,
      status: "deleted" | "active" | "flagged",
      sender: { username: string, role: "user" | "admin", avatar: string }
      replyTo?: {
            messageId: string;
            message: string;
            sender: string;
      };
      //client only
      state?: string;
}

export interface IChatRoom extends ChatObj, Document<string> { }

export interface ChatObj {
      _id: string;
      name: string;
      slug: string;
      imageUrl: string;
      messages: ChatMessage[];
      blockedMembers: string[];
      restrictedMembers: string[];
      memebers: Partial<UserObj>[];
      metadata: Metadata;
      description: string;
      creatorId?: string;
      status: "active" | " inactive",
      onlyAdmins: boolean;
      allowPFP: boolean;
}

export interface Metadata {
      title: string,
      ogTitle?: string,
      keywords?: string,
      description?: string
      ogImage?: string
}


export interface AdminStats {

      totalOrders: number;
      totalRevenue: number;
      costOfProducts: number;
      netProfit: number;
      totalProfit: number;
      postOfficeFromRevenue: number;
      postOfficeFromProfit: number;
      postOfficeTotal: number;
      finalProfit?: number;
      newUsers: number;
      totalProductCount: number;
      orderPackagingCost: string;
      productPackagingCost: string;
      usersWithMultipleOrders: number;
}

