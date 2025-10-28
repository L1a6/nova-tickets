import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Navbar.css";

const Navbar = ({ navLinks = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Listen for theme changes
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = localStorage.getItem('app-theme') || 'dark';
      setTheme(currentTheme);
      document.body.className = currentTheme;
    };

    updateTheme();
    window.addEventListener('storage', updateTheme);
    window.addEventListener('themeChange', updateTheme);

    return () => {
      window.removeEventListener('storage', updateTheme);
      window.removeEventListener('themeChange', updateTheme);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const nav = document.querySelector('.universal-nav-actions');
      const hamburger = document.querySelector('.universal-hamburger');
      
      if (menuOpen && nav && hamburger) {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
          setMenuOpen(false);
        }
      }
    };

    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpen]);

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  const handleLinkClick = (link) => {
    setMenuOpen(false);
    if (link.onClick) {
      link.onClick();
    } else if (link.href) {
      window.location.href = link.href;
    }
  };

  return (
    <nav className={`universal-navbar ${theme}`}>
      <div className="universal-nav-container">
        {/* Logo */}
        <div className="universal-nav-logo">
          <span className="logo-nova">Nova</span>
          <span className="logo-ticket">Ticket</span>
        </div>
        
        {/* Hamburger Menu Button */}
        <button 
          className="universal-hamburger"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <div className={`universal-nav-actions ${menuOpen ? 'show' : ''}`}>
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleLinkClick(link)}
              className={`universal-nav-link ${link.variant || ''}`}
            >
              {link.icon && <span className="nav-link-icon">{link.icon}</span>}
              {link.label}
            </button>
          ))}
        </div>

        {/* Overlay for mobile menu */}
        {menuOpen && <div className="universal-nav-overlay" onClick={() => setMenuOpen(false)} />}
      </div>
    </nav>
  );
};

export default Navbar;

