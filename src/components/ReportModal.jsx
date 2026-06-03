import React, { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const ReportModal = ({ isOpen, onClose, content, index, exportOrientation }) => {
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      const contentElement = document.getElementById(`modal-report-content-${index}`);
      if (!contentElement) {
        setExporting(false);
        return;
      }
      
      const htmlOutput = contentElement.innerHTML;
  
      const fullHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Report</title>
        <style>
          @page Section1 {
            size: ${exportOrientation === 'portrait' ? '595.3pt 841.9pt' : '841.9pt 595.3pt'};
            mso-page-orientation: ${exportOrientation === 'portrait' ? 'portrait' : 'landscape'};
            margin: ${exportOrientation === 'portrait' ? '20pt 20pt 20pt 20pt' : '40pt 40pt 40pt 40pt'};
          }
          div.Section1 { page: Section1; }
          body { font-family: Arial, sans-serif; font-size: ${exportOrientation === 'portrait' ? '8pt' : '10pt'}; font-weight: normal; color: black; }
          h1, h2, h3, h4, h5, h6 { font-size: ${exportOrientation === 'portrait' ? '10pt' : '12pt'}; font-weight: bold; text-align: center; margin-bottom: 8px; color: black; }
          strong, b { font-weight: bold; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
          td, th { border: 1px solid black; padding: ${exportOrientation === 'portrait' ? '2px' : '4px'}; text-align: left; font-size: ${exportOrientation === 'portrait' ? '8pt' : '10pt'}; font-weight: normal; word-wrap: break-word; vertical-align: top; color: black; }
          ul, ol { margin-top: 2px; margin-bottom: 2px; padding-left: 15px; }
          p { margin-bottom: 4px; font-size: ${exportOrientation === 'portrait' ? '8pt' : '10pt'}; color: black; }
        </style>
        </head><body><div class="Section1">${htmlOutput}</div></body></html>
      `;
  
      const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `RPS_OBE_Report_${index + 1}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExporting(false);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#2a3950] w-full max-w-full h-full rounded-lg shadow-2xl flex flex-col border border-white/10 overflow-hidden">
        
        {/* Title Bar - Small, compact */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-[#1f2b3d]">
          <h3 className="text-white/90 text-sm font-medium">Preview & Edit Report</h3>
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content - Editable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
          <div className="absolute top-4 right-4 text-xs text-white/50 bg-[#1f2b3d] px-2 py-1 rounded border border-white/10 pointer-events-none opacity-50">
            Click any text to edit
          </div>
          
          <div className="max-w-7xl mx-auto w-full overflow-x-auto pb-10">
            <div 
              id={`modal-report-content-${index}`}
              contentEditable={true}
              suppressContentEditableWarning={true}
              className="text-white/90 leading-relaxed text-base outline-none focus:ring-1 focus:ring-white/20 rounded p-1"
            >
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  table: ({node, ...props}) => <table className="w-full border-collapse border border-white/20 mb-6 rounded-lg overflow-hidden mx-1.5 sm:mx-0" style={{ width: 'calc(100% - 12px)' }} {...props} />,
                  th: ({node, ...props}) => <th className="border border-white/20 bg-white/10 p-2 text-[13px] text-left font-semibold" {...props} />,
                  td: ({node, ...props}) => <td className="border border-white/20 p-2 text-[13px]" {...props} />,
                  h1: ({node, ...props}) => <h1 className="text-xl sm:text-2xl font-bold mb-6 mt-4 text-white text-center leading-snug" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg sm:text-xl font-bold mb-3 mt-5" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-base sm:text-lg font-bold mb-2 mt-4" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-[#1f2b3d] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-transparent hover:bg-white/5 text-white/80 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#f34868] hover:bg-[#ff5d7b] text-white text-xs font-medium transition-colors disabled:opacity-50"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export DOCX
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ReportModal;
