'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { generateDesigns } from '@/lib/api';
import type { Design } from '@/lib/api';
import EnhancedARViewer from '../ar/EnhancedARViewer';

const ROOM_TYPES = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Office',
  'Dining Room',
];

const STYLE_OPTIONS = [
  'Modern',
  'Contemporary',
  'Minimalist',
  'Industrial',
  'Scandinavian',
  'Traditional',
  'Bohemian',
  'Rustic',
];

export default function GenerateComponent() {
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedDesignForAR, setSelectedDesignForAR] = useState<Design | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedRoom || selectedStyles.length === 0) {
      toast.error('Please select a room type and at least one style');
      return;
    }

    try {
      setGenerating(true);
      const generatedDesigns = await generateDesigns({
        roomType: selectedRoom,
        styles: selectedStyles,
        image,
      });
      setDesigns(generatedDesigns);
      toast.success('Designs generated successfully!');
    } catch (error: any) {
      console.error('Error generating designs:', error);
      toast.error(error.message || 'Failed to generate designs. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Image Upload */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upload Room Image (Optional)</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              {image ? (
                <div className="relative">
                  <img
                    src={image}
                    alt="Room preview"
                    className="max-h-64 rounded-lg object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setImage(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      Click to upload a room image
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            {uploadError && (
              <p className="text-sm text-red-500">{uploadError}</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Room Type</label>
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger>
              <SelectValue placeholder="Select a room type" />
            </SelectTrigger>
            <SelectContent>
              {ROOM_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Style</label>
          <div className="flex flex-wrap gap-2">
            {STYLE_OPTIONS.map((style) => (
              <Button
                key={style}
                variant={selectedStyles.includes(style) ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedStyles((prev) =>
                    prev.includes(style)
                      ? prev.filter((s) => s !== style)
                      : [...prev, style]
                  );
                }}
                className="text-sm"
              >
                {style}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={generating || !selectedRoom || selectedStyles.length === 0}
        className="w-full"
      >
        {generating ? 'Generating...' : 'Generate Designs'}
      </Button>

      {designs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Generated Designs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {designs.map((design) => (
              <Card key={design.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={design.image}
                    alt={design.description}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">{design.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-600">
                      {design.style}
                    </span>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedDesignForAR(design)}
                      >
                        View in AR
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('Design saved!')}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedDesignForAR && (
        <EnhancedARViewer
          modelUrl="/models/furniture.glb" // We'll need to replace this with actual model URLs
          scale={1}
          color="#FFFFFF"
          onExit={() => setSelectedDesignForAR(null)}
        />
      )}
    </div>
  );
}
