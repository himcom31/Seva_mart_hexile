// App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "./Components/User/Scrolltotop.jsx";

import AdminLogin from './pages/Admin/AdmimnLogin.jsx';
import AdminLayout from './Components/Admin/AdminLayout.jsx';
import UserLayout from './Components/User/UserLayout.jsx';
import UserNavbar from './Components/User/Navbar.jsx';
import UserFooter from './Components/User/Footer.jsx';
import HomePage from './pages/User/HomePages.jsx';
import UserLoginPage from './pages/User/UserLogin.jsx';
import VendorDashboard from './pages/User/Vendordashboard.jsx';
import CustomerLogin from './Components/User/CustomerLogin.jsx';   // ← NEW
import CustomerDashboard from "./Components/User/Customerdashboard.jsx";



const ProtectedRouteAdmin = ({ children }) => {
  const token = localStorage.getItem('al_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

const UserProtectedRoute = ({ children }) => {
  return children;
};

const AppLayout = ({ children }) => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const isVendorDashboard = pathname === '/vendor/dashboard';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && !isVendorDashboard && <UserNavbar />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && !isVendorDashboard && <UserFooter />}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <AppLayout>
        <ScrollToTop />
        <Routes>

          {/* Root → user home */}
          <Route path="/" element={<HomePage />} />

          {/* Admin login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected admin area */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRouteAdmin>
                <AdminLayout />
              </ProtectedRouteAdmin>
            }
          />

          {/* Public user routes */}
          <Route path="/user/login" element={<UserLoginPage />} />


          {/* Customer order tracking — no auth needed, just mobile number */}
          <Route path="/user/customer/login" element={<CustomerLogin />} />
          <Route path="/user/customer/dashboard" element={<CustomerDashboard />} />




          {/* Vendor Dashboard — own top-level route, outside UserLayout */}
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />

          {/* Protected user area */}
          <Route
            path="/user/*"
            element={
              <UserProtectedRoute>
                <UserLayout />
              </UserProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={
            <div className="flex items-center justify-center h-screen font-bold text-2xl text-slate-400">
              404 - Page Not Found
            </div>
          } />

        </Routes>
      </AppLayout>
    </div>
  );
}

export default App;