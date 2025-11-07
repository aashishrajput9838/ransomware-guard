import React, { useState, useRef } from 'react'
import { Upload, Search, Link2, TrendingUp, Lock, Activity, Zap, AlertTriangle } from 'lucide-react';
import Navigation from './components/Navigation.jsx';
import Footer from './components/footer.jsx';


const App = () => {
  const [activeTab, setActiveTab] = useState('file');
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
    }
  };

  const simulateAnalysis = async () => {
    if (!file) return;

    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    // Simulate analysis stages
    const stages = [
      { name: 'Static Analysis', duration: 1000, endProgress: 33 },
      { name: 'Dynamic Analysis', duration: 3000, endProgress: 66 },
      { name: 'Family Classification', duration: 1000, endProgress: 100 }
    ];

    let currentProgress = 0;

    for (const stage of stages) {
      const startProgress = currentProgress;
      const increment = (stage.endProgress - startProgress) / (stage.duration / 100);
      
      for (let i = 0; i < stage.duration; i += 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
        currentProgress = Math.min(startProgress + (i / stage.duration) * (stage.endProgress - startProgress), stage.endProgress);
        setProgress(Math.round(currentProgress));
      }
    }

    // Generate mock result
    const mockResult = {
      filename: file.name,
      filesize: Math.round(file.size / 1024),
      verdict: ['malicious', 'suspicious', 'clean'][Math.floor(Math.random() * 3)],
      confidence: (70 + Math.random() * 30).toFixed(1),
      isRansomware: Math.random() > 0.5,
      family: ['WannaCry', 'Ryuk', 'Cerber', 'Locky', 'GandCrab'][Math.floor(Math.random() * 5)],
      familyConfidence: (65 + Math.random() * 35).toFixed(1),
      staticScore: Math.floor(40 + Math.random() * 60),
      dynamicScore: Math.floor(50 + Math.random() * 50),
      filesModified: Math.floor(Math.random() * 100),
      filesEncrypted: Math.floor(Math.random() * 50),
      cryptoAPICalls: Math.floor(Math.random() * 200),
      networkConnections: Math.floor(Math.random() * 10),
      ransonNotes: Math.floor(Math.random() * 3),
      hashes: {
        sha256: 'a'.repeat(64),
        md5: 'b'.repeat(32),
        sha1: 'c'.repeat(40)
      },
      ips: ['192.168.1.100', '10.0.0.50', '172.16.0.1'].slice(0, Math.floor(Math.random() * 3) + 1),
      domains: ['malicious.com', 'c2server.net', 'ransomware-pay.ru'].slice(0, Math.floor(Math.random() * 3) + 1)
    };

    setResult(mockResult);
    setAnalyzing(false);
    setProgress(0);
  };

  const getVerdictColor = (verdict) => {
    if (verdict === 'malicious') return 'text-red-500';
    if (verdict === 'suspicious') return 'text-yellow-500';
    return 'text-green-500';
  };

  const getVerdictBg = (verdict) => {
    if (verdict === 'malicious') return 'bg-red-900/20 border-red-500/50';
    if (verdict === 'suspicious') return 'bg-yellow-900/20 border-yellow-500/50';
    return 'bg-green-900/20 border-green-500/50';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      
      <Navigation />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mt-20 mb-12">
          <h2 className="text-6xl font-medium uppercase text-blue-400 mb-10">Ransomware Guard</h2>
          <p className="text-white text-sm font-light max-w-xl mb-20 mx-auto">Analyze suspicious files, domains, and URLs to detect ransomware and other threats. Automatically share analysis with the security community.</p>
        </div>

        {/* Tabs */}
        <div className="flex w-300 justify-center items-center gap-20 mb-8 border-b border-slate-400/50">
          <button
            onClick={() => setActiveTab('file')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'file'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            FILE
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'url'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            URL
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'search'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            SEARCH
          </button>
        </div>

        {/* File Upload Section */}
        {activeTab === 'file' && !result && (
          <div className="max-w-3xl mx-auto">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-600 rounded-xl p-16 text-center hover:border-slate-500 transition cursor-pointer bg-slate-800/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-slate-700/50 rounded-full">
                  <Upload className="w-12 h-12 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Choose file or drag it here</h3>
                  <p className="text-slate-400 text-sm mb-4">Max file size: 100 MB</p>
                  {file && (
                    <p className="text-blue-400 text-sm font-medium">
                      Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".exe,.dll,.zip,.bin,.doc,.pdf"
              />
            </div>

            {file && !analyzing && (
              <div className="mt-6 flex gap-4">
                <button
                  onClick={simulateAnalysis}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Start Analysis
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                  }}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
                >
                  Clear
                </button>
              </div>
            )}

            {analyzing && (
              <div className="mt-8 bg-slate-800 rounded-lg p-8 border border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="animate-spin">
                    <Activity className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Analyzing file...</h3>
                    <p className="text-slate-400 text-sm">{file.name}</p>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-blue-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-slate-400 text-sm mt-4 text-center">{progress}% complete</p>
              </div>
            )}

            <div className="mt-8 ml-20 w-150 text-center text-white text-xs">
              <p>By submitting data above, you are agreeing to our <a href='#terms and conditions' className='text-blue-400'>Terms of Service</a> and <a href='#Privacy Notice' className='text-blue-400' >Privacy Notice</a>, and to the <span className='font-bold'>sharing of your Sample submission with the security community</span>. Please do not submit any personal information;</p>
              <p>We are not responsible for the contents of your submission.</p>
            </div>
            <div className="mt-20 ml-20 w-150 py-2 text-center text-white text-xs bg-cyan-900">
              <p>Want to automate submissions? <a href="#" className='text-blue-400'>Check our API</a>, or access your <a href="#" className='text-blue-400'>API key</a>.</p>
            </div>
          </div>
        )}


        {/* Results Section */}
        {result && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Card */}
            <div className={`border rounded-xl p-8 ${getVerdictBg(result.verdict)}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{result.filename}</h3>
                  <p className="text-slate-400 text-sm">{result.filesize} KB</p>
                </div>
                <div className="text-right">
                  <p className={`text-4xl font-bold ${getVerdictColor(result.verdict)} mb-2`}>
                    {result.verdict.toUpperCase()}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Confidence: {result.confidence}%
                  </p>
                </div>
              </div>
            </div>

            {/* Ransomware Detection */}
            {result.isRansomware && (
              <div className="border border-red-500/50 bg-red-900/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-red-400 font-semibold mb-2">Ransomware Detected</h4>
                    <p className="text-red-400/90 text-sm mb-3">
                      This file shows characteristics of ransomware and poses a significant threat.
                    </p>
                    <div className="bg-slate-800/50 rounded p-4 mb-3">
                      <p className="text-white font-semibold mb-2">Family: {result.family}</p>
                      <p className="text-slate-400 text-sm">
                        Classification confidence: {result.familyConfidence}%
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">
                      View Recommendation
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Summary */}
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-slate-700 bg-slate-800/50 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Static Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Score</span>
                    <span className="text-white font-semibold">{result.staticScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${result.staticScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-700 bg-slate-800/50 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Dynamic Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Score</span>
                    <span className="text-white font-semibold">{result.dynamicScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${result.dynamicScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Behavioral Indicators */}
            <div className="border border-slate-700 bg-slate-800/50 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-400" />
                Behavioral Indicators
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Files Modified</p>
                  <p className="text-2xl font-bold text-white">{result.filesModified}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Files Encrypted</p>
                  <p className="text-2xl font-bold text-red-400">{result.filesEncrypted}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Crypto API Calls</p>
                  <p className="text-2xl font-bold text-yellow-400">{result.cryptoAPICalls}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Network Connections</p>
                  <p className="text-2xl font-bold text-blue-400">{result.networkConnections}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Ransom Notes</p>
                  <p className="text-2xl font-bold text-purple-400">{result.ransonNotes}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  <p className="text-2xl font-bold text-green-400">✓</p>
                </div>
              </div>
            </div>

            {/* IOCs */}
            <div className="border border-slate-700 bg-slate-800/50 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-4">Indicators of Compromise (IOCs)</h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-2">File Hashes</p>
                  <div className="space-y-2">
                    <div className="bg-slate-700/50 rounded p-3 text-xs text-slate-300 font-mono break-all">
                      SHA-256: {result.hashes.sha256}
                    </div>
                    <div className="bg-slate-700/50 rounded p-3 text-xs text-slate-300 font-mono break-all">
                      MD5: {result.hashes.md5}
                    </div>
                  </div>
                </div>

                {result.ips.length > 0 && (
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-2">Network IPs</p>
                    <div className="space-y-2">
                      {result.ips.map((ip, idx) => (
                        <div key={idx} className="bg-slate-700/50 rounded p-3 text-sm text-slate-300 font-mono">
                          {ip}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.domains.length > 0 && (
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-2">Domains</p>
                    <div className="space-y-2">
                      {result.domains.map((domain, idx) => (
                        <div key={idx} className="bg-slate-700/50 rounded p-3 text-sm text-slate-300 font-mono">
                          {domain}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setResult(null);
                  setFile(null);
                }}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Analyze Another File
              </button>
              <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">
                Download Report
              </button>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'url' && (
          <div className="max-w-3xl mx-auto">
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center bg-slate-800/50">
              <Link2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">URL Analysis</h3>
              <input
                type="url"
                placeholder="Enter URL or domain to analyze"
                className="w-full mt-6 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="max-w-3xl mx-auto">
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center bg-slate-800/50">
              <Search className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Search Database</h3>
              <input
                type="text"
                placeholder="Search by hash, domain, or IP"
                className="w-full mt-6 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
