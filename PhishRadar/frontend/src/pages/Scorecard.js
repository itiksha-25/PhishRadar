import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Clock, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { API } from '../App';
import axios from 'axios';
import { toast } from 'sonner';

const Scorecard = ({ sessionId }) => {
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScore();
  }, []);

  const loadScore = async () => {
    try {
      const response = await axios.get(`${API}/scores/${sessionId}`);
      setScore(response.data);
    } catch (error) {
      console.error('Failed to load score:', error);
      toast.error('No score found. Complete the simulator first!');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      Critical: 'text-red-500',
      High: 'text-orange-500',
      Medium: 'text-yellow-500',
      Low: 'text-green-500',
    };
    return colors[level] || 'text-gray-500';
  };

  const getRiskLevelMessage = (level) => {
    const messages = {
      Critical:
        'HIGH VULNERABILITY: You are at serious risk of falling for phishing attacks. Please review the training materials and practice more.',
      High: 'ELEVATED RISK: Your phishing detection skills need improvement. Consider reviewing common red flags.',
      Medium:
        'MODERATE AWARENESS: You have basic phishing detection skills but could benefit from additional training.',
      Low: 'STRONG DEFENSE: You have good phishing detection skills. Keep staying vigilant!',
    };
    return messages[level] || '';
  };

  const getGrade = (accuracy) => {
    if (accuracy >= 90) return 'A+';
    if (accuracy >= 85) return 'A';
    if (accuracy >= 80) return 'B+';
    if (accuracy >= 75) return 'B';
    if (accuracy >= 70) return 'C+';
    if (accuracy >= 65) return 'C';
    if (accuracy >= 60) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lime-400 font-mono animate-pulse">Loading scorecard...</div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <GlassCard className="max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-orbitron text-white mb-4">No Score Found</h2>
          <p className="text-gray-300 mb-6">Complete the simulator to see your results.</p>
          <NeonButton onClick={() => navigate('/simulator')} data-testid="go-to-simulator">
            Go to Simulator
          </NeonButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 relative z-10">
      <div className="max-w-5xl mx-auto">
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
              Digital Safety <span className="text-lime-400">Scorecard</span>
            </h1>
            <p className="text-teal-400 font-mono mt-1">// YOUR PERFORMANCE ANALYSIS</p>
          </div>
        </div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="text-center mb-8 p-8">
            <Trophy className="w-20 h-20 text-lime-400 mx-auto mb-4" />
            <div className="text-6xl font-bold font-mono text-lime-400 mb-2">
              {getGrade(score.accuracy)}
            </div>
            <div className="text-3xl font-bold font-mono text-white mb-4">
              {score.accuracy.toFixed(1)}%
            </div>
            <p className="text-gray-400 font-mono">Overall Accuracy</p>
          </GlassCard>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="stat-card text-center" hover={false}>
              <Target className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-3xl font-bold font-mono text-cyan-400 mb-1">
                {score.correct_attempts}/{score.total_attempts}
              </div>
              <div className="text-sm text-gray-400">Correct Attempts</div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="stat-card text-center" hover={false}>
              <Clock className="w-8 h-8 text-turquoise-400 mx-auto mb-3" />
              <div className="text-3xl font-bold font-mono text-turquoise-400 mb-1">
                {score.avg_hesitancy.toFixed(1)}s
              </div>
              <div className="text-sm text-gray-400">Avg Response Time</div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="stat-card text-center" hover={false}>
              <TrendingUp className="w-8 h-8 text-lime-400 mx-auto mb-3" />
              <div className={`text-3xl font-bold font-mono mb-1 ${getRiskLevelColor(score.risk_level)}`}>
                {score.risk_level}
              </div>
              <div className="text-sm text-gray-400">Risk Level</div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="stat-card text-center" hover={false}>
              <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-3xl font-bold font-mono text-yellow-500 mb-1">
                {score.total_attempts - score.correct_attempts}
              </div>
              <div className="text-sm text-gray-400">Mistakes</div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Risk Assessment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="mb-8">
            <h2 className="text-2xl font-bold font-orbitron text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              Risk Assessment
            </h2>
            <div
              className={`p-4 rounded-lg border-2 ${getRiskLevelColor(score.risk_level).replace(
                'text',
                'border'
              )} bg-black/30`}
            >
              <p className={`text-lg font-mono ${getRiskLevelColor(score.risk_level)}`}>
                {getRiskLevelMessage(score.risk_level)}
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="mb-8">
            <h2 className="text-2xl font-bold font-orbitron text-white mb-4">Recommendations</h2>
            <div className="space-y-3">
              {score.accuracy < 70 && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">
                    ⚠️ <strong>Critical:</strong> Review the Phish Tank examples to learn common red
                    flags
                  </p>
                </div>
              )}
              {score.avg_hesitancy > 5 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-500 text-sm">
                    🕒 Your response time is slow. Practice recognizing phishing patterns faster.
                  </p>
                </div>
              )}
              {score.accuracy >= 85 && (
                <div className="p-3 bg-lime-400/10 border border-lime-400/30 rounded-lg">
                  <p className="text-lime-400 text-sm">
                    ✅ <strong>Excellent work!</strong> Keep practicing to maintain your skills.
                  </p>
                </div>
              )}
              <div className="p-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
                <p className="text-cyan-400 text-sm">
                  💡 Always verify sender addresses, never click suspicious links, and enable 2FA on
                  all accounts.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <NeonButton onClick={() => navigate('/simulator')} className="flex-1" data-testid="retry-button">
            Try Again
          </NeonButton>
          <NeonButton
            variant="secondary"
            onClick={() => navigate('/phish-tank')}
            className="flex-1"
            data-testid="learn-more-button"
          >
            Learn More
          </NeonButton>
          <NeonButton
            variant="secondary"
            onClick={() => navigate('/')}
            className="flex-1"
            data-testid="home-button"
          >
            Home
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default Scorecard;

