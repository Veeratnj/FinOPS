import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Filter } from 'lucide-react';

export interface SearchFilter {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: { label: string; value: string }[];
}

export interface AdvancedSearchProps {
  onSearch: (query: string, filters: Record<string, any>) => void;
  filters?: SearchFilter[];
  placeholder?: string;
  showFilters?: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  filters = [],
  placeholder = 'Search...',
  showFilters = true,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = useCallback(() => {
    onSearch(query, activeFilters);
  }, [query, activeFilters, onSearch]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const addFilter = (filterId: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => {
      const { [filterId]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearAll = () => {
    setQuery('');
    setActiveFilters({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} className="gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
        {showFilters && filters.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {Object.entries(activeFilters).map(([filterId, value]) => {
            const filter = filters.find(f => f.id === filterId);
            return (
              <Badge key={filterId} variant="secondary" className="gap-2">
                {filter?.label}: {value}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => removeFilter(filterId)}
                />
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvanced && filters.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Advanced Filters</CardTitle>
            <CardDescription>Add filters to refine your search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filters.map(filter => (
                <div key={filter.id} className="space-y-2">
                  <label className="text-sm font-medium">{filter.label}</label>
                  {filter.type === 'select' && filter.options ? (
                    <select
                      value={activeFilters[filter.id] || ''}
                      onChange={(e) => addFilter(filter.id, e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="">All {filter.label}</option>
                      {filter.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={filter.type}
                      value={activeFilters[filter.id] || ''}
                      onChange={(e) => addFilter(filter.id, e.target.value)}
                      placeholder={`Enter ${filter.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSearch} size="sm">
                Apply Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(false)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/**
 * Custom hook for search functionality
 */
export const useSearch = <T extends any>(data: T[], searchFields: (keyof T)[]) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filtered = data.filter(item => {
    // Text search
    if (query) {
      const queryLower = query.toLowerCase();
      const matchesQuery = searchFields.some(field => {
        const value = item[field];
        return String(value).toLowerCase().includes(queryLower);
      });
      if (!matchesQuery) return false;
    }

    // Filters
    for (const [key, value] of Object.entries(filters)) {
      if (value && item[key as keyof T] !== value) {
        return false;
      }
    }

    return true;
  });

  return {
    query,
    setQuery,
    filters,
    setFilters,
    filtered,
  };
};
