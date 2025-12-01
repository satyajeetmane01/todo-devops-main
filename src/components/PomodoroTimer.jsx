import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Maximize2,
  Minimize2,
  Target,
  Coffee,
  CheckCircle
} from 'lucide-react';
import './PomodoroTimer.css';

const PomodoroTimer = ({ 
  isVisible, 
  onToggle, 
  onFocusMode, 
  currentTodo,
  onSessionComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [sessionCount, setSessionCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionGoal, setSessionGoal] = useState(4);
  const [completedToday, setCompletedToday] = useState(0);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('pomodoroData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setSessionCount(data.sessionCount || 0);
      setCompletedToday(data.completedToday || 0);
      setIsMuted(data.isMuted || false);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const data = {
      sessionCount,
      completedToday,
      isMuted
    };
    localStorage.setItem('pomodoroData', JSON.stringify(data));
  }, [sessionCount, completedToday, isMuted]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0) {
      handleSessionComplete();
    }
  }, [timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    // Play notification sound
    if (!isMuted && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }

    // Show browser notification
    if (Notification.permission === 'granted') {
      const message = sessionType === 'work' 
        ? 'Work session complete! Time for a break.' 
        : 'Break time over! Ready to focus?';
      new Notification('Pomodoro Timer', { body: message, icon: '/favicon.ico' });
    }

    if (sessionType === 'work') {
      setSessionCount(prev => prev + 1);
      setCompletedToday(prev => prev + 1);
      onSessionComplete?.(sessionType);
      
      // Start break
      if (sessionCount + 1 >= 4) {
        setSessionType('longBreak');
        setTimeLeft(15 * 60); // 15 minute long break
        setSessionCount(0);
      } else {
        setSessionType('shortBreak');
        setTimeLeft(5 * 60); // 5 minute short break
      }
    } else {
      // Break is over, start work session
      setSessionType('work');
      setTimeLeft(25 * 60);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (sessionType === 'work') {
      setTimeLeft(25 * 60);
    } else if (sessionType === 'shortBreak') {
      setTimeLeft(5 * 60);
    } else {
      setTimeLeft(15 * 60);
    }
  };

  const skipSession = () => {
    handleSessionComplete();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const requestNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = sessionType === 'work' ? 25 * 60 : 
                     sessionType === 'shortBreak' ? 5 * 60 : 15 * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getSessionIcon = () => {
    switch (sessionType) {
      case 'work': return <Target size={20} />;
      case 'shortBreak': return <Coffee size={20} />;
      case 'longBreak': return <Coffee size={20} />;
      default: return <Target size={20} />;
    }
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case 'work': return '#ef4444';
      case 'shortBreak': return '#10b981';
      case 'longBreak': return '#3b82f6';
      default: return '#ef4444';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`pomodoro-timer ${isMinimized ? 'minimized' : ''}`}>
      <audio ref={audioRef} preload="auto">
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>
      
      <div className="timer-header">
        <div className="timer-title">
          {getSessionIcon()}
          <span className="session-type">
            {sessionType === 'work' ? 'Focus Time' : 
             sessionType === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </span>
        </div>
        
        <div className="timer-controls">
          <button 
            onClick={toggleMute} 
            className="control-btn"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            className="control-btn"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button 
            onClick={onToggle} 
            className="control-btn close-btn"
            title="Close Timer"
          >
            ×
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="timer-display">
            <div className="circular-progress">
              <svg className="progress-ring" width="120" height="120">
                <circle
                  className="progress-ring-circle"
                  stroke={getSessionColor()}
                  strokeWidth="4"
                  fill="transparent"
                  r="56"
                  cx="60"
                  cy="60"
                  style={{
                    strokeDasharray: 351.86,
                    strokeDashoffset: 351.86 - (351.86 * getProgress()) / 100
                  }}
                />
              </svg>
              <div className="time-text">{formatTime(timeLeft)}</div>
            </div>
          </div>

          <div className="timer-actions">
            {!isRunning ? (
              <button onClick={startTimer} className="action-btn primary">
                <Play size={18} />
                Start
              </button>
            ) : (
              <button onClick={pauseTimer} className="action-btn secondary">
                <Pause size={18} />
                Pause
              </button>
            )}
            
            <button onClick={resetTimer} className="action-btn">
              <RotateCcw size={18} />
              Reset
            </button>
            
            <button onClick={skipSession} className="action-btn">
              <Square size={18} />
              Skip
            </button>
          </div>

          {currentTodo && (
            <div className="current-task">
              <div className="task-label">Current Task:</div>
              <div className="task-text">{currentTodo.text}</div>
            </div>
          )}

          <div className="session-stats">
            <div className="stat">
              <CheckCircle size={16} />
              <span>Today: {completedToday}</span>
            </div>
            <div className="stat">
              <Target size={16} />
              <span>Goal: {sessionGoal}</span>
            </div>
          </div>

          <div className="focus-mode-btn">
            <button onClick={onFocusMode} className="focus-btn">
              <Maximize2 size={18} />
              Enter Focus Mode
            </button>
          </div>
        </>
      )}

      {isMinimized && (
        <div className="minimized-display">
          <div className="minimized-time">{formatTime(timeLeft)}</div>
          <div className="minimized-type">{sessionType}</div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
