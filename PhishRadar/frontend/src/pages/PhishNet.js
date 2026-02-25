import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { API } from '../App';
import axios from 'axios';
import { toast } from 'sonner';

const PhishNet = ({ sessionId }) => {
  const navigate = useNavigate();
  const [emailContent, setEmailContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [analysisStartTime, setAnalysisStartTime] = useState(null);

  const sampleEmails = [
    {
      title: 'Bank Alert',
      content:
        'URGENT: Your Bank of America account has been suspended due to suspicious activity. Click here immediately to verify your identity and restore access. Failure to act within 24 hours will result in permanent account closure.',
    },
    {
      title: 'Prize Winner',
      content:
        'Congratulations! You have won $1,000,000 in the International Lottery. To claim your prize, please provide your bank details and pay a small processing fee of $99. This offer expires in 48 hours!',
    },
  ];

  const handleAnalyze = async () => {
    if (!emailContent.trim()) {
      toast.error('Please enter email content to analyze');
      return;
    }

    setAnalyzing(true);
    setAnalysisStartTime(Date.now());
    setResult(null);

    try {
      const response = await axios.post(`${API}/analyze-email`, {
        email_content: emailContent,
      });
      
      setTimeout(() => {
        setResult(response.data);
        setAnalyzing(false);
      }, 1500);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze email');
      setAnalyzing(false);
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      Critical: 'text-red-500',
      High: 'text-orange-500',
      Medium: 'text-yellow-500',
      Low: 'text-green-500',
    };
    return colors[level] || 'text-gray-500';
  };

  const getUrgencyColor = (score) => {
    if (score >= 70) return 'from-red-500 via-orange-500 to-yellow-500';
    if (score >= 50) return 'from-orange-500 via-yellow-500 to-lime-400';
    if (score >= 30) return 'from-yellow-500 to-lime-400';
    return 'from-teal-500 via-cyan-400 to-turquoise-400';
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-white">
              Phish Net <span className="text-lime-400">Analyzer</span>
            </h1>
            <p className="text-teal-400 font-mono mt-1">// PSYCHOLOGICAL TRIGGER DETECTION</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <GlassCard>
            <h2 className="text-2xl font-bold font-orbitron mb-4 text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-lime-400" />
              Email Content
            </h2>
            <textarea
              className="w-full h-64 bg-black/50 border-2 border-forest-500 text-white font-mono p-4 rounded-md focus:outline-none focus:border-lime-400 transition-colors resize-none placeholder:text-teal-700"
              placeholder="Paste suspicious email content here..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              data-testid="email-input"
            />
            <div className="flex gap-4 mt-4">
              <NeonButton
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex-1"
                data-testid="scan-button"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                    Scanning...
                  </>
                ) : (
                  'Scan Email'
                )}
              </NeonButton>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Quick Samples:</p>
              <div className="space-y-2">
                {sampleEmails.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setEmailContent(sample.content)}
                    className="w-full text-left text-sm text-cyan-400 hover:text-cyan-300 p-2 rounded border border-cyan-400/20 hover:border-cyan-400/50 transition-all"
                    data-testid={`sample-${idx}`}
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Results Section */}
          <GlassCard>
            <h2 className="text-2xl font-bold font-orbitron mb-4 text-white">Analysis Results</h2>
            {analyzing && (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-16 h-16 text-lime-400 animate-spin mb-4" />
                <p className="text-lime-400 font-mono animate-pulse">Analyzing triggers...</p>
              </div>
            )}
            {!analyzing && !result && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertTriangle className="w-16 h-16 mb-4 opacity-30" />
                <p className="font-mono">No analysis yet. Paste an email to begin.</p>
              </div>
            )}
            {!analyzing && result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                data-testid="analysis-results"
              >
                {/* Urgency Meter */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-mono text-gray-400">URGENCY SCORE</span>
                    <span className="text-2xl font-bold font-mono text-lime-400">
                      {result.urgency_score}/100
                    </span>
                  </div>
                  <div className="h-4 w-full bg-gray-900 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getUrgencyColor(result.urgency_score)} urgency-bar`}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.urgency_score}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Risk Level */}
                <div className="mb-6 p-4 bg-black/30 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-gray-400">RISK LEVEL</span>
                    <span className={`text-xl font-bold font-mono ${getRiskColor(result.risk_level)}`}>
                      {result.risk_level.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Triggers */}
                <div>
                  <h3 className="text-lg font-bold font-orbitron mb-3 text-white">Detected Triggers</h3>
                  {result.triggers.length === 0 && (
                    <p className="text-gray-400 text-sm font-mono">No suspicious triggers detected.</p>
                  )}
                  <div className="space-y-3">
                    {result.triggers.map((trigger, idx) => (
                      <motion.div
                        key={idx}
                        className="p-3 bg-black/30 rounded-lg border border-cyan-400/20"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        data-testid={`trigger-${idx}`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lime-400 font-bold">{trigger.trigger}</span>
                          <span className="text-cyan-400 font-mono text-sm">+{trigger.score}</span>
                        </div>
                        {trigger.evidence.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {trigger.evidence.map((evidence, i) => (
                              <span
                                key={i}
                                className="text-xs font-mono px-2 py-1 bg-teal-400/10 text-teal-400 rounded"
                              >
                                {evidence}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default PhishNet;


