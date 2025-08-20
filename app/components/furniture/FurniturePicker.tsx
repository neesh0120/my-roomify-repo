'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { furnitureModels, type FurnitureModel } from '@/lib/furniture';

interface FurniturePickerProps {
  onSelect: (model: FurnitureModel) => void;
}

export function FurniturePicker({ onSelect }: FurniturePickerProps) {
  const categories = Array.from(new Set(furnitureModels.map(m => m.category)));
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Select Furniture</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="flex-1">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 gap-4 p-4">
                  {furnitureModels
                    .filter(model => model.category === category)
                    .map((model) => (
                      <Card
                        key={model.id}
                        className="cursor-pointer hover:border-primary"
                        onClick={() => onSelect(model)}
                      >
                        <CardContent className="p-2">
                          <div className="relative w-full aspect-square">
                            <Image
                              src={model.previewImage}
                              alt={model.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <p className="mt-2 text-sm font-medium text-center">
                            {model.name}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
