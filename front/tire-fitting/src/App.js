import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container } from 'react-bootstrap';

import Registration from './components/auth/Registration/Registration';
import Login from './components/auth/Login/Login';

import ProductManagement from './components/EQseller/products/ProductManagement';
import TechnicalDocumentsManagement from './components/EQseller/documentation/TechnicalDocumentsManagement';
import EquipmentSellerProfileSettings from './components/EQseller/profile/EquipmentSellerProfileSettings';
import OrderManagement from './components/EQseller/orders/OrderManagement';
import ConsultationRequests from './components/EQseller/consultations/ConsultationRequests';
import SellerReviewsManagement from './components/EQseller/reviews/SellerReviewsManagement';

import ProductCatalog from './components/Client/prodcuts/ProductCatalog';
import ProductDetail from './components/Client/prodcuts/ProductDetail';
import CartPage from './components/Client/cart/CartPage';
import CheckoutPage from './components/Client/checkout/CheckoutPage';
import ProfilePage from './components/Client/profile/ProfilePage';

import EquipmentsellerRoute from './components/EquipmentsellerRoute';
import Header from './components/Header';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Header />
      <Container className="py-4">
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route
            path="/seller/reviews"
            element={
              <EquipmentsellerRoute>
                <SellerReviewsManagement />
              </EquipmentsellerRoute>
            }
          />
          <Route
            path="/seller/consultations"
            element={
              <EquipmentsellerRoute>
                <ConsultationRequests />
              </EquipmentsellerRoute>
            }
          />
          <Route
            path="/seller/products"
            element={
              <EquipmentsellerRoute>
                <ProductManagement />
              </EquipmentsellerRoute>
            }
          />
          <Route
            path="/seller/docs"
            element={
              <EquipmentsellerRoute>
                <TechnicalDocumentsManagement />
              </EquipmentsellerRoute>
            }
          />
          <Route
            path="/seller/profile"
            element={
              <EquipmentsellerRoute>
                <EquipmentSellerProfileSettings />
              </EquipmentsellerRoute>
            }
          />
          <Route
            path="/seller/orders"
            element={
              <EquipmentsellerRoute>
                <OrderManagement />
              </EquipmentsellerRoute>
            }
          />
        </Routes>
      </Container>
      <ToastContainer />
    </>
  );
}

export default App;
