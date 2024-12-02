import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import GameComponent from "./components/Game"
import Login from "./components/auth/Login"
import Notfound from "./Notfound"
import SignIn from "./components/auth/SignIn"
import ForgetPassword from "./components/auth/ForgetPassword"
import OtpVerify from "./components/OtpVerify"

function App() {
  return (
    <>
       <Router>
        <Routes>
         <Route element={ <GameComponent /> } path="/game" />
         <Route element={ <Login /> } path="/login" />
         <Route element={ <SignIn /> } path="/signin" />
         <Route element={ <Notfound /> } path="*" />
         <Route element={ <ForgetPassword /> } path="/forget-password" />
         <Route element={ <OtpVerify /> } path="/otp-verify" />
        </Routes>
       </Router>
    </>
  )
}

export default App
