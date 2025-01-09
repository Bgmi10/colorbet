//@ts-ignore
import chip10 from "../../public/assets/chips/10_0.png";
//@ts-ignore
import chip20 from "../../public/assets/chips/20_0.png";
//@ts-ignore
import chip50 from "../../public/assets/chips/50_0.png";
//@ts-ignore
import chip100 from "../../public/assets/chips/100_0.png";
//@ts-ignore
import chip200 from "../../public/assets/chips/200_0.png";
//@ts-ignore
import chip500 from "../../public/assets/chips/500_0.png";
//@ts-ignore
import chip1k from "../../public/assets/chips/1000_0.png";
//@ts-ignore
import chip5k from "../../public/assets/chips/5000_0.png";
//@ts-ignore
import chip10k from "../../public/assets/chips/10000_0.png";
//@ts-ignore
import chip20k from "../../public/assets/chips/20000_0.png";
//@ts-ignore
import chip50k from "../../public/assets/chips/50000_0.png";
//@ts-ignore
import chip100k from "../../public/assets/chips/100000_0.png";
//@ts-ignore
import Avatar0 from "../../public/assets/change_head/Avatar0.png";
//@ts-ignore
import Avatar1 from "../../public/assets/change_head/Avatar1.png";
//@ts-ignore
import Avatar2 from "../../public/assets/change_head/Avatar2.png";
//@ts-ignore
import Avatar3 from "../../public/assets/change_head/Avatar3.png";
//@ts-ignore
import Avatar4 from "../../public/assets/change_head/Avatar4.png";
//@ts-ignore
import Avatar5 from "../../public/assets/change_head/Avatar5.png";
//@ts-ignore
import Avatar6 from "../../public/assets/change_head/Avatar6.png";
//@ts-ignore
import Avatar7 from "../../public/assets/change_head/Avatar7.png";
//@ts-ignore
import Avatar8 from "../../public/assets/change_head/Avatar8.png";
//@ts-ignore
import Avatar9 from "../../public/assets/change_head/Avatar9.png";
//@ts-ignore
import Avatar10 from "../../public/assets/change_head/Avatar10.png";
//@ts-ignore
import Avatar11 from "../../public/assets/change_head/Avatar11.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//@ts-ignore
import kotakPng1 from '../../public/assets/kotak.ico'
import { faBank, faCoins, faCreditCard, faExchangeAlt, faExclamationTriangle, faGift, faHeadset, faHistory, faInfoCircle, faMailBulk, faShield, faThunderstorm, faTimesCircle, faUndoAlt, faUserSecret, faWallet } from "@fortawesome/free-solid-svg-icons";
const isprod = false;
export const baseurl = isprod ? 'http://54.165.116.40:3005' : 'http://localhost:3005'

export const validEmail = (email : string) => {
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

    return isValidEmail;
}

export const yellowCoin = "https://cfuibdsd3g.wggos.com/assets/base/native/73/73ab1b52-4131-4273-89a3-77bff838d609.cd265.webp"

export const blackCoin = "https://cfuibdsd3g.wggos.com/assets/base/native/ab/abdf6741-47ec-4fda-8ede-f8f322d3f8dc.7afae.webp"

export const greenCoin = "https://cfuibdsd3g.wggos.com/assets/base/native/de/def76206-7b5e-43ef-8cfa-1393f06ea4fe.cb45b.webp"

export const blueCoin = "https://cfuibdsd3g.wggos.com/assets/base/native/9a/9a65c9aa-9509-482a-b00f-eea22e773048.04f63.webp"

export const sliverCoin = "https://cfuibdsd3g.wggos.com/assets/base/native/5a/5a883e5a-9477-418f-8a59-f73e2eb73e80.d908c.webp"

export const orangeCoin = "https://cfuibdsd3g.wggos.com/assets/base/native/4f/4fc11ef8-3542-460d-b3dd-977465d9b9c0.193f1.webp"

