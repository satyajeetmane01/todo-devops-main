import React, { useState, useEffect, useReducer } from 'react';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import StatsPanel from './components/StatsPanel';
import PomodoroTimer from './components/PomodoroTimer';
import FocusMode from './components/FocusMode';
import ProductivityAnalytics from './components/ProductivityAnalytics';
import './App.css';

// Action types
const ACTIONS = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  SET_TODOS: 'SET_TODOS'
};

// Reducer function
const todoReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return [...state, { ...action.payload, id: Date.now().toString() }];
    
    case ACTIONS.TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    
    case ACTIONS.UPDATE_TODO:
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, ...action.payload.updates }
          : todo
      );
    
    case ACTIONS.DELETE_TODO:
      return state.filter(todo => todo.id !== action.payload);
    
    case ACTIONS.SET_TODOS:
      return action.payload;
    
    default:
      return state;
  }
};

function App() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  // Productivity features state
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [currentFocusTodo, setCurrentFocusTodo] = useState(null);
  const [pomodoroData, setPomodoroData] = useState({
    timeLeft: 25 * 60,
    isRunning: false,
    sessionType: 'work',
    isMuted: false
  });

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        dispatch({ type: ACTIONS.SET_TODOS, payload: parsedTodos });
      } catch (error) {
        console.error('Error loading todos from localStorage:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Get unique categories from todos
  const categories = [...new Set(todos
    .map(todo => todo.category)
    .filter(Boolean)
  )];

  // Filter todos based on search and filter criteria
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && !todo.completed) ||
      (filterStatus === 'completed' && todo.completed);
    const matchesCategory = !categoryFilter || todo.category === categoryFilter;
    const matchesPriority = !priorityFilter || todo.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Sort todos by priority and due date
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // First sort by completion status (incomplete first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then by priority (high first)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority] || 0;
    const bPriority = priorityOrder[b.priority] || 0;
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    // Then by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    // Finally by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleAddTodo = (todoData) => {
    dispatch({ type: ACTIONS.ADD_TODO, payload: todoData });
  };

  const handleToggleTodo = (id) => {
    dispatch({ type: ACTIONS.TOGGLE_TODO, payload: id });
  };

  const handleUpdateTodo = (id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_TODO, payload: { id, updates } });
  };

  const handleDeleteTodo = (id) => {
    dispatch({ type: ACTIONS.DELETE_TODO, payload: id });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setCategoryFilter('');
    setPriorityFilter('');
  };

  // Productivity feature handlers
  const handlePomodoroToggle = () => {
    setShowPomodoro(!showPomodoro);
  };

  const handleFocusMode = () => {
    setShowFocusMode(true);
  };

  const handleAnalyticsToggle = () => {
    setShowAnalytics(!showAnalytics);
  };

  const handleSessionComplete = (sessionType) => {
    // Save session data
    const sessionData = {
      type: sessionType,
      timestamp: new Date().toISOString(),
      duration: sessionType === 'work' ? 25 : 5
    };
    
    const existingSessions = JSON.parse(localStorage.getItem('pomodoroSessions') || '[]');
    existingSessions.push(sessionData);
    localStorage.setItem('pomodoroSessions', JSON.stringify(existingSessions));
  };

  const handleTodoFocus = (todo) => {
    setCurrentFocusTodo(todo);
    setShowPomodoro(true);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Todo App</h1>
            <p>Stay organized and get things done</p>
          </div>
          
          <div className="header-actions">
            <button 
              onClick={handlePomodoroToggle}
              className="header-btn pomodoro-btn"
              title="Pomodoro Timer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              🍅
            </button>
            <button 
              onClick={handleAnalyticsToggle}
              className="header-btn analytics-btn"
              title="Productivity Analytics"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              📊
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <StatsPanel todos={todos} />
        
        <AddTodo onAdd={handleAddTodo} />
        
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          categories={categories}
          onClearFilters={handleClearFilters}
        />
        
        <TodoList
          todos={sortedTodos}
          onToggle={handleToggleTodo}
          onEdit={() => {}} // Handled within TodoItem
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
          onFocus={handleTodoFocus}
        />
      </main>

      {/* Productivity Features */}
      <PomodoroTimer
        isVisible={showPomodoro}
        onToggle={handlePomodoroToggle}
        onFocusMode={handleFocusMode}
        currentTodo={currentFocusTodo}
        onSessionComplete={handleSessionComplete}
      />

      <FocusMode
        isActive={showFocusMode}
        onClose={() => setShowFocusMode(false)}
        currentTodo={currentFocusTodo}
        pomodoroData={pomodoroData}
        onSessionComplete={handleSessionComplete}
      />

      <ProductivityAnalytics
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        todos={todos}
        pomodoroData={pomodoroData}
      />
    </div>
  );
}

export default App;