import { PaymentMethod } from "@/Interface";

export const paymentMethodTutorial: PaymentMethod[] = [
      {
            alias: "revolut",
            name: "Revolut",
            image: "/assets/images/revolut.png",
            details: [
                  { text: "Pay With Revolut", color: "#000000" },
                  { text: "Supports ApplePay, Google Pay, Debit Card, Bank Transfer", color: "#000000" },
                  { text: "Requires ID", color: "#dc2626" },
                  { text: "24 Hour Wait Time Before First Order", color: "#dc2626" },
                  { text: "Minimum Order Total Must Be £10", color: "#16a34a" },
                  { text: "Low Purchase & Transfer Fees", color: "#16a34a" },
                  { text: "Very Reliable", color: "#16a34a" },
            ],
            fee: "6% Fee",
            tutorialLink: "/how-to-order/revolut",
            imageIcon: "/assets/images/revolut-icon.png",
            cardColor: "#000000",
            accountPopups: [
                  {
                        image: "/assets/images/revolut/account/1.png",
                        text: "Go To App Store Or Play Store And Download Revolut. It Should Look Like This"
                  },
                  {
                        image: "/assets/images/revolut/account/2.png",
                        text: "Open The Revolut App And Click 'Create Account'"
                  },
                  {
                        image: "/assets/images/revolut/account/3.png",
                        text: "Enter Your Phone Number Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/4.png",
                        text: "Click 'Confirm'"
                  },
                  {
                        image: "/assets/images/revolut/account/5.png",
                        text: "Enter The 6 Digit Code That Was Sent To Your Phone Number"
                  },
                  {
                        image: "/assets/images/revolut/account/6.png",
                        text: "Here You Choose Whichever You Want"
                  },
                  {
                        image: "/assets/images/revolut/account/7.png",
                        text: "Select The UK Then Click 'Sign Up Securely'"
                  },
                  {
                        image: "/assets/images/revolut/account/8.png",
                        text: "Enter Your Email Address Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/9.png",
                        text: "Pick A 6 Digit Pin"
                  },
                  {
                        image: "/assets/images/revolut/account/10.png",
                        text: "Here You Choose Whichever You Want"
                  },
                  {
                        image: "/assets/images/revolut/account/11.png",
                        text: "Enter Your First And Last Name Exactly As It Is On Your ID. Middle Names Are Not Needed. Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/12.png",
                        text: "Enter Your Date Of Birth Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/13.png",
                        text: "Enter Your Full Address. It Needs To Match Your ID. Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/14.png",
                        text: "Select The Option That Is Highlighted In The Image Above Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/15.png",
                        text: "Select The Option That Is Highlighted In The Image Above"
                  },
                  {
                        image: "/assets/images/revolut/account/16.png",
                        text: "Select The UK"
                  },
                  {
                        image: "/assets/images/revolut/account/17.png",
                        text: "Select Which ID You Would Like To Use To Confirm Your Identity"
                  },
                  {
                        image: "/assets/images/revolut/account/18.png",
                        text: "Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/19.png",
                        text: "Click 'Agree And Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/20.png",
                        text: "Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/21.png",
                        text: "Click 'No'"
                  },
                  {
                        image: "/assets/images/revolut/account/22.png",
                        text: "Click 'Yes, Only The United Kingdom'"
                  },
                  {
                        image: "/assets/images/revolut/account/23.png",
                        text: "Click 'Agree'"
                  },
                  {
                        image: "/assets/images/revolut/account/24.png",
                        text: "Select The Option That Is Highlighted In The Image Above Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/25.png",
                        text: "Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/26.png",
                        text: "Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/27.png",
                        text: "Click The Top Right Hand Corner 'Not Now'"
                  },
                  {
                        image: "/assets/images/revolut/account/28.png",
                        text: "Click 'Virtual'"
                  },
                  {
                        image: "/assets/images/revolut/account/29.png",
                        text: "Select £0 Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/30.png",
                        text: "Here You Choose Whichever You Want"
                  },
                  {
                        image: "/assets/images/revolut/account/31.png",
                        text: "Now Your Revolut Bank Account Has Been Created But We Still Need To Setup The Cryptocurrency Area. Click The Area In The Red Circle In The Image Above"
                  },
                  {
                        image: "/assets/images/revolut/account/32.png",
                        text: "Click 'Start Trading'"
                  },
                  {
                        image: "/assets/images/revolut/account/33.png",
                        text: "Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/34.png",
                        text: "Click 'Restricted Investor'"
                  },
                  {
                        image: "/assets/images/revolut/account/35.png",
                        text: "Type 7% For Both Questions Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/36.png",
                        text: "Now You Need To Do A Short Quiz. Read The Guide By Clicking 'Learn About Crypto' Once You Have Read It And You Are Ready Click 'Start Quiz'"
                  },
                  {
                        image: "/assets/images/revolut/account/37.png",
                        text: "Click 'No'"
                  },
                  {
                        image: "/assets/images/revolut/account/38.png",
                        text: "Click 'Yes, Only The United Kingdom'"
                  },
                  {
                        image: "/assets/images/revolut/account/39.png",
                        text: "When It Asks You For Your National Insurance Number You Need To Do The Following, Type Any 2 Letters Followed By Any 6 Numbers And Then Followed By 1 Letter. You Do Not Need To Use Your Real National Insurance Number. It Just Has To Look Real. DO NOT USE THE NUMBERS IN THE IMAGE ABOVE, THIS WILL FLAG AS BEING USED TWICE. Create Your Own Using The Instructions Above. Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/40.png",
                        text: "Click 'Agree'"
                  },
                  {
                        image: "/assets/images/revolut/account/41.png",
                        text: "Click 'Accept'"
                  },
                  {
                        image: "/assets/images/revolut/account/42.png",
                        text: "Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/account/43.png",
                        text: "Congratulations, You Have Setup Your Revolut Account And You Will Be Able To Place Your First Order With Us Tomorrow"
                  }
            ],
            orderPopups: [
                  {
                        image: "/assets/images/revolut/order/1.png",
                        text: "The 24 Hour Wait Period Is Over, Now You Can Open Up The Revolut App. Then Click 'Add Money'"
                  },
                  {
                        image: "/assets/images/revolut/order/2.png",
                        text: "Now Pause On This Page. Don't Close The Revolut App Just Temporarily Swipe Off It And Go To The bigmamasedibles.cc Website"
                  },
                  {
                        image: "/assets/images/revolut/order/3.png",
                        text: "Add All The Goodies You Want To Your Box Then Checkout As Guest Or Login To Your Big Mamas Edibles Account"
                  },
                  {
                        image: "/assets/images/revolut/order/4.png",
                        text: "Fill In Your Delivery Information Etc Then Scroll Down To The Payment Option"
                  },
                  {
                        image: "/assets/images/revolut/order/5.png",
                        text: "Select 'Bitcoin Cash' As Your Payment Option Then Click 'Place Order'"
                  },
                  {
                        image: "/assets/images/revolut/order/6.png",
                        text: "You Will Now See The Big Mamas Edibles Payment Page. This Is Where You Will Get All The Information Required To Pay. As You Can See My Order Total Is £25"
                  },
                  {
                        image: "/assets/images/revolut/order/7.png",
                        text: "Now Return To The Revolut App. I Am Going To Add £30 To My Revolut Account. The Extra £5 Is To Cover Any Purchasing And Transfer Fees. Then Click Here To Select Your Payment Method"
                  },
                  {
                        image: "/assets/images/revolut/order/8.png",
                        text: "For This Tutorial I Am Going To Use My Debit Card But You Can Use Any Of The Options Displayed"
                  },
                  {
                        image: "/assets/images/revolut/order/9.png",
                        text: "Now Input Your Debit Card Details Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/revolut/order/10.png",
                        text: "Now Click 'Add Money Securely'"
                  },
                  {
                        image: "/assets/images/revolut/order/11.png",
                        text: "Now Your Account Has Been Topped Up. Now Click The 'Crypto' Tab"
                  },
                  {
                        image: "/assets/images/revolut/order/12.png",
                        text: "Then Click 'Trade'"
                  },
                  {
                        image: "/assets/images/revolut/order/13.png",
                        text: "Then Click 'Buy Crypto'"
                  },
                  {
                        image: "/assets/images/revolut/order/14.png",
                        text: "In The Search Bar Search For 'Bitcoin Cash'"
                  },
                  {
                        image: "/assets/images/revolut/order/15.png",
                        text: "Now Select 'Bitcoin Cash'"
                  },
                  {
                        image: "/assets/images/revolut/order/16.png",
                        text: "Now Click 'Buy'"
                  },
                  {
                        image: "/assets/images/revolut/order/17.png",
                        text: "Now Pause Here"
                  },
                  {
                        image: "/assets/images/revolut/order/18.png",
                        text: "Now Pause On This Page And Go Back To The Big Mamas Edibles Payment Page. As You Can See My Order Total Is £25"
                  },
                  {
                        image: "/assets/images/revolut/order/19.png",
                        text: "Now Im Going To Use The £30 I Topped Up To Purchase £30 Of Bitcoin Cash. I Type £30 Then Click 'Review Order'"
                  },
                  {
                        image: "/assets/images/revolut/order/20.png",
                        text: "Click 'Confirm Order'"
                  },
                  {
                        image: "/assets/images/revolut/order/21.png",
                        text: "The Bitcoin Cash Has Now Been Purchased. Now We Need To Transfer It. Click The X In The Top Left Of The Screen"
                  },
                  {
                        image: "/assets/images/revolut/order/22.png",
                        text: "Now Click The 3 Dots"
                  },
                  {
                        image: "/assets/images/revolut/order/23.png",
                        text: "Select 'Send'"
                  },
                  {
                        image: "/assets/images/revolut/order/24.png",
                        text: "Now Click 'Add Wallet Address'"
                  },
                  {
                        image: "/assets/images/revolut/order/25.png",
                        text: "Now Pause On This Page And Go Back To The Big Mamas Edibles Payment Page"
                  },
                  {
                        image: "/assets/images/revolut/order/26.png",
                        text: "Then Copy The Long Sequence Of Letters And Numbers In The Big Green Box. Then Return To The Revolut App"
                  },
                  {
                        image: "/assets/images/revolut/order/27.png",
                        text: "Paste The Address In The 'Wallet Address' Box Then Click 'Wallet / Exchange'"
                  },
                  {
                        image: "/assets/images/revolut/order/28.png",
                        text: "You Can Select Literally Any Of These Options. I Am Going To Select Coinbase"
                  },
                  {
                        image: "/assets/images/revolut/order/29.png",
                        text: "Now Click 'Save'"
                  },
                  {
                        image: "/assets/images/revolut/order/30.png",
                        text: "Pick A Verification Method. I Have Selected 'Phone Via SMS'"
                  },
                  {
                        image: "/assets/images/revolut/order/31.png",
                        text: "Enter The Verification Code That Was Sent To Your Phone Number"
                  },
                  {
                        image: "/assets/images/revolut/order/32.png",
                        text: "Now Pause Here Again And Go Back To The Big Mamas Edibles Payment Page"
                  },
                  {
                        image: "/assets/images/revolut/order/33.png",
                        text: "Copy The Amount In The Red Circle That Ends In 'BCH'"
                  },
                  {
                        image: "/assets/images/revolut/order/34.png",
                        text: "Return To The Revolut App And Paste The Amount Here Then Click 'Review Transfer'"
                  },
                  {
                        image: "/assets/images/revolut/order/35.png",
                        text: "Click 'Confirm Transfer'"
                  },
                  {
                        image: "/assets/images/revolut/order/36.png",
                        text: "The Bitcoin Cash Has Now Been Purchased And Transferred"
                  },
                  {
                        image: "/assets/images/revolut/order/37.png",
                        text: "Return To The Big Mamas Edibles Payment Page. Now Wait Until This Page Refreshes. It Usually Takes 20-40 Minutes"
                  },
                  {
                        image: "/assets/images/revolut/order/38.png",
                        text: "The Order Has Now Gone Through Successfully, Well Done You Did It!"
                  }
            ],
      },
      {
            alias: "coinbase",
            name: "Coinbase",
            image: "/assets/images/coinbase.png",
            details: [
                  { text: "Pay With Coinbase", color: "#000000" },
                  { text: "Supports ApplePay, Google Pay, Debit Card, Bank Transfer", color: "#000000" },
                  { text: "Requires ID", color: "#dc2626" },
                  { text: "24 Hour Wait Time Before First Order", color: "#dc2626" },
                  { text: "Minimum Order Total Must Be £5", color: "#16a34a" },
                  { text: "Low Purchase & Transfer Fees", color: "#16a34a" },
                  { text: "Very Reliable", color: "#16a34a" },
            ],
            fee: "Roughly 4% Fee",
            tutorialLink: "/how-to-order/coinbase",
            imageIcon: "/assets/images/coinbase-icon.png",
            cardColor: "#0052fe",
            accountPopups: [
                  {
                        image: "/assets/images/coinbase/account/1.png",
                        text: "Go To App Store Or Play Store And Download Coinbase. It Should Look Like This"
                  },
                  {
                        image: "/assets/images/coinbase/account/2.png",
                        text: "Open The Coinbase App And Then Click 'Sign Up'"
                  },
                  {
                        image: "/assets/images/coinbase/account/3.png",
                        text: "Enter Your Email Address Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/4.png",
                        text: "Enter The 6 Digit Code That Was Sent To Your Email, Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/5.png",
                        text: "Create A Password, Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/6.png",
                        text: "Enter Your First And Last Name, Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/7.png",
                        text: "Enter Your Phone Number, Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/8.png",
                        text: "Confirm You Are 18+ And Agree To The User Agreement, Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/9.png",
                        text: "Select The UK For Both Questions Unless You Are A Foreigner Living In The UK, In That Case Select Whichever Country Issued Your ID"
                  },
                  {
                        image: "/assets/images/coinbase/account/10.png",
                        text: "Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/11.png",
                        text: "Fill In The Details On This Page. Do Not Lie Or You Will Fail The ID Check. Make Sure The Information You Put Here Matches Your ID. Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/12.png",
                        text: "Enter Your Address. Again Do Not Lie Here. Make Sure Your Address Is The Same As It Is On Your ID. Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/13.png",
                        text: "You Will See A List Of Options Here. Select The Option That Is Displayed Above"
                  },
                  {
                        image: "/assets/images/coinbase/account/14.png",
                        text: "You Will See A List Of Options Here. Select The Option That Is Displayed Above"
                  },
                  {
                        image: "/assets/images/coinbase/account/15.png",
                        text: "You Will See A List Of Options Here. Select The Option That Is Displayed Above"
                  },
                  {
                        image: "/assets/images/coinbase/account/16.png",
                        text: "Wait For Your Information To Be Verified"
                  },
                  {
                        image: "/assets/images/coinbase/account/17.png",
                        text: "You Will See A List Of Options Here. Select The Option That Is Displayed Above"
                  },
                  {
                        image: "/assets/images/coinbase/account/18.png",
                        text: "You Will See A List Of Options Here. Select The Option That Is Displayed Above"
                  },
                  {
                        image: "/assets/images/coinbase/account/19.png",
                        text: "You Will See A List Of Options Here. Select The Option That Is Displayed Above"
                  },
                  {
                        image: "/assets/images/coinbase/account/20.png",
                        text: "Click 'Lets Go'"
                  },
                  {
                        image: "/assets/images/coinbase/account/21.png",
                        text: "You Will See A List Of Options Here. Select The Option That Is Displayed Above"
                  },
                  {
                        image: "/assets/images/coinbase/account/22.png",
                        text: "You Will See A List Of Options Here. Select The Option That Is Displayed Above"
                  },
                  {
                        image: "/assets/images/coinbase/account/23.png",
                        text: "You Will See A List Of Options Here. Select The Option That Is Displayed Above"
                  },
                  {
                        image: "/assets/images/coinbase/account/24.png",
                        text: "You Will See A List Of Options Here. Select The Option That Is Displayed Above"
                  },
                  {
                        image: "/assets/images/coinbase/account/25.png",
                        text: "Click 'Yes I Accept'"
                  },
                  {
                        image: "/assets/images/coinbase/account/26.png",
                        text: "Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/27.png",
                        text: "Now Its Time To Verify Your Identity, Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/28.png",
                        text: "Select Your Type Of ID"
                  },
                  {
                        image: "/assets/images/coinbase/account/29.png",
                        text: "Enable Camera Access And Then Follow The On Screen Instructions On How To Take Pictures Of Your ID Documents"
                  },
                  {
                        image: "/assets/images/coinbase/account/30.png",
                        text: "Now Take A Selfie To Confirm You Are The Owner Of The ID"
                  },
                  {
                        image: "/assets/images/coinbase/account/31.png",
                        text: "Wait For Your ID To Be Verified"
                  },
                  {
                        image: "/assets/images/coinbase/account/32.png",
                        text: "Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/33.png",
                        text: "When It Asks You For Your National Insurance Number You Need To Do The Following, Type Any 2 Letters Followed By Any 6 Numbers And Then Followed By 1 Letter. You Do Not Need To Use Your Real National Insurance Number. It Just Has To Look Real. DO NOT USE THE NUMBERS IN THE IMAGE ABOVE, THIS WILL FLAG AS BEING USED TWICE. Create Your Own Using The Instructions Above."
                  },
                  {
                        image: "/assets/images/coinbase/account/34.png",
                        text: "Click 'No'"
                  },
                  {
                        image: "/assets/images/coinbase/account/35.png",
                        text: "Click 'Confirm'"
                  },
                  {
                        image: "/assets/images/coinbase/account/36.png",
                        text: "Click 'Yes Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/37.png",
                        text: "The Answers For The Quiz Can Be Found In The Crypto Guide. Watch The Guide Before Attempting The Quiz. If You Fail Multiple Times You Will Be Locked Out For 24 Hours Before Being Able To Retry So Don't Rush. Read The Crypto Guide. When You Are Ready Click 'Take The Quiz'"
                  },
                  {
                        image: "/assets/images/coinbase/account/38.png",
                        text: "Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/account/39.png",
                        text: "Congratulations, You Have Setup Your Coinbase Account And You Will Be Able To Place Your First Order With Us Tomorrow"
                  }
            ],
            orderPopups: [
                  {
                        image: "/assets/images/coinbase/order/1.png",
                        text: "The 24 Hour Wait Period Is Over, Now You Can Open Up The Coinbase App. Then Click 'Get Started'"
                  },
                  {
                        image: "/assets/images/coinbase/order/2.png",
                        text: "You Will See A List Of Payment Options. I Have Selected 'Credit/Debit Card' For This Tutorial"
                  },
                  {
                        image: "/assets/images/coinbase/order/3.png",
                        text: "Fill In Your Card Details Then Click 'Add Card' The Card You Use Must Be In The Same Name As Your Coinbase Account"
                  },
                  {
                        image: "/assets/images/coinbase/order/4.png",
                        text: "Now Click 'Done'"
                  },
                  {
                        image: "/assets/images/coinbase/order/5.png",
                        text: "Now Click 'Get Started'"
                  },
                  {
                        image: "/assets/images/coinbase/order/6.png",
                        text: "Now Click 'Make A Trade'"
                  },
                  {
                        image: "/assets/images/coinbase/order/7.png",
                        text: "Search For 'Bitcoin Cash'"
                  },
                  {
                        image: "/assets/images/coinbase/order/8.png",
                        text: "This Is How Bitcoin Cash Should Look In The Coinbase App. Click On It."
                  },
                  {
                        image: "/assets/images/coinbase/order/9.png",
                        text: "Now Click 'Continue And Trade Crypto'"
                  },
                  {
                        image: "/assets/images/coinbase/order/10.png",
                        text: "Now You Will Be Asked To Enter The Amount Of Bitcoin Cash You Would Like To Purchase. Pause Here. Do Not Close The Coinbase App. Swipe Off The App And Go To The Big Mamas Edibles Website"
                  },
                  {
                        image: "/assets/images/coinbase/order/11.png",
                        text: "Now Add All The Cheeky Goodies You Want To Your Box. Then Continue As 'Guest' Or 'Login' To Your Big Mamas Edibles Account"
                  },
                  {
                        image: "/assets/images/coinbase/order/12.png",
                        text: "Enter Your Delivery Details Etc Etc Then Scroll Down To The Payment Selection"
                  },
                  {
                        image: "/assets/images/coinbase/order/13.png",
                        text: "Select 'Bitcoin Cash' As Your Payment Method. Then Click 'Place Order'"
                  },
                  {
                        image: "/assets/images/coinbase/order/14.png",
                        text: "You Will Now See The Big Mamas Edibles Payment Page. This Is Where You Will Get All The Information Required To Pay. As You Can See My Order Total Is £15. Now Go Back To The Coinbase App."
                  },
                  {
                        image: "/assets/images/coinbase/order/15.png",
                        text: "I Need To Buy £15 Of Bitcoin Cash But Instead I Am Going To Buy £20. The Extra £5 Is To Cover Any Purchasing / Transfer Fees. It Is Your Responsibility To Cover These Fees So ALWAYS Buy Extra Bitcoin Cash. Then Click 'Review Order'"
                  },
                  {
                        image: "/assets/images/coinbase/order/16.png",
                        text: "Now Click 'Buy Now'"
                  },
                  {
                        image: "/assets/images/coinbase/order/17.png",
                        text: "Now That Your Account Has Been Topped Up, Click On The Area Marked In The Red Circle"
                  },
                  {
                        image: "/assets/images/coinbase/order/18.png",
                        text: "Now Click 'Transfer'"
                  },
                  {
                        image: "/assets/images/coinbase/order/19.png",
                        text: "Then Click 'Send Crypto'"
                  },
                  {
                        image: "/assets/images/coinbase/order/20.png",
                        text: "You Will Now Be Asked To Enter The Wallet Address Your Sending To. Now Pause Here Again And Return To The Big Mamas Edibles Payment Page."
                  },
                  {
                        image: "/assets/images/coinbase/order/21.png",
                        text: "Now Copy The Long Sequence Of Numbers And Letters Displayed In The Big Green Box"
                  },
                  {
                        image: "/assets/images/coinbase/order/22.png",
                        text: "Then Go Back To Coinbase And Paste The Address You Just Copied Into The Search Bar. Once You Have Pasted It You Will See It Be Saved And It Will Appear Below The Search Bar. Click On The Saved Wallet Address"
                  },
                  {
                        image: "/assets/images/coinbase/order/23.png",
                        text: "Now Select 'Bitcoin Cash' As The Asset You Would Like To Send"
                  },
                  {
                        image: "/assets/images/coinbase/order/24.png",
                        text: "Now You Will Be Asked To Enter An Amount. Pause Here And Go Back To The Big Mamas Edibles Payment Page"
                  },
                  {
                        image: "/assets/images/coinbase/order/25.png",
                        text: "Now Copy The Amount That Ends In 'BCH' It Is Marked In Red Text"
                  },
                  {
                        image: "/assets/images/coinbase/order/26.png",
                        text: "Now Return To Coinbase. The Next Step Is Very Important So Don't Miss It. Click The Small Arrows Just Below The 0. The 'GBP' Text Should Then Change To 'BCH'. Then Paste The Amount You Copied."
                  },
                  {
                        image: "/assets/images/coinbase/order/27.png",
                        text: "It Should Then Look Similar To This. Make Sure It Says BCH After Your Amount. Not GBP. Then Click 'Preview'"
                  },
                  {
                        image: "/assets/images/coinbase/order/28.png",
                        text: "Now Click 'Self-Custody Wallet'"
                  },
                  {
                        image: "/assets/images/coinbase/order/29.png",
                        text: "Select 'Sending To Myself' Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/coinbase/order/30.png",
                        text: "Now Click 'Continue' Again"
                  },
                  {
                        image: "/assets/images/coinbase/order/31.png",
                        text: "Double Check Everything Looks Right And Then Click 'Send Now'"
                  },
                  {
                        image: "/assets/images/coinbase/order/32.png",
                        text: "The Transfer Has Now Been Started. Now Click 'Done' Then Return To The Big Mamas Edibles Payment Page"
                  },
                  {
                        image: "/assets/images/coinbase/order/33.png",
                        text: "Now Wait Until This Page Refreshes. It Usually Takes 20-40 Minutes"
                  },
                  {
                        image: "/assets/images/coinbase/order/34.png",
                        text: "The Order Has Now Gone Through Successfully, Well Done You Did It 🥳!"
                  }
            ],
      },
      {
            alias: "moonpay",
            name: "MoonPay",
            image: "/assets/images/moonpay-2.png",
            details: [
                  { text: "Pay With Moonpay", color: "#000000" },
                  { text: "Supports ApplePay, Google Pay, Debit Card, Bank Transfer", color: "#000000" },
                  { text: "Requires ID", color: "#dc2626" },
                  { text: "24 Hour Wait Time Before First Order", color: "#dc2626" },
                  { text: "Minimum Order Total Must Be £20", color: "#dc2626" },
                  { text: "High Purchase & Transfer Fees", color: "#dc2626" },
                  { text: "Not Reliable", color: "#dc2626" },
            ],
            fee: "Roughly 4% Fee",
            tutorialLink: "/how-to-order/moonpay",
            imageIcon: "/assets/images/moonpay-icon.png",
            cardColor: "#7d00ff",
            accountPopups: [
                  {
                        image: "/assets/images/moonpay/account/1.png",
                        text: "Go To App Store Or Play Store And Download Moonpay. It Should Look Like This"
                  },
                  {
                        image: "/assets/images/moonpay/account/2.png",
                        text: "Open The Moonpay App Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/account/3.png",
                        text: "Enter Your Email Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/account/4.png",
                        text: "Tick The Box Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/account/5.png",
                        text: "Enter The 6 Digit Code That Was Sent To Your Email"
                  },
                  {
                        image: "/assets/images/moonpay/account/6.png",
                        text: "Click 'Verify Account'"
                  },
                  {
                        image: "/assets/images/moonpay/account/7.png",
                        text: "Click 'Get Started'"
                  },
                  {
                        image: "/assets/images/moonpay/account/8.png",
                        text: "Select The 'UK' Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/account/9.png",
                        text: "Tick The Box Then Click 'I Agree'"
                  },
                  {
                        image: "/assets/images/moonpay/account/10.png",
                        text: "Enter Your First And Last Name Then Your Date Of Birth. Make Sure This Matches Your ID. Middle Names Are Not Needed. Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/account/11.png",
                        text: "Enter Your Address Details. Make Sure This Matches Your ID Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/account/12.png",
                        text: "Enter Your Phone Number Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/account/13.png",
                        text: "Enter The 6 Digit Code That Was Sent To Your Phone Number"
                  },
                  {
                        image: "/assets/images/moonpay/account/14.png",
                        text: "Click 'Get Started'"
                  },
                  {
                        image: "/assets/images/moonpay/account/15.png",
                        text: "Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/account/16.png",
                        text: "Select Your ID Type Then Follow The On Screen Instructions"
                  },
                  {
                        image: "/assets/images/moonpay/account/17.png",
                        text: "Click 'Get Started'"
                  },
                  {
                        image: "/assets/images/moonpay/account/18.png",
                        text: "Click 'Restricted Investor' Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/account/19.png",
                        text: "Type 7% Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/account/20.png",
                        text: "Type 7% Again Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/account/21.png",
                        text: "Tick The Box Then Click 'Confirm'"
                  },
                  {
                        image: "/assets/images/moonpay/account/22.png",
                        text: "Now You Will Need To Take A Quick Test. Read The Guide Before Attempting The Test. All The Answers You Need Are In The Guide. Once You Are Ready To Take The Test Click 'Get Started'"
                  },
                  {
                        image: "/assets/images/moonpay/account/23.png",
                        text: "Once You Have Passed The Test Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/account/24.png",
                        text: "Congratulations, You Have Setup Your Moonpay Account And You Will Be Able To Place Your First Order With Us Tomorrow"
                  }
            ],
            orderPopups: [
                  {
                        image: "/assets/images/moonpay/order/1.png",
                        text: "The 24 Hour Wait Period Is Over, Now You Can Open Up The Moonpay App. Then Click 'Buy'"
                  },
                  {
                        image: "/assets/images/moonpay/order/2.png",
                        text: "Now Click The Search Bar And Search For 'Bitcoin Cash'"
                  },
                  {
                        image: "/assets/images/moonpay/order/3.png",
                        text: "Now Select 'Bitcoin Cash'"
                  },
                  {
                        image: "/assets/images/moonpay/order/4.png",
                        text: "Now You Will Be Asked To Input The Amount You Would Like To Purchase. Pause Here. Do Not Close The App Just Temporarily Swipe Of It. Then Go To The Big Mamas Edibles Website"
                  },
                  {
                        image: "/assets/images/moonpay/order/5.png",
                        text: "Now Add All The Items You Want To Your Box Then Checkout As Guest Or Login To Your Big Mamas Edibles Account"
                  },
                  {
                        image: "/assets/images/moonpay/order/6.png",
                        text: "Fill In Your Delivery Information Etc Then Scroll Down To The Payment Option"
                  },
                  {
                        image: "/assets/images/moonpay/order/7.png",
                        text: "Select 'Bitcoin Cash' As Your Payment Option Then Click 'Place Order'"
                  },
                  {
                        image: "/assets/images/moonpay/order/8.png",
                        text: "You Will Now See The Big Mamas Edibles Payment Page. This Is Where You Will Get All The Information Required To Pay. Copy The Amount Marked In The Red Circle Then Return To The Moonpay App"
                  },
                  {
                        image: "/assets/images/moonpay/order/9.png",
                        text: "The Next Step Is Very Important So Don't Miss It. Click The Small Arrows Just Below The £ Sign. The Sign Should Then Change To 'Bch'. Then Paste The Amount You Copied."
                  },
                  {
                        image: "/assets/images/moonpay/order/10.png",
                        text: "It Should Then Look Similar To This. Make Sure It Says Bch After Your Amount. Then Click 'Continue With Bitcoin Cash'"
                  },
                  {
                        image: "/assets/images/moonpay/order/11.png",
                        text: "You Will Now Be Asked To Choose Your Wallet Address"
                  },
                  {
                        image: "/assets/images/moonpay/order/12.png",
                        text: "Now Go Back To The Big Mamas Edibles Payment Page And Copy The Wallet Address In The Big Green Box"
                  },
                  {
                        image: "/assets/images/moonpay/order/13.png",
                        text: "The Go Back To The Moonpay App And Paste It In The Box. It Will Then Appear Just Below. Click On It"
                  },
                  {
                        image: "/assets/images/moonpay/order/14.png",
                        text: "Now We Will Select Our Choice Of Payment Method. For The Purpose Of This Tutorial Im Going To Pay With Debit Card. Click Here To Change The Payment Method"
                  },
                  {
                        image: "/assets/images/moonpay/order/15.png",
                        text: "Now Select 'Debit Card'"
                  },
                  {
                        image: "/assets/images/moonpay/order/16.png",
                        text: "Now Fill In Your Debit Card Information. You Can Only Use Cards With The Same Name As The Owner Of The Moonpay Account. Then Click 'Add Card'"
                  },
                  {
                        image: "/assets/images/moonpay/order/17.png",
                        text: "Now Click 'Pay With Card'"
                  },
                  {
                        image: "/assets/images/moonpay/order/18.png",
                        text: "Now Tick The Confirmation Boc Then Click 'Continue'"
                  },
                  {
                        image: "/assets/images/moonpay/order/19.png",
                        text: "Your Bitcoin Cash Has Been Purchased And Transferred Well Done. Now Return To The Big Mamas Edibles Payment Page"
                  },
                  {
                        image: "/assets/images/moonpay/order/20.png",
                        text: "Now Wait Until This Page Refreshes. It Usually Takes 20-40 Minutes"
                  },
                  {
                        image: "/assets/images/moonpay/order/21.png",
                        text: "The Order Has Now Gone Through Successfully, Well Done You Did It!"
                  }
            ],
      },
      {
            alias: "bch",
            name: "Bitcoin Cash",
            image: null,
            imageText: "Any Other App",
            details: [
                  {
                        text: "You Can Use Any App Or Platform To Pay For Your Orders As Long As You Pay In Bitcoin Cash (BCH). We Currently Dont Have Any Tutorials For Any Other Apps. If You Are Using Any Other App I Would Assume You Already Know How To Purchase & Transfer Bitcoin Cash. If You Need Any Help Or Have A Question <a class='text-blue-700 underline' href='/contact' target='_blank'>Contact Us</a>", color: "#000000"
                  }
            ],
            fee: "Roughly 4% Fee",
            tutorialLink: null,
            accountPopups: [

            ],
            orderPopups: [

            ],
      },
];