export const purpleCoin = "https://cfuibdsd3g.wggos.com/assets/base/native/25/25a4aaf8-ed6f-474c-89d3-00d2c721b322.9bf1c.webp"

export const redCoin = "https://cfuibdsd3g.wggos.com/assets/base/native/1b/1bff6629-3b38-4355-81f6-88051f393f8d.9eaa9.webp" 

export const dragon = "https://x03k89o0jg.wgbos.com/assets/dtf/native/87/879c87fb-2c55-48f8-8dc1-dfdbefa32d54.899f9.png"

export const tiger = "https://x03k89o0jg.wgbos.com/assets/dtf/native/44/440dbefc-5a17-4121-b481-80c381606fdd.8f0a4.png"

export const depositgif = "https://o878517.715878.com/active/ActiveImg24600857488938825.avif"


export const chips = [
    {
      id: 1,
      url: chip10,
      value: 10,
    },
    {
      id: 2,
      url: chip20,
      value: 20
    },
    {
      id: 3,
      url: chip50,
      value: 50
    },
    {
      id: 4,
      url: chip100,
      value: 100
    },
    {
      id: 5,
      url: chip200,
      value: 200
    },
    {
      id: 6,
      url: chip500,
      value: 500
    },
    {
      id: 7,
      url: chip1k,
      value: 1000
    },
    {
      id: 8,
      url: chip5k,
      value: 5000
    },
    {
      id: 9,
      url: chip10k,
      value: 10000
    },
    {
      id: 10,
      url: chip20k,
      value: 20000
    },{
      id: 11,
      url: chip50k,
      value: 50000
    },{
      id: 12,
      url: chip100k,
      value: 100000
    }
  ]
  


 export const profileAvatar = [
    Avatar0,
    Avatar1,
    Avatar2,
    Avatar3,
    Avatar4,
    Avatar5,
    Avatar6,
    Avatar7,
    Avatar8,
    Avatar9,
    Avatar10,
    Avatar11
  ];


 export const ProfileSetttingsData = [
    {
        id: 1,
        icon: <FontAwesomeIcon icon={faHeadset} className="text-2xl"/>,
        title: "Support & Contact",
        link: "/support-chat"  
    },
    {
        id: 2,
        icon: <FontAwesomeIcon icon={faGift} className="text-2xl"/>,
        link: "/referals",
        title: "Promotion",
    },
    {
        id: 3,
        icon: <FontAwesomeIcon icon={faWallet} className="text-2xl"/>,
        title: "Chip Bank",
        options: [
            {
                id: "1",
                icon: <FontAwesomeIcon icon={faThunderstorm} className="text-2xl"/>,
                title: "Recharge",
                link: "/recharge-chip",
            },
            {
                id: "2",
                title: "Withdrawal",
                link: "/withdrawal-chip",
                icon: <FontAwesomeIcon icon={faCoins} className="text-2xl"/>
            },
            {
                id: "3",
                title: "Transaction history",
                link: "/transaction-history",
                icon: <FontAwesomeIcon icon={faExchangeAlt} className="text-2xl"/>
            },
            {
              id: "4",
              title: "Withdrawal Records",
              link: "/withdrawal-records",
              icon: <FontAwesomeIcon icon={faHistory} className="text-2xl"/>
            }
        ]
    },
    {
        id: 4,
        icon: <FontAwesomeIcon icon={faCreditCard} className="text-2xl"/>,
        title: "Bank Accounts",
        link: "/bank-account",
    },
    {
        id: 5,
        icon: <FontAwesomeIcon icon={faShield} className="text-2xl" />, 
        title: "Account & Security",
        options: [
            {
                id: "1",
                title: "Change Password",
                icon: <FontAwesomeIcon icon={faUndoAlt} className="text-2xl" />,
                link: "/change-password"
            },
            {
                id: "3",
                title: "Login Activity",
                icon: <FontAwesomeIcon icon={faHistory} className="text-2xl" />,
                link: "/login-activity"
            },
            {
                id: "6",
                title: "Close Account",
                icon: <FontAwesomeIcon icon={faTimesCircle} className="text-2xl" />,
                link: "/close-account"
            }
        ],
    },
    {
        id: 6,
        icon: <FontAwesomeIcon icon={faMailBulk} className="text-2xl"/>,
        title: "Report & Feedbacks",
        link: "/report",
    },
    {
        id: 7,
        icon: <FontAwesomeIcon icon={faInfoCircle} className="text-2xl" />,
        title: "Policy & Guidelines",
        options: [
          {
            id: "1",
            title: "Privacy Policy",
            icon: <FontAwesomeIcon icon={faUserSecret} className="text-2xl" />,
            link: "/privacy-policy"
          },
          {
            id: "2",
            title: "Risk Disclosure Agreement",
            icon: <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl" />,
            link: "/risk-disclosure"
          }
        ],
    }
];

