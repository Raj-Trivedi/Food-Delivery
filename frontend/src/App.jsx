import { Navbar } from './Component/Navbar/Navbar'
import { Routes, Route, useLocation} from 'react-router-dom'
import Menu from './Pages/Menu.jsx'
import { Home } from './Pages/Home'
import { AboutUs } from './Component/AboutUs/AboutUs.jsx'
import Footer from './Component/Footer/Footer.jsx'
// import SignUp from './Component/SignUp/SignUp.jsx'
import Cart from "./Pages/Cart.jsx";
import Address from './Pages/Address/Address.jsx';
import ProductDetail from './Component/ProductDetails/ProductDetail.jsx';
import Myorder from './Component/Myorder/Myorder.jsx'
import Auth from './Pages/Auth.jsx'
import AdminPanel from './Pages/adminpanel/AdminPanel.jsx'
import SellerSignIn from './Component/Login/SellerSignIn.jsx';
import SellerRegister from './Component/Login/SellerRegister.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './Component/ScrollToTop';

function App() {

  const location = useLocation();
  const hideNavFooter = /admin|seller/i.test(location.pathname);
  
  return (
    <>
      <ScrollToTop />
      {!hideNavFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/address" element={<Address />} /> 
        <Route path="/product/:category/:id" element={<ProductDetail />} />
        <Route path="/myorder" element={<Myorder />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/seller-signin" element={<SellerSignIn />} />
        <Route path="/seller-register" element={<SellerRegister />} />
      </Routes>

      {!hideNavFooter && <Footer />}   
      <ToastContainer />
    </>
  )
}

export default App
