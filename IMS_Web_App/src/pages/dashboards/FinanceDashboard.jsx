import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { DollarSign, FileText, AlertCircle } from 'lucide-react';

const FinanceDashboard = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    apiService.invoices.getAll().then(res => setInvoices(res.data || res));
  }, []);

  const pendingAmount = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.total, 0);

  return (
    <Layout>
      <div className="fade-in">
        <h1>Revenue Management</h1>
        <div className="card" style={{ background: 'var(--primary-green)', color: 'white', marginBottom: '2rem' }}>
          <p>Outstanding Revenue</p>
          <h1 style={{ color: 'white' }}>${pendingAmount.toLocaleString()}</h1>
        </div>
        <div className="card">
          <h3>Recent Invoices</h3>
          {invoices.slice(0, 5).map(inv => (
            <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
              <span>{inv.patientName}</span>
              <span style={{ fontWeight: 600 }}>${inv.total}</span>
              <span className={`badge ${inv.status === 'PAID' ? 'badge-success' : 'badge-warning'}`}>{inv.status}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FinanceDashboard;