export const kotakPng = kotakPng1;

export const appName = "Colorwiz";

export const bankDatas = [
  {
    id: "1",
    bankName: "HDFC Bank",
    imageUrl: "https://www.hdfcbank.com/static/features/%5BBBHOST%5D/theme-nb-hdfc/favicon.ico"
  },
  {
    id: "2",
    bankName: "ICICI Bank",
    imageUrl: "https://www.icicibank.com/etc.clientlibs/icicibank/clientlibs/clientlib-base/resources/images/favicon.ico"
  },
  {
    id: "3",
    bankName: "Kotak Mahindra Bank",
    imageUrl: "https://netbanking.kotak.com/knb2/favicon.ico"
  },
  {
    id: "4",
    bankName: "Axis Bank",
    imageUrl: "https://smartsearch.senseforth.com/AxisProdSmartSearch/Axis_Bank_SS/Images/Loader.gif"
  },
  {
    id: "5",
    bankName: "TNSC Bank",
    imageUrl: "https://www.tnscbank.com/jb-content/uploads/2022/10/favicon.png"
  },
  {
    id: "6",
    bankName: "Airtel Payment Bank",
    imageUrl: "https://www.airtel.in/bank/favicon.ico"
  },
  {
    id: "7",
    bankName: "Bank Of India",
    imageUrl: "https://bankofindia.co.in/o/boi-global-theme/images/favicon.ico"
  },
   {
    id: "8",
    bankName: "AU Small Finance Bank",
    imageUrl: "https://www.aubank.in/assets/images/favicon.png"
  },{
    id: "9",
    bankName: "Bassien Catholic Co-Operative Bank",
  },
  {
    id: "10",
    bankName: "BNP Parabas Bank",
    imageUrl: "https://cdn-group.bnpparibas.com/favicon.ico"
  },
  {
    id: "11",
    bankName: "Bank of Bahrain and Kuwait",
    imageUrl: "https://www.bbkonline.com/wp-content/uploads/2022/11/fav.png?w=32"
  },
  {
    id: "12",
    bankName: "Bob Card",
    imageUrl: "https://www.bobcard.co.in/favicon.ico"
  },
  {
    id: "13",
    bankName: "Bank of Baroda Corporate",
    imageUrl: "https://www.bankofbaroda.in/-/media/project/bob/shared/favicon/favicon.png"
  },
  {
    id: "14",
    bankName: "Bank of Baroda Retail",
    imageUrl: "https://www.bankofbaroda.in/-/media/project/bob/shared/favicon/favicon.png"
  },
  {
    id: "15",
    bankName: "Bank Of Maharashtra"
  },
  {
    id: "16",
    bankName: "Canara Bank"
  },
  {
    id: "17",
    bankName: "Catholic Syrian Bank"
  },
  {
    id: "18",
    bankName: "Central Bank",
    imageUrl: "https://www.centralbankofindia.co.in/sites/default/files/favicon.ico"
  },
  {
    id: "19",
    bankName: "City Union Bank",
    imageUrl: "https://www.cityunionbank.com/assets/frontend/images/favicon.jpg"
  },
  {
    id: "20",
    bankName: "Corporation Bank"
  },
  {
    id: "21",
    bankName: "Cosmos Co-Operative Bank",
    imageUrl: "https://www.cosmosbank.com/images/cosmos-bank-2019-fevicon.png"
  },
  {
    id: "22",
    bankName: "DBS Bank",
    imageUrl: "https://www.dbs.com/in/iwov-resources/flp/splitter/images/maps-icons-pi/DBS.png"
  },
  {
    id: "23",
    bankName: "DCB Bank LTD",
    imageUrl: "https://www.dcbbank.com/favicon.ico"
  },
  {
    id: "24",
    bankName: "Dena Bank"
  },
  {
    id: "25",
    bankName: "Deutsche Bank"
  },
  {
    id: "26",
    bankName: "Dhanlaxmi Bank",
    imageUrl: "https://www.dhanbank.com/images/icons/favicon.png"
  },
  {
    id: "27",
    bankName: "Federal Bank"
  },
  {
    id: "28",
    bankName: "HSBC",
    imageUrl: "https://www.hsbc.co.in/etc.clientlibs/dpws/clientlibs-public/clientlib-site/resources/favicons/favicon-32x32.png"
  },
  {
    id: "29",
    bankName: "IDBI Bank",
  },
  {
    id: "30",
    bankName: "IDFC First Bank",
  }
  ,
  {
    id: "31",
    bankName: "Indian Bank",
    imageUrl: "https://www.netbanking.indianbank.in/img/FavIcon1.png"
  },
  {
    id: "32",
    bankName: "Indusland Bank",
  },
  {
    id: "33",
    bankName: "Indian Overseas Bank"
  },
  {
    id: "34",
    bankName: "Karnataka Bank"
  },
  {
    id: "35",
    bankName: "J&K Bank"
  },
  {
    id: "36",
    bankName: "JANATA SAHAKARI Bank LTD PUNE"
  },
  {
    id: "37",
    bankName: "Karur Vysya Bank",
    imageUrl: "https://www.kvb.co.in/img/icon-192x192.png"
  },
  {
    id: "38",
    bankName: "Lakshmi Vilas Bank - Retail"
  },
  {
    id: "39",
    bankName: "Lakshmi Vilas Bank - Corporate"
  },
  {
    id: "40",
    bankName: "Pubjab National Bank"
  },
  {
    id: "41",
    bankName: "Pubjab & Sind Bank"
  },
  {
    id: "42",
    bankName: "Pubjab & Maharashtra Co-Operative Bank"
  },
  {
    id: "43",
    bankName: "RBL Bank Limited"
  },
  {
    id: "44",
    bankName: "RBS"
  },
  {
    id: "45",
    bankName: "Saraswat Co-Operative Bank"
  },
   {
    id :"46",
    bankName: "The South Indian Bank"
   },
   {
    id: "47",
    bankName: "Standard Chartered Bank"
   },
   {
    id: "48",
    bankName: "TamilNad Mercantile Bank Ltd"
   },
   {
    id: "49",
    bankName: "UCO Bank"
   },
   {
    id: "50",
    bankName: "Union Bank of India"
   },
   {
    id: "51",
    bankName: "Yes Bank"
   },
   {
    id: "52",
    bankName: "The Zorastrain Co-Operative Bank"
   }
]

export const payoutMethods = [
  {
      id: "1",
      name: "UPI Transfer",
      logo: () => <FontAwesomeIcon icon={faWallet} className="text-xl text-yellow-500" />
  },
  {
      id: "2",
      name: "IMPS Transfer",
      logo: () => <FontAwesomeIcon icon={faBank} className="text-xl text-yellow-500" />
  }
];


export const newGif = "https://www.iob.in/new-icon.gif";

export const cal = (second: number, nanoSec: number) => {
  if(!second || !nanoSec)return;
  return second * 1000 + nanoSec / 1000;
}