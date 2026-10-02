/**
 * Database/API Service Layer
 * Abstract layer for all data operations
 * Can be swapped with real API calls or database operations
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Base API service class
 */
export class ApiService {
  private baseUrl: string;
  private timeout: number = 5000;

  constructor(baseUrl: string = import.meta.env.VITE_API_URL ||
    'http://localhost:8001') {
    this.baseUrl = baseUrl;
  }

  protected async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    path: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const token =
  localStorage.getItem(
    "access_token"
  );

const config: RequestInit = {
  method,

  headers: {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),

    ...options?.headers,
  },

  ...options,
};

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  protected async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  protected async post<T>(path: string, data: any, options?: RequestInit): Promise<T> {
    return this.request<T>('POST', path, data, options);
  }

  protected async put<T>(path: string, data: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PUT', path, data, options);
  }

  protected async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }
}

/**
 * Cost Data Service
 */
export interface CostData {
  id: string;
  date: string;
  category: string;
  service: string;
  cost: number;
  currency: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface CostFilter {
  startDate?: string;
  endDate?: string;
  category?: string;
  service?: string;
  minCost?: number;
  maxCost?: number;
}

export class CostDataService extends ApiService {
  async getCosts(filter?: CostFilter): Promise<ApiResponse<CostData[]>> {
    try {
      // Mock implementation - replace with actual API call
      const costs: CostData[] = [
        {
          id: '1',
          date: '2024-01-15',
          category: 'Compute',
          service: 'EC2',
          cost: 1250,
          currency: 'USD',
          trend: 'up',
        },
        {
          id: '2',
          date: '2024-01-15',
          category: 'Storage',
          service: 'S3',
          cost: 850,
          currency: 'USD',
          trend: 'down',
        },
      ];

      return {
        success: true,
        data: costs,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch costs',
      };
    }
  }

  async getCostById(id: string): Promise<ApiResponse<CostData>> {
    try {
      // Mock implementation
      const cost: CostData = {
        id,
        date: '2024-01-15',
        category: 'Compute',
        service: 'EC2',
        cost: 1250,
        currency: 'USD',
        trend: 'up',
      };

      return {
        success: true,
        data: cost,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch cost',
      };
    }
  }

  async createCost(data: Omit<CostData, 'id'>): Promise<ApiResponse<CostData>> {
    try {
      const newCost: CostData = {
        ...data,
        id: Date.now().toString(),
      };

      return {
        success: true,
        data: newCost,
        message: 'Cost created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create cost',
      };
    }
  }

  async updateCost(id: string, data: Partial<CostData>): Promise<ApiResponse<CostData>> {
    try {
      const updated: CostData = {
        id,
        date: data.date || '2024-01-15',
        category: data.category || 'Compute',
        service: data.service || 'EC2',
        cost: data.cost || 1250,
        currency: data.currency || 'USD',
        trend: data.trend || 'up',
      };

      return {
        success: true,
        data: updated,
        message: 'Cost updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update cost',
      };
    }
  }

  async deleteCost(id: string): Promise<ApiResponse<void>> {
    try {
      return {
        success: true,
        message: 'Cost deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete cost',
      };
    }
  }
}

/**
 * Budget Service
 */
export interface Budget {
  id: string;
  name: string;
  limit: number;
  spent: number;
  currency: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  status: 'on_track' | 'warning' | 'exceeded';
  owner: string;
}

export class BudgetService extends ApiService {
  async getBudgets(): Promise<ApiResponse<Budget[]>> {
    try {
      const budgets: Budget[] = [
        {
          id: '1',
          name: 'Development',
          limit: 5000,
          spent: 3500,
          currency: 'USD',
          period: 'monthly',
          status: 'on_track',
          owner: 'engineering',
        },
        {
          id: '2',
          name: 'Production',
          limit: 10000,
          spent: 9500,
          currency: 'USD',
          period: 'monthly',
          status: 'warning',
          owner: 'operations',
        },
      ];

      return {
        success: true,
        data: budgets,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch budgets',
      };
    }
  }

  async createBudget(data: Omit<Budget, 'id'>): Promise<ApiResponse<Budget>> {
    try {
      const newBudget: Budget = {
        ...data,
        id: Date.now().toString(),
      };

      return {
        success: true,
        data: newBudget,
        message: 'Budget created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create budget',
      };
    }
  }

  async updateBudget(id: string, data: Partial<Budget>): Promise<ApiResponse<Budget>> {
    try {
      const updated: Budget = {
        id,
        name: data.name || 'Budget',
        limit: data.limit || 5000,
        spent: data.spent || 0,
        currency: data.currency || 'USD',
        period: data.period || 'monthly',
        status: data.status || 'on_track',
        owner: data.owner || 'admin',
      };

      return {
        success: true,
        data: updated,
        message: 'Budget updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update budget',
      };
    }
  }

  async deleteBudget(id: string): Promise<ApiResponse<void>> {
    try {
      return {
        success: true,
        message: 'Budget deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete budget',
      };
    }
  }
}

/**
 * Analytics Service
 */
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: string;
}

export class AnalyticsService extends ApiService {
  async trackEvent(event: string, properties?: Record<string, any>): Promise<void> {
    try {
      // In production, send to analytics service
      console.log('Event tracked:', { event, properties });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  async getMetrics(timeRange: string): Promise<ApiResponse<any>> {
    try {
      return {
        success: true,
        data: {
          totalEvents: 15234,
          uniqueUsers: 1234,
          timeRange,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch metrics',
      };
    }
  }
}

// Singleton instances
export const costDataService = new CostDataService();
export const budgetService = new BudgetService();
export const analyticsService = new AnalyticsService();
