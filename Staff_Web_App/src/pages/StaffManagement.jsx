import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', role: '', department: '', specialization: '', phone: ''
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const response = await apiService.staff.getAll();
      setStaff(response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await apiService.staff.update(editingStaff.id, formData);
      } else {
        await apiService.staff.create(formData);
      }
      await loadStaff();
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this staff member?')) {
      await apiService.staff.delete(id);
      await loadStaff();
    }
  };

  const handleEdit = (s) => {
    setEditingStaff(s);
    setFormData(s);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStaff(null);
    setFormData({ name: '', email: '', role: '', department: '', specialization: '', phone: '' });
  };

  if (loading) {
    return <Layout><div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} /></div></Layout>;
  }

  return (
    <Layout>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1>Staff Management</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage hospital staff members</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Add Staff
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Department</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Contact</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{s.id}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>{s.role}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{s.department}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div>{s.email}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{s.phone}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" onClick={() => handleEdit(s)} style={{ padding: '0.5rem' }}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(s.id)} style={{ padding: '0.5rem' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
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
                <h2>{editingStaff ? 'Edit Staff' : 'Add Staff'}</h2>
                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Name *</label>
                    <input type="text" className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email *</label>
                    <input type="email" className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Role *</label>
                    <select className="input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
                      <option value="">Select...</option>
                      <option value="admin">Admin</option>
                      <option value="doctor">Doctor</option>
                      <option value="radiologist">Radiologist</option>
                      <option value="finance">Finance</option>
                      <option value="management">Management</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Department *</label>
                    <input type="text" className="input" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Specialization</label>
                    <input type="text" className="input" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Phone *</label>
                    <input type="tel" className="input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {editingStaff ? 'Update' : 'Add'}
                  </button>
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

export default StaffManagement;
