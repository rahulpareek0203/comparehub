import Header from './components/Header'
import ResultsPage from './pages/ResultPage'
import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout';
import ProductPage from './pages/ProductPage';
import CartPage from "./pages/CartPage";
import FavouritesPage from "./pages/FavouritesPage";

import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";


function App() {
 
  return (
    
    <BrowserRouter>
      <Routes>
                                     {/* Layout route */}

        <Route element ={<MainLayout />} >
          <Route index element={<ResultsPage />} />
          <Route path= "/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favourites" element={<FavouritesPage />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          
        </Route>

      </Routes>   
    </BrowserRouter>

    
  );
}

export default App
