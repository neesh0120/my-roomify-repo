'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Camera, Filter, Grid, Heart, Eye, Download, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function GalleryPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [likedDesigns, setLikedDesigns] = useState<string[]>([]);

  const filters = [
    { id: 'all', name: 'All Styles', count: 240 },
    { id: 'modern', name: 'Modern', count: 65 },
    { id: 'luxury', name: 'Luxury', count: 42 },
    { id: 'boho', name: 'Boho', count: 38 },
    { id: 'scandinavian', name: 'Scandinavian', count: 45 },
    { id: 'industrial', name: 'Industrial', count: 28 },
    { id: 'traditional', name: 'Traditional', count: 22 }
  ];

  const galleryDesigns = [
    {
      id: 'gallery-1',
      title: 'Serene Modern Living',
      style: 'Modern Minimalist',
      roomType: 'Living Room',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500',
      author: 'AI Generated',
      likes: 142,
      views: 892
    },
    {
      id: 'gallery-2',
      title: 'Luxury Bedroom Suite',
      style: 'Luxury Contemporary',
      roomType: 'Bedroom',
      image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=500',
      author: 'AI Generated',
      likes: 98,
      views: 654
    },
    {
      id: 'gallery-3',
      title: 'Boho Kitchen Charm',
      style: 'Boho Chic',
      roomType: 'Kitchen',
      image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=500',
      author: 'AI Generated',
      likes: 156,
      views: 743
    },
    {
      id: 'gallery-4',
      title: 'Scandinavian Office',
      style: 'Scandinavian',
      roomType: 'Office',
      image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=500',
      author: 'AI Generated',
      likes: 89,
      views: 456
    },
    {
      id: 'gallery-5',
      title: 'Industrial Loft',
      style: 'Industrial',
      roomType: 'Living Room',
      image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=500',
      author: 'AI Generated',
      likes: 201,
      views: 1089
    },
    {
      id: 'gallery-6',
      title: 'Classic Dining Room',
      style: 'Traditional Classic',
      roomType: 'Dining Room',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=500',
      author: 'AI Generated',
      likes: 67,
      views: 389
    },
    {
      id: 'gallery-7',
      title: 'Modern Bathroom Spa',
      style: 'Modern Minimalist',
      roomType: 'Bathroom',
      image: 'https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg?auto=compress&cs=tinysrgb&w=500',
      author: 'AI Generated',
      likes: 134,
      views: 567
    },
    {
      id: 'gallery-8',
      title: 'Luxury Home Theater',
      style: 'Luxury Contemporary',
      roomType: 'Entertainment',
      image: 'https://images.pexels.com/photos/1145257/pexels-photo-1145257.jpeg?auto=compress&cs=tinysrgb&w=500',
      author: 'AI Generated',
      likes: 176,
      views: 823
    },
    {
      id: 'gallery-9',
      title: 'Boho Reading Nook',
      style: 'Boho Chic',
      roomType: 'Bedroom',
      image: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=500',
      author: 'AI Generated',
      likes: 92,
      views: 445
    }
  ];

  const handleLike = (designId: string) => {
    setLikedDesigns(prev => 
      prev.includes(designId)
        ? prev.filter(id => id !== designId)
        : [...prev, designId]
    );
  };

  const filteredDesigns = selectedFilter === 'all' 
    ? galleryDesigns 
    : galleryDesigns.filter(design => 
        design.style.toLowerCase().includes(selectedFilter.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Roomify
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="/gallery" className="text-purple-600 font-medium">
              Gallery
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">
              Dashboard
            </Link>
          </nav>
          <Link href="/upload">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Try Roomify
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Design{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Gallery
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore stunning AI-generated interior designs from our community. 
              Get inspired by thousands of unique room transformations.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
                  }`}
                >
                  {filter.name}
                  <span className="ml-2 text-sm opacity-75">({filter.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredDesigns.map((design) => (
              <Card key={design.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                <div className="relative">
                  <img 
                    src={design.image} 
                    alt={design.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-lg mb-1">{design.title}</h3>
                    <p className="text-sm opacity-90">{design.style} • {design.roomType}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20"
                      onClick={() => handleLike(design.id)}
                    >
                      <Heart className={`w-4 h-4 ${likedDesigns.includes(design.id) ? 'text-red-400 fill-current' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{design.author}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{design.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{design.views}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/ar?design=${design.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View in AR
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-purple-50"
            >
              Load More Designs
            </Button>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Create Your Own?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of users transforming their spaces with AI-powered interior design
            </p>
            <Link href="/upload">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Designing Now
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}