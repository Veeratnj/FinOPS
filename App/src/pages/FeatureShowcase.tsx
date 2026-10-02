import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotificationActions } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import {
  TrendLineChart,
  MultiLineChart,
  ScatterPlotChart,
  FilledAreaChart,
} from '@/components/charts/AdvancedCharts';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { DataTable } from '@/components/DataTableComponent';
import { exportToCSV, exportToJSON } from '@/utils/exportUtils';
import { Code, Zap } from 'lucide-react';

// Sample data for charts
const trendData = [
  { date: 'Jan', cost: 4000, projected: 4200 },
  { date: 'Feb', cost: 3000, projected: 3800 },
  { date: 'Mar', cost: 2000, projected: 2800 },
  { date: 'Apr', cost: 2780, projected: 2900 },
  { date: 'May', cost: 1890, projected: 1900 },
  { date: 'Jun', cost: 2390, projected: 2500 },
];

const multiLineData = [
  { month: 'Jan', EC2: 2400, S3: 1200, RDS: 900 },
  { month: 'Feb', EC2: 1398, S3: 1221, RDS: 850 },
  { month: 'Mar', EC2: 9800, S3: 2290, RDS: 1200 },
  { month: 'Apr', EC2: 3908, S3: 2000, RDS: 2210 },
  { month: 'May', EC2: 4800, S3: 2181, RDS: 2290 },
  { month: 'Jun', EC2: 3800, S3: 2500, RDS: 2000 },
];

const scatterData = [
  { x: 100, y: 200, name: 'Instance A' },
  { x: 120, y: 100, name: 'Instance B' },
  { x: 170, y: 430, name: 'Instance C' },
  { x: 140, y: 250, name: 'Instance D' },
  { x: 150, y: 160, name: 'Instance E' },
];

const costTableData = [
  {
    id: '1',
    service: 'EC2',
    category: 'Compute',
    cost: 2500,
    status: 'optimal',
    trend: '↑ 5%',
  },
  {
    id: '2',
    service: 'S3',
    category: 'Storage',
    cost: 1200,
    status: 'warning',
    trend: '↑ 12%',
  },
  {
    id: '3',
    service: 'RDS',
    category: 'Database',
    cost: 800,
    status: 'optimal',
    trend: '↓ 3%',
  },
  {
    id: '4',
    service: 'Lambda',
    category: 'Compute',
    cost: 450,
    status: 'optimal',
    trend: '↓ 8%',
  },
];

