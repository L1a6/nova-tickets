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
import { LayoutDashboard, LogOut, Ticket, Home } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [firstName, setFirstName] = useState("");
  const [tickets, setTickets] = useState([]);

  // Check authentication on mount
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("ticketapp_session"));
    if (!session || !session.isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }
    
    if (session?.fullName) {
      const nameParts = session.fullName.trim().split(" ");
      setFirstName(nameParts[0]);
    }
  }, [navigate]);

  // Load tickets from localStorage on mount
  useEffect(() => {
    const loadTickets = () => {
      const storedTickets = JSON.parse(localStorage.getItem("ticketapp_tickets"));
      if (storedTickets && storedTickets.length > 0) {
        setTickets(storedTickets);
        console.log('📊 Dashboard loaded tickets:', storedTickets.length);
      } else {
        // Initialize with default tickets if none exist
        const defaultTickets = [
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
        ];
        localStorage.setItem("ticketapp_tickets", JSON.stringify(defaultTickets));
        setTickets(defaultTickets);
      }
    };

    loadTickets();
  }, []);

  // Listen for ticket updates from TicketManagement
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "ticketapp_tickets" || e.key === null) {
        const updatedTickets = JSON.parse(localStorage.getItem("ticketapp_tickets")) || [];
        setTickets(updatedTickets);
        console.log('🔄 Dashboard updated from storage event:', updatedTickets.length);
      }
      
      if (e.key === "ticketapp_session" && !e.newValue) {
        navigate("/", { replace: true });
      }
    };

    // Handler for custom ticketsUpdated event 
    const handleTicketsUpdated = () => {
      const updatedTickets = JSON.parse(localStorage.getItem("ticketapp_tickets")) || [];
      setTickets(updatedTickets);
      console.log('🔄 Dashboard updated from custom event:', updatedTickets.length);
    };

    // Listen for both types of events
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("ticketsUpdated", handleTicketsUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("ticketsUpdated", handleTicketsUpdated);
    };
  }, [navigate]);

  // Apply theme
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const goToTickets = () => navigate("/TicketManagement");

  const goToDashboard = () => navigate("/Dashboard");

  const handleLogout = () => {
    localStorage.removeItem("ticketapp_session");
    navigate("/", { replace: true });
  };

  // Calculate statistics from actual tickets
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter((t) => t.status === "in_progress").length;
  const closedTickets = tickets.filter((t) => t.status === "closed").length;

  // Real chart data based on actual ticket creation dates
  const generateChartData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toISOString().split('T')[0];
      
      // Count tickets created on this day
      const ticketCount = tickets.filter(t => t.created === dateStr).length;
      
      // If no tickets on this day, show 0 (or you can use cumulative count)
      last7Days.push({
        name: dayName,
        tickets: ticketCount,
      });
    }
    
    return last7Days;
  };

  const chartData = generateChartData();

  const getStatusClass = (status) => {
    if (status === "open") return "status-open";
    if (status === "in_progress") return "status-progress";
    return "status-closed";
  };

  const getStatusText = (status) =>
    status === "in_progress" ? "In Progress" : status;

  const navLinks = [
    { name: 'Home', href: "/", icon: Home },
    { name: "Dashboard", href: "/Dashboard", icon: LayoutDashboard, onClick: goToDashboard },
    { name: "Ticket Management", href: "/TicketManagement", icon: Ticket, onClick: goToTickets },
    { name: "Logout", href: "/", icon: LogOut, onClick: handleLogout, variant: "cta" },
  ];

  return (
    <div data-theme={theme}>
      <Navbar 
        links={navLinks} 
        theme={theme} 
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
        onClick={goToTickets}
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

          {/* Real-time statistics */}
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

          {/* Dynamic chart based on ticket creation dates */}
          <section className="chart-container">
            <h2 className="chart-title">Ticket Activity (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
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
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          {/* Live ticket list */}
          <section>
            <header className="tickets-header">
              <h2 className="tickets-title">Recent Tickets</h2>
              <button onClick={goToTickets} className="btn btn--cta">
                Manage Tickets
              </button>
            </header>

            <div className="tickets-list">
              {tickets.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No tickets available. Create your first ticket!
                </p>
              ) : (
                tickets.slice(0, 10).map((ticket) => (
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
                ))
              )}
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