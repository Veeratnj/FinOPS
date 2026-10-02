import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { exportToCSV, exportToJSON } from '@/utils/exportUtils';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  description?: string;
  searchable?: boolean;
  sortable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  exportable?: boolean;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => React.ReactNode;
}

type SortOrder = 'asc' | 'desc' | null;

export function DataTable<T extends { [key: string]: any }>({
  columns,
  data,
  title,
  description,
  sortable = true,
  paginated = true,
  pageSize = 10,
  exportable = true,
  onRowClick,
  rowActions,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortOrder) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const displayData = paginated
    ? sortedData.slice(startIndex, startIndex + pageSize)
    : sortedData;

  const handleSort = (key: keyof T) => {
    if (!sortable || !columns.find(col => col.key === key)?.sortable) return;

    if (sortColumn === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? null : 'asc');
      if (sortOrder === 'desc') setSortColumn(null);
    } else {
      setSortColumn(key);
      setSortOrder('asc');
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      exportToCSV(sortedData, `${title?.replace(/\s+/g, '_') || 'export'}.csv`);
    } else {
      exportToJSON(sortedData, `${title?.replace(/\s+/g, '_') || 'export'}.json`);
    }
  };

  const getSortIcon = (key: keyof T) => {
    if (sortColumn !== key) return <ArrowUpDown className="h-4 w-4" />;
    if (sortOrder === 'asc') return <ChevronUp className="h-4 w-4" />;
    return <ChevronDown className="h-4 w-4" />;
  };

  return (
    <Card>
      {title && (
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {exportable && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('json')}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                JSON
              </Button>
            </div>
          )}
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900">
                {columns.map(column => (
                  <TableHead
                    key={String(column.key)}
                    className="font-semibold"
                    style={{ width: column.width }}
                    align={column.align}
                  >
                    <button
                      onClick={() => handleSort(column.key)}
                      className={`flex items-center gap-2 ${
                        column.sortable
                          ? 'cursor-pointer hover:text-primary'
                          : 'cursor-default'
                      }`}
                      disabled={!column.sortable}
                    >
                      {column.label}
                      {column.sortable && getSortIcon(column.key)}
                    </button>
                  </TableHead>
                ))}
                {rowActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (rowActions ? 1 : 0)}
                    className="text-center py-8 text-gray-500"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((row, index) => (
                  <TableRow
                    key={index}
                    onClick={() => onRowClick?.(row)}
                    className={onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900' : ''}
                  >
                    {columns.map(column => (
                      <TableCell
                        key={String(column.key)}
                        align={column.align}
                        className="py-3"
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : typeof row[column.key] === 'boolean'
                          ? row[column.key]
                            ? '✓'
                            : '✗'
                          : row[column.key]}
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell className="py-3">
                        {rowActions(row)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {paginated && totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of{' '}
              {sortedData.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
