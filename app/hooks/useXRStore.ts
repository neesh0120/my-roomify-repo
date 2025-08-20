import { create } from 'zustand';

interface XRState {
  mode: 'inline' | 'immersive-vr' | 'immersive-ar';
  session: XRSession | null;
  originReferenceSpace: XRReferenceSpace | null;
  viewerReferenceSpace: XRReferenceSpace | null;
  hitTestSource: XRHitTestSource | null;
  hitTestSourceRequested: boolean;
  inputSources: XRInputSourceArray | null;
  inputSourcesMap: Map<XRInputSource, any>;
  detectedPlanes: Set<XRPlane>;
  detectedMeshes: Set<any>;
  device: any;
  isPresenting: boolean;
  interactions: Map<any, any>;
}

export const useXRStore = create<XRState>((set) => ({
  mode: 'immersive-ar',
  session: null,
  originReferenceSpace: null,
  viewerReferenceSpace: null,
  hitTestSource: null,
  hitTestSourceRequested: false,
  inputSources: null,
  inputSourcesMap: new Map(),
  detectedPlanes: new Set(),
  detectedMeshes: new Set(),
  device: null,
  isPresenting: false,
  interactions: new Map(),
}));
