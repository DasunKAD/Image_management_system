import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ClipboardList, 
  Upload, 
  CheckCircle, 
  User, 
  Calendar, 
  Activity,
  FileText
} from 'lucide-react';

const TechnicianWorklist = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  
  // State for file uploads: { [taskId]: [File, File] }
  const [uploadFiles, setUploadFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await apiService.workflow.getPendingTasks();
      setTasks(response.data || response); // Handle both formats
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = (id) => {
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  const handleFileChange = (taskId, e) => {
    const files = Array.from(e.target.files);
    setUploadFiles(prev => ({
      ...prev,
      [taskId]: files
    }));
  };

  const handleCompleteTask = async (task) => {
    const files = uploadFiles[task.taskId];
    if (!files || files.length === 0) {
      alert("Please upload at least one image/document to complete the task.");
      return;
    }

    if (!window.confirm(`Complete task ${task.taskNo} and upload ${files.length} files?`)) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      // Append other necessary fields if required by BE
      formData.append('taskId', task.taskId);
      formData.append('status', 'COMPLETED');

      await apiService.workflow.completeTask(task.taskId, formData);
      
      // Clear state and reload
      setUploadFiles(prev => {
        const newState = { ...prev };
        delete newState[task.taskId];
        return newState;
      });
      await loadTasks();
      alert("Task completed successfully!");
    } catch (error) {
      console.error("Error completing task", error);
      alert("Failed to complete task.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      t.patientName?.toLowerCase().includes(q) ||
      t.visitNo?.toLowerCase().includes(q) ||
      t.taskNo?.toLowerCase().includes(q) ||
      t.taskId?.toString().includes(q)
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
          <h1>Worklist (Pending Tasks)</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage imaging requests and upload results
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '500px' }}>
          <Search 
            size={18} 
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
          />
          <input
            type="text"
            className="input"
            placeholder="Search by Patient Name, Visit #, Task ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem' }}
          />
        </div>

        {/* Tasks List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No pending tasks found.
            </div>
          ) : (
            <div>
              {/* Table Header (Hidden on small screens if needed, but keeping for structure) */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '0.5fr 2fr 1.5fr 1fr 1fr 0.5fr', 
                background: 'var(--surface-alt)', 
                padding: '1rem',
                borderBottom: '1px solid var(--border)',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                <span>ID</span>
                <span>Patient Info</span>
                <span>Visit/Doctor</span>
                <span>Modality</span>
                <span>Created</span>
                <span></span>
              </div>

              {filteredTasks.map(task => {
                const isExpanded = expandedTaskId === task.taskId;
                return (
                  <div key={task.taskId} style={{ borderBottom: '1px solid var(--border)' }}>
                    {/* List Item Row */}
                    <div 
                      onClick={() => handleToggleExpand(task.taskId)}
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '0.5fr 2fr 1.5fr 1fr 1fr 0.5fr', 
                        padding: '1rem',
                        cursor: 'pointer',
                        background: isExpanded ? 'var(--secondary-green)' : 'transparent',
                        alignItems: 'center',
                        transition: 'background 0.2s'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>#{task.taskId}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{task.patientName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task.patientMedicalRecordNumber}</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{task.visitNo}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task.visitDoctorName}</div>
                      </div>
                      <div>
                        <span className="badge badge-info">{task.modality || task.taskType}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem' }}>
                        {new Date(task.createdOn).toLocaleDateString()}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {/* Expanded Details Section */}
                    {isExpanded && (
                      <div style={{ padding: '1.5rem', background: 'var(--surface)', animation: 'fadeIn 0.2s' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                          
                          {/* Patient Details */}
                          <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                              <User size={16} /> Patient Details
                            </h4>
                            <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                              <p><strong>Name:</strong> {task.patientName}</p>
                              <p><strong>DOB:</strong> {task.patientDateOfBirth} ({task.patientGender})</p>
                              <p><strong>Phone:</strong> {task.patientPhone}</p>
                              <p><strong>MRN:</strong> {task.patientMedicalRecordNumber}</p>
                            </div>
                          </div>

                          {/* Visit Details */}
                          <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                              <Activity size={16} /> Visit Information
                            </h4>
                            <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                              <p><strong>Visit #:</strong> {task.visitNo}</p>
                              <p><strong>Reason:</strong> {task.visitReason}</p>
                              <p><strong>Check-in:</strong> {new Date(task.checkInTime).toLocaleString()}</p>
                              <p><strong>Active:</strong> {task.isVisitActive ? 'Yes' : 'No'}</p>
                            </div>
                          </div>

                          {/* Task Description */}
                          <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                              <ClipboardList size={16} /> Task Instructions
                            </h4>
                            <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                              <p><strong>Task #:</strong> {task.taskNo}</p>
                              <p><strong>Type:</strong> {task.taskType}</p>
                              <p><strong>Description:</strong></p>
                              <p style={{ background: 'white', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                                {task.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action / Upload Area */}
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Complete Task</h3>
                          
                          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, minWidth: '300px' }}>
                              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Upload Images/Files</label>
                              <div style={{ 
                                border: '2px dashed var(--border)', 
                                padding: '1.5rem', 
                                borderRadius: 'var(--radius)',
                                textAlign: 'center',
                                position: 'relative',
                                background: 'var(--surface-alt)'
                              }}>
                                <input 
                                  type="file" 
                                  multiple
                                  onChange={(e) => handleFileChange(task.taskId, e)}
                                  style={{ 
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                                    opacity: 0, cursor: 'pointer' 
                                  }}
                                />
                                <Upload size={32} color="var(--text-secondary)" style={{ marginBottom: '0.5rem' }} />
                                <p style={{ fontWeight: 500 }}>Click to select files</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Supports JPG, PNG, DICOM, PDF</p>
                              </div>

                              {/* Selected Files Preview */}
                              {uploadFiles[task.taskId] && uploadFiles[task.taskId].length > 0 && (
                                <div style={{ marginTop: '1rem' }}>
                                  <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Selected Files:</p>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {Array.from(uploadFiles[task.taskId]).map((file, idx) => (
                                      <div key={idx} className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <FileText size={12} />
                                        {file.name}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div style={{ alignSelf: 'flex-end' }}>
                              <button 
                                className="btn btn-primary" 
                                style={{ padding: '0.75rem 1.5rem', gap: '0.5rem' }}
                                onClick={() => handleCompleteTask(task)}
                                disabled={submitting}
                              >
                                {submitting ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <CheckCircle size={18} />}
                                Complete & Upload
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TechnicianWorklist;