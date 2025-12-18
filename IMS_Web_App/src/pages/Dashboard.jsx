import { useAuth } from '../context/AuthContext';

import AdminDashboard from './dashboards/AdminDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import RadiologistDashboard from './dashboards/RadiologistDashboard';
import StaffDashboard from './dashboards/StaffDashboard';
import FinanceDashboard from './dashboards/FinanceDashboard';
import PatientDashboard from './dashboards/PatientDashboard';

const Dashboard = () => {
  const { user } = useAuth(); // assumes user.roles = ['ROLE_ADMIN', ...]

  if (!user || !user.roles) return null;

  const roles = user.roles;

  if (roles.includes('ROLE_ADMIN')) return <AdminDashboard />;
  if (roles.includes('ROLE_DOCTOR')) return <DoctorDashboard />;
  if (roles.includes('ROLE_RADIOLOGIST')) return <RadiologistDashboard />;
  if (roles.includes('ROLE_FINANCE')) return <FinanceDashboard />;
  if (roles.includes('ROLE_STAFF')) return <StaffDashboard />;
  if (roles.includes('ROLE_PATIENT')) return <PatientDashboard />;

  return <h2>No dashboard assigned</h2>;
};

export default Dashboard;
