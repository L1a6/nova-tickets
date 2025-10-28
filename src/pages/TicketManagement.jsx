import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Apply theme class to body
  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  // Load tickets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ticketapp_tickets');
    if (stored) {
      setTickets(JSON.parse(stored));
    } else {
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
    }
  }, []);

  // Save tickets to localStorage
  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('ticketapp_tickets', JSON.stringify(tickets));
      // Trigger storage event for dashboard to update
      window.dispatchEvent(new Event('storage'));
    }
  }, [tickets]);

  // Listen for storage changes from other tabs/pages
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedTickets = JSON.parse(localStorage.getItem('ticketapp_tickets')) || [];
      setTickets(updatedTickets);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleMenu = () => setMenuOpen(prev => !prev);

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

  const handleCreate = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    const newTicket = {
      ...formData,
      id: Date.now(),
      created: new Date().toISOString().split('T')[0],
    };
    setTickets([newTicket, ...tickets]);
    setShowCreateModal(false);
    setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
    setFormErrors({});
    showToast('Ticket created successfully!', 'success');
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    const updatedTickets = tickets.map(t =>
      t.id === currentTicket.id ? { ...formData, id: t.id, created: t.created } : t
    );
    setTickets(updatedTickets);
    setShowEditModal(false);
    setCurrentTicket(null);
    setFormData({ title: '', description: '', status: 'open', priority: 'medium' });
    setFormErrors({});
    showToast('Ticket updated successfully!', 'success');
  };

  const handleDelete = () => {
    setTickets(tickets.filter(t => t.id !== currentTicket.id));
    setShowDeleteConfirm(false);
    setCurrentTicket(null);
    showToast('Ticket deleted successfully!', 'success');
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

  const goToDashboard = () => navigate('/dashboard');

  const handleLogout = () => {
    localStorage.removeItem('ticketapp_session');
    navigate('/');
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="dashboard-container" aria-label="Ticket Management">
      {/* Navigation */}
      <nav className="dashboard-nav" role="navigation">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="nova">Nova</span>
            <span className="ticket">Ticket</span>
          </div>

          <button
            className="hamburger"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          <div className={`nav-actions ${menuOpen ? 'show' : ''}`}>
            <button
              id="theme-toggle"
              aria-label="Toggle Theme"
              onClick={toggleTheme}
            ></button>
            <button onClick={goToDashboard} className="nav-actions">
              Dashboard
            </button>
            <button onClick={handleLogout} className="nav-actions">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <section className="dashboard-content">
        {/* Header */}
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

        {/* Stats */}
        <section className="stats-grid">
          <article className="stat-card stat-card-open">
            <div className="stat-label">Open</div>
            <div className="stat-value">{tickets.filter(t => t.status === 'open').length}</div>
          </article>
          <article className="stat-card stat-card-progress">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{tickets.filter(t => t.status === 'in_progress').length}</div>
          </article>
          <article className="stat-card stat-card-closed">
            <div className="stat-label">Closed</div>
            <div className="stat-value">{tickets.filter(t => t.status === 'closed').length}</div>
          </article>
          <article className="stat-card stat-card-total">
            <div className="stat-label">Total</div>
            <div className="stat-value">{tickets.length}</div>
          </article>
        </section>

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
    </main>
  );
};

export default TicketManagement;
