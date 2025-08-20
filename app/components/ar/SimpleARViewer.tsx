'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ARViewerProps {
  modelUrl: string;
  scale?: number;
  color?: string;
  onExit?: () => void;
}

function Model({ url, scale = 1, color }: { url: string; scale?: number; color?: string }) {
  const gltf = useGLTF(url);
  
  return (
    <primitive 
      object={gltf.scene} 
      scale={[scale, scale, scale]}
    />
  );
}

export default function EnhancedARViewer({ modelUrl, scale = 1, color, onExit }: ARViewerProps) {
  const [isViewMode, setIsViewMode] = useState(true);

  return (
    <div className="relative h-full w-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Model url={modelUrl} scale={scale} color={color} />
        <OrbitControls enabled={isViewMode} />
      </Canvas>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 space-x-4">
        <Button
          onClick={() => {
            setIsViewMode(!isViewMode);
            toast.success(isViewMode ? 'Placement mode' : 'View mode');
          }}
        >
          {isViewMode ? 'Switch to Placement' : 'Switch to View'}
        </Button>
        {onExit && (
          <Button variant="outline" onClick={onExit}>
            Exit AR
          </Button>
        )}
      </div>
    </div>
  );
}
