import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, BookOpen, AlertTriangle, TrendingUp } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { API } from '../App';
import axios from 'axios';
import { toast } from 'sonner';

const PhishTank = ({ sessionId }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('student');
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExample, setSelectedExample] = useState(null);

  const categories = [
    { id: 'student', label: 'Students', icon: '🎓', color: 'lime' },
    { id: 'banker', label: 'Bankers', icon: '💼', color: 'cyan' },
    { id: 'shopper', label: 'Shoppers', icon: '🛍️', color: 'turquoise' },
    { id: 'elderly', label: 'Elderly', icon: '👴', color: 'teal' },
  ];

  useEffect(() => {
    loadExamples(activeCategory);
  }, [activeCategory]);

  const loadExamples = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/phish-tank/${category}`);
      setExamples(response.data);
    } catch (error) {
      console.error('Failed to load examples:', error);
      toast.error('Failed to load phishing examples');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative z-10">
      <div className="max-w-7xl mx-auto">
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
              Phish <span className="text-lime-400">Tank</span>
            </h1>
            <p className="text-teal-400 font-mono mt-1">// REAL-WORLD PHISHING EXAMPLES</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedExample(null);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeCategory === cat.id
                  ? `bg-${cat.color}-400 text-black shadow-[0_0_15px_rgba(193,241,48,0.4)]`
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
              }`}
              data-testid={`category-${cat.id}`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Examples Grid */}
        {!selectedExample ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 text-center py-12">
                <div className="text-lime-400 font-mono animate-pulse">Loading examples...</div>
              </div>
            ) : (
              examples.map((example, idx) => (
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <GlassCard
                    className="phish-example cursor-pointer h-full"
                    onClick={() => setSelectedExample(example)}
                    data-testid={`example-${example.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold font-orbitron text-white">{example.title}</h3>
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">From:</div>
                        <div className="text-sm font-mono text-cyan-400">{example.sender}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Subject:</div>
                        <div className="text-sm text-white">{example.subject}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Preview:</div>
                        <div className="text-sm text-gray-300">{example.preview}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {example.triggers.map((trigger, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs font-mono bg-red-500/20 border border-red-500 text-red-500 rounded"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-black/30 rounded">
                        <div className="text-xs text-gray-400">Success Rate</div>
                        <div className="text-sm font-bold font-mono text-red-500">
                          {example.stats.success_rate}
                        </div>
                      </div>
                      <div className="p-2 bg-black/30 rounded">
                        <div className="text-xs text-gray-400">Avg Loss</div>
                        <div className="text-sm font-bold font-mono text-yellow-500">
                          {example.stats.avg_loss}
                        </div>
                      </div>
                      <div className="p-2 bg-black/30 rounded">
                        <div className="text-xs text-gray-400">Reports</div>
                        <div className="text-sm font-bold font-mono text-orange-500">
                          {example.stats.reports}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-lime-400 font-bold uppercase">
                      View Details →
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard>
              <button
                onClick={() => setSelectedExample(null)}
                className="text-cyan-400 hover:text-cyan-300 mb-6 flex items-center gap-2"
                data-testid="back-to-list"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to list
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold font-orbitron text-white mb-2">
                    {selectedExample.title}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    Case Study
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Sender Email:</div>
                      <div className="p-3 bg-black/50 rounded-lg border border-cyan-400/30 font-mono text-cyan-400 text-sm">
                        {selectedExample.sender}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Subject Line:</div>
                      <div className="p-3 bg-black/50 rounded-lg border border-white/10 text-white text-sm">
                        {selectedExample.subject}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Full Content:</div>
                      <div className="p-3 bg-black/50 rounded-lg border border-white/10 text-gray-300 text-sm">
                        {selectedExample.full_content}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Red Flags:
                      </div>
                      <div className="space-y-2">
                        {selectedExample.red_flags.map((flag, i) => (
                          <div
                            key={i}
                            className="p-2 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400"
                          >
                            • {flag}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-yellow-500" />
                        Statistics:
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 bg-black/50 rounded-lg border border-red-500/30">
                          <div className="text-xs text-gray-400">Victim Success Rate</div>
                          <div className="text-2xl font-bold font-mono text-red-500">
                            {selectedExample.stats.success_rate}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Percentage of people who fall for this scam
                          </div>
                        </div>
                        <div className="p-3 bg-black/50 rounded-lg border border-yellow-500/30">
                          <div className="text-xs text-gray-400">Average Financial Loss</div>
                          <div className="text-2xl font-bold font-mono text-yellow-500">
                            {selectedExample.stats.avg_loss}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Per victim who falls for it</div>
                        </div>
                        <div className="p-3 bg-black/50 rounded-lg border border-orange-500/30">
                          <div className="text-xs text-gray-400">Total Reports</div>
                          <div className="text-2xl font-bold font-mono text-orange-500">
                            {selectedExample.stats.reports}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Documented cases worldwide
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-lime-400/10 border border-lime-400/30 rounded-lg">
                  <div className="text-sm text-lime-400 font-bold mb-2">✅ Protection Tips:</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Always verify sender email addresses carefully</li>
                    <li>• Never click suspicious links - type URLs directly</li>
                    <li>• Be skeptical of urgent requests or "too good to be true" offers</li>
                    <li>• Enable two-factor authentication on all accounts</li>
                    <li>• Contact organizations directly using official contact info</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PhishTank;


