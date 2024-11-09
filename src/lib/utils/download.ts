// src/lib/utils/download.ts
import html2canvas from 'html2canvas';

export async function downloadCalendarAsImage(elementId: string, filename: string): Promise<void> {
  try {
    const element = document.getElementById('download-calendar');
    if (!element) {
      throw new Error('Download calendar element not found');
    }

    // Make the element visible temporarily
    const originalDisplay = element.style.display;
    element.style.display = 'block';

    // Configure html2canvas options
    const canvas = await html2canvas(element, {
      scale: 2, // Increase quality
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 1080,
      height: 1920,
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
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading calendar:', error);
    throw error;
  }
}