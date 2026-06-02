import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { analyzeVideo, API_BASE } from '../utils/api.js';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeInSection } from '../components/Motion';
import {
  HiOutlineVideoCamera,
  HiOutlineUpload,
  HiCheckCircle,
  HiExclamationCircle,
  HiRefresh,
  HiOutlineInformationCircle,
  HiOutlineChartBar,
  HiPlay,
} from 'react-icons/hi';

const TEST_INFO = {
  situp: { title: 'Sit Up Assessment', desc: 'Face the camera side-on. Ensure your full body is visible.', target: 'Core Endurance', unit: 'reps' },
  jump: { title: 'Vertical Jump', desc: 'Stand facing the camera. Jump as high as possible. Ensure arms are visible.', target: 'Explosive Power', unit: 'cm' },
  sprint: { title: 'Sprint Assessment', desc: 'Record from the side. Run across the frame at maximum speed.', target: 'Speed & Acceleration', unit: 'sec' },
  shuttle: { title: 'Shuttle Run', desc: 'Mark lines 10m apart. Record from an angle capturing both lines.', target: 'Agility', unit: 'sec' },
};

function getRecorderMimeType() {
  const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
  return types.find(t => MediaRecorder.isTypeSupported(t)) || '';
}

export default function UploadCenter() {
  const { user } = useApp();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTestType = queryParams.get('test') || 'situp';

  const [testType, setTestType] = useState(
    TEST_INFO[initialTestType] ? initialTestType : 'situp'
  );
  const [mode, setMode] = useState('webcam');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalVideoUrl, setOriginalVideoUrl] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef(null);
  const playbackRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (!user?.id) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const test = new URLSearchParams(location.search).get('test');
    if (test && TEST_INFO[test]) setTestType(test);
  }, [location.search]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopStream();
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch (err) {
      setError('Camera access denied or unavailable. ' + err.message);
      showToast('Could not access camera. Check browser permissions.', 'error');
    }
  }, [stopStream, showToast]);

  useEffect(() => {
    if (mode === 'webcam' && user?.id) startCamera();
    else stopStream();
    return () => stopStream();
  }, [mode, user?.id, startCamera, stopStream]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (originalVideoUrl) URL.revokeObjectURL(originalVideoUrl);
    };
  }, [previewUrl, originalVideoUrl]);

  const clearRecording = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (originalVideoUrl) URL.revokeObjectURL(originalVideoUrl);
    setPreviewUrl(null);
    setOriginalVideoUrl(null);
    setResult(null);
    setError('');
    setShowOverlay(false);
    chunksRef.current = [];
    if (mode === 'webcam') startCamera();
  };

  const handleStartRecording = () => {
    if (!streamRef.current) {
      showToast('Camera not ready. Allow camera access first.', 'error');
      return;
    }
    chunksRef.current = [];
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (originalVideoUrl) URL.revokeObjectURL(originalVideoUrl);
    setPreviewUrl(null);
    setOriginalVideoUrl(null);
    setResult(null);
    setError('');
    setShowOverlay(false);

    const mimeType = getRecorderMimeType();
    const options = mimeType ? { mimeType } : undefined;
    const recorder = new MediaRecorder(streamRef.current, options);
    recorder.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' });
      const recordedFile = new File([blob], `recording-${testType}.webm`, { type: blob.type });
      setFile(recordedFile);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setOriginalVideoUrl(url);
      showToast('Recording saved. Review and run AI analysis.', 'success');
    };
    recorder.start(250);
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    showToast('Assessment recording started', 'info');
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    stopStream();
  };

  const handleFileChange = e => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setError('');
    setShowOverlay(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (originalVideoUrl) URL.revokeObjectURL(originalVideoUrl);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setOriginalVideoUrl(url);
    showToast('Video selected. Click Analyze to continue.', 'info');
  };

  const processVideo = async videoFile => {
    if (!videoFile || !user?.id) return;
    setIsProcessing(true);
    setError('');
    showToast('Uploading video for AI analysis…', 'info');
    try {
      const data = await analyzeVideo(testType, user.id, videoFile);
      setResult(data);
      // Ensure the clean video is shown by default after analysis
      setPreviewUrl(originalVideoUrl);
      setShowOverlay(false);
      showToast('AI analysis complete. Assessment saved.', 'success');
    } catch (err) {
      const msg = err.message || 'Failed to process video.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyze = () => {
    if (!file) {
      showToast('Record or upload a video first.', 'error');
      return;
    }
    processVideo(file);
  };

  const reset = () => {
    clearRecording();
    if (mode === 'webcam') startCamera();
  };

  const toggleOverlay = () => {
    if (!result?.debug_video_url) return;
    const nextState = !showOverlay;
    setShowOverlay(nextState);
    if (nextState) {
      setPreviewUrl(`${API_BASE}${result.debug_video_url}`);
    } else {
      setPreviewUrl(originalVideoUrl);
    }
  };

  const testInfo = TEST_INFO[testType];

  return (
    <div className="page-shell flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex flex-col">
        <FadeInSection className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="section-label mb-3">Assessment Center</span>
              <h1 className="text-3xl font-display font-bold">
                Performance <span className="gradient-text">Evaluation</span>
              </h1>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.03] p-1.5 rounded-xl border border-white/[0.08] flex-wrap">
              {Object.keys(TEST_INFO).map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setTestType(key); clearRecording(); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    testType === key
                      ? 'bg-gradient-to-r from-ki-saffron to-ki-accent text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {TEST_INFO[key].title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </FadeInSection>

        <div className="grid lg:grid-cols-3 gap-6 flex-1">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <FadeInSection className="flex-1 flex flex-col">
              <div className="glass-card-strong p-1 flex-1 flex flex-col relative overflow-hidden min-h-[400px]">
                <div className="absolute top-4 left-4 z-20 flex bg-ki-dark/80 backdrop-blur-md rounded-lg p-1 border border-white/10">
                  <button
                    type="button"
                    onClick={() => { setMode('webcam'); clearRecording(); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${mode === 'webcam' ? 'bg-ki-saffron text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <HiOutlineVideoCamera /> Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('upload'); clearRecording(); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${mode === 'upload' ? 'bg-ki-saffron text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <HiOutlineUpload /> Upload
                  </button>
                </div>

                <div className="flex-1 bg-black rounded-xl overflow-hidden relative group m-1">
                  {isProcessing && (
                    <div className="absolute inset-0 z-30 bg-ki-dark-2/90 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="w-16 h-16 border-4 border-ki-saffron/30 border-t-ki-saffron rounded-full animate-spin mb-4" />
                      <h3 className="text-lg font-display font-bold text-white mb-2">Analyzing Biomechanics</h3>
                      <p className="text-sm text-gray-400">Processing pose landmarks with MediaPipe…</p>
                    </div>
                  )}

                  {previewUrl && !isRecording ? (
                    <video
                      ref={playbackRef}
                      src={previewUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain bg-black min-h-[360px]"
                    />
                  ) : mode === 'webcam' ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover min-h-[360px] ${!cameraReady && !error ? 'opacity-0' : ''}`}
                      />
                      {!cameraReady && !error && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                          Initializing camera…
                        </div>
                      )}
                      <AnimatePresence>
                        {isRecording && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/50"
                          >
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-bold text-red-400 tracking-wider">REC</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-xl bg-white/[0.02] m-4">
                      {file ? (
                        <>
                          <HiCheckCircle className="text-emerald-500 mb-3" size={48} />
                          <p className="text-sm text-white font-medium mb-1">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </>
                      ) : (
                        <>
                          <HiOutlineUpload className="text-gray-500 mb-4" size={48} />
                          <p className="text-sm font-medium text-white mb-2">Upload assessment video</p>
                          <p className="text-xs text-gray-500 mb-6">MP4, WebM up to 50MB</p>
                          <label className="btn-secondary py-2.5 px-6 cursor-pointer w-auto">
                            Browse Files
                            <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleFileChange} />
                          </label>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-wrap justify-center gap-3 border-t border-white/[0.05]">
                  {mode === 'webcam' && !previewUrl && (
                    !isRecording ? (
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        disabled={isProcessing}
                        className="btn-primary w-auto px-8 py-3 flex items-center gap-2 text-sm disabled:opacity-50"
                      >
                        <HiOutlineVideoCamera size={18} /> Start Recording
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStopRecording}
                        className="btn-primary w-auto px-8 py-3 flex items-center gap-2 text-sm bg-red-600 hover:from-red-600 hover:to-red-700"
                      >
                        <span className="w-3 h-3 rounded-sm bg-white" /> Stop Recording
                      </button>
                    )
                  )}
                  {file && !isRecording && !result && (
                    <>
                      <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={isProcessing}
                        className="btn-primary w-auto px-8 py-3 flex items-center gap-2 text-sm disabled:opacity-50"
                      >
                        <HiPlay size={18} /> Run AI Analysis
                      </button>
                      <button type="button" onClick={reset} className="btn-secondary w-auto px-6 py-3 text-sm">
                        <HiRefresh className="inline mr-1" /> Retake
                      </button>
                    </>
                  )}
                </div>
              </div>
            </FadeInSection>
          </div>

          <div className="flex flex-col gap-6">
            <FadeInSection delay={0.1}>
              <div className="glass-card p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-ki-saffron/10 text-ki-saffron">
                    <HiOutlineInformationCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-display font-semibold mb-1">{testInfo.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{testInfo.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.05]">
                  <span className="badge badge-info">Target: {testInfo.target}</span>
                  <span className="badge badge-warning">AI Validated</span>
                </div>
              </div>
            </FadeInSection>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="glass-card p-4 border-red-500/30 bg-red-500/5 flex items-start gap-3">
                    <HiExclamationCircle className="text-red-400 shrink-0" size={18} />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-strong p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-display font-semibold">Analysis Results</h3>
                    {result.validation_status === 'Valid' ? (
                      <span className="badge badge-success px-3 py-1.5"><HiCheckCircle className="inline" /> Verified</span>
                    ) : (
                      <span className="badge badge-danger px-3 py-1.5"><HiExclamationCircle className="inline" /> Flagged</span>
                    )}
                  </div>
                  <div className="flex flex-col items-center py-6 mb-6 border-y border-white/[0.05]">
                    <span className="text-xs text-gray-500 uppercase tracking-widest mb-2">Final Score</span>
                    <span className="text-6xl font-display font-bold gradient-text">{result.score}</span>
                    <span className="text-sm text-gray-400 mt-2">{testInfo.unit}</span>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">AI Confidence</span>
                      <span className="text-emerald-400 font-medium">{result.ai_confidence}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${result.ai_confidence}%` }} />
                    </div>
                  </div>
                  {result.validation_status !== 'Valid' && result.cheat_reason && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                      <p className="text-xs text-red-300">{result.cheat_reason}</p>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    {result.debug_video_url && (
                      <button
                        type="button"
                        onClick={toggleOverlay}
                        className={`w-full py-2.5 text-sm flex items-center justify-center gap-2 rounded-lg font-medium transition-colors mb-2 border ${showOverlay ? 'bg-ki-saffron/20 border-ki-saffron text-ki-saffron' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
                      >
                        {showOverlay ? 'Hide AI Analysis Overlay' : 'Show AI Analysis Overlay'}
                      </button>
                    )}
                    <button type="button" onClick={reset} className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2">
                      <HiRefresh /> Retake Assessment
                    </button>
                    <Link to="/dashboard" className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 text-center">
                      Back to Dashboard
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!result && !isProcessing && !error && (
              <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                <HiOutlineChartBar size={32} className="mb-3 text-gray-500" />
                <p className="text-sm text-gray-400">Record or upload a video, then run AI analysis to see results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
