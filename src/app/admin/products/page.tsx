'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  ArrowLeft
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  category: string;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Premium T-Shirt', price: 29.99, stock: 150, status: 'active', category: 'Clothing' },
  { id: '2', name: 'Designer Jeans', price: 89.99, stock: 75, status: 'active', category: 'Clothing' },
  { id: '3', name: 'Leather Jacket', price: 199.99, stock: 0, status: 'out-of-stock', category: 'Clothing' },
  { id: '4', name: 'Running Shoes', price: 129.99, stock: 200, status: 'active', category: 'Footwear' },
  { id: '5', name: 'Vintage Watch', price: 299.99, stock: 25, status: 'active', category: 'Accessories' },
];

export default function AdminProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);

  useEffect(() => {
    let filtered = products;
    
    // Apply filter from URL params
    if (filter) {
      switch (filter) {
        case 'active':
          filtered = filtered.filter(p => p.status === 'active');
          break;
        case 'out-of-stock':
          filtered = filtered.filter(p => p.status === 'out-of-stock');
          break;
        case 'all':
        default:
          // Show all products
          break;
      }
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, filter, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-500 hover:bg-red-600">Out of Stock</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Inactive</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getFilterTitle = () => {
    switch (filter) {
      case 'active':
        return 'Active Products';
      case 'out-of-stock':
        return 'Out of Stock Products';
      case 'all':
      default:
        return 'All Products';
    }
  };

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
              <h1 className="text-3xl font-bold text-white">{getFilterTitle()}</h1>
              <p className="text-gray-400">Manage your product inventory</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/admin/products/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <Button variant="outline" className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                    <CardDescription className="text-gray-400">{product.category}</CardDescription>
                  </div>
                  {getStatusBadge(product.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Price:</span>
                    <span className="text-white font-semibold">${product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Stock:</span>
                    <span className={`font-semibold ${
                      product.stock === 0 ? 'text-red-400' : 
                      product.stock < 50 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {product.stock} units
                    </span>
                  </div>
                  <div className="flex gap-2 pt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-red-900/50 border-red-700 text-red-300 hover:bg-red-900/70"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400 mb-4">No products match your current filters.</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  router.push('/admin/products');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}