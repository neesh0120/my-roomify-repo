'use client';

import '@google/model-viewer';

interface ModelViewerProps {
  modelUrl: string;
  scale: number;
  color: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function ModelViewer({ modelUrl, scale, color }: ModelViewerProps) {
  if (!modelUrl) return null;

  return (
    <model-viewer
      src={modelUrl}
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      enable-pan
      shadow-intensity="1"
      style={{ width: '100%', height: '100%' }}
      scale={`${scale} ${scale} ${scale}`}
    >
      <div className="progress-bar hide" slot="progress-bar">
        <div className="update-bar"></div>
      </div>
    </model-viewer>
  );
}
