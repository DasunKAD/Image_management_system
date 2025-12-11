import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';
import { Plus, Search, Calendar as CalendarIcon, X, User, FileText, CheckCircle, Clock, Trash2, List } from 'lucide-react';

const VisitManagement = () => {
  // Data State
  const [visits, setVisits] = useState([]);
  const [staff, setStaff] = useState([]); // Doctors
  const [invoices, setInvoices] = useState([]); 
  const [serviceCatalogs, setServiceCatalogs] = useState([]); // Service List from API
  const [loading, setLoading] = useState(true);

  // UI State
  const [mainSearchQuery, setMainSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Form State - Patient
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState([]);
  const [isSearchingPatients, setIsSearchingPatients] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Form State - Doctor
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [doctorSearchResults, setDoctorSearchResults] = useState([]);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Form State - Services
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [serviceSearchResults, setServiceSearchResults] = useState([]);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]); // List of selected services in table

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    notes: '', // Reason
    status: 'Scheduled'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [apptRes, staffRes, invoiceRes, serviceRes] = await Promise.all([
        apiService.appointments.getAll(),
        apiService.staff.getAll(),
        apiService.invoices.getAll(),
        apiService.serviceCatalogs.getAll()
      ]);
      setVisits(apptRes.data);
      setStaff(staffRes.data?.filter(s => s.role === 'doctor'));
      setInvoices(invoiceRes.data);
      setServiceCatalogs(serviceRes.data);
    } finally {
      setLoading(false);
    }
  };

  // --- Search Logic ---

  // Main Table Search
  const filteredVisits = visits.filter(v => {
    const query = mainSearchQuery.toLowerCase();
    return (
      v.id.toLowerCase().includes(query) ||
      v.patientName.toLowerCase().includes(query) ||
      v.patientId.toLowerCase().includes(query)
    );
  });

  // Patient Search (Modal)
  useEffect(() => {
    const searchPatients = async () => {
      if (patientSearchQuery.length >= 3) {
        setIsSearchingPatients(true);
        try {
          const results = await apiService.patients.search(patientSearchQuery);
          setPatientSearchResults(results.data || results);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearchingPatients(false);
        }
      } else {
        setPatientSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchPatients, 300);
    return () => clearTimeout(debounceTimer);
  }, [patientSearchQuery]);

  // Doctor Search (Modal)
  useEffect(() => {
    if (doctorSearchQuery) {
      const results = staff.filter(d => 
        d.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
        d.specialization.toLowerCase().includes(doctorSearchQuery.toLowerCase())
      );
      setDoctorSearchResults(results);
    } else {
      setDoctorSearchResults(staff);
    }
  }, [doctorSearchQuery, staff]);

  // Service Search (Modal)
  useEffect(() => {
    if (serviceSearchQuery) {
      const results = serviceCatalogs.filter(s => 
        s.description.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
        s.serviceCode.toLowerCase().includes(serviceSearchQuery.toLowerCase())
      );
      setServiceSearchResults(results);
    } else {
      setServiceSearchResults(serviceCatalogs);
    }
  }, [serviceSearchQuery, serviceCatalogs]);


  // --- Handlers ---

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientSearchQuery(`${patient.firstName} ${patient.lastName}`);
    setPatientSearchResults([]); 
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorSearchQuery(doctor.name);
    setShowDoctorDropdown(false);
  };

  const handleServiceSelect = (service) => {
    // Prevent duplicates
    if (!selectedServices.some(s => s.serviceCode === service.serviceCode)) {
      setSelectedServices([...selectedServices, { ...service, description: service.description, clinicNote: service.description  }]);
    }
    setServiceSearchQuery('');
    setShowServiceDropdown(false);
  };

  const handleServiceDescriptionChange = (index, value) => {
    const updatedServices = [...selectedServices];
    updatedServices[index].clinicNote = value;
    setSelectedServices(updatedServices);
  };

  const removeService = (index) => {
    const updatedServices = selectedServices.filter((_, i) => i !== index);
    setSelectedServices(updatedServices);
  };

  const clearForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      notes: '',
      status: 'Scheduled'
    });
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setSelectedServices([]);
    setPatientSearchQuery('');
    setDoctorSearchQuery('');
    setServiceSearchQuery('');
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      alert("Please select a patient.");
      return;
    }

    // Construct the payload
    const newVisitData = {
      ...formData,
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      doctorId: selectedDoctor ? selectedDoctor.id : null,
      doctorName: selectedDoctor ? selectedDoctor.name : null,
      type: selectedServices.length > 0 ? 'Multiple Services' : 'General Visit', // Logic to determine type based on services
      services: selectedServices.map(s => ({
        serviceId: s.id,
        code: s.serviceCode,
        clinicNote: s.clinicNote,
      }))
    };

    try {
      await apiService.appointments.create(newVisitData);
      await loadData();
      clearForm();
    } catch (error) {
      console.error('Error creating visit:', error);
    }
  };

  const getBillingStatus = (visitId, patientId) => {
    const invoice = invoices.find(inv => inv.appointmentId === visitId || inv.patientId === patientId);
    if (!invoice) return <span className="badge badge-info">Unbilled</span>;
    return (
      <span className={`badge ${invoice.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
        {invoice.status}: ${invoice.total}
      </span>
    );
  };

  if (loading) {
    return <Layout><div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} /></div></Layout>;
  }

  return (
    <Layout>
      <div className="fade-in">
        {/* Top Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1>Visit Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage patient visits, check-ins, and appointments</p>
        </div>

        {/* Search & Action Bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input
              type="text"
              className="input"
              placeholder="Search Visit ID, Patient Name or ID..."
              value={mainSearchQuery}
              onChange={(e) => setMainSearchQuery(e.target.value)}
              style={{ paddingLeft: '3rem', height: '42px' }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ height: '42px' }}>
            <Plus size={20} /> New Visit / Check-In
          </button>
        </div>

        {/* Visits Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Visit ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Patient</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Doctor</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Reason</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Billing Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((visit) => (
                  <tr key={visit.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 500 }}>{visit.id}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 500 }}>{visit.patientName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {visit.patientId}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {visit.doctorName ? (
                        <span>{visit.doctorName}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>-- No Doctor --</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', maxWidth: '200px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {visit.notes || '--'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {getBillingStatus(visit.id, visit.patientId)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                       <span className={`badge ${visit.status === 'Completed' ? 'badge-success' : visit.status === 'Cancelled' ? 'badge-error' : 'badge-warning'}`}>
                        {visit.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                       <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem' }} title="View Details">
                          <FileText size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Visit Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div className="card" style={{ maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', animation: 'fadeIn 0.2s', padding: '2rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2>New Visit Entry</h2>
                <button onClick={clearForm} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* 1. Patient Search Field */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Patient Search *</label>
                    <div style={{ position: 'relative' }}>
                      <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="Type 3+ letters to search patient..."
                        value={patientSearchQuery}
                        onChange={(e) => {
                          setPatientSearchQuery(e.target.value);
                          if (selectedPatient) setSelectedPatient(null);
                        }}
                        style={{ paddingLeft: '3rem', borderColor: selectedPatient ? 'var(--primary-green)' : 'var(--border)' }}
                      />
                      {selectedPatient && (
                        <CheckCircle size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-green)' }} />
                      )}
                    </div>
                    
                    {patientSearchResults.length > 0 && !selectedPatient && (
                      <div style={{ 
                        position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border)', 
                        borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', zIndex: 10, maxHeight: '200px', overflowY: 'auto', marginTop: '4px' 
                      }}>
                        {patientSearchResults.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => handlePatientSelect(p)}
                            style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--surface-alt)' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-alt)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                          >
                            <div style={{ fontWeight: 600 }}>{p.firstName} {p.lastName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {p.id} • DOB: {p.dateOfBirth}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fields visible ONLY after Patient is selected */}
                  {selectedPatient && (
                    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      
                      {/* Patient Info Card */}
                      <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                          <div><strong>Email:</strong> {selectedPatient.email}</div>
                          <div><strong>Phone:</strong> {selectedPatient.phoneNumber}</div>
                          <div><strong>Gender:</strong> {selectedPatient.gender}</div>
                          <div><strong>Blood:</strong> {selectedPatient.bloodGroup || 'N/A'}</div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* Date */}
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Date</label>
                          <input 
                            type="date" 
                            className="input" 
                            value={formData.date} 
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          />
                        </div>

                        {/* Doctor Search */}
                        <div style={{ position: 'relative' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Doctor <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>(Optional)</span>
                          </label>
                          <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                              type="text"
                              className="input"
                              placeholder="Search Doctor..."
                              value={doctorSearchQuery}
                              onFocus={() => setShowDoctorDropdown(true)}
                              onChange={(e) => {
                                setDoctorSearchQuery(e.target.value);
                                setShowDoctorDropdown(true);
                                setSelectedDoctor(null); 
                              }}
                              style={{ paddingLeft: '3rem' }}
                            />
                          </div>
                          
                          {showDoctorDropdown && doctorSearchResults.length > 0 && (
                            <div style={{ 
                              position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border)', 
                              borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', zIndex: 10, maxHeight: '150px', overflowY: 'auto', marginTop: '4px' 
                            }}>
                              {doctorSearchResults.map(d => (
                                <div 
                                  key={d.id}
                                  onClick={() => handleDoctorSelect(d)}
                                  style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--surface-alt)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-alt)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                >
                                  <div style={{ fontWeight: 600 }}>{d.name}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.specialization}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Visit Reason */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Visit Reason</label>
                        <textarea 
                          className="input" 
                          rows={2} 
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Enter reason for visit, symptoms, or notes..."
                        />
                      </div>

                      {/* --- SERVICE SELECTION SECTION --- */}
                      <div style={{ borderTop: '2px dashed var(--border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <List size={20} /> Select Services
                        </h3>
                        
                        {/* Service Search Dropdown */}
                        <div style={{ marginBottom: '1rem', position: 'relative' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Add Service Item</label>
                          <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                              type="text"
                              className="input"
                              placeholder="Search service catalog (e.g. Consultation, X-Ray)..."
                              value={serviceSearchQuery}
                              onFocus={() => setShowServiceDropdown(true)}
                              onChange={(e) => {
                                setServiceSearchQuery(e.target.value);
                                setShowServiceDropdown(true);
                              }}
                              style={{ paddingLeft: '3rem' }}
                            />
                          </div>

                           {showServiceDropdown && serviceSearchResults.length > 0 && (
                            <div style={{ 
                              position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border)', 
                              borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', zIndex: 10, maxHeight: '200px', overflowY: 'auto', marginTop: '4px' 
                            }}>
                              {serviceSearchResults.map(s => (
                                <div 
                                  key={s.id}
                                  onClick={() => handleServiceSelect(s)}
                                  style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--surface-alt)', display: 'flex', justifyContent: 'space-between' }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-alt)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                >
                                  <div>
                                    <div style={{ fontWeight: 600 }}>{s.description}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Code: {s.serviceCode}</div>
                                  </div>
                                  <div style={{ fontWeight: 600, color: 'var(--primary-green)' }}>${s.unitCost}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Selected Services Table */}
                        {selectedServices.length > 0 ? (
                          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                              <thead style={{ background: 'var(--surface-alt)' }}>
                                <tr>
                                  <th style={{ padding: '0.75rem', textAlign: 'left', width: '30%'}}>Service Name</th>
                                  <th style={{ padding: '0.75rem', textAlign: 'left', width: '50%' }}>Clinic Notes</th>
                                  <th style={{ padding: '0.75rem', textAlign: 'right', width: '10%'}}>Fee</th>
                                  <th style={{ padding: '0.75rem', textAlign: 'right', width: '10%'}}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedServices.map((service, index) => (
                                  <tr key={index} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.75rem' }}>
                                      <div style={{ fontWeight: 500 }}>{service.description}</div>
                                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{service.serviceCode}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                      <input 
                                        type="text" 
                                        className="input" 
                                        style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                                        placeholder="Add Notes to clinic..."
                                        value={service.clinicNote}
                                        onChange={(e) => handleServiceDescriptionChange(index, e.target.value)}
                                      />
                                    </td>
                                    <td style={{ padding: '0.75rem' ,textAlign: 'right' }}>
                                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>${service.unitCost}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                      <button 
                                        type="button" 
                                        onClick={() => removeService(index)}
                                        style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            No services selected yet. Search above to add.
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={!selectedPatient}>
                      Create Visit
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={clearForm} style={{ flex: 1 }}>
                      Cancel
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VisitManagement;