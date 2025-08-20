'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Upload, ArrowLeft, X, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function UploadPage() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [roomType, setRoomType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const roomTypes = [
    { id: 'living-room', name: 'Living Room', icon: '🛋️' },
    { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'office', name: 'Office', icon: '💼' },
    { id: 'dining', name: 'Dining Room', icon: '🍽️' },
    { id: 'bathroom', name: 'Bathroom', icon: '🛁' }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImage(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImage(event.target.result as string);
            try {
              localStorage.setItem('roomify:lastUpload', event.target.result as string);
            } catch {}
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleProceedToStyles = () => {
    if (uploadedImage && roomType) {
      setIsProcessing(true);
      try {
        localStorage.setItem('roomify:roomType', roomType);
        localStorage.setItem('roomify:styles', JSON.stringify([]));
      } catch {}
      setTimeout(() => {
        router.push(`/styles?room=${roomType}`);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Back to Home</span>
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
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">1</span>
                </div>
                <span className="font-medium text-purple-600">Upload Photo</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-semibold">2</span>
                </div>
                <span className="font-medium text-gray-500">Select Style</span>
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

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div>
              <h1 className="text-3xl font-bold mb-6">Upload Your Room Photo</h1>
              <p className="text-gray-600 mb-8">
                Upload a clear photo of your room to get started. Our AI works best with well-lit photos taken from a corner of the room.
              </p>

              {!uploadedImage ? (
                <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
                  <CardContent 
                    className={`p-12 text-center ${dragActive ? 'bg-purple-50' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-2">Drag & drop your photo here</h3>
                    <p className="text-gray-500 mb-6">or click to browse files</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Choose File
                      </Button>
                    </label>
                  </CardContent>
                </Card>
              ) : (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded room" 
                        className="w-full h-64 object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-4 right-4"
                        onClick={() => setUploadedImage(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-2 text-green-600 mb-2">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Photo uploaded successfully</span>
                      </div>
                      <p className="text-gray-600">Great! Your photo is ready for AI transformation.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Room Type Selection */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Select Room Type</h2>
              <p className="text-gray-600 mb-6">
                Choose the type of room to help our AI provide more accurate design suggestions.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {roomTypes.map((type) => (
                  <Card 
                    key={type.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      roomType === type.id 
                        ? 'border-purple-500 bg-purple-50 shadow-lg' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setRoomType(type.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-3">{type.icon}</div>
                      <h3 className="font-semibold">{type.name}</h3>
                      {roomType === type.id && (
                        <Check className="w-5 h-5 text-purple-600 mx-auto mt-2" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Continue Button */}
              <div className="mt-8">
                <Button
                  onClick={handleProceedToStyles}
                  disabled={!uploadedImage || !roomType || isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-6 text-lg rounded-xl disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Style Selection
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <Card className="mt-12 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">📸 Photo Tips for Best Results</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <strong className="block text-blue-600 mb-1">Good Lighting</strong>
                  Natural light works best. Take photos during daylight hours.
                </div>
                <div>
                  <strong className="block text-blue-600 mb-1">Full Room View</strong>
                  Capture as much of the room as possible from a corner.
                </div>
                <div>
                  <strong className="block text-blue-600 mb-1">Clear & Sharp</strong>
                  Ensure the photo is in focus and not blurry.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}