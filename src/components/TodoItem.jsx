import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Edit2, 
  Calendar, 
  Tag, 
  AlertCircle,
  Clock,
  Trash2,
  Target
} from 'lucide-react';
import { format, isAfter, isToday, isTomorrow } from 'date-fns';
import './TodoItem.css';

const TodoItem = ({ 
  todo, 
  onToggle, 
  onEdit, 
  onDelete, 
  onUpdate,
  onFocus
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editCategory, setEditCategory] = useState(todo.category || '');
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, {
        text: editText.trim(),
        category: editCategory,
        priority: editPriority,
        dueDate: editDueDate
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditCategory(todo.category || '');
    setEditPriority(todo.priority || 'medium');
    setEditDueDate(todo.dueDate || '');
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    
    if (isAfter(now, due)) return 'overdue';
    if (isToday(due)) return 'today';
    if (isTomorrow(due)) return 'tomorrow';
    return 'upcoming';
  };

  const dueDateStatus = getDueDateStatus(todo.dueDate);

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <div className="edit-form">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-input"
            autoFocus
          />
          <div className="edit-controls">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="priority-select"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              placeholder="Category"
              className="category-input"
            />
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="due-date-input"
            />
          </div>
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">
              <Check size={16} />
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <button
          className={`checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={() => onToggle(todo.id)}
        >
          {todo.completed && <Check size={16} />}
        </button>
        
        <div className="todo-details">
          <div className="todo-text">{todo.text}</div>
          
          <div className="todo-meta">
            {todo.category && (
              <span className="category">
                <Tag size={12} />
                {todo.category}
              </span>
            )}
            
            {todo.priority && (
              <span 
                className="priority"
                style={{ color: getPriorityColor(todo.priority) }}
              >
                <AlertCircle size={12} />
                {todo.priority}
              </span>
            )}
            
            {todo.dueDate && (
              <span className={`due-date ${dueDateStatus}`}>
                <Calendar size={12} />
                {format(new Date(todo.dueDate), 'MMM dd')}
                {dueDateStatus === 'overdue' && <Clock size={12} />}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="todo-actions">
        <button
          onClick={() => onFocus?.(todo)}
          className="focus-btn"
          title="Focus on this task"
        >
          <Target size={16} />
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="edit-btn"
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="delete-btn"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
