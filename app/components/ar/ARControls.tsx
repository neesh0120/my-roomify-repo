'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Move3d, Crosshair } from 'lucide-react';

interface ARControlsProps {
  onReset: () => void;
  onTogglePlacement: () => void;
  isPlacementMode: boolean;
}

export function ARControls({ onReset, onTogglePlacement, isPlacementMode }: ARControlsProps) {
  return (
    <div 
      id="ar-overlay"
      className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none"
    >
      <div className="max-w-md mx-auto flex justify-between items-center pointer-events-auto">
        <Button variant="secondary" size="icon" onClick={onReset}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={onTogglePlacement}
          variant={isPlacementMode ? "default" : "secondary"}
          className="flex items-center space-x-2"
        >
          {isPlacementMode ? (
            <>
              <Crosshair className="h-4 w-4" />
              <span>Place Mode</span>
            </>
          ) : (
            <>
              <Move3d className="h-4 w-4" />
              <span>View Mode</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
