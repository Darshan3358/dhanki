import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Landing.css';
import dhanikLogo from '../../assets/dhanik-logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Why Dhanik', href: '#features' },
    { name: 'Utility', href: '#utility' },
    { name: 'Advisory', href: '#advisory' },
    { name: 'Careers', href: '#careers' },
  ];

  return (
    <motion.nav
      className={`header ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0.8rem 2rem',
        background: scrolled ? 'rgba(10, 14, 23, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 215, 0, 0.1)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container">
        {/* NEW 3D COMPOSITE LOGO */}
        <a href="#" className="logo" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          textDecoration: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={dhanikLogo}
              alt="Dhanik Coin Logo"
              style={{
                width: '70px',
                height: '70px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)) drop-shadow(0 2px 6px rgba(0,0,0,0.4))'
              }}
            />
          </div>

          {/* Logo Text */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{
              fontSize: '1.8rem',
              fontWeight: '800',
              letterSpacing: '1px',
              background: 'linear-gradient(90deg, #fff, #b3b3b3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              DHANIK
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <ul className="desktop-menu">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                style={{
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  transition: 'color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.color = 'var(--primary-gold)'}
                onMouseOut={(e) => e.target.style.color = 'var(--text-primary)'}
              >
                {link.name}
              </a>
            </li>
          ))}
          <li>
            <a href="/login" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>Get Started</a>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="mobile-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--bg-card)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{ fontSize: '1.1rem', fontWeight: '600' }}
            >
              {link.name}
            </a>
          ))}
          <a href="/login" className="btn-primary" onClick={() => setIsOpen(false)}>Get Started</a>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Header;
