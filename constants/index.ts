import {
      _PaymentMethod,
      BillingObj,
      CategoryObj,
      DeliveryMethodObj,
      PaymentMethod,
      PostObj,
      ProductObj,
      ProductType,
      ShippingCountriesObj,
} from "@/Interface";

import { Metadata } from "next";

export const CURRENCY_SYMBOL = "£";

export const FILTERED_CATEGORIES = [
      "X- Homepage New Stock",
      "X- Homepage Bundles",
      "X- Homepage Vapes",
      "X- Homepage Accessories",
      "X- Homepage Mixers",
      "X- Homepage Cheeky Deals",
      "X- Homepage Edibles",
      "X- Homepage Pre Rolls",
      "Z- Stock Email Shake / Trim",
      "Z- Stock Email Hash",
      "Z- Stock Email Mixers",
      "Z-Stock Email Vapes",
      "Z- Stock Email Edibles",
      "Z- Stock Email UK Grow",
      "Z- Stock Email Exotic Grow",
      "Z- Stock Email Pre Rolls"
];



export const VARIATION_FILTERED_CATEGORIES = [...FILTERED_CATEGORIES, "Bundles", "CheekyDeals"];
export const APP_URL = process.env.NEXT_PUBLIC_PROD == "true" ? process.env.NEXT_PUBLIC_PROD_APP_URL : process.env.NEXT_PUBLIC_DEV_APP_URL;

export const FREE_DELIVERY_MIN_AMOUNT = 100;

export const MONTHLY_EXPENSES = 8720;

export const WEEKLY_EXPENSES = 2180;

export const POST_OFFICE_PARCEL_COST = 5.70;

export const STATS_START_DATE_ISO = "2026-06-19T15:00:00.000Z";

export const GATEWAY_ENDPOINT = "https://ediblesadmin.bigmamasedibles.cc/api/deposit";

export const MENU_CATEGORIES = [
      {
            emoji: "🛍️",
            name: "Bundles",
            slug: "bundles",
      },
      {
            emoji: "🍬",
            name: "Candy",
            slug: "candy",
      },
      {
            emoji: "🍫",
            name: "Chocolate",
            slug: "chocolate",
      },
      {
            emoji: "🍪",
            name: "Bakery",
            slug: "bakery",
      },
      {
            emoji: "🥤",
            name: "Syrup",
            slug: "syrup",
      },
      {
            emoji: "💊 ",
            name: "Meds",
            slug: "meds",
      },
      {
            emoji: "🪦",
            name: "Death",
            slug: "death",
      },
      {
            emoji: "🫨",
            name: "500mg",
            slug: "edibles-500mg",
      },
      {
            emoji: "🫠",
            name: "1000mg",
            slug: "edibles-1000mg",
      },
      {
            emoji: "🥣",
            name: "Make Your Own",
            slug: "make-your-own",
      },
];

export const USER_MENU_LINKS = [
      { name: "Profile", emoji: "⚙️", slug: "/account/profile" },
      { name: "Orders", emoji: "📦", slug: "/account/orders/" },
      { name: "Addresses", emoji: "🏡", slug: "/account/addresses/" },
      { name: "Balance", emoji: "💷", slug: "/account/dashboard/" },
      { name: "Contact Us", imageUrl: "/assets/images/contact-icon-ed.png", slug: "/contact" }
]

export const MENU_QUICK_LINKS = [
      { name: "Blogs", url: "/blog", emoji: "📚" },
      { name: "How To Order", url: "/how-to-order", emoji: "📦" },
      { name: "Contact Us", url: "/contact", imageUrl: "/assets/images/contact-icon-ed.png" },
      { name: "Chat Rooms", url: "/chat-rooms", emoji: "💬", pwaOnly: true, authOnly: true },
];

export const productTypes: ProductType[] = ["Single", "Bundles", "CheekyDeals"];

