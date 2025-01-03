import { BrowserRouter as Router , Routes , Route, Outlet } from "react-router-dom"
import GameComponent from "./components/A-vs-B/Game";
import Login from "./components/auth/Login";
import Notfound from "./Notfound";
import SignIn from "./components/auth/SignIn";
import ForgetPassword from "./components/auth/ForgetPassword";
import OtpSigninverify from "./components/auth/OtpSigninverify";
import OtpForgetVerify from "./components/auth/OtpForgetVerify";
import AppBar from "./components/AppBar";
import Profile from "./components/profile/Profile";
import ProtectOtpPage from "./components/auth/ProtectOtpPage";
import RechargeChip from "./components/recharge/RechargeChip";
import ImpsService from "./components/recharge/ImpsService";
import { Suspense } from "react";
import Loader from "./components/Loader";
import Bank from "./components/bindbank/Bank";
import Withdraw from "./components/withdrawal/Withdraw";
import WithdrawalRecords from "./components/withdrawal/WithdrawalRecords";
import RechargeRecords from "./components/recharge/RechargeRecords";
import ColorGame from "./components/color/ColorGame";
import Blog from "./components/blog/Blog";
import Aviator from "./components/aviator/Aviator";
import ChangePassword from "./components/auth/ChangePassword";
import OtpLoginVerify from "./components/auth/OtpLoginVerify";

function App() {
  return (
    <>
       <Router>
        <Suspense fallback={ <><Loader /></> }>
          <Routes>
           <Route element={ <GameComponent /> } path="/A-vs-B" />
           <Route element={ <Login /> } path="/login" />
           <Route element={ <SignIn /> } path="/signin" />
           <Route element={ <Notfound /> } path="*" />
           <Route element={ <ForgetPassword /> } path="/forget-password" />
           <Route element={<ProtectOtpPage children={ <Outlet /> } /> }>
             <Route element={ <OtpSigninverify /> } path="/otp-signin-verify" />
             <Route element={ <OtpForgetVerify /> } path="/otp-forget-verify" />
             <Route element={ <OtpLoginVerify />} path="/otp-login-verify" />
           </Route>
           <Route element={ <RechargeChip /> } path="/recharge-chip" />
           <Route element={ <Profile /> } path="/profile" />
           <Route element={ <ImpsService /> } path="/payment-imps" />
           <Route element={ <Bank /> } path="/bank-account" />
           <Route element={ <Withdraw /> } path="/withdrawal-chip" />
           <Route element={ <WithdrawalRecords /> } path="withdrawal-records" />
           <Route element={ <RechargeRecords /> } path="/transaction-history" />
           <Route element={ <ColorGame /> } path="/color" />
           <Route element={ <Blog /> } path="/blog" />
           <Route element={ <Aviator /> } path="/aviator" />
           <Route element={ <ChangePassword /> } path="/change-password" />
          </Routes>
          <AppBar />
        </Suspense>
       </Router>
      
    </>
  )
}

export default App
