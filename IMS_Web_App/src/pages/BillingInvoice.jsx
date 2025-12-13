import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';
import { Plus, DollarSign, X, Eye } from 'lucide-react';

const BillingInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '', appointmentId: '', items: [{ description: '', amount: 0 }]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [invRes, patRes, apptRes] = await Promise.all([
        apiService.invoices.getAll(),
        apiService.patients.getAll(),
        apiService.appointments.getAll()
      ]);
      setInvoices(invRes.data);
      setPatients(patRes.data);
      setAppointments(apptRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === formData.patientId);
    const subtotal = formData.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    const invoiceData = {
      ...formData,
      patientName: `${patient.firstName} ${patient.lastName}`,
      subtotal,
      tax,
      total,
      status: 'Pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    await apiService.invoices.create(invoiceData);
    await loadData();
    setShowModal(false);
    setFormData({ patientId: '', appointmentId: '', items: [{ description: '', amount: 0 }] });
  };

  const handleStatusChange = async (id, status) => {
    await apiService.invoices.updateStatus(id, status);
    await loadData();
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { description: '', amount: 0 }] });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  if (loading) {
    return <Layout><div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} /></div></Layout>;
  }

  return (
    <Layout>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1>Billing & Invoices</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage patient billing and payments</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Create Invoice
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Invoice ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Patient</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Due Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{inv.id}</td>
                  <td style={{ padding: '1rem' }}>{inv.patientName}</td>
                  <td style={{ padding: '1rem' }}>{inv.date}</td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary-green)' }}>
                    ${inv.total.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      className={`badge ${inv.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}
                      value={inv.status}
                      onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                      style={{ border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem' }}>{inv.dueDate}</td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setViewInvoice(inv)}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Invoice Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', animation: 'fadeIn 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2>Create Invoice</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Patient *</label>
                    <select className="input" value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} required>
                      <option value="">Select patient...</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.id})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Appointment</label>
                    <select className="input" value={formData.appointmentId} onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}>
                      <option value="">Select appointment (optional)...</option>
                      {appointments.filter(a => a.patientId === formData.patientId).map(a => (
                        <option key={a.id} value={a.id}>{a.date} - {a.type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Invoice Items</label>
                      <button type="button" className="btn btn-secondary" onClick={addItem} style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}>
                        <Plus size={14} /> Add Item
                      </button>
                    </div>
                    {formData.items.map((item, index) => (
                      <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input 
                          type="text" 
                          className="input" 
                          placeholder="Description" 
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          required
                        />
                        <input 
                          type="number" 
                          className="input" 
                          placeholder="Amount"
                          step="0.01"
                          value={item.amount}
                          onChange={(e) => updateItem(index, 'amount', e.target.value)}
                          style={{ width: '120px' }}
                          required
                        />
                        {formData.items.length > 1 && (
                          <button 
                            type="button" 
                            className="btn btn-danger" 
                            onClick={() => removeItem(index)}
                            style={{ padding: '0.5rem' }}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '1rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      <span>Subtotal:</span>
                      <span>${formData.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      <span>Tax (10%):</span>
                      <span>${(formData.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) * 0.1).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontWeight: 600, fontSize: '1rem' }}>
                      <span>Total:</span>
                      <span style={{ color: 'var(--primary-green)' }}>
                        ${(formData.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) * 1.1).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Invoice</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Invoice Modal */}
        {viewInvoice && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', animation: 'fadeIn 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid var(--primary-green)' }}>
                <div>
                  <h2 style={{ marginBottom: '0.5rem' }}>Invoice {viewInvoice.id}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Date: {viewInvoice.date}</p>
                </div>
                <button onClick={() => setViewInvoice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Bill To:</h3>
                <p style={{ fontWeight: 600 }}>{viewInvoice.patientName}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Patient ID: {viewInvoice.patientId}</p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem' }}>Description</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, fontSize: '0.875rem' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewInvoice.items.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem' }}>{item.description}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ padding: '1rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Subtotal:</span>
                  <span>${viewInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Tax:</span>
                  <span>${viewInvoice.tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontWeight: 600, fontSize: '1.125rem' }}>
                  <span>Total:</span>
                  <span style={{ color: 'var(--primary-green)' }}>${viewInvoice.total.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: viewInvoice.status === 'Paid' ? 'var(--secondary-green)' : '#fef3c7', borderRadius: 'var(--radius)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>Status:</span>
                  <span className={`badge ${viewInvoice.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                    {viewInvoice.status}
                  </span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  <strong>Due Date:</strong> {viewInvoice.dueDate}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BillingInvoice;
