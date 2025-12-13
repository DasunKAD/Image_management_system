import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';
import { Plus, FileText, CheckCircle, X } from 'lucide-react';

const DiagnosisReports = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    appointmentId: '', diagnosis: '', report: '', followUpRequired: false, followUpDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [diagRes, apptRes, imgRes] = await Promise.all([
        apiService.diagnoses.getAll(),
        apiService.appointments.getAll(),
        apiService.images.getAll()
      ]);
      setDiagnoses(diagRes.data);
      setAppointments(apptRes.data);
      setImages(imgRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const appt = appointments.find(a => a.id === formData.appointmentId);
    const diagnosisData = {
      ...formData,
      patientId: appt.patientId,
      patientName: appt.patientName,
      doctorId: 'S002',
      doctorName: 'Dr. Michael Chen',
      status: 'Draft'
    };
    await apiService.diagnoses.create(diagnosisData);
    await loadData();
    setShowModal(false);
    setFormData({ appointmentId: '', diagnosis: '', report: '', followUpRequired: false, followUpDate: '' });
  };

  const handleConfirm = async (id) => {
    if (window.confirm('Confirm this diagnosis?')) {
      await apiService.diagnoses.confirm(id);
      await loadData();
    }
  };

  if (loading) {
    return <Layout><div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} /></div></Layout>;
  }

  return (
    <Layout>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1>Diagnosis & Reports</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Create and manage diagnosis reports</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> New Diagnosis
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {diagnoses.map((diag) => (
            <div key={diag.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{diag.patientName}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span>{diag.id}</span>
                    <span>•</span>
                    <span>{diag.date}</span>
                    <span>•</span>
                    <span>{diag.doctorName}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span className={`badge ${diag.status === 'Confirmed' ? 'badge-success' : 'badge-warning'}`}>
                    {diag.status}
                  </span>
                  {diag.status !== 'Confirmed' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleConfirm(diag.id)}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      <CheckCircle size={16} /> Confirm
                    </button>
                  )}
                </div>
              </div>
              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius)' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary-green)' }}>
                  Diagnosis
                </h4>
                <p>{diag.diagnosis}</p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Report</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {diag.report}
                </p>
              </div>
              {diag.followUpRequired && (
                <div style={{ 
                  padding: '0.75rem', 
                  background: '#fef3c7', 
                  border: '1px solid #fde047',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                  color: '#92400e'
                }}>
                  <strong>Follow-up Required:</strong> {diag.followUpDate}
                </div>
              )}
            </div>
          ))}
        </div>

        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', animation: 'fadeIn 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2>Create Diagnosis Report</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Appointment *</label>
                    <select className="input" value={formData.appointmentId} onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })} required>
                      <option value="">Select appointment...</option>
                      {appointments.map(a => (
                        <option key={a.id} value={a.id}>{a.patientName} - {a.date} ({a.id})</option>
                      ))}
                    </select>
                  </div>

                  {formData.appointmentId && (
                    <div style={{ padding: '1rem', background: 'var(--secondary-green)', borderRadius: 'var(--radius)' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Available Images</h4>
                      {images.filter(img => img.appointmentId === formData.appointmentId).map(img => (
                        <div key={img.id} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          • {img.type} - {img.category} ({img.scanDate})
                        </div>
                      ))}
                      {images.filter(img => img.appointmentId === formData.appointmentId).length === 0 && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No images uploaded yet</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Diagnosis *</label>
                    <input 
                      type="text" 
                      className="input" 
                      value={formData.diagnosis} 
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} 
                      placeholder="Primary diagnosis..."
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Report *</label>
                    <textarea 
                      className="input" 
                      value={formData.report} 
                      onChange={(e) => setFormData({ ...formData, report: e.target.value })} 
                      rows={6}
                      placeholder="Detailed medical report, findings, and recommendations..."
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.followUpRequired} 
                        onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Follow-up Required</span>
                    </label>
                  </div>
                  {formData.followUpRequired && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Follow-up Date</label>
                      <input 
                        type="date" 
                        className="input" 
                        value={formData.followUpDate} 
                        onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                      />
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Diagnosis</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DiagnosisReports;
