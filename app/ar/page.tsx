'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Camera, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import ModelViewer from '@/app/components/ar/ModelViewer';
import { FurniturePicker } from '@/app/components/furniture/FurniturePicker';
import { FurnitureCustomizer } from '@/app/components/furniture/FurnitureCustomizer';
import { type FurnitureModel } from '@/lib/furniture';

export default function ARPage() {
  const searchParams = useSearchParams();
  const roomType = searchParams.get('room');
  const [selectedModel, setSelectedModel] = useState<FurnitureModel | null>(null);
  const [isARActive, setIsARActive] = useState(false);
  const [customizations, setCustomizations] = useState({
    scale: 1,
    color: '#FFFFFF'
  });

  const handleModelSelect = (model: FurnitureModel) => {
    setSelectedModel(model);
    setCustomizations({
      scale: model.defaultScale,
      color: '#FFFFFF'
    });
  };

  const handleCustomizationUpdate = (scale: number, color: string) => {
    setCustomizations({ scale, color });
  };

  const startARSession = () => {
    if (!selectedModel) {
      toast.error('Please select a furniture item first.');
      return;
    }
    setIsARActive(true);
  };

  const stopARSession = () => {
    setIsARActive(false);
  };

  if (isARActive) {
    return (
      <div className="relative h-screen">
        <ModelViewer
          modelUrl={selectedModel?.modelUrl || ''}
          scale={customizations.scale}
          color={customizations.color}
        />
        <Button
          className="absolute top-4 right-4 z-10"
          variant="secondary"
          onClick={stopARSession}
        >
          Exit AR
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/generate" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Back to Designs</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Roomify AR
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Design Your Space</h1>
              <p className="text-xl text-gray-600">
                Select and customize furniture for your {roomType?.replace('-', ' ')}
              </p>
            </div>

            <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
              {selectedModel ? (
                <ModelViewer 
                  modelUrl={selectedModel.modelUrl}
                  scale={customizations.scale}
                  color={customizations.color}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">Select a furniture item to begin</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  Choose Furniture
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <FurniturePicker onSelect={handleModelSelect} />
              </DialogContent>
            </Dialog>

            {selectedModel && (
              <>
                <FurnitureCustomizer
                  selectedModelId={selectedModel.id}
                  onUpdateModel={handleCustomizationUpdate}
                />
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 text-blue-800">📱 AR Instructions</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📷</div>
                        <strong className="block mb-1">Point Camera</strong>
                        <p>Point your device camera at the floor</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">👆</div>
                        <strong className="block mb-1">Tap to Place</strong>
                        <p>Tap to place furniture in your space</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={startARSession}
                >
                  Start AR Experience
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}