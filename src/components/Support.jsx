// components/Support/Support.jsx
import React, { useState } from 'react';
import './Support.css';

// Sample FAQ data
const faqs = [
  { question: 'How do I reset a user password?', answer: 'Navigate to the Users tab, select the user, and click "Reset Password".' },
  { question: 'How can I view system logs?', answer: 'Go to the Logs section under System Settings to view detailed logs.' },
  { question: 'What is the maximum file upload size?', answer: 'The maximum file upload size is 10MB for all admin uploads.' },
];

// Sample ticket data (mocked for demo)
const initialTickets = [
  { id: 1, title: 'Login Issue', status: 'Open', priority: 'High', date: '2025-05-18' },
  { id: 2, title: 'Database Error', status: 'In Progress', priority: 'Medium', date: '2025-05-17' },
];

const Support = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'Low' });
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle ticket submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicket = {
      id: tickets.length + 1,
      title: formData.title,
      status: 'Open',
      priority: formData.priority,
      date: new Date().toISOString().split('T')[0],
    };
    setTickets([...tickets, newTicket]);
    setFormData({ title: '', description: '', priority: 'Low' });
    alert('Ticket submitted successfully!');
  };

  // Toggle FAQ
  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="support-container">
      <h1>Admin Support</h1>

      {/* Tickets Section */}
      <section className="tickets-section">
        <h2>Support Tickets</h2>
        <div className="table-wrapper">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.title}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        ticket.status === 'Open' ? 'status-open' : 'status-in-progress'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create Ticket Form */}
      <section className="form-section">
        <h2>Create New Ticket</h2>
        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button type="submit" className="submit-button">
            Submit Ticket
          </button>
        </form>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                onClick={() => toggleFaq(index)}
                className="faq-question"
              >
                {faq.question}
                <span>{expandedFaq === index ? '-' : '+'}</span>
              </button>
              {expandedFaq === index && (
                <p className="faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Support;
