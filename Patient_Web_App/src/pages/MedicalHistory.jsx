import { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import { Card, Badge, LoadingSpinner } from '../components/ui';
import { ChevronRight } from '../components/icons/Icons';

const MedicalHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    apiService.getMedicalHistory().then((res) => {
      if (res.success) setHistory(res.data);
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
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Medical History</h1>
        <p className="text-neutral-500">Your complete medical visit history</p>
      </div>

      <div className="flex flex-col gap-4">
        {history.map((record, index) => (
          <Card
            key={record.id}
            className="cursor-pointer transition-all animate-slide-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setExpanded(expanded === record.id ? null : record.id)}
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Badge variant="success">{record.type}</Badge>
                    <span className="text-sm text-neutral-400">{record.date}</span>
                  </div>
                  <h3 className="text-base font-semibold text-neutral-800 mb-1">
                    {record.doctor}
                  </h3>
                  <p className="text-sm text-neutral-500">{record.department}</p>
                </div>
                <div className={`transform transition-transform ${expanded === record.id ? 'rotate-90' : ''} text-neutral-400`}>
                  <ChevronRight size={20} />
                </div>
              </div>

              {expanded === record.id && (
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-neutral-600 mb-1">Diagnosis</p>
                    <p className="text-sm text-neutral-800">{record.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-600 mb-1">Notes</p>
                    <p className="text-sm text-neutral-800">{record.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MedicalHistory;