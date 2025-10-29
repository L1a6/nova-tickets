import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = ({ links = [], authLinks = [] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return true;
  });

  // Scroll behavior: hide on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  // Apply theme UNIVERSALLY across ALL pages and components
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all existing theme classes
    root.classList.remove('dark-theme', 'light-theme');
    body.classList.remove('dark-theme', 'light-theme');
    
    // Add the current theme class
    const themeClass = isDark ? 'dark-theme' : 'light-theme';
    root.classList.add(themeClass);
    body.classList.add(themeClass);
    
    // Set data attribute for stronger CSS targeting
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // Apply theme color to body background
    if (isDark) {
      body.style.backgroundColor = '#0a0b0f';
      body.style.color = '#ffffff';
    } else {
      body.style.backgroundColor = '#f8fafc';
      body.style.color = '#0f172a';
    }
    
    // Save to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Dispatch custom event so other components can listen
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { theme: isDark ? 'dark' : 'light' } 
    }));
  }, [isDark]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar ${isVisible ? 'visible' : 'hidden'} ${isDark ? 'dark' : 'light'}`}>
        <div className="navbar-container">
          {/* Logo */}
          <a href="/" className="logo">Nova<span>Ticket</span></a>

          {/* Desktop Links */}
          <div className="nav-links">
            {links.map((link) => (
              <a key={link.name} href={link.href} className="nav-link">
                {link.name}
              </a>
            ))}
            {authLinks.map((link) => (
              <a key={link.name} href={link.href} className={`nav-link ${link.variant}`}>
                {link.name}
              </a>
            ))}
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun size={18} className="theme-icon" />
              ) : (
                <Moon size={18} className="theme-icon" />
              )}
            </button>
          </div>

          {/* Hamburger Button */}
          <button 
            className="hamburger-btn" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''} ${isDark ? 'dark' : 'light'}`}>
        <div className="mobile-menu-links">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a key={link.name} href={link.href} onClick={closeMobileMenu} className="mobile-link">
                {Icon && <Icon size={20} />}
                {link.name}
              </a>
            );
          })}
          {authLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a key={link.name} href={link.href} onClick={closeMobileMenu} className={`mobile-link ${link.variant}`}>
                {Icon && <Icon size={18} />}
                {link.name}
              </a>
            );
          })}
          <button 
            className="theme-toggle mobile-theme" 
            onClick={() => { toggleTheme(); closeMobileMenu(); }}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <>
                <Sun size={18} className="theme-icon" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={18} className="theme-icon" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && <div className="menu-overlay" onClick={closeMobileMenu}></div>}
    </>
  );
};

export default Navbar;





