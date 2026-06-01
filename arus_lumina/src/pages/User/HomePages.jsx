// pages/User/HomePages.jsx
import React from "react";

// ✅ Removed Navbar and Footer — already rendered by AppLayout in App.jsx
import Hero from "../../Components/User/Hero.jsx";
import FeaturedServices from "../../Components/User/WhyChooseUs.jsx";
import PopularServices from "../../Components/User/PopularServices.jsx";
import HowItWorks from "../../Components/User/HowItWorks.jsx";
import ReviewCard from "../../Components/User/ReviewCard.jsx";
import PopularProviders from "../../Components/User/PopularProviders.jsx";
import CTABanner from "../../Components/User/CTABanner.jsx";
import RecentBlogs from "../../Components/User/RecentBlogs.jsx";
import GrowBusiness from "../../Components/User/GrowBusiness.jsx";
import BrowseHighRated from "../../Components/User/BrowseHighRated.jsx";
import FAQ from "../../Components/User/FAQ.jsx";
import Servicessection from '../../Components/User/Servicessection.jsx'

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