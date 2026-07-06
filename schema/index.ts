
import { z } from "zod";

export const validateUserSchema = z.object({
      email: z.string().trim().min(5, "Kindly Enter A Valid Email").email("Please enter a valid email address").toLowerCase(),

      password: z.string().trim().min(4, "Password Must Be At Least 4 In Length"),

      username: z.string().trim().min(2, "Username Must Be At Least 2 In Length")
            .regex(/^[a-zA-Z0-9]+$/, "Username Can Only Contain Letters And Numbers")
            .toLowerCase(),

      referralCoupon: z.string().trim().optional()
});


export const verificationCodeSchema = z.object({
      verificationCode: z.string().trim().min(6, "Kindly Enter A Valid Verification Code")
});

export const verifyEmailSchema = z.object({
      verificationCode: z.string().trim().min(6, "Kindly Enter A Valid Verification Code"),
      email: z.string().trim().email().toLowerCase()
});

export const ProductObjSchema = z.object({
      _id: z.string().trim(),
      name: z.string().trim(),
      slug: z.string().trim(),
      price: z.number(),
      images: z.array(z.string().trim().url()).optional(),
      stockQty: z.number().optional(),
});



export const metaSchema = z.object({
      title: z.string().trim(),
      description: z.string().trim(),
      keywords: z.string().trim()
});

export const SelectFieldSchema = z.object({
      value: z.string().trim(),
      productId: z.string().trim(),
});


export const VariationSchema = z.object({
      label: z.string().trim(),
      category: z.string().trim(),
      price: z.number(),
      selectFields: z.array(SelectFieldSchema)
});

export const ProductUploadSchema = z.object({
      name: z.string().trim(),
      slug: z.string().trim(),
      price: z.number(),
      description: z.string().trim().optional(),
      shortDescription: z.string().trim().optional(),
      categories: z.array(z.string().trim()).min(1),
      images: z.array(z.string().trim().url()).min(1),
      stockQty: z.number(),
      metadata: metaSchema,
      views: z.number().optional(),
      status: z.enum(["published", "draft"]),
      variations: z.array(VariationSchema).optional(),
      productType: z.enum(["Single", "Bundles", "CheekyDeals"]),
      costPrice: z.string().trim().min(0),
});


export const PostUploadSchema = z.object({
      title: z.string().trim(),
      slug: z.string().trim(),
      content: z.string().trim().min(1),
      metadata: metaSchema,
      status: z.enum(["published", "draft"]),
      coverImage: z.string().trim().url(),
});

export const PostUpdateSchema = z.object({
      _id: z.string().trim().min(10),
      title: z.string().trim().min(5),
      slug: z.string().trim(),
      content: z.string().trim().min(1),
      metadata: metaSchema,
      status: z.enum(["published", "draft"]),
      coverImage: z.string().trim().url(),
});

export const ProductUpdateSchema = z.object({
      _id: z.string().trim().min(10),
      name: z.string().trim(),
      slug: z.string().trim(),
      price: z.number(),
      description: z.string().trim().optional(),
      shortDescription: z.string().trim().optional(),
      categories: z.array(z.string().trim()).min(1),
      images: z.array(z.string().trim().url()).min(1),
      stockQty: z.number(),
      metadata: metaSchema,
      views: z.number().optional(),
      status: z.enum(["published", "draft"]),
      variations: z.array(VariationSchema).optional(),
      productType: z.enum(["Single", "Bundles", "CheekyDeals"]),
      costPrice: z.string().trim().min(0),
});

export const deleteSchema = z.object({
      _id: z.string().trim().min(10)
});

export const CartItemSchema = z.object({
      id: z.string().trim(),
      productObj: ProductObjSchema,
      cartQty: z.number().min(1, 'Cart Quantity Must Be At Least 1'),
      bundleVariation: z.union([z.record(z.any()), z.undefined(), VariationSchema]),
      cheekyVariation: z.optional(z.array(VariationSchema)),
      productType: z.enum(['Single', 'Bundles', 'CheekyDeals']),
});

export const BillingAddressSchema = z.object({
      city: z.string().trim().min(1, 'City Is Required'),
      postcode: z.string().trim().min(1, 'Postcode Is Required'),
      street: z.string().trim().min(5, 'The Street Address You Entered Seems Too Short. Please Double Check And Provide A More Detailed Address'),
      state: z.string().trim().optional(),
      country: z.string().trim().min(1, 'Country Is Required'),
      nickname: z.string().trim().min(1, 'Nickname Is Required').optional(),
});

export const BillingObjSchema = z.object({
      firstName: z.string().trim().min(1, 'First Name Is Required'),
      lastName: z.string().trim().min(1, 'Last Name Is Required'),
      email: z.string().trim().email('Invalid Billing Email').toLowerCase(),
      addressObj: BillingAddressSchema,
      default: z.boolean().optional(),
});

