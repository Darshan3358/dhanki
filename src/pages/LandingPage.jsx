import React from 'react';
import Header from '../components/Landing/Header';
import Hero from '../components/Landing/Hero';
import About from '../components/Landing/About';
import Features from '../components/Landing/Features';
import Utility from '../components/Landing/Utility';
import Advisory from '../components/Landing/Advisory';
import Careers from '../components/Landing/Careers';
import Footer from '../components/Landing/Footer';
import '../components/Landing/Landing.css';

const LandingPage = () => {
  return (
    <div className="landing-page-root">
      <Header />
      <Hero />
      <About />
      <Features />
      <Utility />
      <Advisory />
      <Careers />
      <Footer />
    </div>
  );
};

export default LandingPage;
