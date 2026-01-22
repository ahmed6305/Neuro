import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Play from './pages/Play';
import Learn from './pages/Learn';
import MemoryMatrix from './components/games/MemoryMatrix';
import SpeedMatch from './components/games/SpeedMatch';
import ColorChaos from './components/games/ColorChaos';
import QuantumMath from './components/games/QuantumMath';
import EagleEye from './components/games/EagleEye';
import PatternPath from './components/games/PatternPath';
import WordScramble from './components/games/WordScramble';
import Dashboard from './pages/Dashboard';

import FocusMode from './components/common/FocusMode';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/common/Header';
import { GameProvider } from './context/GameContext';

import Stats from './pages/Stats';
import Settings from './pages/Settings';

function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500/30">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/play" element={<Play />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/settings" element={<Settings />} />

              {/* Games */}
              <Route path="/play/memory-matrix" element={<MemoryMatrix />} />
              <Route path="/play/speed-match" element={<SpeedMatch />} />
              <Route path="/play/color-chaos" element={<ColorChaos />} />
              <Route path="/play/quantum-math" element={<QuantumMath />} />
              <Route path="/play/eagle-eye" element={<EagleEye />} />
              <Route path="/play/pattern-path" element={<PatternPath />} />
              <Route path="/play/word-scramble" element={<WordScramble />} />
            </Routes>
            <FocusMode />
          </div>
        </Router>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;
