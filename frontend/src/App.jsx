import { Navbar } from './Component/Navbar/Navbar'
import { Routes, Route, useLocation} from 'react-router-dom'
import { Menu } from './Pages/Menu'
import { Home } from './Pages/Home'
import { AboutUs } from './Pages/AboutUs'
import Footer from './Component/Footer/Footer.jsx'
import SignUp from './Component/SignUp/SignUp.jsx'
import Cart from "./Pages/Cart.jsx" 

function App() {

  const location = useLocation();
  const isAuth = location.pathname === "/signUp";
  return (
    <>
      {!isAuth && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      {!isAuth && <Footer />}   
    </>
  )
}

export default App
