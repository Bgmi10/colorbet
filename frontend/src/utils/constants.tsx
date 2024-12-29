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
import { faCoins, faCreditCard, faEnvelope, faExchangeAlt, faExclamationTriangle, faGift, faHeadset, faHistory, faInfoCircle, faLockOpen, faMailBulk, faMobileAlt, faShield, faThunderstorm, faTimesCircle, faUndoAlt, faUserSecret, faWallet } from "@fortawesome/free-solid-svg-icons";
const isprod = false;
export const baseurl = isprod ? 'http://44.204.84.25:3005' : 'http://localhost:3005'

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
                title: "Reset Password",
                icon: <FontAwesomeIcon icon={faUndoAlt} className="text-2xl" />,
                link: "/reset-password"
            },
            {
                id: "2",
                title: "Two-Factor Authentication",
                icon: <FontAwesomeIcon icon={faLockOpen} className="text-2xl" />, 
                link: "/two-factor-authentication"
            },
            {
                id: "3",
                title: "Login Activity",
                icon: <FontAwesomeIcon icon={faHistory} className="text-2xl" />,
                link: "/login-activity"
            },
            {
                id: "4",
                title: "Manage Devices",
                icon: <FontAwesomeIcon icon={faMobileAlt} className="text-2xl" />,
                link: "/manage-devices"
            },
            {
                id: "5",
                title: "Update Email",
                icon: <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />,
                link: "/update-email"
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

export const kotakPng = kotakPng1

export const appName = "colorwiz";