import React, { useState } from 'react';
import { Plus, Calendar, Tag, AlertCircle } from 'lucide-react';
import './AddTodo.css';

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd({
        text: text.trim(),
        category: category.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
        completed: false,
        createdAt: new Date().toISOString()
      });
      setText('');
      setCategory('');
      setPriority('medium');
      setDueDate('');
    }
  };

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <div className="add-todo-main">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
          autoFocus
        />
        <button type="submit" className="add-btn">
          <Plus size={20} />
        </button>
      </div>
      
      <div className="add-todo-options">
        <div className="option-group">
          <Tag size={16} />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="category-input"
          />
        </div>
        
        <div className="option-group">
          <AlertCircle size={16} />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="priority-select"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        
        <div className="option-group">
          <Calendar size={16} />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="due-date-input"
          />
        </div>
      </div>
    </form>
  );
};

export default AddTodo;
