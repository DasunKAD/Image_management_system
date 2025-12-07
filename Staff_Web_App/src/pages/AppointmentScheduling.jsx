import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';
import { Plus, Calendar as CalendarIcon, X } from 'lucide-react';

const AppointmentScheduling = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '', doctorId: '', date: '', time: '', type: '', notes: '', status: 'Scheduled'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [apptRes, patientRes, staffRes] = await Promise.all([
        apiService.appointments.getAll(),
        apiService.patients.getAll(),
        apiService.staff.getAll()
      ]);
      setAppointments(apptRes.data);
      setPatients(patientRes.data);
      setStaff(staffRes.data.filter(s => s.role === 'doctor'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === formData.patientId);
    const doctor = staff.find(d => d.id === formData.doctorId);
    const appointmentData = {
      ...formData,
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctorName: doctor.name
    };
    await apiService.appointments.create(appointmentData);
    await loadData();
    handleCloseModal();
  };

  const handleCancel = async (id) => {
    if (window.confirm('Cancel this appointment?')) {
      await apiService.appointments.cancel(id);
      await loadData();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ patientId: '', doctorId: '', date: '', time: '', type: '', notes: '', status: 'Scheduled' });
  };

  if (loading) {
    return <Layout><div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} /></div></Layout>;
  }

  return (
    <Layout>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1>Appointment Scheduling</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage patient appointments</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Schedule Appointment
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Patient</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Doctor</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{appt.id}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{appt.patientName}</td>
                  <td style={{ padding: '1rem' }}>{appt.doctorName}</td>
                  <td style={{ padding: '1rem' }}>
                    <div>{appt.date}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{appt.time}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{appt.type}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${appt.status === 'Completed' ? 'badge-success' : appt.status === 'Cancelled' ? 'badge-error' : 'badge-warning'}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {appt.status === 'Scheduled' && (
                      <button className="btn btn-danger" onClick={() => handleCancel(appt.id)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%', animation: 'fadeIn 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2>Schedule Appointment</h2>
                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
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
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Doctor *</label>
                    <select className="input" value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })} required>
                      <option value="">Select doctor...</option>
                      {staff.map(d => (
                        <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Date *</label>
                    <input type="date" className="input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Time *</label>
                    <input type="time" className="input" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Type *</label>
                    <select className="input" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required>
                      <option value="">Select type...</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Screening">Screening</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Notes</label>
                    <textarea className="input" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Schedule</button>
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AppointmentScheduling;
