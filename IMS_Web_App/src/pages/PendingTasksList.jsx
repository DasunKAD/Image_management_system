import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';
import { Search, PlayCircle, FileText, Calendar } from 'lucide-react';

const PendingTasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await apiService.workflow.getRadiologistWorklist();
      setTasks(response.data || response); 
    } catch (error) {
      console.error("Failed to load radiologist tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = (taskId) => {
    // Navigate to the review page (to be implemented later)
    navigate(`/review/${taskId}`);
  };

  const filteredTasks = tasks.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      t.patientName?.toLowerCase().includes(q) ||
      t.taskNo?.toLowerCase().includes(q) ||
      t.visitNo?.toLowerCase().includes(q) ||
      t.patientId?.toString().includes(q)
    );
  });

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
          <h1>Pending Tasks List</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Radiology review worklist
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '400px' }}>
          <Search 
            size={18} 
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
          />
          <input
            type="text"
            className="input"
            placeholder="Search Patient, Task ID, Visit #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem' }}
          />
        </div>

        {/* Tasks Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No pending reviews found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Task ID</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Patient Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Patient ID</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Visit #</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Task Type</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Details</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Scan Date</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Images</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.taskId} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', fontWeight: 500, fontFamily: 'monospace' }}>
                        {task.taskNo}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>
                        {task.patientName}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {task.patientId}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {task.visitNo}
                      </td>
                       <td style={{ padding: '1rem' }}>
                        <span className="badge badge-info">{task.taskType}</span>
                      </td>
                      <td style={{ padding: '1rem', maxWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} title={task.description}>
                          <FileText size={14} color="var(--text-muted)" />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {task.description}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={14} color="var(--text-muted)" />
                          {task.scanDate ? new Date(task.scanDate).toLocaleDateString() : '-'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span className="badge badge-success">{task.attachmentCount || 0}</span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handleStartReview(task.taskId)}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                        >
                          <PlayCircle size={16} /> Start Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PendingTasksList;