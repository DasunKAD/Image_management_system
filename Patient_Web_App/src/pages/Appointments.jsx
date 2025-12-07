import { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import { Card, Badge, LoadingSpinner } from '../components/ui';
import { Calendar } from '../components/icons/Icons';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getAppointments().then((res) => {
      if (res.success) setAppointments(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Appointments</h1>
        <p className="text-neutral-500">Manage your upcoming appointments</p>
      </div>

      {appointments.length > 0 ? (
        <div className="flex flex-col gap-4">
          {appointments.map((apt, index) => (
            <Card
              key={apt.id}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                      {apt.type}
                    </h3>
                    <Badge variant={apt.status === 'upcoming' ? 'success' : 'info'}>
                      {apt.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Date & Time</p>
                    <p className="text-sm font-medium text-neutral-800">
                      {apt.date} at {apt.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Doctor</p>
                    <p className="text-sm font-medium text-neutral-800">{apt.doctor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Department</p>
                    <p className="text-sm font-medium text-neutral-800">{apt.department}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center">
          <div className="text-neutral-300 mb-4">
            <Calendar size={48} />
          </div>
          <p className="text-neutral-500">No appointments scheduled</p>
        </Card>
      )}
    </div>
  );
};

export default Appointments;