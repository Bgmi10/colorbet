import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import GameComponent from "./components/Game"
import Login from "./components/auth/Login"
import Notfound from "./Notfound"
import SignIn from "./components/auth/Signin"

function App() {
  return (
    <>
      <div>
        <Router>
               <Routes>
                      <Route element={ <GameComponent /> } path="/game" />
                      <Route element={ <Login /> } path="/login" />
                      <Route element={ <SignIn /> } path="/signin" />
                      <Route element={ <Notfound /> } path="*" />
               </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
