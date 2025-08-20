'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { furnitureModels, type FurnitureModel, type Material } from '@/lib/furniture';

interface FurnitureCustomizerProps {
  selectedModelId: string;
  onUpdateModel: (scale: number, materialId: string, color: string) => void;
}

export function FurnitureCustomizer({ selectedModelId, onUpdateModel }: FurnitureCustomizerProps) {
  const model = furnitureModels.find(m => m.id === selectedModelId);
  const [scale, setScale] = useState(model?.defaultScale || 1);
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(model?.materials[0] || { id: '', name: '', color: '#FFFFFF' });

  if (!model) return null;

  const handleScaleChange = (value: number[]) => {
    const newScale = value[0];
    setScale(newScale);
    onUpdateModel(newScale, selectedMaterial.id, selectedMaterial.color || '#FFFFFF');
  };

  const handleMaterialChange = (material: Material) => {
    setSelectedMaterial(material);
    onUpdateModel(scale, material.id, material.color || '#FFFFFF');
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{model.name} Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Scale</label>
            <Slider
              defaultValue={[scale]}
              min={0.1}
              max={2}
              step={0.1}
              onValueChange={handleScaleChange}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Materials</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {model.materials.map((material) => (
                <Button
                  key={material.id}
                  variant={selectedMaterial.id === material.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleMaterialChange(material)}
                >
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: material.color }}
                  />
                  {material.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
