import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';
import { 
  FileText, 
  User, 
  Image as ImageIcon, 
  Activity, 
  Plus, 
  X,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

const ImageThumbnail = ({ src, alt }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div style={{ 
        height: '100%', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'var(--text-muted)',
        background: '#f3f4f6' 
      }}>
        <AlertCircle size={24} style={{ marginBottom: '0.25rem' }} />
        <span style={{ fontSize: '0.75rem' }}>Failed</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      onError={(e) => {
        console.error("Image failed to load:", src); // Debug log
        setError(true);
      }}
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover' // Changed to cover to ensure it fills the box
      }} 
    />
  );
};

const TaskReview = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); 
  
  const [reportData, setReportData] = useState({
    diseaseClassification: '',
    findings: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    type: 'Follow-up Scan',
    priority: 'Routine',
    description: ''
  });

  useEffect(() => {
    if (taskId) {
      loadTaskDetails();
    }
  }, [taskId]);

  const loadTaskDetails = async () => {
    setLoading(true);
    try {
      const data = await apiService.workflow.getTaskDetails(taskId);
      setTask(data);
    } catch (error) {
      console.error("Error loading task", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportData.diseaseClassification || !reportData.findings) {
      alert("Please fill in all required fields.");
      return;
    }

    if (window.confirm("Are you sure you want to submit this diagnostic report?")) {
      setIsSubmitting(true);
      try {
        const numericTaskId = parseInt(taskId, 10);
        await apiService.diagnostics.submitReport({
          taskId: numericTaskId,
          patientId: task.patientId,
          visitId: task.visitId,
          ...reportData
        });
        setIsSubmitted(true);
        alert("Report submitted successfully.");
      } catch (error) {
        console.error("Submission failed", error);
        alert("Failed to submit report.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await apiService.workflow.createTask({
        patientId: task.patientId,
        visitId: task.visitId,
        sourceTaskId: taskId,
        ...newTaskData
      });
      alert("New task created successfully.");
      setShowModal(false);
      setNewTaskData({ type: 'Follow-up Scan', priority: 'Routine', description: '' });
    } catch (error) {
      console.error("Failed to create task", error);
    }
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

  if (!task) return <Layout><div style={{ padding: '2rem' }}>Task not found</div></Layout>;

  return (
    <Layout>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h1 style={{ margin: 0 }}>Review: {task.taskNo}</h1>
              <span className="badge badge-info">{task.modality}</span>
              <span className={`badge ${isSubmitted ? 'badge-success' : 'badge-warning'}`}>
                {isSubmitted ? 'Report Submitted' : 'Pending Review'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              {task.patientName} ({task.patientMedicalRecordNumber}) • {task.visitReason}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
              <Plus size={18} /> Add New Task
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back to List
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setActiveTab('overview')}
                style={{
                  padding: '1rem 1.5rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'overview' ? '2px solid var(--primary-green)' : '2px solid transparent',
                  color: activeTab === 'overview' ? 'var(--primary-green)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Activity size={18} /> Task Overview & Images
              </button>
              <button
                onClick={() => setActiveTab('patient')}
                style={{
                  padding: '1rem 1.5rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'patient' ? '2px solid var(--primary-green)' : '2px solid transparent',
                  color: activeTab === 'patient' ? 'var(--primary-green)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <User size={18} /> Patient Details & History
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="fade-in">
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ImageIcon size={20} /> Image Series
                  </h3>
                  
                  {task.images && task.images.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                      {task.images.map((img) => (
                        <div 
                          key={img} 
                          style={{ 
                            border: '1px solid var(--border)', 
                            borderRadius: 'var(--radius)', 
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            background: '#333', // Dark background so even if image is missing you see a box
                            position: 'relative'
                          }}
                          onClick={() => window.open(img, '_blank')}
                          title="Click to open in new tab"
                        >
                          {/* Force a specific height so the container is never 0px */}
                          <div style={{ height: '150px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ImageThumbnail src={img} alt={img.name} />
                          </div>
                          <div style={{ padding: '0.5rem', background: 'var(--surface)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{img.name}</span>
                            <ExternalLink size={12} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface-alt)', borderRadius: 'var(--radius)', color: 'var(--text-secondary)' }}>
                      No images uploaded for this task yet.
                    </div>
                  )}
                </div>

                <div className="card">
                   <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Task Instructions</h3>
                   <div style={{ padding: '1rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius)' }}>
                     <p><strong>Description:</strong> {task.description}</p>
                     <p style={{ marginTop: '0.5rem' }}><strong>Priority:</strong> {task.priority || 'Routine'}</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'patient' && (
              <div className="fade-in">
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Patient Demographics</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                    <div>
                      <p style={{ color: 'var(--text-secondary)' }}>Full Name</p>
                      <p style={{ fontWeight: 500 }}>{task.patientName}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)' }}>MRN</p>
                      <p style={{ fontWeight: 500 }}>{task.patientMedicalRecordNumber}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)' }}>Date of Birth</p>
                      <p style={{ fontWeight: 500 }}>{task.patientDateOfBirth} ({task.patientGender})</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)' }}>Contact</p>
                      <p style={{ fontWeight: 500 }}>{task.patientPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Visit History</h3>
                  {task.visitHistory && task.visitHistory.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Type</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Doctor</th>
                          <th style={{ padding: '0.75rem', textAlign: 'left' }}>Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {task.visitHistory.map((visit, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '0.75rem' }}>{visit.date}</td>
                            <td style={{ padding: '0.75rem' }}>{visit.type}</td>
                            <td style={{ padding: '0.75rem' }}>{visit.doctor}</td>
                            <td style={{ padding: '0.75rem' }}>{visit.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No visit history available.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'sticky', top: '2rem' }}>
            <div className="card" style={{ borderTop: '4px solid var(--primary-green)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <FileText size={20} color="var(--primary-green)" />
                <h3 style={{ fontSize: '1.25rem' }}>Diagnostic Report</h3>
              </div>

              <form onSubmit={handleSubmitReport}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    Disease Classification
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="e.g., Normal, Acute Fracture, Pneumonia..."
                    value={reportData.diseaseClassification}
                    onChange={(e) => setReportData({...reportData, diseaseClassification: e.target.value})}
                    disabled={isSubmitted}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    Clinical Findings
                  </label>
                  <textarea 
                    className="input" 
                    rows={8}
                    placeholder="Enter detailed radiological findings here..."
                    value={reportData.findings}
                    onChange={(e) => setReportData({...reportData, findings: e.target.value})}
                    disabled={isSubmitted}
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '1rem' }}
                  disabled={isSubmitting || isSubmitted}
                >
                  {isSubmitting ? 'Submitting...' : isSubmitted ? 'Report Submitted' : 'Complete Review'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {showModal && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.5)', zIndex: 1000, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
          }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%', animation: 'fadeIn 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2>Add Follow-up Task</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius)' }}>
                <p style={{ fontSize: '0.9rem' }}><strong>Patient:</strong> {task.patientName}</p>
                <p style={{ fontSize: '0.9rem' }}><strong>Visit ID:</strong> {task.visitId}</p>
              </div>

              <form onSubmit={handleCreateTask}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Task Type</label>
                    <select 
                      className="input" 
                      value={newTaskData.type}
                      onChange={(e) => setNewTaskData({...newTaskData, type: e.target.value})}
                    >
                      <option value="Follow-up Scan">Follow-up Scan</option>
                      <option value="Lab Test">Lab Test</option>
                      <option value="Specialist Consult">Specialist Consult</option>
                      <option value="Physical Therapy">Physical Therapy</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Priority</label>
                    <select 
                      className="input" 
                      value={newTaskData.priority}
                      onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value})}
                    >
                      <option value="Routine">Routine</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Stat">Stat (Immediate)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description / Instructions</label>
                    <textarea 
                      className="input" 
                      rows={3}
                      placeholder="Specific instructions for this task..."
                      value={newTaskData.description}
                      onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Task</button>
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

export default TaskReview;