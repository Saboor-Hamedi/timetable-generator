import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Download, ArrowUp, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import deepSeek from '../api/gpt/DeekSeek';

const AssistantMessage = ({ content, index }) => {
  const [docxUrl, setDocxUrl] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const contentElement = document.getElementById(`report-content-${index}`);
      if (!contentElement) return;
      
      const htmlOutput = contentElement.innerHTML;
  
      const fullHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Report</title>
        <style>
          @page Section1 {
            size: 841.9pt 595.3pt; /* A4 Landscape */
            mso-page-orientation: landscape;
            margin: 40pt 40pt 40pt 40pt;
          }
          div.Section1 { page: Section1; }
          body { font-family: Arial, sans-serif; font-size: 10pt; font-weight: normal; color: black; }
          h1, h2, h3, h4, h5, h6 { font-size: 12pt; font-weight: bold; text-align: center; margin-bottom: 8px; color: black; }
          strong, b { font-weight: bold; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
          td, th { border: 1px solid black; padding: 4px; text-align: left; font-size: 10pt; font-weight: normal; word-wrap: break-word; vertical-align: top; color: black; }
          ul, ol { margin-top: 2px; margin-bottom: 2px; padding-left: 15px; }
          p { margin-bottom: 4px; font-size: 10pt; color: black; }
        </style>
        </head><body><div class="Section1">${htmlOutput}</div></body></html>
      `;
  
      const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      setDocxUrl(url);
    }, 500);

    return () => clearTimeout(timer);
  }, [content, index]);

  return (
    <div className="flex flex-col gap-4 w-full mb-8">
      <div id={`report-content-${index}`} className="text-white/90 leading-relaxed max-w-full overflow-x-auto text-base">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            table: ({node, ...props}) => <table className="w-full border-collapse border border-white/20 mb-6 rounded-lg overflow-hidden" {...props} />,
            th: ({node, ...props}) => <th className="border border-white/20 bg-white/10 p-2 text-[13px] text-left font-semibold" {...props} />,
            td: ({node, ...props}) => <td className="border border-white/20 p-2 text-[13px]" {...props} />,
            h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 mt-6 text-[#f34868]" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
            p: ({node, ...props}) => <p className="mb-4" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      
      <div className="flex items-center gap-3 border-t border-white/10 pt-4 mt-2">
        {docxUrl ? (
          <a
            href={docxUrl}
            download={`RPS_OBE_Report_${index + 1}.doc`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 transition-colors text-sm font-medium cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export to DOCX
          </a>
        ) : (
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 opacity-50 border border-white/10 text-white/90 text-sm font-medium cursor-not-allowed"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Preparing DOCX...
          </button>
        )}
      </div>
    </div>
  );
};

const UserMessage = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-white/90 text-sm mb-6 flex justify-between items-start group">
      <div>
        <span className="font-semibold text-[#f34868]">You: </span> {content}
      </div>
      <button
        onClick={handleCopyPrompt}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-md text-white/50 hover:text-white shrink-0 ml-4"
        title="Copy prompt"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

const Report = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please type your report request first.');
      return;
    }

    const userMessage = { role: 'user', content: prompt };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setPrompt('');
    setLoading(true);
    setError('');

    try {
      const result = await deepSeek.generateReport(updatedMessages);
      setMessages([...updatedMessages, { role: 'assistant', content: result }]);
    } catch (err) {
      setError(err?.message || 'Failed to generate report.');
      setPrompt(userMessage.content);
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-[#2a3950]">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-3xl mx-auto w-full px-4 py-8 pb-32">
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/40 mt-20">
              <h2 className="text-2xl font-semibold mb-2">Generate Timetable / Report</h2>
              <p className="text-sm">Type your prompt below to start.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              {messages.map((msg, idx) => (
                <div key={idx} className="w-full">
                  {msg.role === 'user' ? (
                    <UserMessage content={msg.content} />
                  ) : (
                    <AssistantMessage content={msg.content} index={idx} />
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex items-center gap-3 text-white/50 text-sm mt-2 mb-8">
                  <Loader2 className="w-5 h-5 animate-spin text-[#f34868]" />
                  Generating response...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Fixed Input Area at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-[#2a3950] via-[#2a3950] to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto w-full relative pointer-events-auto">
          <div className="bg-[#1f2b3d] rounded-2xl border border-white/15 p-1 pl-4 pr-12 flex items-center shadow-lg focus-within:border-white/30 transition-colors relative min-h-[56px]">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter topic (e.g. Computer Vision)..."
              rows={1}
              className="w-full bg-transparent text-white resize-none outline-none py-4 text-base"
              style={{ overflow: 'hidden' }}
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="absolute right-2 bottom-2 p-2 rounded-lg bg-[#f34868] text-white hover:bg-[#ff5d7b] disabled:opacity-50 disabled:bg-gray-600 disabled:text-white transition-colors flex items-center justify-center h-10 w-10"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Report;
