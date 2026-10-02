export interface ExportData {
  [key: string]: any;
}

/**
 * Export data as CSV
 */
export const exportToCSV = (data: ExportData[], filename: string = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header];
          // Handle values with commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        })
        .join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  downloadBlob(blob, filename);
};

/**
 * Export data as JSON
 */
export const exportToJSON = (data: ExportData[], filename: string = 'export.json') => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  downloadBlob(blob, filename);
};

/**
 * Export table data as TSV (for Excel import)
 */
export const exportToTSV = (data: ExportData[], filename: string = 'export.tsv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const tsvContent = [
    headers.join('\t'),
    ...data.map(row =>
      headers.map(header => row[header] ?? '').join('\t')
    ),
  ].join('\n');

  const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' });
  downloadBlob(blob, filename);
};

/**
 * Generate and export PDF (requires html2pdf or similar)
 * This is a simplified version - you'll need to install a PDF library
 */
export const exportToPDF = async (
  htmlElement: HTMLElement,
  filename: string = 'export.pdf'
) => {
  try {
    // Check if html2pdf is available, otherwise fallback to simple message
    if ((window as any).html2pdf) {
      const pdf = (window as any).html2pdf();
      pdf
        .set({
          margin: 10,
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
        })
        .from(htmlElement)
        .save();
    } else {
      // Fallback: show message to install pdf library
      console.log(
        'PDF export requires html2pdf library. Install with: npm install html2pdf.js'
      );
      // For now, we'll export as HTML
      const htmlContent = htmlElement.innerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      downloadBlob(blob, filename.replace('.pdf', '.html'));
    }
  } catch (error) {
    console.error('PDF export failed:', error);
  }
};

/**
 * Export chart as image
 */
export const exportChartAsImage = (canvasElement: HTMLCanvasElement, filename: string = 'chart.png') => {
  const link = document.createElement('a');
  link.href = canvasElement.toDataURL('image/png');
  link.download = filename;
  link.click();
};

/**
 * Helper function to trigger download
 */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate mock report as HTML
 */
export const generateHTMLReport = (
  title: string,
  data: ExportData[],
  subtitle?: string
): string => {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
        h2 { color: #666; margin-top: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th { background-color: #1e40af; color: white; padding: 10px; text-align: left; }
        td { border: 1px solid #ddd; padding: 10px; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .timestamp { color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${subtitle ? `<h2>${subtitle}</h2>` : ''}
      <table>
        <thead>
          <tr>
            ${headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${headers.map(h => `<td>${row[h] ?? ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p class="timestamp">Generated on ${new Date().toLocaleString()}</p>
    </body>
    </html>
  `;
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};
