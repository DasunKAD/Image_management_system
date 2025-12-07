import { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import { Card, Button, LoadingSpinner } from '../components/ui';
import { FileText, Eye, Download } from '../components/icons/Icons';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getReports().then((res) => {
      if (res.success) setReports(res.data);
      setLoading(false);
    });
  }, []);

  const handleDownload = async (reportId) => {
    const result = await apiService.downloadReport(reportId);
    if (result.success) {
      // Handle file download
      const url = window.URL.createObjectURL(result.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      a.click();
    }
  };

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
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Medical Reports</h1>
        <p className="text-neutral-500">Download and view your medical reports</p>
      </div>

      <div className="flex flex-col gap-3">
        {reports.map((report, index) => (
          <Card
            key={report.id}
            className="animate-slide-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-800 mb-1">
                    {report.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-neutral-500">
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Eye size={16} /> View
                </Button>
                <Button size="sm" onClick={() => handleDownload(report.id)}>
                  <Download size={16} /> Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;