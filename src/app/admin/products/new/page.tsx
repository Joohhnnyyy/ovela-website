'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Save,
  Package,
  DollarSign,
  Hash,
  Tag
} from 'lucide-react';

export default function NewProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin/products');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/products')}
            className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700 shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Add New Product</h1>
            <p className="text-gray-400 text-sm sm:text-base">Create a new product for your inventory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Product Information */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Product Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Basic details about your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6 lg:p-8">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200 text-sm font-medium">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-200 text-sm font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter product description"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing & Inventory
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Set pricing and stock information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6 lg:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-gray-200 text-sm font-medium">Price ($) *</Label>
                      <Input
                        id="price"
                        type="text"
                        value={formData.price}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow numbers and decimal point
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            handleInputChange('price', value);
                          }
                        }}
                        placeholder="0.00"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-gray-200 text-sm font-medium">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="text"
                        value={formData.stock}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow numbers
                          if (value === '' || /^\d+$/.test(value)) {
                            handleInputChange('stock', value);
                          }
                        }}
                        placeholder="0"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:space-y-8">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Category & Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6 lg:p-8">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-200 text-sm font-medium">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="clothing" className="text-white hover:bg-gray-600">Clothing</SelectItem>
                        <SelectItem value="footwear" className="text-white hover:bg-gray-600">Footwear</SelectItem>
                        <SelectItem value="accessories" className="text-white hover:bg-gray-600">Accessories</SelectItem>
                        <SelectItem value="electronics" className="text-white hover:bg-gray-600">Electronics</SelectItem>
                        <SelectItem value="home" className="text-white hover:bg-gray-600">Home & Garden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-200 text-sm font-medium">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="active" className="text-white hover:bg-gray-600">Active</SelectItem>
                        <SelectItem value="inactive" className="text-white hover:bg-gray-600">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 lg:p-8">
                  <div className="space-y-4">
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Product
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/admin/products')}
                      className="w-full bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 h-12 text-base font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}