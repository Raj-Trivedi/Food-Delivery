import { Navbar } from './Component/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import { Menu } from './Pages/Menu'
import { Home } from './Pages/Home'
import { AboutUs } from './Pages/AboutUs'


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/aboutUs" element={<AboutUs />} />
      </Routes>
    </>
  )
}

export default App
