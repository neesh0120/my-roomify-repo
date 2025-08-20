export interface FurnitureModel {
  id: string;
  name: string;
  category: string;
  modelUrl: string;
  previewImage: string;
  defaultScale: number;
  materials: Material[];
}

export interface Material {
  id: string;
  name: string;
  textureUrl?: string;
  color?: string;
}

export const furnitureModels: FurnitureModel[] = [
  {
    id: 'modern-sofa',
    name: 'Modern Sofa',
    category: 'Living Room',
    modelUrl: '/models/modern-sofa.glb',
    previewImage: '/furniture/modern-sofa.png',
    defaultScale: 1,
    materials: [
      { id: 'fabric-gray', name: 'Gray Fabric', color: '#8C8C8C' },
      { id: 'fabric-beige', name: 'Beige Fabric', color: '#E6D5B8' },
      { id: 'leather-brown', name: 'Brown Leather', color: '#5C4033' }
    ]
  },
  {
    id: 'dining-table',
    name: 'Dining Table',
    category: 'Dining Room',
    modelUrl: '/models/dining-table.glb',
    previewImage: '/furniture/dining-table.png',
    defaultScale: 1.2,
    materials: [
      { id: 'wood-oak', name: 'Oak', color: '#B8860B' },
      { id: 'wood-walnut', name: 'Walnut', color: '#5C4033' },
      { id: 'glass-clear', name: 'Clear Glass', color: '#FFFFFF' }
    ]
  },
  {
    id: 'bed-frame',
    name: 'Modern Bed Frame',
    category: 'Bedroom',
    modelUrl: '/models/bed-frame.glb',
    previewImage: '/furniture/bed-frame.png',
    defaultScale: 1.5,
    materials: [
      { id: 'fabric-gray', name: 'Gray Fabric', color: '#8C8C8C' },
      { id: 'wood-oak', name: 'Oak', color: '#B8860B' },
      { id: 'metal-black', name: 'Black Metal', color: '#2C2C2C' }
    ]
  },
  {
    id: 'office-desk',
    name: 'Office Desk',
    category: 'Office',
    modelUrl: '/models/office-desk.glb',
    previewImage: '/furniture/office-desk.png',
    defaultScale: 1.2,
    materials: [
      { id: 'wood-oak', name: 'Oak', color: '#B8860B' },
      { id: 'metal-white', name: 'White Metal', color: '#FFFFFF' },
      { id: 'glass-clear', name: 'Clear Glass', color: '#FFFFFF' }
    ]
  }
];
