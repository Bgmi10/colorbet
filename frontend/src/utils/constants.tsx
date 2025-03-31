import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBank, faCoins, faCreditCard, faExchangeAlt, faExclamationTriangle, faGift, faHeadset, faHistory, faInfoCircle, faMailBulk, faShield, faThunderstorm, faTimesCircle, faUndoAlt, faUserSecret, faWallet } from "@fortawesome/free-solid-svg-icons";

export const baseurl = import.meta.env.VITE_APP_NODE_ENV as string === "production" ? 'https://api.casinobharat.space' : 'http://localhost:3005';

export const validEmail = (email : string) => {
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    return isValidEmail;
}

export const chips = [
    {
      id: 1,
      url: "/assets/chips/10_0.png",
      value: 10,
    },
    {
      id: 2,
      url: "/assets/chips/20_0.png",
      value: 20
    },
    {
      id: 3,
      url: "/assets/chips/50_0.png",
      value: 50
    },
    {
      id: 4,
      url: "/assets/chips/100_0.png",
      value: 100
    },
    {
      id: 5,
      url: "/assets/chips/200_0.png",
      value: 200
    },
    {
      id: 6,
      url: "/assets/chips/500_0.png",
      value: 500
    },
    {
      id: 7,
      url: "/assets/chips/1000_0.png",
      value: 1000
    },
    {
      id: 8,
      url: "/assets/chips/5000_0.png",
      value: 5000
    },
    {
      id: 9,
      url: "/assets/chips/10000_0.png",
      value: 10000
    },
    {
      id: 10,
      url: "/assets/chips/20000_0.png",
      value: 20000
    },{
      id: 11,
      url: "/assets/chips/50000_0.png",
      value: 50000
    },{
      id: 12,
      url: "/assets/chips/100000_0.png",
      value: 100000
    }
]
  
export const profileAvatar = [
    "/assets/change_head/Avatar0.png",
    "/assets/change_head/Avatar1.png",
    "/assets/change_head/Avatar2.png",
    "/assets/change_head/Avatar3.png",
    "/assets/change_head/Avatar4.png",
    "/assets/change_head/Avatar5.png",
    "/assets/change_head/Avatar6.png",
    "/assets/change_head/Avatar7.png",
    "/assets/change_head/Avatar8.png",
    "/assets/change_head/Avatar9.png",
    "/assets/change_head/Avatar10.png",
    "/assets/change_head/Avatar11.png"
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

export const kotakPng = "/assets/kotak.ico";

export const appName = "Casino Bharat";

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