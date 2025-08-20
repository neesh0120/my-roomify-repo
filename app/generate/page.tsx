'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, ArrowLeft, Download, Heart, Share2, Eye, Save, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDesigns, type Design, createProject, toggleLike, toggleSave } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function GeneratePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomType = searchParams.get('room');
  const styles = searchParams.get('styles')?.split(',') || [];
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const [savedDesigns, setSavedDesigns] = useState<string[]>([]);
  const [likedDesigns, setLikedDesigns] = useState<string[]>([]);
  const [designs, setDesigns] = useState<Design[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Call backend to generate designs
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    setIsGenerating(true);
    setError(null);
    setCurrentGeneration(5);

    const tick = setInterval(() => {
      setCurrentGeneration(prev => (prev < 95 ? prev + 2 : prev));
    }, 120);

    const run = async () => {
      try {
        const token = await user.getIdToken();
        const storedImage = typeof window !== 'undefined' ? localStorage.getItem('roomify:lastUpload') : null;
        const selectedStyles = styles.length ? styles : (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('roomify:styles') || '[]') : []);
        const result = await generateDesigns({ roomType, styles: selectedStyles, image: storedImage });
        if (!cancelled) {
          setDesigns(result);
          // create a project for persistence
          try {
            const project = await createProject(token, { name: 'AI Design Project', roomType, styles: selectedStyles, designs: result });
            if (!cancelled) setProjectId(project.id);
          } catch {}
          setCurrentGeneration(100);
          setIsGenerating(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Failed to generate');
          setIsGenerating(false);
        }
      } finally {
        clearInterval(tick);
      }
    };
    run();
    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  }, [user, roomType, styles.join(',')]);

  const generatedDesigns = designs || [];

  const handleSaveDesign = async (designId: string) => {
    if (!user || !projectId) return;
    setSavedDesigns(prev => prev.includes(designId) ? prev.filter(id => id !== designId) : [...prev, designId]);
    try {
      const token = await user.getIdToken();
      await toggleSave(token, projectId, designId);
    } catch {}
  };

  const handleLikeDesign = async (designId: string) => {
    if (!user || !projectId) return;
    setLikedDesigns(prev => prev.includes(designId) ? prev.filter(id => id !== designId) : [...prev, designId]);
    try {
      const token = await user.getIdToken();
      await toggleLike(token, projectId, designId);
    } catch {}
  };

  const handleViewInAR = (designId: string) => {
    router.push(`/ar?design=${designId}&room=${roomType}`);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-12 h-12 text-purple-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Generating Your Designs</h2>
          <p className="text-gray-600 mb-8">
            Our AI is analyzing your room and creating beautiful {styles.join(', ').toLowerCase()} designs...
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${currentGeneration}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{currentGeneration}% Complete</p>
          {error && (
            <p className="text-sm text-red-600 mt-4">{error}</p>
          )}
          
          <div className="mt-8 space-y-2 text-sm text-gray-500">
            <p>✨ Analyzing room dimensions and lighting</p>
            <p>🎨 Applying {styles.length} design styles</p>
            <p>🏠 Creating {roomType?.replace('-', ' ')} layout</p>
            <p>🖼️ Rendering high-quality visualizations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/styles" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Back to Styles</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Roomify
            </span>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✨</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Your Designs Are Ready!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              AI has generated {generatedDesigns.length} unique designs for your {roomType?.replace('-', ' ')}
            </p>
            <p className="text-gray-500">
              Click on any design to view in AR or save to your dashboard
            </p>
          </div>

          {/* Generated Designs Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {generatedDesigns.map((design, index) => (
              <Card key={design.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img 
                    src={design.image} 
                    alt={design.style}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-sm font-medium text-green-600">{design.confidence}% Match</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-black/70 rounded-lg px-3 py-1">
                    <span className="text-sm font-medium text-white">AI Generated</span>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{design.style}</span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLikeDesign(design.id)}
                        className={likedDesigns.includes(design.id) ? 'text-red-500' : 'text-gray-400'}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-6">{design.description}</p>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleViewInAR(design.id)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View in AR
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSaveDesign(design.id)}
                      className={savedDesigns.includes(design.id) ? 'border-green-500 text-green-600' : ''}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {savedDesigns.includes(design.id) ? 'Saved' : 'Save'}
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-6 text-lg rounded-xl"
              onClick={() => router.push('/dashboard')}
            >
              <Save className="mr-3 w-5 h-5" />
              Save All & Go to Dashboard
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg rounded-xl border-2"
              onClick={() => router.push('/upload')}
            >
              Try Another Room
            </Button>
          </div>

          {/* Design Stats */}
          <Card className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{generatedDesigns.length}</div>
                  <p className="text-gray-600">Unique Designs Generated</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {generatedDesigns.length > 0 ? Math.round(generatedDesigns.reduce((acc, design) => acc + design.confidence, 0) / generatedDesigns.length) : 0}%
                  </div>
                  <p className="text-gray-600">Average Confidence Score</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">&lt;30s</div>
                  <p className="text-gray-600">Generation Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}