import React from 'react';
import TodoItem from './TodoItem';
import './TodoList.css';

const TodoList = ({ 
  todos, 
  onToggle, 
  onEdit, 
  onDelete, 
  onUpdate 
}) => {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No todos yet</h3>
        <p>Add a new todo to get started!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TodoList;
