import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Download, ArrowUp, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import deepSeek from '../api/gpt/DeekSeek';
import ReportModal from './ReportModal';

const AssistantMessage = ({ content, index, isStreaming, onOpenModal }) => {


  return (
    <div className="flex flex-col gap-4 w-full mb-8">
      <div id={`report-content-${index}`} className="text-white/90 leading-relaxed max-w-full overflow-x-auto text-base">
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
      
      <div className="flex items-center gap-3 border-t border-white/10 pt-3 mt-2">
        {isStreaming ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-white/50 text-xs font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f34868]" />
            Generating response...
          </div>
        ) : (
          <button
            onClick={() => onOpenModal({ content, index })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#f34868] hover:bg-[#ff5d7b] text-white transition-colors text-xs font-medium cursor-pointer"
          >
            Edit & Export
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
    <div className="flex justify-end mb-8 w-full group">
      <div className="flex flex-col items-end max-w-[85%] md:max-w-[75%]">
        <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tr-sm text-white/90 text-sm">
          {content}
        </div>
        <button
          onClick={handleCopyPrompt}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 mt-1.5 px-2 py-1 hover:bg-white/5 rounded text-white/40 hover:text-white/80 text-xs"
          title="Copy prompt"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

const Report = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeModalData, setActiveModalData] = useState(null);
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
      const assistantMsgIndex = updatedMessages.length;
      setMessages([...updatedMessages, { role: 'assistant', content: '' }]);
      
      await deepSeek.generateReport(updatedMessages, {
        onChunk: (delta, fullContent) => {
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[assistantMsgIndex] = { role: 'assistant', content: fullContent };
            return newMessages;
          });
        }
      });
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
        <div className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/40 mt-10 sm:mt-20 px-4 text-center">
              <h2 className="text-lg sm:text-2xl font-semibold mb-2">Universitas Pamulang</h2>
              <p className="text-xs sm:text-sm">Program Pascasarjana • Teknik Informatika S-2</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full pb-4">
              {messages.map((msg, idx) => (
                <div key={idx} className="w-full">
                  {msg.role === 'user' ? (
                    <UserMessage content={msg.content} />
                  ) : (
                    <AssistantMessage 
                      content={msg.content} 
                      index={idx} 
                      isStreaming={loading && idx === messages.length - 1} 
                      onOpenModal={setActiveModalData}
                    />
                  )}
                </div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Fixed Input Area at Bottom (Flex child, no longer absolute to prevent overlap) */}
      <div className="shrink-0 w-full p-2 sm:p-3 bg-[#2a3950] border-t border-white/5">
        <div className="max-w-5xl mx-auto w-full">
          <div className="bg-[#1f2b3d] rounded-2xl border border-white/15 p-1 pl-3 sm:pl-4 pr-12 flex items-center shadow-lg focus-within:border-white/30 transition-colors relative min-h-[44px] sm:min-h-[48px]">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter topic..."
              rows={1}
              className="w-full bg-transparent text-white resize-none outline-none py-2 sm:py-2.5 text-sm sm:text-base"
              style={{ overflow: 'hidden' }}
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="absolute right-1.5 sm:right-2 bottom-1 sm:bottom-1.5 p-1.5 rounded-lg bg-[#f34868] text-white hover:bg-[#ff5d7b] disabled:opacity-50 disabled:bg-gray-600 disabled:text-white transition-colors flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
        </div>
      </div>

      <ReportModal 
        isOpen={!!activeModalData}
        onClose={() => setActiveModalData(null)}
        content={activeModalData?.content}
        index={activeModalData?.index}
      />
    </div>
  );
};

export default Report;
