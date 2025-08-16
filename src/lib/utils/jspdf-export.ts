'use client';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { MonthData, CalendarDay } from '@/types/rotation';
import { CALENDAR_COLORS, CALENDAR_TYPOGRAPHY, CALENDAR_LAYOUT } from '@/lib/constants/calendar-colors';

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
        <h1 style="font-size: ${CALENDAR_TYPOGRAPHY.mainTitle}; margin: 0; color: ${CALENDAR_COLORS.monthTitle}; font-weight: ${CALENDAR_TYPOGRAPHY.mainTitleWeight}; font-family: var(--font-display), system-ui, sans-serif;">
          Offshore Calendar
        </h1>
        <div style="display: flex; align-items: center; gap: ${CALENDAR_LAYOUT.legendGap};">
          <div style="display: flex; align-items: center; gap: ${CALENDAR_LAYOUT.legendItemGap};">
            <div style="width: ${CALENDAR_LAYOUT.legendIndicatorSize}; height: ${CALENDAR_LAYOUT.legendIndicatorSize}; background: ${CALENDAR_COLORS.legendWork}; border: 2px solid ${CALENDAR_COLORS.legendWorkBorder}; border-radius: 4px;"></div>
            <span style="font-size: ${CALENDAR_TYPOGRAPHY.legendText}; color: ${CALENDAR_COLORS.legendText}; font-weight: ${CALENDAR_TYPOGRAPHY.legendWeight};">Work</span>
          </div>
          <div style="display: flex; align-items: center; gap: ${CALENDAR_LAYOUT.legendItemGap};">
            <div style="width: ${CALENDAR_LAYOUT.legendIndicatorSize}; height: ${CALENDAR_LAYOUT.legendIndicatorSize}; background: ${CALENDAR_COLORS.legendOff}; border: 2px solid ${CALENDAR_COLORS.legendOffBorder}; border-radius: 4px;"></div>
            <span style="font-size: ${CALENDAR_TYPOGRAPHY.legendText}; color: ${CALENDAR_COLORS.legendText}; font-weight: ${CALENDAR_TYPOGRAPHY.legendWeight};">Off</span>
          </div>
          <div style="display: flex; align-items: center; gap: ${CALENDAR_LAYOUT.legendItemGap};">
            <div style="width: ${CALENDAR_LAYOUT.legendIndicatorSize}; height: ${CALENDAR_LAYOUT.legendIndicatorSize}; background: ${CALENDAR_COLORS.legendTravel}; border: 2px solid ${CALENDAR_COLORS.legendTravelBorder}; border-radius: 4px;"></div>
            <span style="font-size: ${CALENDAR_TYPOGRAPHY.legendText}; color: ${CALENDAR_COLORS.legendText}; font-weight: ${CALENDAR_TYPOGRAPHY.legendWeight};">Travel</span>
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
    console.error('PDF Export Debug Info:', {
      errorType: error?.constructor?.name,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      calendarDataLength: options.calendar?.length || 0,
      browserInfo: navigator.userAgent,
      jsPDFAvailable: typeof jsPDF !== 'undefined',
      html2canvasAvailable: typeof html2canvas !== 'undefined'
    });
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('canvas')) {
        throw new Error('PDF generation failed: Canvas rendering issue. Try using PNG export instead.');
      } else if (error.message.includes('memory')) {
        throw new Error('PDF generation failed: Insufficient memory. Try a smaller calendar or refresh the page.');
      } else {
        throw new Error(`PDF generation failed: ${error.message}`);
      }
    }
    throw new Error('PDF generation failed: Unknown error occurred');
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
        <h3 style="text-align: center; margin: 0 0 16px 0; font-size: ${CALENDAR_TYPOGRAPHY.monthTitle}; color: ${CALENDAR_COLORS.monthTitle}; font-weight: ${CALENDAR_TYPOGRAPHY.monthTitleWeight}; font-family: serif; flex-shrink: 0;">${month.month} ${month.year}</h3>
        <div style="
          display: grid; 
          grid-template-columns: repeat(7, 1fr); 
          grid-template-rows: repeat(7, 1fr);
          gap: ${CALENDAR_LAYOUT.cellGap}; 
          font-size: ${CALENDAR_TYPOGRAPHY.dayHeader};
          flex: 1;
        ">
          ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => 
            `<div style="
              text-align: center; 
              font-weight: ${CALENDAR_TYPOGRAPHY.dayHeaderWeight}; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              background: ${CALENDAR_COLORS.headerBackground}; 
              color: ${CALENDAR_COLORS.headerText}; 
              border-radius: ${CALENDAR_LAYOUT.cellBorderRadius};
              aspect-ratio: 1;
            ">${day}</div>`
          ).join('')}
          ${monthGrid.map(cell => `
            <div style="
              text-align: center; 
              display: flex;
              align-items: center;
              justify-content: center;
              background: ${cell.isEmpty ? CALENDAR_COLORS.calendarBackground : getDayColor(cell.day)};
              color: ${CALENDAR_COLORS.dayText};
              border-radius: ${CALENDAR_LAYOUT.cellBorderRadius};
              font-weight: ${CALENDAR_TYPOGRAPHY.dayNumberWeight};
              font-size: ${CALENDAR_TYPOGRAPHY.dayNumber};
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
    return CALENDAR_COLORS.nonRotationDay;
  }
  
  if (day.isTransitionDay) {
    return CALENDAR_COLORS.travelDay;
  }
  
  if (day.isWorkDay) {
    return CALENDAR_COLORS.workDay;
  }
  
  return CALENDAR_COLORS.offDay;
}

// Removed getDayTextColor function as we now use CALENDAR_COLORS.dayText directly

function getDayBorderColor(day: CalendarDay | null): string {
  if (!day || !day.isInRotation) {
    return CALENDAR_COLORS.nonRotationDayBorder;
  }
  
  if (day.isTransitionDay) {
    return CALENDAR_COLORS.travelDayBorder;
  }
  
  if (day.isWorkDay) {
    return CALENDAR_COLORS.workDayBorder;
  }
  
  return CALENDAR_COLORS.offDayBorder;
}