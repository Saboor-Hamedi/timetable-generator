import React, { useState } from 'react';

const Settings = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('deepseek_api_key') || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('deepseek_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
      
      <div className="bg-[#1f2b3d] border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">API Configuration</h3>
        
        <div className="mb-4">
          <label className="block text-white/70 text-sm mb-2">DeepSeek API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#f34868] transition-colors"
          />
          <p className="text-xs text-white/40 mt-2">
            Your API key is stored securely in your browser's local storage.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#f34868] hover:bg-[#ff5d7b] text-white rounded-lg transition-colors font-medium text-sm"
        >
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
