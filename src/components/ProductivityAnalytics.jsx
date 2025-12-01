import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Zap,
  Coffee,
  CheckCircle,
  Award,
  Activity
} from 'lucide-react';
import './ProductivityAnalytics.css';

const ProductivityAnalytics = ({ isVisible, onClose, todos, pomodoroData }) => {
  const [analytics, setAnalytics] = useState({
    totalFocusTime: 0,
    sessionsCompleted: 0,
    averageSessionLength: 0,
    mostProductiveHour: 0,
    weeklyStreak: 0,
    tasksCompleted: 0,
    focusEfficiency: 0,
    breakTime: 0
  });

  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month'
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (isVisible) {
      calculateAnalytics();
      generateChartData();
    }
  }, [isVisible, todos, pomodoroData, timeRange]);

  const calculateAnalytics = () => {
    const today = new Date();
    const startDate = getStartDate(timeRange);
    
    // Calculate focus time and sessions
    const sessions = getSessionsInRange(startDate, today);
    const totalFocusTime = sessions.reduce((total, session) => {
      return total + (session.type === 'work' ? 25 : 0);
    }, 0);
    
    const sessionsCompleted = sessions.filter(s => s.type === 'work').length;
    const averageSessionLength = sessionsCompleted > 0 ? totalFocusTime / sessionsCompleted : 0;
    
    // Calculate most productive hour
    const hourlyData = getHourlyProductivity(sessions);
    const mostProductiveHour = Object.keys(hourlyData).reduce((a, b) => 
      hourlyData[a] > hourlyData[b] ? a : b, 0
    );
    
    // Calculate tasks completed
    const tasksCompleted = todos.filter(todo => 
      todo.completed && new Date(todo.completedAt || todo.createdAt) >= startDate
    ).length;
    
    // Calculate focus efficiency (tasks completed per focus session)
    const focusEfficiency = sessionsCompleted > 0 ? (tasksCompleted / sessionsCompleted) * 100 : 0;
    
    // Calculate break time
    const breakTime = sessions.reduce((total, session) => {
      return total + (session.type === 'break' ? 5 : 0);
    }, 0);
    
    setAnalytics({
      totalFocusTime,
      sessionsCompleted,
      averageSessionLength,
      mostProductiveHour,
      weeklyStreak: calculateStreak(),
      tasksCompleted,
      focusEfficiency,
      breakTime
    });
  };

  const generateChartData = () => {
    const days = timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : 30;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const daySessions = getSessionsForDate(date);
      const focusTime = daySessions.filter(s => s.type === 'work').length * 25;
      const tasksCompleted = todos.filter(todo => 
        todo.completed && 
        new Date(todo.completedAt || todo.createdAt).toDateString() === date.toDateString()
      ).length;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        focusTime,
        tasksCompleted,
        sessions: daySessions.length
      });
    }
    
    setChartData(data);
  };

  const getStartDate = (range) => {
    const today = new Date();
    switch (range) {
      case 'day': return new Date(today.getFullYear(), today.getMonth(), today.getDate());
      case 'week': return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month': return new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      default: return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  };

  const getSessionsInRange = (startDate, endDate) => {
    // This would typically come from localStorage or a database
    // For now, we'll simulate some data
    return JSON.parse(localStorage.getItem('pomodoroSessions') || '[]')
      .filter(session => {
        const sessionDate = new Date(session.timestamp);
        return sessionDate >= startDate && sessionDate <= endDate;
      });
  };

  const getSessionsForDate = (date) => {
    return getSessionsInRange(date, new Date(date.getTime() + 24 * 60 * 60 * 1000));
  };

  const getHourlyProductivity = (sessions) => {
    const hourlyData = {};
    sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours();
      hourlyData[hour] = (hourlyData[hour] || 0) + 1;
    });
    return hourlyData;
  };

  const calculateStreak = () => {
    // Calculate consecutive days with at least one focus session
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const daySessions = getSessionsForDate(date);
      const hasFocusSession = daySessions.some(s => s.type === 'work');
      
      if (hasFocusSession) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 80) return '#10b981';
    if (efficiency >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (!isVisible) return null;

  return (
    <div className="analytics-overlay">
      <div className="analytics-container">
        <div className="analytics-header">
          <div className="analytics-title">
            <BarChart3 size={24} />
            <h2>Productivity Analytics</h2>
          </div>
          
          <div className="analytics-controls">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            <button onClick={onClose} className="close-btn">
              ×
            </button>
          </div>
        </div>

        <div className="analytics-content">
          <div className="analytics-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{formatTime(analytics.totalFocusTime)}</div>
                <div className="stat-label">Total Focus Time</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Target size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{analytics.sessionsCompleted}</div>
                <div className="stat-label">Sessions Completed</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{formatTime(analytics.averageSessionLength)}</div>
                <div className="stat-label">Avg Session Length</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Activity size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{analytics.mostProductiveHour}:00</div>
                <div className="stat-label">Most Productive Hour</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Award size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{analytics.weeklyStreak}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{analytics.tasksCompleted}</div>
                <div className="stat-label">Tasks Completed</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Zap size={24} />
              </div>
              <div className="stat-content">
                <div 
                  className="stat-value"
                  style={{ color: getEfficiencyColor(analytics.focusEfficiency) }}
                >
                  {analytics.focusEfficiency.toFixed(1)}%
                </div>
                <div className="stat-label">Focus Efficiency</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Coffee size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{formatTime(analytics.breakTime)}</div>
                <div className="stat-label">Break Time</div>
              </div>
            </div>
          </div>

          <div className="chart-section">
            <h3>Daily Progress</h3>
            <div className="chart-container">
              <div className="chart-bars">
                {chartData.map((day, index) => (
                  <div key={index} className="chart-day">
                    <div className="bar-container">
                      <div 
                        className="focus-bar"
                        style={{ 
                          height: `${Math.max(day.focusTime / 2, 4)}px`,
                          backgroundColor: '#ef4444'
                        }}
                      />
                      <div 
                        className="task-bar"
                        style={{ 
                          height: `${Math.max(day.tasksCompleted * 8, 4)}px`,
                          backgroundColor: '#10b981'
                        }}
                      />
                    </div>
                    <div className="day-label">{day.date}</div>
                    <div className="day-stats">
                      <div className="day-focus">{day.focusTime}m</div>
                      <div className="day-tasks">{day.tasksCompleted} tasks</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color focus"></div>
                  <span>Focus Time</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color task"></div>
                  <span>Tasks Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityAnalytics;

