import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TimetableContent from './components/TimetableContent';
import Report from './components/Report';
import Settings from './components/Settings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(() => {
    return localStorage.getItem('activeMenu') || 'timetable';
  });

  React.useEffect(() => {
    localStorage.setItem('activeMenu', activeMenu);
  }, [activeMenu]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  React.useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [exportOrientation, setExportOrientation] = useState(() => {
    return localStorage.getItem('exportOrientation') || 'landscape';
  });

  React.useEffect(() => {
    localStorage.setItem('exportOrientation', exportOrientation);
  }, [exportOrientation]);

  const [reportMessages, setReportMessages] = useState([]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'timetable':
        return <TimetableContent />;
      case 'dashboard':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Welcome!</h3>
                <p className="text-white/70">Manage your timetable efficiently</p>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return <Report exportOrientation={exportOrientation} messages={reportMessages} setMessages={setReportMessages} />;
      case 'settings':
        return <Settings theme={theme} toggleTheme={toggleTheme} exportOrientation={exportOrientation} setExportOrientation={setExportOrientation} />;
      default:
        return <TimetableContent />;
    }
  };

  return (
    <div
      className="h-screen w-full bg-[#2a3950] flex overflow-hidden"
      style={{ '--layout-header-height': '56px' }}
    >
      {/* Desktop Sidebar Wrapper */}
      <div 
        className={`hidden md:block transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden shrink-0 h-full`}
      >
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="md:hidden">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;