import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../api/apiService';
import { Card, Badge, LoadingSpinner } from '../components/ui';
import { Droplet, Shield, Calendar, Clock, Heart, Activity } from '../components/icons/Icons';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getAppointments().then((res) => {
      if (res.success) setAppointments(res.data);
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: 'Blood Type', value: user?.bloodType || 'N/A', icon: Droplet, color: 'text-red-600 bg-red-100' },
    { label: 'Insurance', value: user?.insurance ? 'Active' : 'N/A', icon: Shield, color: 'text-primary-600 bg-primary-100' },
    { label: 'Appointments', value: appointments.length, icon: Calendar, color: 'text-blue-600 bg-blue-100' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-7 mb-6 text-white">
        <h1 className="font-display text-2xl font-bold mb-2">
          Hello, {user?.firstName}!
        </h1>
        <p className="text-primary-100">Welcome to your health dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <Icon size={20} />
              </div>
              <p className="text-neutral-500 text-sm mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-neutral-800">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Appointments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-neutral-800">Upcoming Appointments</h2>
          <Badge variant="info">{appointments.length} scheduled</Badge>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : appointments.length > 0 ? (
          <div className="flex flex-col gap-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-neutral-800">{apt.type}</p>
                    <p className="text-sm text-neutral-600">{apt.doctor}</p>
                  </div>
                  <Badge variant="success">{apt.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {apt.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {apt.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500 py-10">No upcoming appointments</p>
        )}
      </Card>

      {/* Health Tips */}
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-bold text-neutral-800 mb-4">Quick Health Tips</h2>
        <div className="flex flex-col gap-3">
          {[
            { icon: Heart, text: 'Keep your heart healthy with 30 minutes of daily exercise' },
            { icon: Activity, text: 'Monitor your blood pressure regularly' },
            { icon: Droplet, text: 'Stay hydrated - drink at least 8 glasses of water daily' },
          ].map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                <div className="text-primary-600"><Icon size={20} /></div>
                <p className="text-sm text-neutral-600">{tip.text}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;