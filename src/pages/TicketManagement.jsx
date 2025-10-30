import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import Navbar from '../components/Navbar.jsx';
import '../styles/TicketManagement.css';

const TicketManagement = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [tickets, setTickets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium'
  });
  const [formErrors, setFormErrors] = useState({});

  // ✅ Check authentication on mount
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("ticketapp_session"));
    if (!session || !session.isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }
  }, [navigate]);

  // ✅ Navbar links with logout handler
  const handleLogout = () => {
    localStorage.removeItem("ticketapp_session");
    navigate("/", { replace: true });
  };

  const navLinks = [
    { name: 'Dashboard', href: '/Dashboard' },
    { name: 'Ticket Management', href: '/TicketManagement' },
    { name: 'Logout', href: '#', onClick: handleLogout, variant: 'cta' },
  ];

  // Apply theme class to body
  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  // ✅ Load tickets from localStorage on mount
  useEffect(() => {
    const loadTickets = () => {
      const stored = localStorage.getItem('ticketapp_tickets');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setTickets(parsed);
        } catch (error) {
          console.error('Error parsing tickets:', error);
          initializeDefaultTickets();
        }
      } else {
        initializeDefaultTickets();
      }
    };

    const initializeDefaultTickets = () => {
      const sampleTickets = [
        {
          id: Date.now() + 1,
          title: 'Login page not responsive on mobile',
          description: 'The login form overflows on screens smaller than 375px',
          status: 'open',
          priority: 'high',
          created: new Date().toISOString().split('T')[0],
        },
        {
          id: Date.now() + 2,
          title: 'Database connection timeout',
          description: 'Users experiencing timeout errors during peak hours',
          status: 'in_progress',
          priority: 'critical',
          created: new Date().toISOString().split('T')[0],
        }
      ];
      setTickets(sampleTickets);
      localStorage.setItem('ticketapp_tickets', JSON.stringify(sampleTickets));
    };

    loadTickets();
  }, []);

  // ✅ CRITICAL: Save tickets to localStorage and notify Dashboard
  const saveTicketsToStorage = (updatedTickets) => {
    try {
      // Save to localStorage
      localStorage.setItem('ticketapp_tickets', JSON.stringify(updatedTickets));
      
      // Dispatch custom event for same-tab updates (Dashboard will listen)
      window.dispatchEvent(new Event('ticketsUpdated'));
      
      // Also dispatch storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'ticketapp_tickets',
        newValue: JSON.stringify(updatedTickets),
        url: window.location.href
      }));
      
      console.log('✅ Tickets saved successfully:', updatedTickets.length);
    } catch (error) {
      console.error('❌ Error saving tickets:', error);
      showToast('Error saving tickets. Please try again.', 'error');
    }
  };

  // ✅ Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ticketapp_tickets' || e.key === null) {
        try {
          const updatedTickets = JSON.parse(localStorage.getItem('ticketapp_tickets')) || [];
          setTickets(updatedTickets);
          console.log('🔄 Tickets updated from storage event');
        } catch (error) {
          console.error('Error loading tickets from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must not exceed 100 characters';
    }
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must not exceed 500 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  // ✅ FIXED: Create ticket handler
  const handleCreate = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    const newTicket = {
      id: Date.now(), // Unique ID
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      created: new Date().toISOString().split('T')[0],
    };

    // Add new ticket to the beginning of the array
    const updatedTickets = [newTicket, ...tickets];
    
    // Update state
    setTickets(updatedTickets);
    
    // Save to localStorage and notify Dashboard
    saveTicketsToStorage(updatedTickets);
    
    // Close modal and reset form
    setShowCreateModal(false);
    setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
    setFormErrors({});
    
    showToast('✅ Ticket created successfully!', 'success');
    
    console.log('✅ New ticket created:', newTicket);
  };

  // ✅ FIXED: Edit ticket handler
  const handleEdit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    const updatedTickets = tickets.map(t =>
      t.id === currentTicket.id 
        ? { 
            ...t,
            title: formData.title.trim(),
            description: formData.description.trim(),
            status: formData.status,
            priority: formData.priority,
          } 
        : t
    );
    
    // Update state
    setTickets(updatedTickets);
    
    // Save to localStorage and notify Dashboard
    saveTicketsToStorage(updatedTickets);
    
    // Close modal and reset form
    setShowEditModal(false);
    setCurrentTicket(null);
    setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
    setFormErrors({});
    
    showToast('✅ Ticket updated successfully!', 'success');
    
    console.log('✅ Ticket updated:', currentTicket.id);
  };

  // ✅ FIXED: Delete ticket handler
  const handleDelete = () => {
    const updatedTickets = tickets.filter(t => t.id !== currentTicket.id);
    
    // Update state
    setTickets(updatedTickets);
    
    // Save to localStorage and notify Dashboard
    saveTicketsToStorage(updatedTickets);
    
    // Close modal and reset
    setShowDeleteConfirm(false);
    setCurrentTicket(null);
    
    showToast('✅ Ticket deleted successfully!', 'success');
    
    console.log('✅ Ticket deleted:', currentTicket.id);
  };

  const openEditModal = (ticket) => {
    setCurrentTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description || '',
      status: ticket.status,
      priority: ticket.priority
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="dashboard-container" aria-label="Ticket Management">

      {/* ✅ Navbar */}
      <div data-theme={theme}>
        <Navbar
          links={navLinks}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
        />
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Page Content */}
      <section className="dashboard-content">
        <header className="tickets-header">
          <div>
            <h1 className="dashboard-title">Ticket Management</h1>
            <p className="dashboard-subtitle">Create, track, and manage all your support tickets</p>
          </div>
          <button
            className="create-ticket-btn"
            onClick={() => {
              setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
              setFormErrors({});
              setShowCreateModal(true);
            }}
          >
            + Create Ticket
          </button>
        </header>

        {/* Filters */}
        <div className="filters-container">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎫</div>
            <h3>No tickets found</h3>
            <p>
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first ticket to get started'}
            </p>
          </div>
        ) : (
          <div className="tickets-list">
            {filteredTickets.map(ticket => (
              <article key={ticket.id} className="ticket-item">
                <div className="ticket-content">
                  <h3 className="ticket-title">{ticket.title}</h3>
                  {ticket.description && (
                    <p className="ticket-description">{ticket.description}</p>
                  )}
                  <div className="ticket-meta-info">
                    <span className={`ticket-status status-${ticket.status}`}>
                      {ticket.status === 'in_progress' ? 'In Progress' : ticket.status}
                    </span>
                    <span className={`ticket-priority priority-${ticket.priority}`}>
                      {ticket.priority} Priority
                    </span>
                    <span className="ticket-date">
                      {ticket.created}
                    </span>
                  </div>
                </div>
                <div className="ticket-actions">
                  <button onClick={() => openEditModal(ticket)} className="btn-edit">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTicket(ticket);
                      setShowDeleteConfirm(true);
                    }}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create New Ticket</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>
                  Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={formErrors.title ? 'error' : ''}
                  placeholder="Enter ticket title"
                />
                {formErrors.title && <p className="error-text">{formErrors.title}</p>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={formErrors.description ? 'error' : ''}
                  placeholder="Enter ticket description"
                  rows="4"
                />
                {formErrors.description && <p className="error-text">{formErrors.description}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status <span className="required">*</span></label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
                    setFormErrors({});
                  }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Edit Ticket</h2>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={formErrors.title ? 'error' : ''}
                />
                {formErrors.title && <p className="error-text">{formErrors.title}</p>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={formErrors.description ? 'error' : ''}
                  rows="4"
                />
                {formErrors.description && <p className="error-text">{formErrors.description}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status <span className="required">*</span></label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentTicket(null);
                    setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
                    setFormErrors({});
                  }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Update Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && currentTicket && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon">⚠️</div>
            <h2 className="modal-title">Delete Ticket?</h2>
            <p className="delete-message">
              Are you sure you want to delete "<strong>{currentTicket.title}</strong>"? This action cannot be undone.
            </p>
            <div className="form-actions">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setCurrentTicket(null);
                }}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="btn-delete-confirm">
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}
      
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
  );
};

export default TicketManagement;