export const FeatureShowcasePage: React.FC = () => {
  const { user } = useAuth();
  const { success, error, warning, info } = useNotificationActions();
  const [searchQuery, setSearchQuery] = useState('');

  const handleNotificationDemo = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: { title: '✓ Success', message: 'Operation completed successfully!' },
      error: { title: '✗ Error', message: 'Something went wrong. Please try again.' },
      warning: { title: '⚠ Warning', message: 'Please be cautious with this action.' },
      info: { title: 'ℹ Info', message: 'This is an informational notification.' },
    };

    const msg = messages[type];
    if (type === 'success') success(msg.title, msg.message);
    else if (type === 'error') error(msg.title, msg.message);
    else if (type === 'warning') warning(msg.title, msg.message);
    else info(msg.title, msg.message);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Enhanced Features Showcase</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, <span className="font-semibold">{user?.name}</span>! 👋
        </p>
        <p className="text-sm text-gray-500">
          Explore all the new features added to your FinOps dashboard
        </p>
      </div>

      {/* Feature Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">🔐 Authentication</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Secure login/signup system with role-based access control and persistent sessions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">🌓 Dark Mode</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              System-aware dark mode toggle with persistent preferences across all pages.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">📊 Advanced Charts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              New chart types: Trend, Waterfall, Scatter Plot, Multi-line, and more.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">📥 Data Export</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Export data as CSV, JSON, TSV, or HTML reports with one click.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">🔔 Notifications</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Real-time toast notifications with different types and automatic dismissal.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">🔍 Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Advanced search with multiple filter types and custom search hooks.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for interactive demos */}
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications Demo</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="search">Search & Filter</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
        </TabsList>

        {/* Notifications Demo */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification System Demo</CardTitle>
              <CardDescription>
                Click buttons below to see different notification types in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={() => handleNotificationDemo('success')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Success
                </Button>
                <Button
                  onClick={() => handleNotificationDemo('error')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Error
                </Button>
                <Button
                  onClick={() => handleNotificationDemo('warning')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Warning
                </Button>
                <Button
                  onClick={() => handleNotificationDemo('info')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Info
                </Button>
              </div>

              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  {`import { useNotificationActions } from '@/context/NotificationContext';\n\nconst { success, error, warning, info } = useNotificationActions();\nsuccess('Operation completed', 'Your action was successful');`}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charts Demo */}
        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendLineChart
              data={trendData}
              title="Cost Trends"
              description="Actual vs Projected costs over time"
              xAxisKey="date"
              yAxisKey="cost"
              height={300}
            />

            <MultiLineChart
              data={multiLineData}
              title="Multi-Service Costs"
              description="Cost breakdown by service"
              xAxisKey="month"
              lines={[
                { key: 'EC2', name: 'EC2', color: '#3b82f6' },
                { key: 'S3', name: 'S3', color: '#10b981' },
                { key: 'RDS', name: 'RDS', color: '#f59e0b' },
              ]}
              height={300}
            />

            <FilledAreaChart
              data={trendData}
              title="Cost Distribution"
              description="Area chart with gradient fill"
              xAxisKey="date"
              yAxisKey="cost"
              fillColor="#8b5cf6"
              height={300}
            />

            <ScatterPlotChart
              data={scatterData}
              title="Instance Correlation"
              description="Cost vs Performance scatter plot"
              xAxisKey="data"
              xKey="x"
              yKey="y"
              height={300}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chart Usage Example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-xs overflow-auto">
                {`import { TrendLineChart } from '@/components/charts/AdvancedCharts';

<TrendLineChart
  data={costData}
  title="Cost Trends"
  xAxisKey="date"
  yAxisKey="cost"
  strokeColor="#3b82f6"
  height={350}
/>`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search & Filter Demo */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Search & Filter Demo</CardTitle>
              <CardDescription>
                Try searching and filtering the data below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdvancedSearch
                onSearch={(query, filters) => {
                  console.log('Search Query:', query);
                  console.log('Filters:', filters);
                }}
                filters={[
                  {
                    id: 'category',
                    label: 'Category',
                    type: 'select',
                    value: '',
                    options: [
                      { label: 'Compute', value: 'Compute' },
                      { label: 'Storage', value: 'Storage' },
                      { label: 'Database', value: 'Database' },
                    ],
                  },
                  {
                    id: 'minCost',
                    label: 'Min Cost',
                    type: 'number',
                    value: '',
                  },
                ]}
                placeholder="Search services..."
              />

              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {`import { AdvancedSearch } from '@/components/AdvancedSearch';\n\n<AdvancedSearch\n  onSearch={(query, filters) => handleSearch(query, filters)}\n  filters={searchFilters}\n  placeholder="Search..."\n/>`}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Table Demo */}
        <TabsContent value="table" className="space-y-4">
          <DataTable
            columns={[
              { key: 'service', label: 'Service', sortable: true, width: '120px' },
              { key: 'category', label: 'Category', sortable: true, width: '120px' },
              {
                key: 'cost',
                label: 'Monthly Cost',
                sortable: true,
                render: (value) => `$${value.toLocaleString()}`,
                align: 'right',
              },
              {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (value) => (
                  <Badge
                    variant={value === 'optimal' ? 'default' : 'secondary'}
                    className={
                      value === 'optimal'
                        ? 'bg-green-600'
                        : 'bg-yellow-600'
                    }
                  >
                    {value}
                  </Badge>
                ),
              },
              { key: 'trend', label: 'Trend', sortable: false },
            ]}
            data={costTableData}
            title="Service Costs"
            description="Monthly costs by service with export capabilities"
            exportable
            paginated
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">DataTable Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2">
                <Badge>✓ Sortable Columns</Badge>
                <Badge>✓ Pagination</Badge>
                <Badge>✓ CSV Export</Badge>
                <Badge>✓ JSON Export</Badge>
                <Badge>✓ Custom Rendering</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Code Examples Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Quick Integration Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm">Authentication</h4>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-auto">
{`const { user, login, logout } = 
  useAuth();

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Export Data</h4>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-auto">
{`import { 
  exportToCSV, 
  exportToJSON 
} from '@/utils/exportUtils';

exportToCSV(data, 'file.csv');
exportToJSON(data, 'file.json');`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Theme Toggle</h4>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-auto">
{`import { useTheme } from 
  '@/context/ThemeContext';

const { isDark, setTheme } = useTheme();

setTheme('dark');`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Notifications</h4>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-auto">
{`const { success, error } = 
  useNotificationActions();

success('Success!', 'Done');
error('Error!', 'Try again');`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Zap className="h-5 w-5" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p>✓ <strong>Explore the features:</strong> Check out each tab above to see live demos</p>
          <p>✓ <strong>Read the guide:</strong> Open NEW_FEATURES_GUIDE.md for detailed documentation</p>
          <p>✓ <strong>Integrate with backend:</strong> Update apiService.ts with your API endpoints</p>
          <p>✓ <strong>Customize styling:</strong> Modify colors and themes to match your brand</p>
          <p>✓ <strong>Visit profile:</strong> Click your avatar in the header to update your profile</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureShowcasePage;
