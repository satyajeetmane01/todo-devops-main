import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import './FilterBar.css';

const FilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  filterStatus, 
  onFilterChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  categories,
  onClearFilters
}) => {
  const hasActiveFilters = searchTerm || filterStatus !== 'all' || categoryFilter || priorityFilter;

  return (
    <div className="filter-bar">
      <div className="search-section">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search todos..."
            className="search-input"
          />
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <Filter size={16} />
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="clear-filters-btn"
            title="Clear all filters"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
