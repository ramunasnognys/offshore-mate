// src/lib/utils/download.ts
import html2canvas from 'html2canvas';

export async function downloadCalendarAsImage(elementId: string, filename: string): Promise<void> {
  try {
    console.log('Starting PNG export with elementId:', elementId, 'filename:', filename);
    
    const element = document.getElementById('download-calendar');
    if (!element) {
      console.error('Element not found. Available elements with "calendar" in ID:', 
        Array.from(document.querySelectorAll('[id*="calendar"]')).map(el => el.id));
      throw new Error('Download calendar element not found');
    }
    
    // Check element dimensions and visibility
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    console.log('Element debug info:', {
      dimensions: { width: rect.width, height: rect.height },
      position: { top: rect.top, left: rect.left },
      style: {
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity,
        position: computedStyle.position
      },
      offsetDimensions: { width: element.offsetWidth, height: element.offsetHeight }
    });

    // Make the element visible temporarily
    const originalDisplay = element.style.display;
    element.style.display = 'block';

    // Configure html2canvas options
    const canvas = await html2canvas(element, {
      scale: 2, // Increase quality
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 2100,
      height: 2970,
      windowWidth: 2100,
      windowHeight: 2970,
    });

    // Hide the element again
    element.style.display = originalDisplay;

    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob);
      }, 'image/png', 1.0);
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    
    console.log('Triggering download for:', filename);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('PNG download completed successfully for:', filename);
    
    // Show user feedback (optional - you might want to show a toast notification)
    if (typeof window !== 'undefined' && 'showNotification' in window) {
      (window as unknown as { showNotification?: (message: string) => void }).showNotification?.(`Calendar downloaded as ${filename}`);
    }
  } catch (error) {
    console.error('Error downloading calendar:', error);
    
    if (error instanceof Error) {
      // Canvas-related errors
      if (error.message.includes('canvas') || error.message.includes('Canvas')) {
        throw new Error('Failed to generate calendar image. Your browser may not support image generation.');
      }
      
      // Memory errors
      if (error.message.includes('memory')) {
        throw new Error('Image generation failed due to memory constraints. Please try a smaller calendar or use a desktop browser.');
      }
    }
    
    throw new Error('Failed to download calendar image. Please refresh the page and try again.');
  }
}