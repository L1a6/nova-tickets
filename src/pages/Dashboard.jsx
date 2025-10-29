import React, { useState, useEffect, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/Dashboard.css";
import "../styles/global.css";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";


const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [firstName, setFirstName] = useState("");
  const [tickets, setTickets] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("ticketapp_tickets")) || [
        {
          id: 1,
          title: "Login page not responsive",
          status: "open",
          priority: "high",
          created: "2025-10-20",
        },
        {
          id: 2,
          title: "Database connection timeout",
          status: "in_progress",
          priority: "critical",
          created: "2025-10-22",
        },
        {
          id: 3,
          title: "Update user profile feature",
          status: "closed",
          priority: "medium",
          created: "2025-10-18",
        },
        {
          id: 4,
          title: "Email notification delay",
          status: "open",
          priority: "low",
          created: "2025-10-25",
        },
        {
          id: 5,
          title: "API rate limiting issue",
          status: "in_progress",
          priority: "high",
          created: "2025-10-24",
        },
      ]
    );
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("ticketapp_session"));
    if (session?.fullName) {
      const nameParts = session.fullName.trim().split(" ");
      setFirstName(nameParts[0]);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedTickets =
        JSON.parse(localStorage.getItem("ticketapp_tickets")) || [];
      setTickets(updatedTickets);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const goToTickets = () => navigate("/TicketManagement");

  const handleLogout = () => {
    localStorage.removeItem("ticketapp_session");
    navigate("/");
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "in_progress"
  ).length;
  const closedTickets = tickets.filter((t) => t.status === "closed").length;

  const chartData = [
    { name: "Mon", tickets: 12 },
    { name: "Tue", tickets: 19 },
    { name: "Wed", tickets: 15 },
    { name: "Thu", tickets: 22 },
    { name: "Fri", tickets: 28 },
    { name: "Sat", tickets: 18 },
    { name: "Sun", tickets: 14 },
  ];

  const getStatusClass = (status) => {
    if (status === "open") return "status-open";
    if (status === "in_progress") return "status-progress";
    return "status-closed";
  };

  const getStatusText = (status) =>
    status === "in_progress" ? "In Progress" : status;

 const navLinks = [
  { name: "Dashboard", href: "/Dashboard" },
  { name: "Ticket Management", href: "/TicketManagement" },
  { name: "Logout", href: "/", variant: "cta" },
];

  return (
     <div data-theme={theme}>
  <Navbar 
    links={navLinks} 
    theme={theme} 
    onToggleTheme={toggleTheme} 
  />
    <main className="dashboard-container" aria-label="Dashboard">
   
      <section className="dashboard-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">
            Monitor and manage your tickets in real-time
          </p>
          <span className="welcome-text">Welcome, {firstName}!</span>
        </header>

        <section className="stats-grid">
          <article className="stat-card stat-card-total">
            <div className="stat-label">Total Tickets</div>
            <div className="stat-value stat-value-total">{totalTickets}</div>
          </article>
          <article className="stat-card stat-card-open">
            <div className="stat-label">Open</div>
            <div className="stat-value stat-value-open">{openTickets}</div>
          </article>
          <article className="stat-card stat-card-progress">
            <div className="stat-label">In Progress</div>
            <div className="stat-value stat-value-progress">
              {inProgressTickets}
            </div>
          </article>
          <article className="stat-card stat-card-closed">
            <div className="stat-label">Closed</div>
            <div className="stat-value stat-value-closed">{closedTickets}</div>
          </article>
        </section>

        <section className="chart-container">
          <h2 className="chart-title">Ticket Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 16, 22, 0.95)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
              <Line
                type="monotone"
                dataKey="tickets"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: "#06b6d4", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section>
          <header className="tickets-header">
            <h2 className="tickets-title">Recent Tickets</h2>
            <button onClick={goToTickets} className="btn btn--cta">
              Manage Tickets
            </button>
          </header>

          <div className="tickets-list">
            {tickets.map((ticket) => (
              <article key={ticket.id} className="ticket-item">
                <div className="ticket-content">
                  <h3 className="ticket-title">{ticket.title}</h3>
                  <p className="ticket-meta">
                    Created: {ticket.created} • Priority: {ticket.priority}
                  </p>
                </div>
                <div>
                  <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <footer className="footer">
        <div className="footer-bottom">
          <p>&copy; 2025 NovaTicket. All rights reserved.</p>
          <ul className="footer-legal">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </footer>
    </main>
    </div>
    
  );
};

export default Dashboard;