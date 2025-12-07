import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';
import { Upload, Image as ImageIcon, FileText } from 'lucide-react';

const ImageUpload = () => {
  const [images, setImages] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    appointmentId: '', type: '', category: '', scanDate: '', machineId: '', comments: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [imgRes, apptRes] = await Promise.all([
        apiService.images.getAll(),
        apiService.appointments.getAll()
      ]);
      setImages(imgRes.data);
      setAppointments(apptRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const appt = appointments.find(a => a.id === formData.appointmentId);
    const imageData = {
      ...formData,
      patientId: appt.patientId,
      patientName: appt.patientName,
      uploadedBy: 'Dr. Emily Davis'
    };
    await apiService.images.upload(imageData);
    await loadData();
    setShowModal(false);
    setFormData({ appointmentId: '', type: '', category: '', scanDate: '', machineId: '', comments: '' });
  };

  if (loading) {
    return <Layout><div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} /></div></Layout>;
  }

  return (
    <Layout>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1>Medical Images</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Upload and manage medical imaging</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Upload size={20} /> Upload Image
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {images.map((img) => (
            <div key={img.id} className="card">
              <div style={{ 
                width: '100%', 
                height: '200px', 
                background: 'var(--surface-alt)', 
                borderRadius: 'var(--radius)', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ImageIcon size={48} color="var(--text-muted)" />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-info">{img.type}</span>
                  <span className={`badge ${img.status === 'Pending Review' ? 'badge-warning' : 'badge-success'}`}>
                    {img.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{img.patientName}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {img.category} - {img.scanDate}
                </p>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                background: 'var(--surface-alt)', 
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem'
              }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Machine:</strong> {img.machineId}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Uploaded:</strong> {img.uploadDate}
                </div>
                {img.comments && (
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <strong>Notes:</strong> {img.comments}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%', animation: 'fadeIn 0.2s' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Upload Medical Image</h2>
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
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Image Type *</label>
                    <select className="input" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required>
                      <option value="">Select type...</option>
                      <option value="MRI">MRI</option>
                      <option value="CT">CT Scan</option>
                      <option value="X-Ray">X-Ray</option>
                      <option value="Ultrasound">Ultrasound</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Category *</label>
                    <input type="text" className="input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g., Brain, Chest, Abdomen" required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Scan Date *</label>
                    <input type="date" className="input" value={formData.scanDate} onChange={(e) => setFormData({ ...formData, scanDate: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Machine ID *</label>
                    <input type="text" className="input" value={formData.machineId} onChange={(e) => setFormData({ ...formData, machineId: e.target.value })} placeholder="e.g., MRI-001" required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Comments</label>
                    <textarea className="input" value={formData.comments} onChange={(e) => setFormData({ ...formData, comments: e.target.value })} rows={3} placeholder="Additional notes..." />
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'var(--surface-alt)', 
                    borderRadius: 'var(--radius)',
                    border: '2px dashed var(--border)',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}>
                    <Upload size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Click to upload image file<br />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Demo: File upload simulated)</span>
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Upload</button>
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

export default ImageUpload;