export const CheckoutSchema = z.object({
      cartItems: z.array(CartItemSchema),
      billingObj: BillingObjSchema,
      paymentGatewayAlias: z.string().trim().min(1, 'Payment Gateway Is Required'),
      shippingMethodAlias: z.string().trim().min(1, 'Shipping Method Is Required'),
      termsAndCondtionAccepted: z.literal(true),
      coupons: z.array(
            z.object({
                  code: z.string().trim().min(1, 'Invalid Voucher In Order')
            })
      ),
      useBalance: z.string().trim().min(0),
});

export const userUpdateSchema = z.object({
      email: z
            .string()
            .min(5, "Kindly Enter A Valid Email")
            .email("Please Enter A Valid Email Address")
            .toLowerCase()
            .optional(),


      password: z
            .string()
            .min(4, "Password Must Be At Least 4 In Length")
            .optional(),

      currentPassword: z
            .string()
            .min(4, "Password Must Be At Least 4 In Length")
            .optional(),

      billingObj: z
            .array(BillingObjSchema)
            .nonempty("At least one billing address is required")
            .optional(),

      avatar: z.string().trim().min(1, "Avatar Selection Is Required").optional(),
});


export const createUserSchema = z.object({

      username: z
            .string()
            .min(2, "Username Must Be At Least 2 In Length")
            .regex(/^[a-zA-Z0-9]+$/, "Username Can Only Contain Letters And Numbers")
            .toLowerCase(),

      email: z
            .string()
            .min(5, "Kindly Enter A Valid Email")
            .email("Please Enter A Valid Email Address")
            .toLowerCase(),

      password: z
            .string()
            .min(4, "Password Must Be At Least 4 In Length"),

      referralCoupon: z
            .string()
            .optional(),

      verificationCode: z
            .string()
            .min(1, "Verification Code Is Required"),

      billingObj: BillingObjSchema,
      avatar: z
            .string()
            .min(1, "Avatar Selection Is Required"),
});


export const TransactionStatusSchema = z.object({
      transactionId: z.string().trim()
})

export const loginUserSchema = z.object({
      username: z.string().trim()
            .min(2, "Username Must Be At Least 2 In Length")
            .regex(/^[a-zA-Z0-9]+$/, "Username Can Only Contain Letters And Numbers")
            .toLowerCase(),
      password: z.string().trim()
            .min(4, "Password Must Be At Least 4 In Length"),
      isPWA: z.boolean().optional().default(false),
})


export const loginAdminchema = z.object({
      email: z.string().trim().email().toLowerCase(),
      password: z.string().trim()
            .min(4, "Did You Just Sent Me That Password ?😤"),
      verificationCode: z.string().trim()
            .min(4, "You Might Have To Pass The Back Door With That Code 😂"),
});


export const contactFormSchema = z.object({
      name: z.string().trim().min(1, "Name is required"),
      orderId: z.string().trim().optional(),
      email: z.string().trim().email("Invalid email address").toLowerCase(),
      message: z.string().trim().min(1, "Message is required"),
});


export const CategoryUploadSchema = z.object({
      name: z.string().trim().min(2),
      slug: z.string().trim().min(2),
      description: z.string().trim().optional(),
      views: z.number().optional(),
      metadata: metaSchema
});


export const CategoryUpdateSchema = z.object({
      _id: z.string().trim().min(10),
      name: z.string().trim().min(2),
      slug: z.string().trim().min(2),
      description: z.string().trim().optional(),
      views: z.number().optional(),
      metadata: metaSchema
});

export const VoucherUpdateSchema = z.object({
      _id: z.string().trim(),
      code: z.string().trim(),
      cartDiscount: z.number(),
      discountType: z.enum(['fixedAmount', 'discount']),
      usageLimitPerUser: z.number(),
      status: z.enum(['active', 'inactive']),
      useageLimit: z.number(),
});

export const CreateVoucherSchema = z.object({
      code: z.string().trim().min(3),
      cartDiscount: z.number().min(1),
      discountType: z.enum(['fixedAmount', 'discount']),
      usageLimitPerUser: z.number().min(1),
      status: z.enum(['active', 'inactive']),
      useageLimit: z.number().min(1),
});


export const OrderUpdateSchema = z.object({
      _id: z.string().trim().min(1, "Order ID is required"),

      status: z.enum(["pending", "processing", "on-hold", "completed", "cancelled"]),

      billingObj: z.object({
            firstName: z.string().trim().min(1),
            lastName: z.string().trim().min(1),
            email: z.string().trim().email().toLowerCase(),
            addressObj: z.object({
                  street: z.string().trim().min(1),
                  city: z.string().trim().min(1),
                  state: z.string().trim().optional(),
                  country: z.string().trim().min(1),
                  postcode: z.string().trim().min(1),
                  nickname: z.string().trim().optional(),
            }),
      }),

      createdAt: z.string()
});
