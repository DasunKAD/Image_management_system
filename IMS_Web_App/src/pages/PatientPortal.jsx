import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';
import { 
  User, 
  Calendar, 
  FileText, 
  Activity, 
  Clock, 
  MapPin, 
  Info,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  DollarSign,
  Printer,
  X,
  Eye
} from 'lucide-react';

const PatientPortal = () => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('visits');
  const [expandedVisits, setExpandedVisits] = useState({});
  
  // State for Invoice Modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      // Calling the specific API as requested
      const data = await apiService.patients.getCurrentPatient();
      setPatientData(data.data);
      
      // Initialize all visits as expanded by default
      if (data.tasks) {
        const visitIds = [...new Set(data.tasks.map(t => t.visitId))];
        const initialExpanded = {};
        visitIds.forEach(id => initialExpanded[id] = true);
        setExpandedVisits(initialExpanded);
      }
    } catch (error) {
      console.error("Error loading patient data", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisit = (visitId) => {
    setExpandedVisits(prev => ({
      ...prev,
      [visitId]: !prev[visitId]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to Group Tasks by Visit
  const getVisitsFromTasks = (tasks = []) => {
    const visitsMap = {};
    
    tasks.forEach(task => {
      if (!visitsMap[task.visitId]) {
        visitsMap[task.visitId] = {
          visitId: task.visitId,
          reason: task.visitReason || 'General Visit',
          doctor: task.visitDoctorName,
          date: task.createdOn, // Approximation using task creation date
          tasks: []
        };
      }
      visitsMap[task.visitId].tasks.push(task);
    });

    // Sort visits by date (newest first)
    return Object.values(visitsMap).sort((a, b) => new Date(b.date) - new Date(a.date));
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

  if (!patientData) return <Layout><div style={{ padding: '2rem' }}>No data available</div></Layout>;

  const visits = getVisitsFromTasks(patientData.tasks);

  return (
    <Layout>
      <div className="fade-in">
        {/* Header Section - Patient Details */}
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary-green)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', background: 'var(--secondary-green)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <User size={40} color="var(--primary-green)" />
            </div>
            
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{patientData.fullName}</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span className="badge badge-info">{patientData.patientCode}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                   <Calendar size={16} /> DOB: {patientData.dateOfBirth}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                   <User size={16} /> {patientData.gender}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                   <Info size={16} /> {patientData.ageCategory}
                </span>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '250px' }}>
               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                 <MapPin size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                 <span style={{ color: 'var(--text-secondary)' }}>{patientData.address || 'No address on file'}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('visits')}
            style={{
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'visits' ? '2px solid var(--primary-green)' : '2px solid transparent',
              color: activeTab === 'visits' ? 'var(--primary-green)' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Calendar size={18} /> Visits History
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            style={{
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'invoices' ? '2px solid var(--primary-green)' : '2px solid transparent',
              color: activeTab === 'invoices' ? 'var(--primary-green)' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              whiteSpace: 'nowrap'
            }}
          >
            <DollarSign size={18} /> Invoices & Billing
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            style={{
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'tasks' ? '2px solid var(--primary-green)' : '2px solid transparent',
              color: activeTab === 'tasks' ? 'var(--primary-green)' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Activity size={18} /> All Tasks
          </button>
        </div>

        {/* VISITS TAB */}
        {activeTab === 'visits' && (
          <div className="fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
            {visits.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No visit history found.</div>
            ) : (
               visits.map((visit, idx) => {
                 const isExpanded = expandedVisits[visit.visitId];
                 return (
                   <div key={visit.visitId} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                     {/* Visit Header */}
                     <div 
                        onClick={() => toggleVisit(visit.visitId)}
                        style={{ 
                          padding: '1rem 1.5rem', 
                          background: 'var(--surface-alt)', 
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                     >
                        <div>
                          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                             {visit.reason}
                          </h3>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={14} /> {new Date(visit.date).toLocaleDateString()} 
                            {visit.doctor && <span>• Dr. {visit.doctor}</span>}
                          </div>
                        </div>
                        <div>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                     </div>

                     {/* Visit Content (Tasks within visit) */}
                     {isExpanded && (
                       <div style={{ padding: '1.5rem' }}>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                            Procedures & Tasks
                          </h4>
                          <div style={{ display: 'grid', gap: '1rem' }}>
                             {visit.tasks.map((task) => (
                               <div key={task.taskNo} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <div>
                                      <div style={{ fontWeight: 600, fontSize: '1rem' }}>{task.description}</div>
                                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task.modality || 'General'}</div>
                                    </div>
                                    <span className={`badge ${task.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                                      {task.status.replace('_', ' ')}
                                    </span>
                                  </div>

                                  {/* Diagnostic Report Section */}
                                  {task.diagnosticReport && (
                                    <div style={{ marginTop: '1rem', background: '#ecfdf5', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid #d1fae5' }}>
                                       <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-green-dark)', marginBottom: '0.25rem' }}>
                                          Diagnosis: {task.diagnosticReport.diseaseClassification}
                                       </div>
                                       <p style={{ fontSize: '0.9rem', color: '#064e3b' }}>
                                          {task.diagnosticReport.findings}
                                       </p>
                                    </div>
                                  )}

                                  {/* Images Section */}
                                  {task.images && task.images.length > 0 && (
                                    <div style={{ marginTop: '1rem' }}>
                                       <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                          <ImageIcon size={14} /> Medical Images ({task.images.length})
                                       </div>
                                       <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                          {task.images.map((imgUrl, i) => (
                                            <a key={i} href={imgUrl} target="_blank" rel="noopener noreferrer">
                                              <img 
                                                src={imgUrl} 
                                                alt={`Scan ${i+1}`} 
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }}
                                              />
                                            </a>
                                          ))}
                                       </div>
                                    </div>
                                  )}
                               </div>
                             ))}
                          </div>
                       </div>
                     )}
                   </div>
                 );
               })
            )}
          </div>
        )}

        {/* INVOICES TAB */}
        {activeTab === 'invoices' && (
          <div className="fade-in">
             <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <thead>
                   <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                     <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Invoice #</th>
                     <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                     <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Items</th>
                     <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Amount</th>
                     <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Status</th>
                     <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {(!patientData.invoices || patientData.invoices.length === 0) ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          No invoices found on record.
                        </td>
                      </tr>
                   ) : (
                     patientData.invoices.map((inv) => (
                       <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                         <td style={{ padding: '1rem', fontWeight: 500, fontFamily: 'monospace', fontSize: '0.9rem' }}>
                            {inv.invoiceNumber || `INV-${inv.id}`}
                         </td>
                         <td style={{ padding: '1rem' }}>{inv.date}</td>
                         <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            {inv.items ? `${inv.items.length} item(s)` : '0 items'}
                         </td>
                         <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>
                            ${inv.total ? inv.total.toFixed(2) : '0.00'}
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
                              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                            >
                              <Eye size={16} /> View Bill
                            </button>
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="fade-in">
             <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <thead>
                   <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                     <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                     <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Description</th>
                     <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Type</th>
                     <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Details</th>
                     <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {patientData.tasks.map((task, index) => (
                     <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                       <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                          {new Date(task.createdOn).toLocaleDateString()}
                       </td>
                       <td style={{ padding: '1rem', fontWeight: 500 }}>{task.description}</td>
                       <td style={{ padding: '1rem' }}>
                          <span className="badge badge-info">{task.modality || 'General'}</span>
                       </td>
                       <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                          {task.diagnosticReport ? (
                            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                               <FileText size={14} /> Report Available
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-secondary)' }}>-</span>
                          )}
                          {task.images && task.images.length > 0 && (
                             <div style={{ marginTop: '0.25rem', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <ImageIcon size={14} /> {task.images.length} Image(s)
                             </div>
                          )}
                       </td>
                       <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span className={`badge ${task.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

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
                <button onClick={handlePrint} className="btn btn-secondary">
                  <Printer size={18} /> Print Bill
                </button>
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
                    <h3 style={{ fontSize: '1.1rem', wordBreak: 'break-all' }}>#{selectedInvoice.invoiceNumber || selectedInvoice.id}</h3>
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
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{patientData.fullName}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Patient ID: {patientData.patientCode}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{patientData.address}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Reference</h4>
                     <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
                       <Calendar size={16} color="var(--text-muted)" /> Due Date: {selectedInvoice.dueDate || selectedInvoice.date}
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
                       <FileText size={16} color="var(--text-muted)" /> Visit #: {selectedInvoice.appointmentId || selectedInvoice.items?.[0]?.visitId || 'N/A'}
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
                    {selectedInvoice.items && selectedInvoice.items.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 500 }}>{item.description}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.code}</div>
                        </td>
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
                      <span style={{ fontWeight: 500 }}>${selectedInvoice.subtotal ? selectedInvoice.subtotal.toFixed(2) : '0.00'}</span>
                    </div>
                    {selectedInvoice.tax && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Tax:</span>
                        <span style={{ fontWeight: 500 }}>${selectedInvoice.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontSize: '1.25rem', fontWeight: 700, borderTop: '1px solid var(--border)' }}>
                      <span>Total:</span>
                      <span style={{ color: 'var(--primary-green)' }}>${selectedInvoice.total ? selectedInvoice.total.toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer (Only for print) */}
                <div className="print-only" style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <p>Thank you for choosing our hospital. For billing inquiries, please contact billing@hospital.com</p>
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
              display: block !important;
            }
            .modal-content {
              box-shadow: none !important;
              border: none !important;
              max-height: none !important;
              overflow: visible !important;
              width: 100% !important;
              max-width: none !important;
            }
            .no-print {
              display: none !important;
            }
            .print-only {
              display: block !important;
            }
            /* Hide scrolling on body when printing */
            body {
              overflow: hidden;
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

export default PatientPortal;