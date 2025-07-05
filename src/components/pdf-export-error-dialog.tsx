'use client';

import React from 'react';
import { AlertTriangle, FileImage } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PDFExportErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToPNG: () => void;
  error?: string;
}

export function PDFExportErrorDialog({ 
  isOpen, 
  onClose, 
  onSwitchToPNG,
  error = 'PDF export is currently unavailable due to a compatibility issue.'
}: PDFExportErrorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            PDF Export Unavailable
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-3">
            <p>{error}</p>
            <p className="font-medium">
              Good news: PNG export works perfectly and provides the same high-quality calendar that you can print or save!
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onSwitchToPNG}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <FileImage className="h-4 w-4 mr-2" />
            Use PNG Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}