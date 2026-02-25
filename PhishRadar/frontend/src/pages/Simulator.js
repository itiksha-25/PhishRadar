import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Mail, MessageSquare, AlertCircle, Skull, Clock } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { API } from '../App';
import axios from 'axios';
import { toast } from 'sonner';

const Simulator = ({ sessionId }) => {
  const navigate = useNavigate();
  const [isPhishermanMode, setIsPhishermanMode] = useState(false);
  const [gameState, setGameState] = useState('idle');
  const [currentNotification, setCurrentNotification] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showHackerView, setShowHackerView] = useState(false);
  const [hackerData, setHackerData] = useState(null);
  const [hesitancyStart, setHesitancyStart] = useState(null);
  const [attempts, setAttempts] = useState([]);

  const notifications = [
    {
      id: 1,
      type: 'email',
      isPhish: true,
      sender: 'security@paypa1-verify.com',
      subject: '⚠️ Your account has been limited',
      preview: 'We detected unusual activity. Verify your account immediately...',
      triggers: ['Fear', 'Urgency'],
      stolenData: ['Email', 'Password', 'Credit Card'],
    },
    {
      id: 2,
      type: 'sms',
      isPhish: false,
      sender: 'DoorDash',
      subject: 'Your order is on the way!',
      preview: 'Your order #12345 will arrive in 15 minutes. Track it here.',
      triggers: [],
      stolenData: [],
    },
    {
      id: 3,
      type: 'email',
      isPhish: true,
      sender: 'amazon-prize@winner-claim.net',
      subject: '🎉 Congratulations! You won a $500 Amazon Gift Card',
      preview: 'Click to claim your prize now! Limited time offer...',
      triggers: ['Greed', 'Scarcity'],
      stolenData: ['Personal Info', 'Address', 'Phone Number'],
    },
    {
      id: 4,
      type: 'sms',
      isPhish: true,
      sender: '+1-800-BANK',
      subject: 'ALERT: Suspicious login attempt',
      preview: 'Click here to secure your account: bit.ly/sec-bnk-123',
      triggers: ['Fear', 'Authority'],
      stolenData: ['Bank Account', 'SSN', 'Login Credentials'],
    },
    {
      id: 5,
      type: 'email',
      isPhish: false,
      sender: 'notifications@github.com',
      subject: 'New star on your repository',
      preview: 'Someone starred your project "awesome-app"',
      triggers: [],
      stolenData: [],
    },
  ];

  const startGame = () => {
    setGameState('playing');
    setScore({ correct: 0, total: 0 });
    setAttempts([]);
    nextNotification();
  };

  const nextNotification = () => {
    const remaining = notifications.filter(
      (n) => !attempts.some((a) => a.notificationId === n.id)
    );
    if (remaining.length === 0) {
      endGame();
      return;
    }
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentNotification(next);
    setHesitancyStart(Date.now());
  };

  const handleChoice = async (choice) => {
    if (!currentNotification) return;

    const hesitancyTime = (Date.now() - hesitancyStart) / 1000;
    const isCorrect =
      (choice === 'phish' && currentNotification.isPhish) ||
      (choice === 'safe' && !currentNotification.isPhish);

    const newAttempt = {
      notificationId: currentNotification.id,
      choice,
      isCorrect,
      hesitancyTime,
    };

    setAttempts([...attempts, newAttempt]);
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    try {
      await axios.post(`${API}/simulator/attempt`, {
        session_id: sessionId,
        notification_type: currentNotification.type,
        user_choice: choice,
        is_correct: isCorrect,
        hesitancy_time: hesitancyTime,
      });
    } catch (error) {
      console.error('Failed to save attempt:', error);
    }

    if (!isCorrect && currentNotification.isPhish) {
      setHackerData({
        stolenData: currentNotification.stolenData,
        triggers: currentNotification.triggers,
      });
      setShowHackerView(true);
      setTimeout(() => {
        setShowHackerView(false);
        nextNotification();
      }, 4000);
    } else {
      if (isCorrect) {
        toast.success('Correct! Well spotted!');
      } else {
        toast.error('Incorrect! That was actually safe.');
      }
      setTimeout(nextNotification, 1000);
    }
  };

  const endGame = async () => {
    setGameState('finished');
    const accuracy = score.total > 0 ? (score.correct / score.total) * 100 : 0;
    const avgHesitancy =
      attempts.reduce((sum, a) => sum + a.hesitancyTime, 0) / attempts.length || 0;

    let riskLevel = 'Low';
    if (accuracy < 50) riskLevel = 'Critical';
    else if (accuracy < 70) riskLevel = 'High';
    else if (accuracy < 85) riskLevel = 'Medium';

    try {
      await axios.post(`${API}/scores`, {
        session_id: sessionId,
        total_attempts: score.total,
        correct_attempts: score.correct,
        accuracy,
        avg_hesitancy: avgHesitancy,
        risk_level: riskLevel,
      });
      navigate('/scorecard');
    } catch (error) {
      console.error('Failed to save score:', error);
      toast.error('Failed to save score');
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
              data-testid="back-button"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-white">
                Catch The <span className="text-lime-400">Phish</span>
              </h1>
              <p className="text-teal-400 font-mono mt-1">// DIGITAL LIFE SIMULATOR</p>
            </div>
          </div>
          <button
            onClick={() => setIsPhishermanMode(!isPhishermanMode)}
            className={`px-4 py-2 rounded-md font-mono text-sm border transition-all ${
              isPhishermanMode
                ? 'bg-red-500/20 border-red-500 text-red-500'
                : 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
            }`}
            data-testid="phisherman-toggle"
          >
            {isPhishermanMode ? '🎯 PHISHERMAN MODE' : '🛡️ FRY MODE'}
          </button>
        </div>

        {!isPhishermanMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Phone Mockup */}
            <GlassCard className="flex items-center justify-center p-8">
              <div className="phone-mockup w-80 h-[600px] relative flex flex-col">
                {/* Phone Header */}
                <div className="h-16 flex items-center justify-center text-white text-sm font-mono border-b border-gray-700">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                {/* Phone Content */}
                <div className="flex-1 bg-gradient-to-b from-gray-900 to-black p-4 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {currentNotification && gameState === 'playing' && (
                      <motion.div
                        key={currentNotification.id}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="notification-slide bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700 shadow-xl"
                        data-testid="notification-card"
                      >
                        <div className="flex items-start gap-3">
                          {currentNotification.type === 'email' ? (
                            <Mail className="w-6 h-6 text-blue-400 flex-shrink-0" />
                          ) : (
                            <MessageSquare className="w-6 h-6 text-green-400 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-bold text-sm mb-1 truncate">
                              {currentNotification.sender}
                            </div>
                            <div className="text-gray-300 text-sm font-semibold mb-1 truncate">
                              {currentNotification.subject}
                            </div>
                            <div className="text-gray-400 text-xs line-clamp-2">
                              {currentNotification.preview}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {gameState === 'idle' && (
                    <div className="flex items-center justify-center h-full text-gray-500 text-center font-mono text-sm">
                      Start the simulation to receive notifications
                    </div>
                  )}

                  {gameState === 'finished' && (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <AlertCircle className="w-16 h-16 text-lime-400 mx-auto mb-4" />
                        <p className="text-white font-mono">Simulation Complete!</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Actions */}
                {gameState === 'playing' && currentNotification && (
                  <div className="h-24 bg-black border-t border-gray-700 flex items-center justify-around px-6">
                    <NeonButton
                      variant="secondary"
                      onClick={() => handleChoice('safe')}
                      className="text-xs py-2 px-4"
                      data-testid="safe-button"
                    >
                      SAFE
                    </NeonButton>
                    <NeonButton
                      variant="danger"
                      onClick={() => handleChoice('phish')}
                      className="text-xs py-2 px-4"
                      data-testid="phish-button"
                    >
                      PHISH
                    </NeonButton>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Control Panel */}
            <GlassCard>
              <h2 className="text-2xl font-bold font-orbitron mb-4 text-white flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-cyan-400" />
                Control Panel
              </h2>

              {gameState === 'idle' && (
                <div className="space-y-4">
                  <p className="text-gray-300">
                    Test your instincts against realistic phishing attempts. Notifications will appear
                    on the phone. Decide if they're <span className="text-lime-400">SAFE</span> or{' '}
                    <span className="text-red-500">PHISH</span>.
                  </p>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-500 text-sm">
                      ⚠️ If you fail to spot a phish, you'll see a "Hacker View" revealing what data
                      was stolen.
                    </p>
                  </div>
                  <NeonButton onClick={startGame} className="w-full" data-testid="start-game-button">
                    Start Simulation
                  </NeonButton>
                </div>
              )}

              {gameState === 'playing' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/30 rounded-lg border border-lime-400/30">
                      <div className="text-sm text-gray-400 mb-1">Correct</div>
                      <div className="text-3xl font-bold font-mono text-lime-400">{score.correct}</div>
                    </div>
                    <div className="p-4 bg-black/30 rounded-lg border border-cyan-400/30">
                      <div className="text-sm text-gray-400 mb-1">Total</div>
                      <div className="text-3xl font-bold font-mono text-cyan-400">{score.total}</div>
                    </div>
                  </div>

                  {hesitancyStart && (
                    <div className="p-4 bg-black/30 rounded-lg border border-turquoise-400/30">
                      <div className="text-sm text-gray-400 mb-2">Hesitancy Timer</div>
                      <div className="text-2xl font-bold font-mono text-turquoise-400">
                        {((Date.now() - hesitancyStart) / 1000).toFixed(1)}s
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Quick decisions (&lt;3s) indicate confidence. Slow decisions suggest uncertainty.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>
        ) : (
          <PhishermanMode />
        )}

        {/* Hacker View Modal */}
        <AnimatePresence>
          {showHackerView && hackerData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
              data-testid="hacker-view"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="hacker-reveal bg-black border-4 border-red-500 p-8 max-w-2xl w-full mx-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Skull className="w-12 h-12 text-red-500 animate-pulse" />
                  <h2 className="text-3xl font-bold font-orbitron text-red-500">HACKER VIEW</h2>
                </div>
                <p className="text-lime-400 font-mono mb-4">// DATA COMPROMISED</p>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Stolen Data:</div>
                    <div className="flex flex-wrap gap-2">
                      {hackerData.stolenData.map((data, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-500 rounded text-sm font-mono"
                        >
                          {data}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Manipulation Triggers Used:</div>
                    <div className="flex flex-wrap gap-2">
                      {hackerData.triggers.map((trigger, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-yellow-500/20 border border-yellow-500 text-yellow-500 rounded text-sm font-mono"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-6 text-center font-mono">
                  This is how hackers see your data when you fall for a phish.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PhishermanMode = () => {
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [generatedEmail, setGeneratedEmail] = useState('');

  const triggers = [
    { name: 'Fear', description: 'Account suspension, security alerts', color: 'red' },
    { name: 'Greed', description: 'Prizes, money, rewards', color: 'yellow' },
    { name: 'Authority', description: 'Government, banks, legal', color: 'blue' },
    { name: 'Urgency', description: 'Limited time, act now', color: 'orange' },
    { name: 'Curiosity', description: 'Mysterious packages, surprises', color: 'purple' },
  ];

  const toggleTrigger = (trigger) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  };

  const generateEmail = () => {
    if (selectedTriggers.length === 0) {
      toast.error('Select at least one trigger');
      return;
    }

    const templates = {
      Fear: 'Your account has been compromised. Immediate action required to prevent data loss.',
      Greed: "Congratulations! You've won $10,000. Click here to claim your prize now.",
      Authority:
        'This is an official notice from the IRS. You have unpaid taxes. Respond immediately to avoid legal action.',
      Urgency: 'URGENT: Your package will be returned if not claimed within 24 hours. Act now!',
      Curiosity: 'Someone sent you a secret message. Click here to reveal it.',
    };

    const email = selectedTriggers.map((t) => templates[t]).join(' ');
    setGeneratedEmail(email);
    toast.success('Phishing email generated!');
  };

  return (
    <GlassCard className="terminal-mode">
      <h2 className="text-2xl font-bold font-orbitron mb-6 terminal-text flex items-center gap-2">
        <Skull className="w-6 h-6" />
        PHISHERMAN MODE
      </h2>
      <p className="terminal-text text-sm mb-6">// SELECT MANIPULATION TRIGGERS TO BUILD A PHISHING EMAIL</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {triggers.map((trigger) => (
          <button
            key={trigger.name}
            onClick={() => toggleTrigger(trigger.name)}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              selectedTriggers.includes(trigger.name)
                ? 'border-lime-400 bg-lime-400/20 terminal-text'
                : 'border-gray-700 hover:border-gray-600'
            }`}
            data-testid={`trigger-${trigger.name.toLowerCase()}`}
          >
            <div className="font-bold terminal-text">{trigger.name}</div>
            <div className="text-xs text-gray-400 mt-1">{trigger.description}</div>
          </button>
        ))}
      </div>

      <NeonButton onClick={generateEmail} className="w-full mb-6" data-testid="generate-email-button">
        Generate Phishing Email
      </NeonButton>

      {generatedEmail && (
        <div className="p-4 bg-black border-2 border-lime-400 rounded-lg">
          <div className="text-sm text-lime-400 mb-2 font-mono">// GENERATED PHISHING EMAIL</div>
          <p className="terminal-text text-sm">{generatedEmail}</p>
        </div>
      )}
    </GlassCard>
  );
};

export default Simulator;

