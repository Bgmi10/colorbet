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

function App() {
  return (
    <>
       <Router>
        <Suspense fallback={ <Loader /> }>
          <Routes>
           <Route element={ <GameComponent /> } path="/A-vs-B" />
           <Route element={ <Login /> } path="/login" />
           <Route element={ <SignIn /> } path="/signin" />
           <Route element={ <Notfound /> } path="*" />
           <Route element={ <ForgetPassword /> } path="/forget-password" />
           <Route element={<ProtectOtpPage children={ <Outlet /> } /> }>
             <Route element={ <OtpSigninverify /> } path="/otp-signin-verify" />
             <Route element={ <OtpForgetVerify /> } path="/otp-forget-verify" />
           </Route>
           <Route element={ <RechargeChip /> } path="/recharge-chip" />
           <Route element={ <Profile /> } path="/profile" />
           <Route element={ <ImpsService /> } path="/payment-imps" />
           <Route element={ <Bank /> } path="/bank-account" />
           <Route element={ <Withdraw /> } path="/withdrawal-chip" />
          </Routes>
          <AppBar />
        </Suspense>
       </Router>
      
    </>
  )
}

export default App
