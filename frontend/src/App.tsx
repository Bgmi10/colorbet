import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import GameComponent from "./components/Game"

function App() {
  return (
    <>
      <div>
        <Router>
               <Routes>
                      <Route element={ <GameComponent /> } path="/game" />
               </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
