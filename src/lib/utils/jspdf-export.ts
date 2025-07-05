'use client';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { MonthData, CalendarDay } from '@/types/rotation';

interface PDFExportOptions {
  calendar: MonthData[];
  scheduleName: string;
  rotationPattern: string;
  startDate: string;
}

/**
 * Exports the calendar as a PDF using jsPDF + html2canvas
 * This approach is more compatible with React 19 RC
 */
export async function exportCalendarAsJsPDF(options: PDFExportOptions): Promise<void> {
  try {
    console.log('Starting jsPDF export...');
    
    // Create a hidden div with the calendar content for PDF
    const calendarElement = document.createElement('div');
    calendarElement.style.position = 'absolute';
    calendarElement.style.left = '-9999px';
    calendarElement.style.top = '-9999px';
    calendarElement.style.width = '2100px'; // High resolution for print
    calendarElement.style.backgroundColor = 'white';
    calendarElement.style.padding = '40px';
    calendarElement.style.fontFamily = 'Arial, sans-serif';
    
    // Add title and legend to match PNG layout
    calendarElement.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; height: 60px;">
        <h1 style="font-size: 48px; margin: 0; color: #1f2937; font-weight: bold; font-family: var(--font-display), system-ui, sans-serif;">
          Offshore Calendar
        </h1>
        <div style="display: flex; align-items: center; gap: 32px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 24px; height: 24px; background: rgba(249, 115, 22, 0.3); border: 2px solid #f97316; border-radius: 4px;"></div>
            <span style="font-size: 20px; color: #374151; font-weight: normal;">Work</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 24px; height: 24px; background: rgba(34, 197, 94, 0.3); border: 2px solid #22c55e; border-radius: 4px;"></div>
            <span style="font-size: 20px; color: #374151; font-weight: normal;">Off</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 24px; height: 24px; background: rgba(236, 72, 153, 0.3); border: 2px solid #ec4899; border-radius: 4px;"></div>
            <span style="font-size: 20px; color: #374151; font-weight: normal;">Travel</span>
          </div>
        </div>
      </div>
      
      <div id="calendar-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; align-items: start;">
        ${generateCalendarHTML(options.calendar)}
      </div>
    `;
    
    document.body.appendChild(calendarElement);
    
    try {
      // Capture the element as canvas
      console.log('Capturing calendar as canvas...');
      const canvas = await html2canvas(calendarElement, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 2100,
        height: 3500 // Increased height for square month cards
      });
      
      // Create PDF
      console.log('Creating PDF from canvas...');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Download the PDF
      const filename = `offshore-calendar-${options.rotationPattern.replace('/', '-')}-${options.startDate}.pdf`;
      pdf.save(filename);
      
      console.log('PDF download completed successfully');
    } finally {
      // Clean up
      document.body.removeChild(calendarElement);
    }
  } catch (error) {
    console.error('Error generating PDF with jsPDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generateCalendarHTML(calendar: MonthData[]): string {
  return calendar.map(month => {
    // Create a proper calendar grid with empty cells for proper alignment
    const monthGrid = createMonthGrid(month);
    
    return `
      <div style="
        border: 1px solid #d1d5db; 
        border-radius: 8px; 
        padding: 16px; 
        background: white; 
        margin-bottom: 20px;
        aspect-ratio: 1;
        min-height: 280px;
        display: flex;
        flex-direction: column;
      ">
        <h3 style="text-align: center; margin: 0 0 16px 0; font-size: 36px; color: #1f2937; font-weight: bold; flex-shrink: 0;">${month.month} ${month.year}</h3>
        <div style="
          display: grid; 
          grid-template-columns: repeat(7, 1fr); 
          grid-template-rows: repeat(7, 1fr);
          gap: 3px; 
          font-size: 20px;
          flex: 1;
        ">
          ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => 
            `<div style="
              text-align: center; 
              font-weight: bold; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              background: #f8f9fa; 
              color: #374151; 
              border-radius: 6px;
              aspect-ratio: 1;
            ">${day}</div>`
          ).join('')}
          ${monthGrid.map(cell => `
            <div style="
              text-align: center; 
              display: flex;
              align-items: center;
              justify-content: center;
              background: ${cell.isEmpty ? '#ffffff' : getDayColor(cell.day)};
              color: ${getDayTextColor()};
              border-radius: 6px;
              font-weight: bold;
              font-size: 24px;
              border: 1px solid ${cell.isEmpty ? 'transparent' : getDayBorderColor(cell.day)};
              aspect-ratio: 1;
            ">
              ${cell.isEmpty || !cell.day ? '' : new Date(cell.day.date).getDate()}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function createMonthGrid(month: MonthData): Array<{day: CalendarDay | null, isEmpty: boolean}> {
  const grid: Array<{day: CalendarDay | null, isEmpty: boolean}> = [];
  
  // Add empty cells for the start of the month
  const firstDayOffset = month.firstDayOfWeek - 1; // Monday = 1, so offset by 0 for Monday
  for (let i = 0; i < firstDayOffset; i++) {
    grid.push({ day: null, isEmpty: true });
  }
  
  // Add all days of the month
  month.days.forEach(day => {
    grid.push({ day, isEmpty: false });
  });
  
  return grid;
}

function getDayColor(day: CalendarDay | null): string {
  if (!day || !day.isInRotation) {
    return '#f8f9fa'; // Light gray for empty cells or days before rotation starts
  }
  
  if (day.isTransitionDay) {
    return '#ffc1cc'; // Light pink for transition days (like in the image)
  }
  
  if (day.isWorkDay) {
    return '#ffb366'; // Light orange for work days (like in the image)
  }
  
  return '#b3e5b3'; // Light green for off days (like in the image)
}

function getDayTextColor(): string {
  // Use dark text for better readability on light backgrounds
  return '#1f2937';
}

function getDayBorderColor(day: CalendarDay | null): string {
  if (!day || !day.isInRotation) {
    return '#e5e7eb';
  }
  
  if (day.isTransitionDay) {
    return '#f472b6'; // Pink border for transition days
  }
  
  if (day.isWorkDay) {
    return '#fb923c'; // Orange border for work days
  }
  
  return '#4ade80'; // Green border for off days
}