export const EMPTY_PRODUCTOBJ: ProductObj = {
      _id: "",
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      price: 40,
      categories: [],
      images: [],
      stockQty: 10,
      productType: "Single",
      variations: [],
      viewsCount: 0,
      status: "published",
      metadata: {
            title: "",
            description: "",
            keywords: ""
      }
}

export const EMPTY_BLOGOBJ: PostObj = {
      _id: "",
      title: "",
      slug: "",
      content: "",
      viewsCount: 0,
      type: "blog",
      metadata: {
            title: "",
            description: "",
            keywords: ""
      },
      status: "draft",
      coverImage: ""
}

export const EMPTY_POSTBJ: PostObj = {
      _id: "",
      title: "",
      slug: "",
      content: "",
      viewsCount: 0,
      type: "post",
      metadata: {
            title: "",
            description: "",
            keywords: ""
      },
      status: "draft",
      coverImage: ""
}

export const EMPTY_CATEGORYOBJ: CategoryObj = {
      _id: "",
      name: "",
      slug: "",
      description: "",
      views: 0,
      imageUrl: "",
      metadata: {
            title: "",
            description: "",
            keywords: ""
      }
}


export const TEMPLATE_MAP: Record<string, { template: string; subject: string }> = {
      'on-hold': {
            template: 'order-on-hold',
            subject: 'Order Placed Successfully 🥳',
      },
      'processing': {
            template: 'order-processing',
            subject: 'Order Shipped 🚚🍃',
      },
      'cancelled': {
            template: 'order-cancelled',
            subject: 'Order Cancelled 😔',
      },
      'completed': {
            template: 'order-completed',
            subject: 'Order Delivered 📦✅',
      },
};


export const SHIPPING_COUNTRIES: ShippingCountriesObj[] = [
      {
            name: "England",
            imageUrl: "/assets/images/england-icon-ed.png",
      },
      {
            name: "Scotland",
            imageUrl: "/assets/images/scotland-icon-ed.png",
      },
      {
            name: "Wales",
            imageUrl: "/assets/images/wales-icon-ed.png",
      },
      {
            name: "Nothern Ireland",
            imageUrl: "/assets/images/nothern-ireland-icon-ed.png",
      },
];

export const DELIVERY_METHODS: DeliveryMethodObj[] = [
      {
            name: "24 Hours Delivery",
            alias: "24hrs-delivery",
            fee: 5,
            minOrderAmount: 1,
            maxOrderAmount: 99,
            type: "paid",
            time: 24 * 60 * 60,
      },
      {
            name: "Free Delivery",
            alias: "24hrs-free-delivery",
            fee: 0,
            minOrderAmount: 100,
            maxOrderAmount: 100000,
            type: "free",
            time: 24 * 60 * 60,
      },
      // {
      //       name: "48hrs £3",
      //       alias: "48hrs-delivery",
      //       fee: 3,
      //       minOrderAmount: 1,
      //       maxOrderAmount: 99,
      //       type: "paid",
      //       time: 48 * 60 * 60,
      // },
];

export const PAYMENT_METHODS: _PaymentMethod[] = [
      // {
      //       alias: "bch",
      //       name: "Bitcoin Cash",
      //       image: "/assets/images/bitcoincash-icon.png",
      //       details: [
      //             "Watch Our Tutorials To Learn How To Pay For Your Order Using Bitcoin Cash (BCH"
      //       ],
      //       fee: "No Fees",
      //       tutorialLink: "/how-to-order",
      // },
      {
            alias: "onramp",
            name: "Onramp Pay",
            image: "/assets/images/wert-pay-icon.png",
            details: [
                  "Pay By Card Through The Onramp Pay Hosted Checkout",
                  "A Secure Payment Link Will Be Created For Your Order After Checkout"
            ],
            fee: "Provider Fees May Apply",
            tutorialLink: null,
      },
];


