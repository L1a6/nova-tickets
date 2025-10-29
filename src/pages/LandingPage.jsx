import React, { useRef, useState, useEffect,  } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import "../styles/LandingPage.css";
import "../styles/global.css";
import {useTheme } from "../context/ThemeContext.jsx";
import headshot1 from "../assets/Headshot1.jpg";
import headshot2 from "../assets/Headshot2.jpg";
import headshot3 from "../assets/Headshot3.jpg";
import { useNavigate } from "react-router-dom"

const LandingPage = () => {
const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const screenRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [numbers, setNumbers] = useState({
    activeTickets: 1247,
    resolved: 342,
    responseTime: 2.3,
    satisfaction: 98.5,
    queueSize: 42,
  });

useEffect(() => {
  const container = screenRef.current;
  if (!container) return;

  let direction = 1; // 1 = down, -1 = up
  let autoScrollInterval = null;
  let userInteracting = false;
  let resumeTimeout = null;

  const scrollSpeed = 1.2; // pixels per frame
  const frameDelay = 16; // roughly 60fps

  const startAutoScroll = () => {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(() => {
      if (userInteracting) return;

      container.scrollTop += direction * scrollSpeed;

      const atBottom =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
      const atTop = container.scrollTop <= 0;

      if (atBottom) {
        clearInterval(autoScrollInterval);
        setTimeout(() => {
          direction = -1;
          startAutoScroll();
        }, 2000); // wait 2s at bottom
      } else if (atTop) {
        clearInterval(autoScrollInterval);
        setTimeout(() => {
          direction = 1;
          startAutoScroll();
        }, 2000); // wait 2s at top
      }
    }, frameDelay);
  };

  const stopAutoScroll = () => {
    clearInterval(autoScrollInterval);
  };

  const handleUserInteraction = () => {
    userInteracting = true;
    stopAutoScroll();
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      userInteracting = false;
      startAutoScroll();
    }, 2000); // resume 2s after no touch
  };

  // Listen for user actions
  container.addEventListener("touchstart", handleUserInteraction, { passive: true });
  container.addEventListener("touchmove", handleUserInteraction, { passive: true });
  container.addEventListener("touchend", handleUserInteraction, { passive: true });
  container.addEventListener("wheel", handleUserInteraction, { passive: true });

  // Start auto-scroll after 2 seconds
  const initTimeout = setTimeout(() => {
    startAutoScroll();
  }, 2000);

  return () => {
    clearTimeout(initTimeout);
    clearInterval(autoScrollInterval);
    clearTimeout(resumeTimeout);
    container.removeEventListener("touchstart", handleUserInteraction);
    container.removeEventListener("touchmove", handleUserInteraction);
    container.removeEventListener("touchend", handleUserInteraction);
    container.removeEventListener("wheel", handleUserInteraction);
  };
}, []);
  // Dynamic Numbers Update
  useEffect(() => {
    const interval = setInterval(() => {
      setNumbers((prev) => ({
        activeTickets: prev.activeTickets + (Math.random() > 0.5 ? 1 : -1),
        resolved: prev.resolved + (Math.random() > 0.5 ? 1 : 0),
        responseTime: (2 + Math.random()).toFixed(1),
        satisfaction: (97 + Math.random() * 3).toFixed(1),
        queueSize: Math.max(30, Math.floor(40 + Math.random() * 20)),
      }));

      // random mini-bar animations
      document.querySelectorAll(".mini-bar").forEach((bar) => {
        const h = Math.random() * 80 + 20;
        bar.style.height = `${h}%`;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-theme={theme}>

      <header className="site-nav" role="banner">
        <nav className="navbar wrapper" aria-label="Main Navigation">
          <div className="brand">
            <span className="nova">Nova</span>
            <span className="ticket">Ticket</span>
          </div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-actions">
            <button
              id="theme-toggle"
              aria-label="Toggle Theme"
              onClick={toggleTheme}
            ></button>
            <button onClick={() => navigate("/authentication")}  className="btn btn--ghost">Sign In</button>
            <button onClick={() => navigate("/authentication")} className="btn btn--cta">Get Started</button>
          </div>
        </nav>
      </header>

      <main className="hero wrapper" role="main">
        <section id="home" className="hero-content" aria-labelledby="hero-title">
          <div className="badge">
            <span className="pulse-indicator"></span>
            Trusted by 10,000+ businesses worldwide
          </div>
          <h1 id="hero-title">
            Experience the<br />
            Future of <span className="gradient-text">Ticketing</span>
          </h1>
          <p className="hero-description">
            Novaticket is the modern ticket management system that helps businesses handle support seamlessly across all channels. Fast, secure, and built for scale.
          </p>
          <div className="hero-ctas">
            <button onClick={() => navigate("/authentication")} className="btn btn--cta">Start Free Trial</button>
            <button onClick={() => navigate("/authentication")} className="btn btn-secondary">Login</button>
          </div>
        </section>

        <section className="platform-preview" aria-label="Platform Preview">
          <div className="screen-content" id="screenContent" ref={screenRef}>
            <header className="screen-header">
              <h2 className="screen-title">Live Platform Activity</h2>
              <p className="screen-subtitle" id="timeDisplay">
                Just now
              </p>
            </header>

            <div className="content-grid">
              <section className="main-panel" aria-label="Performance Metrics">
                <header className="panel-header">
                  <span className="panel-title">Performance Metrics</span>
                  <div className="icon-badge">📊</div>
                </header>

                <div className="stats-row">
                  <article className="stat-item">
                    <div className="stat-label">Active Tickets</div>
                    <div className="stat-value" id="activeTickets">
                      {numbers.activeTickets}
                    </div>
                    <div className="stat-change positive">↑ +23%</div>
                    <div className="mini-chart">
                      <div className="mini-bar"></div>
                      <div className="mini-bar"></div>
                      <div className="mini-bar"></div>
                      <div className="mini-bar"></div>
                      <div className="mini-bar"></div>
                    </div>
                  </article>

                  <article className="stat-item">
                    <div className="stat-label">Resolved Today</div>
                    <div className="stat-value" id="resolved">
                      {numbers.resolved}
                    </div>
                    <div className="stat-change positive">↑ +18%</div>
                    <div className="mini-chart">
                      <div className="mini-bar"></div>
                      <div className="mini-bar"></div>
                      <div className="mini-bar"></div>
                      <div className="mini-bar"></div>
                      <div className="mini-bar"></div>
                    </div>
                  </article>
                </div>
              </section>

              <aside className="side-metrics" aria-label="Quick Metrics">
                <div className="metric-card">
                  <header className="metric-header">
                    <span className="metric-label">Response Time</span>
                    <img src={headshot1} alt="Response Time Icon" width="24" height="24" />
                  </header>
                  <div className="metric-value" id="responseTime">
                    {numbers.responseTime} min
                  </div>
                </div>

                <div className="metric-card">
                  <header className="metric-header">
                    <span className="metric-label">Satisfaction</span>
                    <img src={headshot2} alt="Satisfaction Icon" width="24" height="24" />
                  </header>
                  <div className="metric-value" id="satisfaction">
                    {numbers.satisfaction}%
                  </div>
                </div>

                <div className="metric-card">
                  <header className="metric-header">
                    <span className="metric-label">Queue Size</span>
                    <img src={headshot3} alt="Queue Size Icon" width="24" height="24" />
                  </header>
                  <div className="metric-value" id="queueSize">
                    {numbers.queueSize}
                  </div>
                </div>
              </aside>
            </div>

            {/* Activity Stream */}
            <section className="activity-stream" aria-labelledby="recent-activity-title">
              <header className="stream-header">
                <h3 id="recent-activity-title" className="stream-title">
                  Recent Activity
                </h3>
              </header>

              <div className="activity-list">
                {/* Full list as in original HTML */}
                <article className="activity-item">
                  <div className="activity-icon">✓</div>
                  <div className="activity-content">
                    <p className="activity-title">Ticket #4829 resolved by Naza 🪐</p>
                    <p className="activity-meta">Payment processing issue • 2 min ago</p>
                  </div>
                  <div className="activity-badge success">Resolved</div>
                </article>
                <article className="activity-item">
                  <div className="activity-icon">⚠</div>
                  <div className="activity-content">
                    <p className="activity-title">Priority escalation for Ticket #4831</p>
                    <p className="activity-meta">Login authentication • 5 min ago</p>
                  </div>
                  <div className="activity-badge pending">Urgent</div>
                </article>
                <article className="activity-item">
                  <div className="activity-icon">★</div>
                  <div className="activity-content">
                    <p className="activity-title">New ticket #4832 submitted</p>
                    <p className="activity-meta">Feature request • 1 min ago</p>
                  </div>
                  <div className="activity-badge new">New</div>
                </article>
                <article className="activity-item">
                  <div className="activity-icon">✉</div>
                  <div className="activity-content">
                    <p className="activity-title">Ticket #4833 assigned to CodedLibra🌔</p>
                    <p className="activity-meta">Account issue • 3 min ago</p>
                  </div>
                  <div className="activity-badge pending">Pending</div>
                </article>
              </div>
            </section>

            {/* News Updates */}
            <section className="news-updates" aria-labelledby="platform-updates-title">
              <header className="stream-header">
                <h3 id="platform-updates-title" className="stream-title">
                  Platform Updates
                </h3>
              </header>
              <div className="news-list">
                <article className="news-item">
                  <p className="news-item-title">
                    New AI-powered auto-categorization now live
                  </p>
                  <p className="news-item-meta">
                    <span>Product • 2 hours ago</span>
                  </p>
                </article>
                <article className="news-item">
                  <p className="news-item-title">
                    Security update: Enhanced 2FA options available
                  </p>
                  <p className="news-item-meta">
                    <span>Security • 5 hours ago</span>
                  </p>
                </article>
                <article className="news-item">
                  <p className="news-item-title">
                    Mobile app performance improvements deployed
                  </p>
                  <p className="news-item-meta">
                    <span>Engineering • 1 day ago</span>
                  </p>
                </article>
                <article className="news-item">
                  <p className="news-item-title">
                    New dashboard themes added for user personalization
                  </p>
                  <p className="news-item-meta">
                    <span>UI/UX • 3 days ago</span>
                  </p>
                </article>
              </div>
            </section>

            {/* Team Section */}
            <section className="team-section" aria-labelledby="top-performers-title">
              <header className="stream-header">
                <h3 id="top-performers-title" className="stream-title">
                  Top Performers
                </h3>
              </header>
              <div className="team-grid">
                <article className="team-member">
                  <div className="team-avatar">SC</div>
                  <p className="team-name">Sarah Chen</p>
                  <p className="team-role">Senior Agent</p>
                  <p className="team-stat">89</p>
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>
                    RESOLVED TODAY
                  </p>
                </article>
                <article className="team-member">
                  <div
                    className="team-avatar"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                    }}
                  >
                    ML
                  </div>
                  <p className="team-name">Marcus Liu</p>
                  <p className="team-role">Support Lead</p>
                  <p className="team-stat">76</p>
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>
                    RESOLVED TODAY
                  </p>
                </article>
                <article className="team-member">
                  <div
                    className="team-avatar"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))",
                    }}
                  >
                    AP
                  </div>
                  <p className="team-name">Alex Park</p>
                  <p className="team-role">Agent</p>
                  <p className="team-stat">65</p>
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>
                    RESOLVED TODAY
                  </p>
                </article>
                <article className="team-member">
                  <div
                    className="team-avatar"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-green), var(--accent-cyan))",
                    }}
                  >
                    JD
                  </div>
                  <p className="team-name">Jade Doe</p>
                  <p className="team-role">Junior Agent</p>
                  <p className="team-stat">58</p>
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>
                    RESOLVED TODAY
                  </p>
                </article>
              </div>
            </section>
          </div>
        </section>
      </main>

      {/* Features Section */}
    <section id="features">  
        <div className="wrapper">
            {/* Section Header */}
            <div className="section-header">
                <span className="section-tag">Core Features</span>
                <h2 className="section-heading">
                    Everything you need for <span className="accent">issue tracking</span>
                </h2>
                <p className="section-text">
                    Enterprise-grade tools designed for teams who demand excellence. Track, manage, and resolve tickets with unparalleled efficiency.
                </p>
            </div>

            {/* Three Solid Feature Boxes */}
            <div className="feature-boxes">
                {/* Box 1 */}
                <div className="feature-box">
                    <div className="icon-box">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                        </svg>
                    </div>
                    <h3 className="box-heading">Smart Ticket Creation</h3>
                    <p className="box-text">
                        Effortlessly create and categorize tickets with intelligent workflows, custom fields, and automated routing that adapts to your team's unique requirements.
                    </p>
                </div>

                {/* Box 2 */}
                <div className="feature-box">
                    <div className="icon-box">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    </div>
                    <h3 className="box-heading">Advanced Analytics</h3>
                    <p className="box-text">
                        Gain deep insights with comprehensive dashboards, real-time metrics, and powerful visualization tools that transform data into actionable intelligence.
                    </p>
                </div>

                {/* Box 3 */}
                <div className="feature-box">
                    <div className="icon-box">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <h3 className="box-heading">Team Collaboration</h3>
                    <p className="box-text">
                        Empower your team with seamless collaboration tools, threaded discussions, file sharing, and real-time notifications that keep everyone synchronized.
                    </p>
                </div>
            </div>
        </div>
    </section>

    {/* CTA Section */}
    <section id="about" className="cta-section">
        <div className="wrapper">
            <div className="cta-box">
                <div className="cta-wrapper">
                    <h2 className="cta-heading">Ready to elevate your support workflow?</h2>
                    <p className="cta-subtext">
                        Join thousands of teams managing millions of tickets with NovaTicket. Start your free trial today, no credit card required.
                    </p>
                    <div className="cta-actions">
                        <a href="#home" className="btn btn-primary">Get Started</a>
                        <a href="#home" className="btn btn-secondary">Login</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* Footer */}
    <footer id="contact" className="footer">
        <div className="wrapper">
            <div className="footer-content">
                {/* Brand Column */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <span className="nova">Nova</span><span className="ticket">Ticket</span>
                    </div>
                    <p className="footer-desc">
                        The ultimate issue management platform for modern teams. Powerful, intuitive, and built to scale with your business.
                    </p>
                    <div className="social-icons">
                        <a href="#" className="social-icon" aria-label="Twitter">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                            </svg>
                        </a>
                        <a href="#" className="social-icon" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                                <circle cx="4" cy="4" r="2"/>
                            </svg>
                        </a>
                        <a href="#" className="social-icon" aria-label="GitHub">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Product Column */}
                <div className="footer-col">
                    <h4>Product</h4>
                    <ul className="footer-links">
                        <li><a href="#">Features</a></li>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Security</a></li>
                        <li><a href="#">Roadmap</a></li>
                    </ul>
                </div>

                {/* Company Column */}
                <div className="footer-col">
                    <h4>Company</h4>
                    <ul className="footer-links">
                        <li><a href="#">About</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>

                {/* Resources Column */}
                <div className="footer-col">
                    <h4>Resources</h4>
                    <ul className="footer-links">
                        <li><a href="#">Documentation</a></li>
                        <li><a href="#">API Reference</a></li>
                        <li><a href="#">Support</a></li>
                        <li><a href="#">Community</a></li>
                    </ul>
                </div>
            </div>
            

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <p>&copy; 2025 NovaTicket. All rights reserved.</p>
                <ul className="footer-legal">
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Cookie Policy</a></li>
                </ul>
            </div>
        </div>
    </footer>
    </div>
    

    
  );
};

export default LandingPage;