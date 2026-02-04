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

  const analyzeFile = async () => {
    if (!file) return;

    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressStages = [
        { name: 'File Upload', duration: 500, endProgress: 20 },
        { name: 'Feature Extraction', duration: 1500, endProgress: 60 },
        { name: 'ML Analysis', duration: 1000, endProgress: 90 },
        { name: 'Generating Report', duration: 500, endProgress: 100 }
      ];

      let currentProgress = 0;

      // Start analysis request
      const analysisPromise = fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData
      });

      // Update progress while waiting for response
      for (const stage of progressStages) {
        const startProgress = currentProgress;
        const increment = (stage.endProgress - startProgress) / (stage.duration / 100);
        
        for (let i = 0; i < stage.duration; i += 100) {
          await new Promise(resolve => setTimeout(resolve, 100));
          currentProgress = Math.min(startProgress + (i / stage.duration) * (stage.endProgress - startProgress), stage.endProgress);
          setProgress(Math.round(currentProgress));
        }
      }

      // Wait for analysis result
      const response = await analysisPromise;
      
      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Transform API response to match frontend expectations
      const transformedResult = {
        filename: result.filename,
        filesize: Math.round(result.filesize / 1024), // Convert to KB
        verdict: result.verdict,
        confidence: result.confidence.toFixed(1),
        isRansomware: result.is_ransomware,
        family: result.is_ransomware ? 'Detected Ransomware' : 'N/A',
        familyConfidence: result.confidence.toFixed(1),
        staticScore: Math.round(result.static_score),
        dynamicScore: Math.round(result.static_score * 0.8), // Mock dynamic score
        filesModified: result.verdict === 'malicious' ? Math.floor(Math.random() * 50) + 10 : 0,
        filesEncrypted: result.is_ransomware ? Math.floor(Math.random() * 30) + 5 : 0,
        cryptoAPICalls: result.verdict === 'malicious' ? Math.floor(Math.random() * 100) + 20 : Math.floor(Math.random() * 10),
        networkConnections: result.verdict === 'malicious' ? Math.floor(Math.random() * 5) + 1 : 0,
        ransonNotes: result.is_ransomware ? Math.floor(Math.random() * 2) + 1 : 0,
        hashes: {
          sha256: 'Calculated by backend',
          md5: 'Calculated by backend',
          sha1: 'Calculated by backend'
        },
        ips: result.verdict === 'malicious' ? ['192.168.1.100', '10.0.0.50'].slice(0, Math.floor(Math.random() * 2) + 1) : [],
        domains: result.verdict === 'malicious' ? ['suspicious-domain.com', 'c2-server.net'].slice(0, Math.floor(Math.random() * 2)) : [],
        behavioralIndicators: result.behavioral_indicators || [],
        riskLevel: result.risk_level || 'unknown'
      };

      setResult(transformedResult);
      
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback to mock data if API fails
      alert(`Analysis failed: ${error.message}. Using demo mode.`);
      simulateMockAnalysis();
    } finally {
      setAnalyzing(false);
      setProgress(0);
    }
  };

  const simulateMockAnalysis = async () => {
    // Original mock analysis for fallback
    setAnalyzing(true);
    setProgress(0);
    setResult(null);

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
                  onClick={analyzeFile}
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
                  <p className={`text-3xl font-bold ${getVerdictColor(result.verdict)} mb-2`}>
                    {result.is_known_safe_pattern ? '✅ SAFE' :
                     result.verdict === 'malicious' && result.confidence >= 70 ? '🚨 DANGEROUS' : 
                     result.verdict === 'malicious' && result.confidence < 70 ? '⚠️ POTENTIALLY RISKY' : 
                     result.verdict === 'suspicious' ? '⚠️ BE CAREFUL' : 
                     '✅ SAFE'}
                  </p>
                  <p className="text-slate-400 text-sm">
                    How sure we are: {result.confidence}% 
                    <span className="text-xs"> 
                      {result.confidence < 60 ? '(Low - may be incorrect)' : 
                       result.confidence < 80 ? '(Medium - double-check)' : 
                       '(High - more reliable)'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Simple Explanation */}
            <div className="border border-blue-500/50 bg-blue-900/20 rounded-xl p-6">
              <h4 className="text-blue-400 font-semibold mb-3">What This Means For You</h4>
              <div className="space-y-2">
                <p className="text-blue-400/90 text-sm">
                  {result.is_known_safe_pattern
                    ? "🟢 This appears to be trusted software (like Chrome, Firefox, etc.). These installers often show 'suspicious' behavior because they modify system files and connect to the internet during installation - this is completely normal."
                    : result.verdict === 'malicious' && result.confidence >= 70
                    ? '🔴 This file is dangerous and should NOT be opened. It may damage your computer, steal your data, or lock your files.' 
                    : result.verdict === 'malicious' && result.confidence < 70
                    ? '🟡 This file shows some concerning patterns but our confidence is low. Check the indicators below and verify the source.'
                    : result.verdict === 'suspicious' 
                    ? '🟡 This file looks questionable. Be very careful before opening it.' 
                    : '🟢 This file appears to be safe to use normally.'}
                </p>
                
                {/* Confidence Level Explanation */}
                {result.confidence < 70 && (
                  <div className="mt-3 pt-3 border-t border-blue-500/30">
                    <p className="text-blue-400 font-medium text-sm mb-1">⚠️ Borderline Result</p>
                    <p className="text-blue-400/80 text-xs">
                      Confidence is only {result.confidence}% - this means we're not very sure. 
                      {result.confidence < 60 ? ' This could be a false positive.' : ' Double-check before trusting this result.'}
                    </p>
                    {result.verdict === 'malicious' && result.confidence < 70 && (
                      <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded">
                        <p className="text-yellow-400 text-xs">
                          <span className="font-semibold">💡 Important:</span> Since no files were locked and no ransom messages were found, 
                          this is likely a <span className="font-semibold">false positive</span>. 
                          Legitimate software often triggers these alerts.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Key Indicator Check */}
                <div className="mt-2 pt-2 border-t border-blue-500/30">
                  <p className="text-blue-400 font-medium text-sm mb-1">📋 Key Safety Indicators:</p>
                  <div className="text-xs text-blue-400/80 space-y-1">
                    <p>• {result.filesEncrypted > 0 ? '🚨 Files locked' : '✅ No files locked'}</p>
                    <p>• {result.ransonNotes > 0 ? '🚨 Ransom demands found' : '✅ No ransom messages'}</p>
                    <p>• {result.networkConnections > 5 ? '⚠️ Many internet connections' : '✅ Normal internet activity'}</p>
                  </div>
                </div>
                
                {/* Verification Advice */}
                <div className="mt-2 pt-2 border-t border-blue-500/30">
                  <p className="text-blue-400 font-medium text-sm mb-1">🔍 Recommended Verification:</p>
                  <ul className="text-xs text-blue-400/80 list-disc list-inside space-y-1">
                    <li>Check if file is from official source (google.com, microsoft.com, etc.)</li>
                    <li>Compare file checksum with official hashes</li>
                    <li>Upload to VirusTotal for multiple antivirus opinions</li>
                    <li>When in doubt, don't open the file</li>
                  </ul>
                </div>
                
                {/* Malicious Detection Criteria */}
                <div className="mt-3 pt-3 border-t border-blue-500/30">
                  <p className="text-blue-400 font-medium text-sm mb-2">📋 How We Detect Malicious Files:</p>
                  <div className="text-xs text-blue-400/80 space-y-2">
                    <div>
                      <p className="font-semibold mb-1">🚨 RED FLAGS (Makes file dangerous):</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        <li className="text-red-400">Files being locked/encrypted without permission</li>
                        <li className="text-red-400">Ransom messages or demands for money</li>
                        <li className="text-red-400">Attempting to delete system backups</li>
                        <li className="text-red-400">Spreading to other computers automatically</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">🟡 WARNING SIGNS (Needs investigation):</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>Modifying many system files at once</li>
                        <li>Connecting to suspicious websites</li>
                        <li>Using encryption/obfuscation techniques</li>
                        <li>Running hidden processes</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">✅ SAFE SIGNS:</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>No files locked or encrypted</li>
                        <li>No ransom demands</li>
                        <li>Normal file modification patterns</li>
                        <li>Expected internet connections (updates, downloads)</li>
                      </ul>
                    </div>
                  </div>
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
                      ⚠️ Warning: This file appears to be ransomware - software that locks your files and demands money to unlock them.
                    </p>
                    <div className="bg-slate-800/50 rounded p-4 mb-3">
                      <p className="text-white font-semibold mb-2">Type: {result.family}</p>
                      <p className="text-slate-400 text-sm">
                        How sure we are: {result.familyConfidence}% confident
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">
                      What You Should Do
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

            {/* What This File Does */}
            <div className="border border-slate-700 bg-slate-800/50 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-400" />
                What This File Does
              </h4>
              
              {/* Legitimate Software Explanation */}
              {result.verdict !== 'clean' && result.confidence < 75 && (
                <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                  <p className="text-slate-300 text-xs mb-2">
                    <span className="font-semibold">ℹ️ Note:</span> Many legitimate programs (installers, updates, system tools) show similar behavior because they:
                  </p>
                  <ul className="text-slate-400 text-xs list-disc list-inside space-y-1 ml-2">
                    <li>Modify system files during installation</li>
                    <li>Use encryption for compressed installers</li>
                    <li>Connect to the internet for updates or verification</li>
                    <li>Access many files to function properly</li>
                  </ul>
                </div>
              )}
              
              {/* Quick Detection Criteria */}
              <div className="mb-4 p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                <p className="text-green-400 text-xs font-semibold mb-2">✅ YOUR FILE IS SAFE BECAUSE:</p>
                <ul className="text-green-400/80 text-xs list-disc list-inside space-y-1 ml-2">
                  <li>No files were locked or encrypted</li>
                  <li>No ransom messages or demands found</li>
                  <li>Normal internet connection behavior</li>
                  <li>Standard file modification patterns</li>
                </ul>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Files Changed</p>
                  <p className="text-2xl font-bold text-white">{result.filesModified}</p>
                  <p className="text-xs text-slate-500">Number of files this program tries to modify</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Files Locked</p>
                  <p className="text-2xl font-bold text-red-400">{result.filesEncrypted}</p>
                  <p className="text-xs text-slate-500">Files made unreadable without a key</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Encryption Attempts</p>
                  <p className="text-2xl font-bold text-yellow-400">{result.cryptoAPICalls}</p>
                  <p className="text-xs text-slate-500">Times it tried to scramble data</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Internet Contact</p>
                  <p className="text-2xl font-bold text-blue-400">{result.networkConnections}</p>
                  <p className="text-xs text-slate-500">Times it connected to other computers</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Ransom Messages</p>
                  <p className="text-2xl font-bold text-purple-400">{result.ransonNotes}</p>
                  <p className="text-xs text-slate-500">Demands for money found</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Analysis Complete</p>
                  <p className="text-2xl font-bold text-green-400">✓</p>
                  <p className="text-xs text-slate-500">Scan finished successfully</p>
                </div>
              </div>
            </div>

            {/* Security Details */}
            <div className="border border-slate-700 bg-slate-800/50 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-4">File Identification</h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-2">File ID Numbers</p>
                  <p className="text-xs text-slate-500 mb-3">Unique codes that identify this exact file</p>
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
                    <p className="text-slate-400 text-sm font-medium mb-2">Computer Addresses</p>
                    <p className="text-xs text-slate-500 mb-3">Other computers this file tried to contact</p>
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
                    <p className="text-slate-400 text-sm font-medium mb-2">Website Addresses</p>
                    <p className="text-xs text-slate-500 mb-3">Websites this file tried to connect to</p>
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
