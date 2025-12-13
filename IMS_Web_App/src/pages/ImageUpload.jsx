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
            <h1>Pending Review Medical Images</h1>
            <p style={{ color: 'var(--text-secondary)' }}></p>
          </div>
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

          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Upload size={20} /> Review Image
          </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ImageUpload;
