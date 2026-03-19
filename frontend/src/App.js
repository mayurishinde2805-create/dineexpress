import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import VerifyOTP from "./VerifyOTP";
import Home from "./Home";
import CategoryPage from "./CategoryPage";
import ItemsPage from "./ItemsPage";
import Menu from "./Menu";
import CustomerDashboard from "./CustomerDashboard";
import OrderSummary from "./OrderSummary";
import PaymentPage from "./PaymentPage";
import OrderSuccess from "./OrderSuccess";
import Cart from "./Cart";
import KitchenOverview from "./KitchenOverview";
import KitchenHistory from "./KitchenHistory";
import KitchenDashboardLayout from "./KitchenDashboardLayout";
import KitchenSettings from "./KitchenSettings";
import KitchenAnalytics from "./KitchenAnalytics";
import CounterDashboard from "./CounterDashboard";
import AdminDashboardLayout from "./AdminDashboardLayout";
import AdminLogin from "./AdminLogin";
import AdminRegister from "./AdminRegister";
import AdminVerify from "./AdminVerify";
import AdminWelcome from "./AdminWelcome";
import KitchenLogin from "./KitchenLogin";
import KitchenRegister from "./KitchenRegister";
import KitchenVerify from "./KitchenVerify";
import AdminOverview from "./AdminOverview";
import AdminMenuManagement from "./AdminMenuManagement";
import AdminOrders from "./AdminOrders";
import AdminTables from "./AdminTables";
import AdminCustomers from "./AdminCustomers";
import AdminAnalytics from "./AdminAnalytics";
import AdminSettings from "./AdminSettings";
import AdminFeedback from "./AdminFeedback";
import ProtectedRoute from "./ProtectedRoute";
import Welcome from "./Welcome";
import Gallery3D from "./Gallery3D";

import ForgotPassword from "./ForgotPassword";
import ForgotCode from "./ForgotCode";

import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* Forgot Password Routes */}
          <Route path="/forgot-password" element={<ForgotPassword role="customer" />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword role="admin" />} />
          <Route path="/kitchen/forgot-password" element={<ForgotPassword role="kitchen" />} />

          {/* Forgot Code Routes */}
          <Route path="/admin/recover-code" element={<ForgotCode role="admin" />} />
          <Route path="/kitchen/recover-code" element={<ForgotCode role="kitchen" />} />

          {/* Customer Routes (Public) */}
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/confirm-order" element={<OrderSummary />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/order-status" element={<OrderSuccess />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/items/:categoryName/:subCategoryName" element={<ItemsPage />} />
          <Route path="/gallery-3d" element={<Gallery3D />} />

          {/* Specialized Dashboards (Protected) */}
          <Route path="/kitchen" element={
            <ProtectedRoute role="kitchen">
              <KitchenDashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<KitchenOverview />} />
            <Route path="overview" element={<KitchenOverview />} />
            <Route path="history" element={<KitchenHistory />} />
            <Route path="status" element={<KitchenAnalytics />} />
            <Route path="settings" element={<KitchenSettings />} />
          </Route>
          <Route path="/counter" element={
            <ProtectedRoute role="counter">
              <CounterDashboard />
            </ProtectedRoute>
          } />

          {/* Kitchen Auth */}
          <Route path="/kitchen/login" element={<KitchenLogin />} />
          <Route path="/kitchen/register" element={<KitchenRegister />} />
          <Route path="/kitchen/verify-otp" element={<KitchenVerify />} />

          {/* Admin Auth */}
          <Route path="/admin/welcome" element={<AdminWelcome />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/verify-otp" element={<AdminVerify />} />

          {/* Admin Routes (Protected Layout) */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="menu" element={<AdminMenuManagement />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="tables" element={<AdminTables />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="counter" element={<CounterDashboard />} />
          </Route>

          {/* Route /dashboard alias to /admin/dashboard */}
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" />} />

        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
