import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';
import { 
  Search, 
  Printer, 
  CheckCircle, 
  FileText, 
  X, 
  Calendar,
  Filter
} from 'lucide-react';

const FinanceDashboard = () => {
  const [invoices, setInvoices] = useState([]); // Master list of all invoices
  const [displayedInvoices, setDisplayedInvoices] = useState([]); // List currently shown
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  // Default to today's date formatted as YYYY-MM-DD
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await apiService.invoices.getAll();
      const allInvoices = response.data || response;
      setInvoices(allInvoices);
      // Apply default filter (Today) immediately after loading
      applyFilters(allInvoices, searchQuery, searchDate);
    } catch (error) {
      console.error("Error loading invoices", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const applyFilters = (data, query, date) => {
    const q = query.toLowerCase();
    const filtered = data.filter(inv => {
      // 1. Check Text Match
      const matchesText = (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.patientName.toLowerCase().includes(q) ||
        (inv.appointmentId && inv.appointmentId.toLowerCase().includes(q)) ||
        inv.total.toString().includes(q)
      );

      // 2. Check Date Match (if a date is selected)
      const matchesDate = date ? inv.date === date : true;

      return matchesText && matchesDate;
    });
    setDisplayedInvoices(filtered);
  };

  // Handler for the Search Button
  const handleSearch = () => {
    applyFilters(invoices, searchQuery, searchDate);
  };

  // Handler for Enter key in text input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCompleteInvoice = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to mark this invoice as PAID?")) return;
    
    setProcessing(true);
    try {
      await apiService.invoices.updateStatus(invoiceId, 'PAID');
      
      // Update master list
      const updatedList = invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'PAID' } : inv
      );
      setInvoices(updatedList);
      
      // Update displayed list to reflect status change immediately
      const updatedDisplayed = displayedInvoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'PAID' } : inv
      );
      setDisplayedInvoices(updatedDisplayed);
      
      // Update selected invoice view if open
      if (selectedInvoice && selectedInvoice.id === invoiceId) {
        setSelectedInvoice({ ...selectedInvoice, status: 'PAID' });
      }
      
    } catch (error) {
      console.error("Failed to update invoice", error);
      alert("Failed to complete invoice.");
    } finally {
      setProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="fade-in">
        <div style={{ marginBottom: '2rem' }}>
          <h1>Finance Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Process payments and manage invoices</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          
          {/* Text Search */}
          <div style={{ flex: 2, minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Search Details</label>
            <div style={{ position: 'relative' }}>
              <Search 
                size={18} 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
              <input
                type="text"
                className="input"
                placeholder="Invoice ID, Patient Name, Visit #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>

          {/* Date Filter */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Date Filed</label>
            <div style={{ position: 'relative' }}>
              <Calendar 
                size={18} 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
              <input
                type="date"
                className="input"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>

          {/* Search Button */}
          <div style={{ flex: '0 0 auto' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleSearch}
              style={{ height: '42px', padding: '0 2rem' }}
            >
              <Filter size={18} /> Search
            </button>
          </div>
          
          {/* Clear Button (Optional utility) */}
          <div style={{ flex: '0 0 auto' }}>
             <button 
              className="btn btn-secondary" 
              onClick={() => {
                setSearchQuery('');
                setSearchDate(''); // Clear date to show all
                applyFilters(invoices, '', '');
              }}
              style={{ height: '42px' }}
              title="Clear all filters"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Invoice List Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Invoice ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Patient</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Visit Ref</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedInvoices.length > 0 ? (
                displayedInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, fontFamily: 'monospace' }}>{inv.id}</td>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{inv.patientName}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{inv.appointmentId || '-'}</td>
                    <td style={{ padding: '1rem' }}>{inv.date}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--primary-green)' }}>
                      ${inv.total.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span className={`badge ${inv.status === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setSelectedInvoice(inv)}
                        style={{ padding: '0.5rem 1rem' }}
                      >
                        <FileText size={16} /> View Bill
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <Search size={32} color="var(--border)" />
                      <p>No invoices found for the selected date or search criteria.</p>
                      {searchDate && <p style={{ fontSize: '0.875rem' }}>Filtering by Date: {searchDate}</p>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* INVOICE DETAILS MODAL */}
        {selectedInvoice && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.5)', zIndex: 1000, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem'
          }}>
            <div className="card modal-content" style={{ 
              maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', 
              animation: 'fadeIn 0.2s', padding: 0, display: 'flex', flexDirection: 'column'
            }}>
              
              {/* Toolbar - Not Printed */}
              <div className="no-print" style={{ 
                padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'var(--surface-alt)'
              }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={handlePrint} className="btn btn-secondary">
                    <Printer size={18} /> Print Bill
                  </button>
                  {selectedInvoice.status !== 'PAID' && (
                    <button 
                      onClick={() => handleCompleteInvoice(selectedInvoice.id)} 
                      className="btn btn-primary"
                      disabled={processing}
                    >
                      {processing ? 'Processing...' : <><CheckCircle size={18} /> Mark as PAID</>}
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedInvoice(null)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* PRINTABLE AREA */}
              <div id="printable-bill" style={{ padding: '3rem' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', borderBottom: '2px solid var(--primary-green)', paddingBottom: '1rem' }}>
                  <div>
                    <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-green)' }}>MEDICAL INVOICE</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Hospital Management System</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>#{selectedInvoice.id}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Date: {selectedInvoice.date}</p>
                    <div style={{ marginTop: '0.5rem' }}>
                       <span className={`badge ${selectedInvoice.status === 'PAID' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '1rem', padding: '0.25rem 1rem' }}>
                        {selectedInvoice.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Billed To</h4>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedInvoice.patientName}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Patient ID: {selectedInvoice.patientId}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Reference</h4>
                     <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
                       <Calendar size={16} color="var(--text-muted)" /> Due Date: {selectedInvoice.dueDate}
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
                       <FileText size={16} color="var(--text-muted)" /> Visit #: {selectedInvoice.appointmentId || 'N/A'}
                     </div>
                  </div>
                </div>

                {/* Line Items */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', width: '70%' }}>Description</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem' }}>{item.description}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: '250px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                      <span style={{ fontWeight: 500 }}>${selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Tax:</span>
                      <span style={{ fontWeight: 500 }}>${selectedInvoice.tax.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontSize: '1.25rem', fontWeight: 700 }}>
                      <span>Total:</span>
                      <span style={{ color: 'var(--primary-green)' }}>${selectedInvoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer (Only for print) */}
                <div className="print-only" style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <p>Thank you for choosing our hospital. For billing inquiries, please contact finance@hospital.com</p>
                  <p>Generated on {new Date().toLocaleString()}</p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* CSS for Printing */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .modal-overlay, .modal-content, #printable-bill, #printable-bill * {
              visibility: visible;
            }
            .modal-overlay {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background: white !important;
              padding: 0 !important;
            }
            .modal-content {
              box-shadow: none !important;
              border: none !important;
              max-height: none !important;
              overflow: visible !important;
            }
            .no-print {
              display: none !important;
            }
            .print-only {
              display: block !important;
            }
          }
          .print-only {
            display: none;
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default FinanceDashboard;