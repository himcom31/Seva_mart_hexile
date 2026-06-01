
// src/components/UserLayout.jsx
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import VendorRegister from '../../pages/User/Vendorregister.jsx';
import VendorLogin from '../../pages/User/Vendorlogin.jsx';
import Servicespage  from '../../pages/User/Servicespage.jsx';
import AboutUs from '../../pages/User/Aboutus.jsx';
import TermsAndConditions from '../../Components/User/TermsAndConditions.jsx';
import PrivacyPolicy121 from '../../Components/User/Privacypolicy.jsx';
import ContactUs from '../../Components/User/Contactus.jsx';


const UserLayout = () => {
  return (
    <div className="flex flex-1">

      {/* Optional Sidebar — uncomment if your user side needs one */}
      {/* <UserSidebar /> */}

      <div className="flex-1 p-6 overflow-y-auto ">
        <Routes>

          {/* Default /user/ → redirect to dashboard */}
          {/* <Route index element={<Navigate to="dashboard" replace />} /> */}

          {/* Protected User Pages */}

           <Route path="Vendorregister"          element={<VendorRegister />} /> 
          <Route path="VendorLogin"      element={<VendorLogin />} />
          <Route path="services"     element={<Servicespage />} /> 
          <Route path="about"     element={<AboutUs />} /> 
          <Route path="terms-and-conditions"     element={<TermsAndConditions />} /> 
          <Route path="privacy"     element={<PrivacyPolicy121 />} /> 
          <Route path="contact"     element={<ContactUs />} />
          {/* <Route path="wallet"        element={<UserWallet />} /> */}
          {/* <Route path="notifications" element={<UserNotifications />} /> */}
          {/* <Route path="settings"      element={<UserSettings />} /> */}

          {/* Add more protected user routes here */}

        </Routes>
      </div>

    </div>
  );
};

export default UserLayout;
