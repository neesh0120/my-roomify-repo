'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StylesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomType = searchParams.get('room');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const designStyles = [
    {
      id: 'modern',
      name: 'Modern Minimalist',
      description: 'Clean lines, neutral colors, and functional furniture',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: 'from-gray-500 to-gray-700',
      colors: ['#F5F5F5', '#E0E0E0', '#BDBDBD']
    },
    {
      id: 'luxury',
      name: 'Luxury Contemporary',
      description: 'Rich textures, premium materials, and elegant finishes',
      image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: 'from-yellow-600 to-yellow-800',
      colors: ['#D4AF37', '#B8860B', '#8B4513']
    },
    {
      id: 'boho',
      name: 'Boho Chic',
      description: 'Eclectic patterns, warm colors, and natural textures',
      image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: 'from-orange-500 to-red-600',
      colors: ['#CD853F', '#D2691E', '#A0522D']
    },
    {
      id: 'scandinavian',
      name: 'Scandinavian',
      description: 'Light woods, cozy textiles, and functional design',
      image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: 'from-blue-400 to-blue-600',
      colors: ['#F0F8FF', '#E6F3FF', '#CCE7FF']
    },
    {
      id: 'industrial',
      name: 'Industrial',
      description: 'Raw materials, exposed elements, and urban aesthetics',
      image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: 'from-gray-700 to-gray-900',
      colors: ['#2F2F2F', '#4A4A4A', '#696969']
    },
    {
      id: 'traditional',
      name: 'Traditional Classic',
      description: 'Timeless elegance, rich woods, and classic patterns',
      image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: 'from-red-700 to-red-900',
      colors: ['#8B0000', '#A52A2A', '#CD5C5C']
    }
  ];

  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles(prev => 
      prev.includes(styleId) 
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleGenerateDesigns = () => {
    if (selectedStyles.length > 0) {
      setIsGenerating(true);
      try {
        localStorage.setItem('roomify:styles', JSON.stringify(selectedStyles));
      } catch {}
      const stylesParam = selectedStyles.join(',');
      router.push(`/generate?room=${roomType}&styles=${stylesParam}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/upload" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Back to Upload</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Roomify
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">✓</span>
                </div>
                <span className="font-medium text-green-600">Upload Photo</span>
              </div>
              <div className="w-16 h-1 bg-green-200 rounded"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">2</span>
                </div>
                <span className="font-medium text-purple-600">Select Style</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-semibold">3</span>
                </div>
                <span className="font-medium text-gray-500">AI Generate</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Choose Your Design Styles
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Select one or more interior design styles that inspire you
            </p>
            <p className="text-gray-500">
              Our AI will generate unique designs based on your selections for your {roomType?.replace('-', ' ')}
            </p>
          </div>

          {/* Style Selection Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {designStyles.map((style) => (
              <Card 
                key={style.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl group ${
                  selectedStyles.includes(style.id) 
                    ? 'border-purple-500 bg-purple-50 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-purple-300 hover:scale-102'
                }`}
                onClick={() => handleStyleToggle(style.id)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={style.image} 
                    alt={style.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                  {selectedStyles.includes(style.id) && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{style.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4">{style.description}</p>
                  <div className="flex space-x-2">
                    {style.colors.map((color, index) => (
                      <div 
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Styles Summary */}
          {selectedStyles.length > 0 && (
            <Card className="mb-8 bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">
                  Selected Styles ({selectedStyles.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStyles.map(styleId => {
                    const style = designStyles.find(s => s.id === styleId);
                    return style ? (
                      <span 
                        key={styleId}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {style.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generate Button */}
          <div className="text-center">
            <Button
              onClick={handleGenerateDesigns}
              disabled={selectedStyles.length === 0 || isGenerating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Generating AI Designs...
                </>
              ) : (
                <>
                  <Sparkles className="mr-3 w-6 h-6" />
                  Generate AI Designs
                  <ArrowRight className="ml-3 w-6 h-6" />
                </>
              )}
            </Button>
            {selectedStyles.length === 0 && (
              <p className="text-gray-500 mt-4">Please select at least one design style</p>
            )}
          </div>

          {/* Style Mixing Info */}
          <Card className="mt-12 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">✨ Pro Tips for Style Selection</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <strong className="block text-blue-600 mb-2">Mix & Match</strong>
                  <p>Select 2-3 complementary styles for unique, personalized designs. Our AI excels at blending different aesthetics.</p>
                </div>
                <div>
                  <strong className="block text-blue-600 mb-2">Room Compatibility</strong>
                  <p>All styles work for any room type, but some combinations work better in specific spaces. Trust our AI recommendations!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}