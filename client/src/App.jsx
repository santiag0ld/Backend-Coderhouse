import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import UserProvider from './context/UserContext'
import CartProvider from './context/CartContext'


import TopNavbar from './components/Navbar/Navbar'

import ProductPages from './pages/ProductPage'
import ProductDetailPages from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ChatPage from './pages/ChatPage'
import RealTimeProducts from './pages/RealTimeProductsPage'
import CartPage from './pages/CartPage'
import ProtectedRoute from './ProtectedRoute'
import SuccessPage from './pages/SuccessPage'


function App() {

  return (

      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <TopNavbar />
            <Routes>
              <Route path='/' element={<ProductPages />} />
              <Route path='/products' element={<ProductPages />} />
              <Route path='/products/detail/:pid' element={<ProductDetailPages />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path='/realtimeproducts' element={<RealTimeProducts />} />
                <Route path='/chat' element={<ChatPage />} />
                <Route path='/cart' element={<CartPage />} />
                <Route path='/success' element={<SuccessPage />}/>
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </UserProvider>

  )
}

export default App