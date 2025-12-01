import React from 'react';
import { CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';
import './StatsPanel.css';

const StatsPanel = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const active = total - completed;
  const overdue = todos.filter(todo => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  }).length;
  const highPriority = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-panel">
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon total">
            <Circle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{total}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon active">
            <Circle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{active}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon completed">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon overdue">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon high-priority">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{highPriority}</div>
            <div className="stat-label">High Priority</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon completion">
            <div className="completion-circle">
              <div className="completion-text">{completionRate}%</div>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-number">{completionRate}%</div>
            <div className="stat-label">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
