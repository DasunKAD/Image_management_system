import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { Image, ListChecks, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RadiologistDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiService.workflow.getRadiologistWorklist().then(res => setTasks(res.data || res));
  }, []);

  return (
    <Layout>
      <div className="fade-in">
        <h1>Radiology Command</h1>
        <div className="card" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Priority Worklist</h3>
            <span className="badge badge-info">{tasks.length} Pending Reviews</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>Patient</th>
                <th style={{ padding: '1rem' }}>Modality</th>
                <th style={{ padding: '1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 5).map(task => (
                <tr key={task.taskId} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{task.patientName}</td>
                  <td style={{ padding: '1rem' }}><span className="badge badge-success">{task.modality}</span></td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn btn-secondary" onClick={() => navigate(`/review/${task.taskId}`)}>Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default RadiologistDashboard;