export const PROFILE_AVATARS = [
      {
            imageUrl: "/assets/images/uncle-snoop.png",
            name: "Uncle Snoop",
            alias: "uncle-snoop"
      },
      {
            imageUrl: "/assets/images/pinky.png",
            name: "Pinky",
            alias: "pinky"
      },
      {
            imageUrl: "/assets/images/boris.png",
            name: "Boris",
            alias: "boris"
      },
      {
            imageUrl: "/assets/images/timmy.png",
            name: "Timmy",
            alias: "timmy"
      },
      {
            imageUrl: "/assets/images/rashy.png",
            name: "Rashy",
            alias: "rashy"
      },
      {
            imageUrl: "/assets/images/moon-walker.png",
            name: "Moon Walker",
            alias: "moon-walker"
      },
      {
            imageUrl: "/assets/images/einstein.png",
            name: "Einstein",
            alias: "einstein"
      },
      {
            imageUrl: "/assets/images/poter.png",
            name: "Pot Er",
            alias: "poter"
      },
      {
            imageUrl: "/assets/images/juan-ounce.png",
            name: "Juan Ounce",
            alias: "juan-ounce"
      },
      {
            imageUrl: "/assets/images/jaw-dropper.png",
            name: "Jaw Dropper",
            alias: "jaw-dropper"
      },
      {
            imageUrl: "/assets/images/stoned.png",
            name: "Stoned",
            alias: "stoned"
      },
      {
            imageUrl: "/assets/images/ghost.png",
            name: "Ghost",
            alias: "ghost"
      }
];

export const EMPTY_BILLING_OBJ: BillingObj = {
      firstName: "",
      lastName: "",
      email: "",
      addressObj: {
            country: "",
            city: "",
            street: "",
            state: "",
            postcode: ""
      }
}

const seoKeywordsUK = [
      // Brand Keywords
      "Bigmamasedibles",
      "Big Mamas Edibles",
      "Bigmamasedibles pods",
      "Bigmamasedibles vapes",
      "Bigmamasedibles cannabis",
      "Bigmamasedibles THC products",

      // Healthy Cannabis Keywords
      "organic cannabis UK",
      "clean THC vapes UK",
      "pesticide-free cannabis UK",
      "lab-tested cannabis oil UK",
      "healthy cannabis products UK",
      "wellness cannabis UK",
      "premium THC cartridges UK",
      "pure cannabis pods UK",
      "solvent-free THC UK",

      // Vape-Related Keywords
      "THC vapes UK",
      "smooth cannabis vapes UK",
      "vape pods for relaxation UK",
      "clean hit vape pens UK",
      "discreet THC vape pens UK",
      "vape pens with natural terpenes UK",
      "THC vape pen for anxiety UK",
      "long-lasting vape pods UK",
      "high potency THC vapes UK",

      // Pods and Cartridges Keywords
      "refillable THC pods UK",
      "premium cannabis pods UK",
      "vape pods for THC UK",
      "1g THC pods UK",
      "flavoured THC cartridges UK",
      "healthy cannabis carts UK",
      "clean cannabis oil pods UK",
      "no-cutting-agent cartridges UK",

      // Buyer Intent Long-Tail Keywords
      "where to buy healthy THC vapes UK",
      "best vape pens for cannabis oil UK",
      "organic cannabis vapes UK",
      "THC pods for beginners UK",
      "discreet cannabis vaping UK",
      "top THC vape pens UK 2026",
      "safe cannabis vape products UK",
      "best cartridges for clean high UK",

      // General SEO Boosters
      "healthy cannabis lifestyle UK",
      "THC for wellness and balance UK",
      "alternatives to smoking cannabis UK",
      "microdosing THC with vapes UK",
      "safe vape brands for cannabis UK",
      "cannabis pods without additives UK"
];

