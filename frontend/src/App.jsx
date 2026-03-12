import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MyOrders from "./pages/MyOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";
import DeliveryModal from "./components/DeliveryModal";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meus-pedidos" element={<MyOrders />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <CartSidebar />
        <DeliveryModal />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
