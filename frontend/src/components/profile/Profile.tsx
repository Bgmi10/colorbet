import { faAngleDown, faCoins, faCreditCard, faEdit, faEllipsisV, faEnvelope, faExchangeAlt, faExclamationTriangle, faGift, faHeadset, faHistory, faInfoCircle, faLockOpen, faMailBulk, faMobileAlt, faShield, faThunderstorm, faTimesCircle, faUndoAlt, faUserSecret, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import vip1Frame from "../../assets/headFrame/vip1.png";
import { profileAvatar } from "../../utils/constants";
import editPng from "../../assets/edit.png";

export default function Profile (){

    const { user } = useContext(AuthContext);
    const [isshowavatar, setIsShowAvatar] = useState(false);

    const data = [
        {
            id: 1,
            icon:   <FontAwesomeIcon icon={faHeadset} className="text-2xl cursor-pointer"/>,
            title: "Support & Contact",
            angleDownIcon:  <FontAwesomeIcon icon={faAngleDown}  className="text-2xl cursor-pointer"/>,
            link: "/support-chat"  
        },
        {
            id: 2,
            icon:  <FontAwesomeIcon icon={faGift} className="text-2xl cursor-pointer"/>,
            link: "/referals",
            title: "Promotion",
            angleDownIcon:  <FontAwesomeIcon icon={faAngleDown}  className="text-2xl cursor-pointer"/>, 
        },
        {
            id: 3,
            icon: <FontAwesomeIcon icon={faWallet}  className="text-2xl cursor-pointer"/>,
            title: "Chip Bank",
            angleDownIcon:  <FontAwesomeIcon icon={faAngleDown}  className="text-2xl cursor-pointer"/>,
            options: [
                {
                    id: "1",
                    icon:  <FontAwesomeIcon icon={faThunderstorm}  className="text-2xl cursor-pointer"/>,
                    title: "Recharge",
                    link: "/recharge-chip",
                },
                {
                    id: "3",
                    title: "Withdrawal",
                    link: "/withdrawal-chip",
                    icon: <FontAwesomeIcon icon={faCoins}  className="text-2xl cursor-pointer"/>
                },
                {
                    id: "3",
                    title: "Transaction history",
                    link: "/transaction-history",
                    icon: <FontAwesomeIcon icon={faExchangeAlt}  className="text-2xl cursor-pointer"/>
                }
            ]
        },
        {
            id: 4,
            icon: <FontAwesomeIcon icon={faCreditCard}  className= "text-2xl cursor-pointer"/>,
            title: "Bank Accounts",
            link: "/bank-account",
            angleDownIcon:  <FontAwesomeIcon icon={faAngleDown}  className="text-2xl cursor-pointer"/> 
        },
        {
            id: 5,
            icon: <FontAwesomeIcon icon={faShield} className="text-2xl cursor-pointer" />, 
            title: "Account & Security",
            options: [
                {
                    id: "1",
                    title: "Reset Password",
                    icon: <FontAwesomeIcon icon={faUndoAlt} className="text-2xl cursor-pointer" />,
                    link: "/reset-password"
                },
                {
                    id: "2",
                    title: "Two-Factor Authentication",
                    icon: <FontAwesomeIcon icon={faLockOpen} className="text-2xl cursor-pointer" />, 
                    link: "/two-factor-authentication"
                },
                {
                    id: "3",
                    title: "Login Activity",
                    icon: <FontAwesomeIcon icon={faHistory} className="text-2xl cursor-pointer" />,
                    link: "/login-activity"
                },
                {
                    id: "4",
                    title: "Manage Devices",
                    icon: <FontAwesomeIcon icon={faMobileAlt} className="text-2xl cursor-pointer" />,
                    link: "/manage-devices"
                },
                {
                    id: "5",
                    title: "Update Email",
                    icon: <FontAwesomeIcon icon={faEnvelope} className="text-2xl cursor-pointer" />,
                    link: "/update-email"
                },
                {
                    id: "6",
                    title: "Close Account",
                    icon: <FontAwesomeIcon icon={faTimesCircle} className="text-2xl cursor-pointer" />,
                    link: "/close-account"
                }
            ],
            angleDownIcon: <FontAwesomeIcon icon={faAngleDown} className="text-2xl cursor-pointer" />
        },
        {
            id: 6,
            icon: <FontAwesomeIcon icon={faMailBulk}  className="text-2xl cursor-pointer"/>,
            title: "Report & Feedbacks",
            link: "/report",
            angleDownIcon: <FontAwesomeIcon icon={faAngleDown}  className="text-2xl cursor-pointer"/> 
        },
        {
            id: 7,
            icon: <FontAwesomeIcon icon={faInfoCircle} className="text-2xl cursor-pointer" />,
            title: "Policy & Guidelines",
            options: [
              {
                id: "1",
                title: "Privacy Policy",
                icon: <FontAwesomeIcon icon={faUserSecret} className="text-2xl cursor-pointer" />,
                link: "/privacy-policy"
              },
              {
                id: "2",
                title: "Risk Disclosure Agreement",
                icon: <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl cursor-pointer" />,
                link: "/risk-disclosure"
              }
            ],
            angleDownIcon: <FontAwesomeIcon icon={faAngleDown} className="text-2xl cursor-pointer" />
          }
          
    ]

    const handleShowAvatar = () => {
        setIsShowAvatar(true);
        // here ot should be true then show the list of avartar profile and also user can change the profile by clicking it     
    }

    return(
      <>
        <div className="bg-gray-800">
          <div className="flex justify-between bg-blue-400">
             <div className="m-7">
                 <span className="text-white font-serif">Profile</span>
             </div>
             <div className="m-5">
                  <Link to={"/recharge-chip"}>
                       <Button variant="contianed" className="m-0"><FontAwesomeIcon icon={faCreditCard} className="text-white cursor-pointer text-xl"/></Button>
                  </Link>  
                    <FontAwesomeIcon icon={faEllipsisV} className="text-white cursor-pointer text-xl"/>
              </div>
          </div>
          <div className="justify-center flex">
             <img src={profileAvatar?.[0]} alt="avatar"  className="mt-3"/>
             <img src={vip1Frame} alt="frame" className="absolute"/>
             <img src={editPng} alt="edit" className="h-10 w-10 absolute mt-32 ml-40 cursor-pointer" onClick={handleShowAvatar}/>
          </div>
          <div className="ml-10 mt-10 flex flex-col text-white">
              <span className="font-bold text-lg">ID: {user?.memberId} </span>
              <span className="font-bold text-lg">Email: {user?.email} </span>
              <span className="font-bold text-lg">Name: {user?.userName} </span>
              <span className="font-bold text-lg">Available Balance:  ₹ {user?.balance / 100} </span>
          </div>
             <div className="m-1">
                  <div className="p-3 flex justify-between text-white flex-col">
                     {
                        data?.map((i) => (
                            <div key={i.id} className="m-4 flex justify-between hover:bg-gray-700">
                                 <div className="flex gap-3 cursor-pointer  p-2">
                                     {i.icon}
                                     <span>{i.title}</span> 
                                 </div>
                                 <div>
                                     {i.angleDownIcon}
                                 </div>
                            </div>
                        ))
                     }
                  </div>
             </div>
          </div>
        </>
    )
}   