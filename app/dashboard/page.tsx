'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Camera, Plus, Heart, Eye, Download, Share2, Filter, Search, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { listProjects, type Project } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStyle, setFilterStyle] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const run = async () => {
      try {
        const token = await user.getIdToken();
        const list = await listProjects(token);
        if (!cancelled) setProjects(list);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load projects');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [user]);

  const stats = [
    { label: 'Total Projects', value: projects.length.toString(), change: `+${Math.min(projects.length, 3)}`, color: 'text-blue-600' },
    { label: 'Designs Generated', value: projects.reduce((acc, p) => acc + p.designs.length, 0).toString(), change: `+${Math.min(projects.length * 4, 12)}`, color: 'text-green-600' },
    { label: 'Saved Favorites', value: projects.reduce((acc, p) => acc + p.designs.filter(d => d.saved).length, 0).toString(), change: `+${Math.min(projects.length, 5)}`, color: 'text-purple-600' },
    { label: 'AR Views', value: '24', change: '+8', color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Roomify
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-purple-600 font-medium">
              Dashboard
            </Link>
            <Link href="/gallery" className="text-gray-600 hover:text-purple-600 transition-colors">
              Gallery
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-purple-600 transition-colors">
              Profile
            </Link>
          </nav>
          <Link href="/upload">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Welcome back, Designer!</h1>
            <p className="text-xl text-gray-600">
              Manage your interior design projects and explore new possibilities
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                  <div className="text-sm text-green-600 font-medium">
                    {stat.change} this week
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <Input 
                  placeholder="Search projects..." 
                  className="pl-10 w-64"
                />
              </div>
              <select 
                value={filterStyle}
                onChange={(e) => setFilterStyle(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
              >
                <option value="all">All Styles</option>
                <option value="modern">Modern</option>
                <option value="luxury">Luxury</option>
                <option value="boho">Boho</option>
                <option value="scandinavian">Scandinavian</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Projects Grid/List */}
          {loading ? (
            <div className="text-center text-gray-500">Loading projects...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <img 
                      src={project.designs[0]?.image || 'https://via.placeholder.com/800x400?text=Design'} 
                      alt={project.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        completed
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg px-3 py-1">
                      <span className="text-sm font-medium text-white">{project.designs.length} designs</span>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-gray-500 font-normal">{project.styles.join(', ')}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">Created on {new Date(project.createdAt).toLocaleDateString()}</p>
                    
                    <div className="flex space-x-2">
                      <Link href={`/ar?design=${project.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View AR
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={project.designs[0]?.image || 'https://via.placeholder.com/200x200?text=Design'} 
                        alt={project.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{project.name}</h3>
                            <p className="text-gray-500">{project.styles.join(', ')} • {project.designs.length} designs</p>
                            <p className="text-sm text-gray-400">
                              Created {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                              completed
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-2" />
                                View AR
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State or Load More */}
          <div className="text-center mt-12">
            <Link href="/upload">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-6 text-lg rounded-xl"
              >
                <Plus className="mr-3 w-5 h-5" />
                Create New Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}