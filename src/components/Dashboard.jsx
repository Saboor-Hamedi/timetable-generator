import React, { useState, useEffect } from 'react';
import { getReportsMeta, getReportContent, deleteReport } from '../api/db';
import { Trash2, Eye, CalendarDays } from 'lucide-react';
import ReportModal from './ReportModal';

const Dashboard = ({ exportOrientation }) => {
  const [reports, setReports] = useState([]);
  const [activeModalData, setActiveModalData] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getReportsMeta();
      setReports(data);
    } catch (e) {
      console.error("Failed to load reports", e);
    }
  };

  const handleView = async (id) => {
    const content = await getReportContent(id);
    if (content) {
      setActiveModalData({ content, index: id });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      await deleteReport(id);
      loadReports();
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
      {reports.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-8 text-center max-w-lg mx-auto mt-10">
          <CalendarDays className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Reports Saved</h3>
          <p className="text-white/50 text-sm">Go to the Reports tab, generate a timetable, and save it to your dashboard to view it here anytime.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-[#1f2b3d] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col shadow-lg hover:border-white/20 transition-all">
              <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5 line-clamp-2 leading-snug">{report.title}</h3>
              <p className="text-[11px] sm:text-xs text-white/40 mb-5 flex-1">
                Saved on {new Date(report.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleView(report.id)}
                  className="flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded-lg bg-[#f34868] hover:bg-[#ff5d7b] text-white text-[13px] font-medium transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="flex justify-center items-center p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-red-400 border border-white/10 transition-colors"
                  title="Delete Report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReportModal 
        isOpen={!!activeModalData}
        onClose={() => setActiveModalData(null)}
        content={activeModalData?.content}
        index={activeModalData?.index}
        exportOrientation={exportOrientation}
      />
    </div>
  );
};

export default Dashboard;