export const DEFAULT_METAOBJ: Metadata = {
      metadataBase: new URL(APP_URL!),
      title: "Big Mamas Edibles | UK’s #1 Cannabis Dispensary | Premium Quality",
      description: "Yes This Is Exactly What You Think It Is. The UK’s #1 Online Dispensary. What You Waiting For? A Red Carpet? Get In Here…",
      keywords: seoKeywordsUK,
      openGraph: {
            title: "Big Mamas Edibles | UK’s #1 Cannabis Dispensary | Premium Quality",
            siteName: "Big Mamas Edibles",
            url: APP_URL,
            description: "Yes This Is Exactly What You Think It Is. The UK’s #1 Online Dispensary. What You Waiting For? A Red Carpet? Get In Here…",
            images: [
                  {
                        url: "/assets/images/logo.png",
                        width: 60,
                        height: 60,
                        alt: "Bigmamasedibles logo",
                  },
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
      applicationName: "Big Mamas Edibles",
};


export const DESC_TEMPLATES = [
      {
            name: "Blank",
            content: ""
      },
      {
            name: "Edibles template",
            content:
                  `
                 <div class="p-2" style="border: 3px solid black; border-radius: 0.375rem; margin-bottom: 1.25rem;">
      <div class="d-flex justify-content-between my-2 px-2">
            <div class="desc-box d-flex align-items-center" style="width: 40%;">
                  <div class="desc-img">
                        <img style="height: 23px; min-width: 20px;" src="/assets/images/thc-icon.png" alt="therpene">
                  </div>
                  <div class="desc-text">THC 500mg</div>
            </div>
            <div class="desc-box d-flex align-items-center" style="width: 35%;">
                  <div class="desc-img">
                        <img style="height: 23px; min-width: 20px;" src="/assets/images/piece-ed.png" alt="therpene">
                  </div>
                  <div class="desc-text">5 Pieces</div>
            </div>
            <div class="desc-box d-flex align-items-center" style="width: 20%;">
                  <div class="desc-img">&pound;</div>
                  <div class="desc-text">30</div>
            </div>
      </div>
     <div class="px-2">
      <div class="mt-4 d-flex align-items-center">
            <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/logo-round.png" alt="produced by">
            </div>
            <div class="desc-list-text" style="color: #e21893">Produced By - Big MaMa's Edibles</div>
      </div>
      <div class="mt-4 d-flex align-items-center desc-border black">
            <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/ingredients-icon-edd.png" alt="Cross"></div>
            <div class="desc-list-text">Ingredients - Glucose Syrup, Starch</div>
      </div>
      <div class="mt-4 d-flex align-items-center desc-border">
            <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/warning-icon-edd.png" alt="Cross"></div>
            <div class="desc-list-text"><span style="color: #ff000a;">Allergy Advice - Nothing To Display</span></div>
      </div>
      <div class="mt-4 d-flex align-items-center desc-border yellow">
            <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/production-date-edd.png" alt="Expiry Date"></div>
            <div class="desc-list-text">Expiry - 2027-06-23</div>
      </div>
      <div class="mt-4 d-flex align-items-center">
            <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/feelings-icon-ed.png" alt="Cross"></div>
            <div class="desc-list-text">Effects - 😵‍💫 Euphoric 😌 Relaxed</div>
      </div>
      <div class="mt-4 d-flex align-items-center">
            <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/taste-icon-ed.png" alt="Cross"></div>
            <div class="desc-list-text">Taste - 🍏 🍒 🍇 🥭 🍉</div>
      </div>
      <div class="mt-4 d-flex align-items-center">
            <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/helpswith-icon-ed.png" alt="Cross"></div>
            <div class="desc-list-text">Helps - 🙁 Depression 😖 Anxiety</div>
      </div>
      <div class="mt-4 mb-2 d-flex align-items-center">
            <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/origin-icon-ed.png" alt="Cross"></div>
            <div class="desc-list-text">Origin- 🇬🇧 United Kingdom</div>
      </div>
     </div>
</div>
                      
            `
      },

]
