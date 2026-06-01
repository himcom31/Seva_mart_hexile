// pages/User/HomePages.jsx
import React from "react";

// ✅ Removed Navbar and Footer — already rendered by AppLayout in App.jsx
import Hero from "../../Components/User/Hero";
import FeaturedServices from "../../Components/User/WhyChooseUs";
import PopularServices from "../../Components/User/PopularServices";
import HowItWorks from "../../Components/User/HowItWorks";
import ReviewCard from "../../Components/User/ReviewCard";
import PopularProviders from "../../Components/User/PopularProviders";
import CTABanner from "../../Components/User/CTABanner";
import RecentBlogs from "../../Components/User/RecentBlogs";
import GrowBusiness from "../../Components/User/GrowBusiness";
import BrowseHighRated from "../../Components/User/BrowseHighRated";
import FAQ from "../../Components/User/FAQ";
import Servicessection from '../../Components/User/Servicessection'

function HomePage() {
  return (
    <div className="app">
      <Hero />
      <Servicessection />
      <PopularServices />
      <FeaturedServices />
      <HowItWorks />
      <ReviewCard />
      <FAQ />
    </div>
  );
}

export default HomePage;