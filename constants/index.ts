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

export const GATEWAY_ENDPOINT = "https://bchadmin.bigmamasedibles.cc/api/deposit";

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
            slug: "500mg",
      },
      {
            emoji: "🫠",
            name: "1000mg",
            slug: "1000mg",
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
            imageUrl: "/assets/images/england-icon.png",
      },
      {
            name: "Scotland",
            imageUrl: "/assets/images/scotland-icon.png",
      },
      {
            name: "Wales",
            imageUrl: "/assets/images/wales-icon.png",
      },
      {
            name: "Nothern Ireland",
            imageUrl: "/assets/images/nothern-ireland-icon.png",
      },
];

export const DELIVERY_METHODS: DeliveryMethodObj[] = [
      {
            name: "24hrs £5",
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
      {
            alias: "bch",
            name: "Bitcoin Cash",
            image: "/assets/images/bitcoincash-icon.png",
            details: [
                  "Watch Our Tutorials To Learn How To Pay For Your Order Using Bitcoin Cash (BCH"
            ],
            fee: "No Fees",
            tutorialLink: "/how-to-order",
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
            name: "UK Grow Template",
            content: `<div class="p-2" style="border: 3px solid black; border-radius: 0.375rem; margin-bottom: 1.25rem;">
                        <div class="d-flex justify-content-between my-2 px-2">
                        <div class="desc-box hybrid" style="width: 18%;">
                        <div class="wd-type">Hybrid</div>
                        </div>
                        <div class="desc-box d-flex align-items-center" style="width: 35%;">
                        <div class="desc-img"><img style="height: 23px; min-width: 20px;" src="/assets/images/thc-icon.png" alt="therpene"></div>
                        <div class="desc-text">THC 18%</div>
                        </div>
                        <div class="desc-box d-flex align-items-center" style="width: 18%;">
                        <div class="desc-img"><img style="height: 20px; min-width: 20px;" src="/assets/images/desc-weight-icon.png" alt="weight"></div>
                        <div class="desc-text">14g</div>
                        </div>
                        <div class="desc-box d-flex align-items-center" style="width: 18%;">
                        <div class="desc-img">&pound;</div>
                        <div class="desc-text">35</div>
                        </div>
                        </div>
                        <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;" src="/assets/images/produced-by-icon.png" alt="produced by"></div>
                        <div class="desc-list-text">Produced By - theloudlabs</div>
                        </div>
                        <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;" src="/assets/images/cross-Icon.png" alt="Cross"></div>
                        <div class="desc-list-text">Cross - Sunset Sherbet &amp; Girl Scout Cookies</div>
                        </div>
                        <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;" src="/assets/images/feelings-icon.png" alt="Effects"></div>
                        <div class="desc-list-text">Effects - 🫨 Tingly 😌 Relaxed 😂 Giggly</div>
                        </div>
                        <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;" src="/assets/images/taste-icon.png" alt="Taste"></div>
                        <div class="desc-list-text">Taste - 🍋 Lemon 🍋&zwj;🟩 Citrus 🧈 Butter</div>
                        </div>
                        <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;" src="/assets/images/helpswith-icon.png" alt="Helps With"></div>
                        <div class="desc-list-text">Helps - 😖 Anxiety 🙁 Depression 😓 Stress</div>
                        </div>
                        <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;" src="/assets/images/terpenes-icon.png" alt="Terpene"></div>
                        <div class="desc-list-text">Terpenes - Caryophyllene Linalool Limonene</div>
                        </div>
                        <div class="mt-4 mb-2 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;" src="/assets/images/origin-icon.png" alt="Origin"></div>
                        <div class="desc-list-text d-flex align-items-center">Origin - 🇬🇧 United Kingdom</div>
                        </div>
                        </div>
            `
      },
      {
            name: "Edibles template",
            content:
                  `
                  <div class="p-2" style="border: 3px solid black; border-radius: 0.375rem; margin-bottom: 1.25rem;">
                  <div class="d-flex justify-content-between my-2 px-2">
                  <div class="desc-box d-flex align-items-center" style="width: 75%;">
                        <div class="desc-img">
                        <img style="height: 23px; min-width: 20px;" src="/assets/images/thc-icon.png"
                        alt="therpene">
                        </div>
                        <div class="desc-text">THC 18%</div>
                  </div>
                  <div class="desc-box d-flex align-items-center" style="width: 20%;">
                        <div class="desc-img">&pound;</div>
                        <div class="desc-text">35</div>
                  </div>
                  </div>
                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/bme.png" alt="produced by">
                  </div>
                  <div class="desc-list-text" style="color: #cc0f81">Produced By - Big MaMa's Edibles</div>
                  </div>
                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/ingredients-icon.png" alt="Cross"></div>
                  <div class="desc-list-text">Ingredients- Glucose Syrup, Starch, Sugar, Gelatine, Food Colouring,
                        Flavouring &amp; D9 Distillate</div>
                  </div>
                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/warning-icon.png" alt="Cross"></div>
                  <div class="desc-list-text"><span style="color: #ff000a;">Allergy Advice- Nothing To Display</span></div>
                  </div>
                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/feelings-icon.png" alt="Cross"></div>
                  <div class="desc-list-text">Effects- 😵‍💫 Euphoric 😌 Relaxed 😄 Happy</div>
                  </div>
                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/taste-icon.png" alt="Cross"></div>
                  <div class="desc-list-text">Taste- 🍏 🍒 🍇 🥭 🍉</div>
                  </div>
                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/helpswith-icon.png" alt="Cross"></div>
                  <div class="desc-list-text">Helps- 🙁 Depression 😖 Anxiety 😓 Stress</div>
                  </div>
                  <div class="mt-4 mb-2 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/origin-icon.png" alt="Cross"></div>
                  <div class="desc-list-text">Origin- 🇬🇧 United Kingdom</div>
                  </div>
                  </div>
                      
            `
      },
      {
            name: "Vapes template",
            content: `
                  <div class="p-2" style="border: 3px solid black; border-radius: 0.375rem; margin-bottom: 1.25rem;">

                  <div class="d-flex justify-content-between my-2 px-2">

                  <div class="desc-box pe-0 d-flex align-items-center" style="width: 75%;">
                        <div class="desc-img-2"><img style="min-height: 20px; min-width: 100%;"
                        src="/assets/images/cell-x-loud.png" alt="weight"></div>
                  </div>

                  <div class="desc-box d-flex align-items-center" style="width: 18%;">
                        <div class="desc-img">&pound;</div>
                        <div class="desc-text">35</div>
                  </div>

                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/reusable-icon.png" alt="produced by">
                  </div>
                  <div class="desc-list-text">Re-Useable Battery DO NOT THROW AWAY IF PODS FINISH</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/magnetic-connector-icon.png" alt="produced by">
                  </div>
                  <div class="desc-list-text">Removable Magnetic Pod Connection, To Purchase Pods <a target="_blank" style="color: #162ff1;"
                        href="https://bigmamasedibles.cc/product/d9-pods-bundle/">Click Here</a></div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/information-icon.png" alt="produced by">
                  </div>
                  <div class="desc-list-text">For Detailed Information &amp; Intructions <a style="color: #162ff1;"
                        href="https://www.ccell.com/pod-system/luster-pro">Click Here</a></div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/usbc-icon.png" alt="produced by">
                  </div>
                  <div class="desc-list-text">USBC Charging Cable Included</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/power-on-icon.png" alt="produced by">
                  </div>
                  <div class="desc-list-text">Ultimate Safety, 5 Taps To Turn On Or Off</div>
                  </div>


                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/pre-heat-icon.png" alt="produced by">
                  </div>
                  <div class="desc-list-text">Pre Heat Setting, Double Tap &amp; Wait 10 Seconds For Oil To Be Heated Up Before
                  Inhaling</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/settings-icon.png" alt="produced by">
                  </div>
                  <div class="desc-list-text">3 Heat Settings- 6.5W Maximum Flavour, 7.5W Happy Medium Effect, 8.5W Larger
                  Potent Clouds</div>
                  </div>

                  <div class="mt-4 mb-2  d-flex align-items-center px-2">
                  <div class="desc-list-img"><img
                        style="object-fit: contain; width: 100%; height: 100%;"
                        src="/assets/images/anti-clog-icon.png" alt="produced by">
                  </div>
                  <div class="desc-list-text">Full Anti Clog Setting, Double Tap And Wait 10 Seconds To Clear Any And Every
                  Clog</div>
                  </div>

                  </div>

            `
      },
      {
            name: 'Pods template',
            content: `
            
                        <div class="p-2" style="border: 3px solid black; border-radius: 0.375rem; margin-bottom: 1.25rem;">

                        <div class="d-flex justify-content-between my-2 px-2">
                              <div class="desc-box hybrid" style="width: 18%;">
                                    <div class="wd-type">Hybrid</div>
                              </div>
                              <div class="desc-box d-flex align-items-center" style="width: 35%;">
                                    <div class="desc-img"><img style="height: 23px; min-width: 20px;"
                                                src="/assets/images/thc-icon.png" alt="therpene">
                                    </div>
                                    <div class="desc-text">THC 96%</div>
                              </div>
                              <div class="desc-box d-flex align-items-center" style="width: 18%;">
                                    <div class="desc-img"><img style="height: 20px; min-width: 20px;"
                                                src="/assets/images/desc-weight-icon.png" alt="weight"></div>
                                    <div class="desc-text">1g</div>
                              </div>
                              <div class="desc-box d-flex align-items-center" style="width: 18%;">
                                    <div class="desc-img">&pound;</div>
                                    <div class="desc-text">45</div>
                              </div>
                        </div>


                        <div class="mt-4 d-flex align-items-center px-2">
                              <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                          src="/assets/images/cell-logo.png" alt="produced by">
                              </div>
                              <div class="desc-list-text">Pods Produced By CCELL</div>
                        </div>

                        <div class="mt-4 d-flex align-items-center px-2">
                              <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                          src="/assets/images/produced-by-icon.png" alt="produced by">
                              </div>
                              <div class="desc-list-text">Delta 9 Distillate Produced By theloudlabs</div>
                        </div>

                        <div class="mt-4 d-flex align-items-center px-2">
                              <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                          src="/assets/images/abstrax-logo.png" alt="produced by">
                              </div>
                              <div class="desc-list-text">Added Terpenes Produced By Abstrax Tech</div>
                        </div>

                        <div class="mt-4 d-flex align-items-center px-2">
                              <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                          src="/assets/images/information-icon.png" alt="produced by">
                              </div>
                              <div class="desc-list-text">To Learn More About D9 Distillate <a style="color: #162ff1" href="https://bigmamasedibles.cc/what-is-d9-distillate/">
                                    Click&nbsp;Here </a></div>
                        </div>

                        <div class="mt-4 d-flex align-items-center px-2">
                              <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                          src="/assets/images/yellow-warning-icon.png" alt="produced by">
                              </div>
                              <div class="desc-list-text"><span style="color: #ff6800">These Pods Need To Be Paired With The Luster Pro<br>
                              Battery To Purchase The Battery <a style="color: #162ff1"
                                    href="https://bigmamasedibles.cc/product/ccell-luster-pro-battery/"> Click Here </a></span></div>
                        </div>

                        <div class="mt-4 d-flex align-items-center px-2">
                              <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                          src="/assets/images/cross-Icon.png" alt="produced by">
                              </div>
                              <div class="desc-list-text">Cross- Mango Kush &amp; Peaches &amp; Cream</div>
                        </div>


                        <div class="mt-4 d-flex align-items-center px-2">
                              <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                          src="/assets/images/feelings-icon.png" alt="produced by">
                              </div>
                              <div class="desc-list-text">Effects- 😵‍💫 Euphoric 😌 Relaxed 😂 Giggly</div>
                        </div>

                        <div class="mt-4 d-flex align-items-center px-2">
                              <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                          src="/assets/images/taste-icon.png" alt="produced by">
                              </div>
                              <div class="desc-list-text">Taste- 🥭 Mango 🍑 Peach 🍦 Cream</div>
                        </div>


                        <div class="mt-4 d-flex align-items-center px-2">
                              <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                          src="/assets/images/helpswith-icon.png" alt="produced by">
                              </div>
                              <div class="desc-list-text">Helps- 😓 Stress 🙁 Depression 😖 Anxiety</div>
                        </div>

                        <div class="mt-4 mb-2 d-flex align-items-center px-2">
                              <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                          src="/assets/images/terpenes-icon.png" alt="produced by">
                              </div>
                              <div class="desc-list-text">Terpenes- Myrcene Pinene Caryophyllene</div>
                        </div>

                  </div>

            `
      },
      {
            name: "Looseleaf template",
            content: `
            <div class="p-2" style="border: 3px solid black; border-radius: 0.375rem; margin-bottom: 1.25rem;">

                  <div class="mt-2 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/looseleaf-icon.png" alt="produced by">
                        </div>
                        <div class="desc-list-text">Produced By - Looseleaf</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/piece-icon.png" alt="Cross"></div>
                        <div class="desc-list-text">Quantity - 2 Blunt Wraps Per Pack</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/stamp-duty-icon.png" alt="Effects"></div>
                        <div class="desc-list-text">Disclaimer - UK Import Tax / Duty Paid</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/warning-icon.png" alt="Taste"></div>
                        <div class="desc-list-text"><span class='red-color'>Warning- Tobacco Is The Leading Cause Of Cancer. To
                                    Get Help To Stop Visit </span><span><a target="_blank" class="link-color" rel="noreferral" href="https://www.nhs.uk/better-health/quit-smoking/uk-quit-smoking-services/">www.nhs.uk/quit</a></span>
                       </div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/taste-icon.png" alt="Terpene"></div>
                        <div class="desc-list-text">Taste - 🍇 Berry 🧁 Sweet 🫐 Blueberry</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2 mb-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/helpswith-icon.png" alt="Helps With">
                        </div>
                        <div class="desc-list-text">Helps - 😖 Anxiety 🙁 Depression 😓 Stress</div>
                  </div>

            </div>
            `
      },
      {
            name: "Herbs template",
            content: `
            <div class="p-2" style="border: 3px solid black; border-radius: 0.375rem; margin-bottom: 1.25rem;">

                  <div class="mt-2 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/herbs-icon.png" alt="produced by">
                        </div>
                        <div class="desc-list-text">Options- Blue Lotus, Chamomile, Passion, Sage, Marshmallow</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/piece-icon.png" alt="Cross"></div>
                        <div class="desc-list-text">Weight- Each Pack Contains 3.5g</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/stamp-duty-icon.png" alt="Effects"></div>
                        <div class="desc-list-text">Disclaimer - UK Import Tax / Duty Paid</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2 mb-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/helpswith-icon.png" alt="Helps With">
                        </div>
                        <div class="desc-list-text">Helps - 😖 Anxiety 🙁 Depression 😓 Stress</div>
                  </div>

            </div>
            `
      },
      {
            name: "Cigarette template",
            content: `

            <div class="p-2" style="border: 3px solid black; border-radius: 0.375rem; margin-bottom: 1.25rem;">

                  <div class="d-flex justify-content-between mt-2 px-2">
                        <div><img src="/assets/images/benson-and-hedges-icon.png" style="height: 40px;width: auto" alt="Benson-And-Hedges"></div>
                        <div><img src="/assets/images/sterling-icon.png" style="height: 40px;width: auto" alt="Sterling"></div>
                        <div><img src="/assets/images/lambert-butler-logo.png" style="height: 40px;width: auto" alt="Lambert-Butler"></div>
                        <div><img src="/assets/images/marlboro-icon.png" style="height: 40px;width: auto" alt="Marlboro"></div>
                        <div><img src="/assets/images/players-logo.png" style="height: 40px;width: auto" alt="Players"></div>
                        <div><img src="/assets/images/camel-logo.png" style="height: 40px;width: auto" alt="Camel"></div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/stamp-duty-icon.png" alt="Effects"></div>
                        <div class="desc-list-text">Disclaimer - UK Import Tax / Duty Paid</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/warning-icon.png" alt="Taste"></div>
                        <div class="desc-list-text"><span class='red-color'>Warning- Tobacco Is The Leading Cause Of Cancer. To
                                    Get Help To Stop Visit </span><span><a target="_blank" class="link-color" rel="noreferral" href="https://www.nhs.uk/better-health/quit-smoking/uk-quit-smoking-services/">www.nhs.uk/quit</a></span>
                       </div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2 mb-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/helpswith-icon.png" alt="Helps With">
                        </div>
                        <div class="desc-list-text">Helps - 😖 Anxiety 🙁 Depression 😓 Stress</div>
                  </div>

            </div>
            `
      },
      {
            name: "Backwood template",
            content: `
            <div class="p-2" style="border: 3px solid black; border-radius: 0.375rem; margin-bottom: 1.25rem;">

                  <div class="mt-2 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/backwoods-icon.png" alt="produced by">
                        </div>
                        <div class="desc-list-text">Produced By - Backwoods Cigars</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/piece-icon.png" alt="Cross"></div>
                        <div class="desc-list-text">Quantity - 2 Blunt Wraps Per Pack</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/stamp-duty-icon.png" alt="Effects"></div>
                        <div class="desc-list-text">Disclaimer - UK Import Tax / Duty Paid</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/warning-icon.png" alt="Taste"></div>
                        <div class="desc-list-text"><span class='red-color'>Warning- Tobacco Is The Leading Cause Of Cancer. To
                                    Get Help To Stop Visit </span><span><a target="_blank" class="link-color" rel="noreferral" href="https://www.nhs.uk/better-health/quit-smoking/uk-quit-smoking-services/">www.nhs.uk/quit</a></span>
                       </div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/taste-icon.png" alt="Terpene"></div>
                        <div class="desc-list-text">Taste - 🍇 Berry 🧁 Sweet 🫐 Blueberry</div>
                  </div>

                  <div class="mt-4 d-flex align-items-center px-2 mb-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/helpswith-icon.png" alt="Helps With">
                        </div>
                        <div class="desc-list-text">Helps - 😖 Anxiety 🙁 Depression 😓 Stress</div>
                  </div>

            </div>
            `
      },
      {
            name: 'Raw template',
            content: `
              <div class="p-2" style="border: 3px solid black; border-radius: 0.375rem; margin-bottom: 1.25rem;">

                  <div class="d-flex justify-content-between my-2 px-2">

                        <div class="d-flex align-items-center">
                              <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                          src="/assets/images/raw-icon.png" alt="produced by">
                              </div>
                              <div class="desc-list-text">Raw</div>
                        </div>

                        <div class="desc-box d-flex align-items-center" style="width: 18%;">
                              <div class="desc-img">&pound;</div>
                              <div class="desc-text">30</div>
                        </div>

                  </div>

                  <div class="mt-4 d-flex align-items-center px-2 mb-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/information-icon.png" alt="produced by">
                        </div>
                        <div class="desc-list-text">information text</div>
                  </div>

            </div>
                        
            `
      },
      {
            name: 'Elements template',
            content: `
              <div class="p-2" style="border: 3px solid black; border-radius: 0.375rem; margin-bottom: 1.25rem;">

                  <div class="d-flex justify-content-between my-2 px-2">

                        <div class="d-flex align-items-center">
                              <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                          src="/assets/images/elements-logo.png" alt="produced by">
                              </div>
                              <div class="desc-list-text">Elements</div>
                        </div>

                        <div class="desc-box d-flex align-items-center" style="width: 18%;">
                              <div class="desc-img">&pound;</div>
                              <div class="desc-text">30</div>
                        </div>

                  </div>

                  <div class="mt-4 d-flex align-items-center px-2 mb-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/information-icon.png" alt="produced by">
                        </div>
                        <div class="desc-list-text">information text</div>
                  </div>

            </div>
                        
            `
      },
      {
            name: 'Accessory No Brand',
            content: `
              <div class="p-2" style="border: 3px solid black; border-radius: 0.375rem; margin-bottom: 1.25rem;">

                  <div class="d-flex justify-content-end my-2 px-2">

                        <div class="desc-box d-flex align-items-center" style="width: 18%;">
                              <div class="desc-img">&pound;</div>
                              <div class="desc-text">30</div>
                        </div>

                  </div>

                  <div class="mt-4 d-flex align-items-center px-2 mb-2">
                        <div class="desc-list-img"><img style="object-fit: contain; width: 100%; height: 100%;"
                                    src="/assets/images/information-icon.png" alt="produced by">
                        </div>
                        <div class="desc-list-text">information text</div>
                  </div>

            </div>
                        
            `
      }
]
