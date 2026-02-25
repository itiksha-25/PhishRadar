import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Terminal, Database, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';

const Dashboard = ({ sessionId }) => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'phish-net',
      title: 'Phish Net',
      subtitle: 'Email Analyzer',
      description: 'Scan emails for psychological manipulation triggers',
      icon: ShieldAlert,
      color: 'lime',
      path: '/phish-net',
    },
    {
      id: 'simulator',
      title: 'Catch The Phish',
      subtitle: 'Digital Life Simulator',
      description: 'Test your instincts against realistic phishing attempts',
      icon: Terminal,
      color: 'cyan',
      path: '/simulator',
    },
    {
      id: 'phish-tank',
      title: 'Phish Tank',
      subtitle: 'Example Library',
      description: 'Explore real-world phishing examples and tactics',
      icon: Database,
      color: 'turquoise',
      path: '/phish-tank',
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-12 relative z-10">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Zap className="w-12 h-12 text-lime-400" />
          <h1 className="text-5xl md:text-7xl font-bold font-orbitron tracking-tighter text-white">
            Phish<span className="text-lime-400">Radar</span>
          </h1>
        </div>
        <p className="text-lg md:text-xl text-teal-400 font-mono">
          // CYBER-NOIR PHISHING AWARENESS PLATFORM
        </p>
        <p className="text-base text-gray-400 mt-2">
          Session: <span className="text-cyan-400 font-mono">{sessionId}</span>
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard
                className="h-full flex flex-col cursor-pointer group"
                onClick={() => navigate(module.path)}
                data-testid={`module-${module.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-4 rounded-lg bg-${module.color}-400/10 border border-${module.color}-400/30 group-hover:bg-${module.color}-400/20 transition-all`}
                  >
                    <Icon className={`w-8 h-8 text-${module.color}-400`} />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-orbitron mb-2 text-white">
                  {module.title}
                </h2>
                <p className="text-sm text-cyan-400 font-mono mb-3">{module.subtitle}</p>
                <p className="text-base text-gray-300 flex-grow">{module.description}</p>
                <div className="mt-6">
                  <div className="text-lime-400 font-bold uppercase text-sm group-hover:text-lime-300 transition-colors">
                    Launch Module →
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Footer */}
      <motion.div
        className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <GlassCard className="text-center" hover={false}>
          <div className="text-3xl font-bold font-mono text-lime-400">93%</div>
          <div className="text-sm text-gray-400 mt-1">of breaches involve phishing</div>
        </GlassCard>
        <GlassCard className="text-center" hover={false}>
          <div className="text-3xl font-bold font-mono text-cyan-400">$4.9M</div>
          <div className="text-sm text-gray-400 mt-1">average cost of data breach</div>
        </GlassCard>
        <GlassCard className="text-center" hover={false}>
          <div className="text-3xl font-bold font-mono text-turquoise-400">12s</div>
          <div className="text-sm text-gray-400 mt-1">average time to fall for phishing</div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Dashboard;


