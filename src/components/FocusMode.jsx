import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Target,
  Coffee,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import './FocusMode.css';

const FocusMode = ({ 
  isActive, 
  onClose, 
  currentTodo, 
  pomodoroData,
  onSessionComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState(pomodoroData?.timeLeft || 25 * 60);
  const [isRunning, setIsRunning] = useState(pomodoroData?.isRunning || false);
  const [sessionType, setSessionType] = useState(pomodoroData?.sessionType || 'work');
  const [isMuted, setIsMuted] = useState(pomodoroData?.isMuted || false);
  const [showBreakSuggestion, setShowBreakSuggestion] = useState(false);

  const breakActivities = [
    "Take a short walk",
    "Do some stretching",
    "Drink water",
    "Look away from screen",
    "Take deep breaths",
    "Listen to music",
    "Meditate for 2 minutes"
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSessionComplete();
    }
  }, [timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (sessionType === 'work') {
      setShowBreakSuggestion(true);
      setSessionType('shortBreak');
      setTimeLeft(5 * 60);
      onSessionComplete?.('work');
    } else {
      setShowBreakSuggestion(false);
      setSessionType('work');
      setTimeLeft(25 * 60);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    setShowBreakSuggestion(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionType === 'work' ? 25 * 60 : 5 * 60);
    setShowBreakSuggestion(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = sessionType === 'work' ? 25 * 60 : 5 * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getSessionColor = () => {
    return sessionType === 'work' ? '#ef4444' : '#10b981';
  };

  const getRandomActivity = () => {
    return breakActivities[Math.floor(Math.random() * breakActivities.length)];
  };

  if (!isActive) return null;

  return (
    <div className="focus-mode">
      <div className="focus-overlay" />
      
      <div className="focus-container">
        <div className="focus-header">
          <button onClick={onClose} className="close-focus-btn">
            <ArrowLeft size={20} />
            Exit Focus
          </button>
          
          <div className="focus-controls">
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className="control-btn"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        <div className="focus-content">
          {currentTodo && (
            <div className="focus-task">
              <div className="task-icon">
                {sessionType === 'work' ? <Target size={24} /> : <Coffee size={24} />}
              </div>
              <div className="task-details">
                <div className="task-label">
                  {sessionType === 'work' ? 'Focusing on:' : 'Break time - try:'}
                </div>
                <div className="task-text">
                  {sessionType === 'work' ? currentTodo.text : getRandomActivity()}
                </div>
              </div>
            </div>
          )}

          <div className="focus-timer">
            <div className="timer-circle">
              <svg className="progress-ring" width="200" height="200">
                <circle
                  className="progress-ring-bg"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="6"
                  fill="transparent"
                  r="94"
                  cx="100"
                  cy="100"
                />
                <circle
                  className="progress-ring-fill"
                  stroke={getSessionColor()}
                  strokeWidth="6"
                  fill="transparent"
                  r="94"
                  cx="100"
                  cy="100"
                  style={{
                    strokeDasharray: 590.8,
                    strokeDashoffset: 590.8 - (590.8 * getProgress()) / 100
                  }}
                />
              </svg>
              <div className="timer-display">
                <div className="time-text">{formatTime(timeLeft)}</div>
                <div className="session-type">
                  {sessionType === 'work' ? 'FOCUS TIME' : 'BREAK TIME'}
                </div>
              </div>
            </div>
          </div>

          <div className="focus-actions">
            {!isRunning ? (
              <button onClick={startTimer} className="focus-action-btn primary">
                <Play size={24} />
                {sessionType === 'work' ? 'Start Focus' : 'Start Break'}
              </button>
            ) : (
              <button onClick={pauseTimer} className="focus-action-btn secondary">
                <Pause size={24} />
                Pause
              </button>
            )}
            
            <button onClick={resetTimer} className="focus-action-btn">
              <RotateCcw size={20} />
              Reset
            </button>
          </div>

          {showBreakSuggestion && (
            <div className="break-suggestion">
              <div className="suggestion-icon">
                <CheckCircle size={20} />
              </div>
              <div className="suggestion-text">
                Great work! Take a 5-minute break and try: <strong>{getRandomActivity()}</strong>
              </div>
            </div>
          )}

          <div className="focus-tips">
            <div className="tip">
              💡 {sessionType === 'work' 
                ? 'Focus on one task at a time' 
                : 'Step away from your workspace'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
