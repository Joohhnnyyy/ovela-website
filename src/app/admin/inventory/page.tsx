'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  category: string;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Premium T-Shirt',
    currentStock: 150,
    minStock: 50,
    maxStock: 300,
    category: 'Clothing',
    lastUpdated: '2024-01-15',
    status: 'in-stock'
  },
  {
    id: '2',
    name: 'Designer Jeans',
    currentStock: 25,
    minStock: 30,
    maxStock: 200,
    category: 'Clothing',
    lastUpdated: '2024-01-14',
    status: 'low-stock'
  },
  {
    id: '3',
    name: 'Leather Jacket',
    currentStock: 0,
    minStock: 10,
    maxStock: 50,
    category: 'Clothing',
    lastUpdated: '2024-01-13',
    status: 'out-of-stock'
  },
  {
    id: '4',
    name: 'Running Shoes',
    currentStock: 350,
    minStock: 100,
    maxStock: 300,
    category: 'Footwear',
    lastUpdated: '2024-01-15',
    status: 'overstock'
  },
  {
    id: '5',
    name: 'Vintage Watch',
    currentStock: 75,
    minStock: 20,
    maxStock: 100,
    category: 'Accessories',
    lastUpdated: '2024-01-15',
    status: 'in-stock'
  },
];

export default function InventoryManagement() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && item.status === selectedFilter;
  });

  const updateStock = (id: string, change: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.currentStock + change);
        let newStatus: InventoryItem['status'] = 'in-stock';
        
        if (newStock === 0) newStatus = 'out-of-stock';
        else if (newStock < item.minStock) newStatus = 'low-stock';
        else if (newStock > item.maxStock) newStatus = 'overstock';
        
        return {
          ...item,
          currentStock: newStock,
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge className="bg-green-500 hover:bg-green-600">In Stock</Badge>;
      case 'low-stock':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-500 hover:bg-red-600">Out of Stock</Badge>;
      case 'overstock':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Overstock</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStockIcon = (status: string) => {
    switch (status) {
      case 'low-stock':
      case 'out-of-stock':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'overstock':
        return <TrendingUp className="h-4 w-4 text-blue-400" />;
      default:
        return <Package className="h-4 w-4 text-green-400" />;
    }
  };

  const alertItems = inventory.filter(item => 
    item.status === 'low-stock' || item.status === 'out-of-stock'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/admin/dashboard')}
              className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
              <p className="text-gray-400">Monitor and manage your product stock levels</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Alerts */}
        {alertItems.length > 0 && (
          <Card className="mb-6 bg-red-900/20 border-red-700">
            <CardHeader>
              <CardTitle className="text-red-300 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Stock Alerts ({alertItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alertItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-red-900/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStockIcon(item.status)}
                      <span className="text-white font-medium">{item.name}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <span className="text-red-300">
                      {item.currentStock} / {item.minStock} min
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'in-stock', 'low-stock', 'out-of-stock', 'overstock'].map(filter => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    onClick={() => setSelectedFilter(filter)}
                    className={selectedFilter === filter ? 
                      "bg-blue-600 hover:bg-blue-700 text-white" : 
                      "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                    }
                  >
                    {filter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Inventory Items</CardTitle>
            <CardDescription className="text-gray-400">
              {filteredInventory.length} items found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInventory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
                  <div className="flex items-center gap-4">
                    {getStockIcon(item.status)}
                    <div>
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-gray-400 text-sm">{item.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-gray-300 text-sm">Current Stock</p>
                      <p className="text-white font-semibold text-lg">{item.currentStock}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-300 text-sm">Min / Max</p>
                      <p className="text-gray-400 text-sm">{item.minStock} / {item.maxStock}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-300 text-sm">Status</p>
                      {getStatusBadge(item.status)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(item.id, -1)}
                        className="bg-red-900/50 border-red-700 text-red-300 hover:bg-red-900/70"
                        disabled={item.currentStock === 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(item.id, 1)}
                        className="bg-green-900/50 border-green-700 text-green-300 hover:bg-green-900/70"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredInventory.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
                <p className="text-gray-400">No inventory items match your current filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}