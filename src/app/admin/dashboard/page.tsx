'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { orderService, Order } from '@/services/orderService';
import { UserService } from '@/services/userService';
import { User } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  LogOut,
  Settings,
  BarChart3,
  Eye,
  Activity,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Shield
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  revenue: number;
}

interface OrderStats {
  todayOrders: number;
  pendingOrders: number;
  completedOrders: number;
  processingOrders: number;
  totalRevenue: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    revenue: 0
  });
  const [orderStats, setOrderStats] = useState<OrderStats>({
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    processingOrders: 0,
    totalRevenue: 0
  });
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0
  });
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const adminAuth = localStorage.getItem('admin_authenticated');
    const adminSession = localStorage.getItem('admin_session');
    
    if (adminAuth === 'true' && adminSession) {
      // Check if session is still valid (24 hours)
      const sessionTime = parseInt(adminSession);
      const currentTime = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
      
      if (currentTime - sessionTime < sessionDuration) {
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        // Session expired
        handleLogout();
      }
    } else {
      router.push('/auth/login');
    }
    
    setIsLoading(false);
  }, [router]);

  const loadDashboardData = async () => {
    // Simulate loading dashboard data
    // In a real app, this would fetch from your API
    setStats({
      totalUsers: 1247,
      totalOrders: 892,
      totalProducts: 156,
      revenue: 45670
    });
    
    // Load real order statistics
    await loadOrderStats();
    
    // Load real user statistics
    await loadUserStats();
  };

  const loadOrderStats = async () => {
    try {
      setIsLoadingOrders(true);
      const orders = await orderService.getOrders();
       
       const today = new Date();
       today.setHours(0, 0, 0, 0);
       
       const todayOrders = orders.filter((order: Order) => {
         const orderDate = new Date(order.orderDate);
         orderDate.setHours(0, 0, 0, 0);
         return orderDate.getTime() === today.getTime();
       }).length;
       
       const pendingOrders = orders.filter((order: Order) => order.status === 'pending').length;
       const completedOrders = orders.filter((order: Order) => order.status === 'delivered').length;
       const processingOrders = orders.filter((order: Order) => order.status === 'processing').length;
       
       const totalRevenue = orders
         .filter((order: Order) => order.status === 'delivered')
         .reduce((sum: number, order: Order) => sum + order.total, 0);
      
      setOrderStats({
        todayOrders,
        pendingOrders,
        completedOrders,
        processingOrders,
        totalRevenue
      });
    } catch (error) {
      console.error('Error loading order stats:', error);
      // Set fallback values
      setOrderStats({
        todayOrders: 47,
        pendingOrders: 12,
        completedOrders: 35,
        processingOrders: 8,
        totalRevenue: 45670
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const loadUserStats = async () => {
    try {
      setIsLoadingUsers(true);
      const result = await UserService.getAllActiveUsers();
      
      if (result.success && result.data) {
        const users = result.data;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const totalUsers = users.length;
        const activeUsers = users.filter((user: User) => user.isActive).length;
        
        const newUsersToday = users.filter((user: User) => {
          const userDate = new Date(user.createdAt);
          const userDay = new Date(userDate.getFullYear(), userDate.getMonth(), userDate.getDate());
          return userDay.getTime() === today.getTime();
        }).length;
        
        const newUsersThisWeek = users.filter((user: User) => {
          const userDate = new Date(user.createdAt);
          return userDate >= weekAgo;
        }).length;
        
        const newUsersThisMonth = users.filter((user: User) => {
          const userDate = new Date(user.createdAt);
          return userDate >= monthAgo;
        }).length;
        
        const calculatedUserStats = {
          totalUsers,
          activeUsers,
          newUsersToday,
          newUsersThisWeek,
          newUsersThisMonth
        };
        
        setUserStats(calculatedUserStats);
        
        // Update main stats with real user data
        setStats(prev => ({
          ...prev,
          totalUsers: totalUsers
        }));
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
      // Set fallback values
      setUserStats({
        totalUsers: 0,
        activeUsers: 0,
        newUsersToday: 0,
        newUsersThisWeek: 0,
        newUsersThisMonth: 0
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_session');
    
    // Clear cookies
    document.cookie = 'admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    router.push('/auth/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-white mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-gray-500 animate-pulse mx-auto"></div>
          </div>
          <p className="mt-6 text-gray-200 font-medium">Loading admin dashboard...</p>
          <p className="text-sm text-gray-400 mt-1">Please wait while we prepare your workspace</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-md shadow-lg border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
                <p className="text-sm text-gray-300 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Welcome back, Administrator
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-900/30 px-3 py-2 rounded-full border border-green-700">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-300">System Online</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:bg-gray-800 transition-colors border-gray-600 text-white hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
              <p className="text-gray-400">Monitor your business performance and manage operations</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Badge variant="outline" className="border-green-600 text-green-400 bg-green-900/20">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                All Systems Operational
              </Badge>
              <Badge variant="outline" className="border-blue-600 text-blue-400 bg-blue-900/20">
                Last updated: {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300 group border border-gray-700">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/5 rounded-full translate-y-8 -translate-x-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-sm font-semibold text-gray-300 mb-1">Total Users</CardTitle>
                <p className="text-xs text-gray-500">Active registered users</p>
              </div>
              <div className="h-12 w-12 bg-blue-900/50 rounded-xl flex items-center justify-center group-hover:bg-blue-800/50 transition-colors shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white mb-2">{isLoadingUsers ? '...' : userStats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs">
                  <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                  <span className="text-green-400 font-medium">+{userStats.newUsersThisMonth}</span>
                  <span className="text-gray-400 ml-1">this month</span>
                </div>
                <div className="text-xs text-gray-500">+{userStats.newUsersThisWeek} this week</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300 group border border-gray-700">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500/5 rounded-full translate-y-8 -translate-x-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-sm font-semibold text-gray-300 mb-1">Total Orders</CardTitle>
                <p className="text-xs text-gray-500">Completed transactions</p>
              </div>
              <div className="h-12 w-12 bg-purple-900/50 rounded-xl flex items-center justify-center group-hover:bg-purple-800/50 transition-colors shadow-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white mb-2">{stats.totalOrders.toLocaleString()}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs">
                  <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                  <span className="text-green-400 font-medium">+8%</span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
                <div className="text-xs text-gray-500">+42 today</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300 group border border-gray-700">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-500/5 rounded-full translate-y-8 -translate-x-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-sm font-semibold text-gray-300 mb-1">Total Products</CardTitle>
                <p className="text-xs text-gray-500">Available inventory</p>
              </div>
              <div className="h-12 w-12 bg-orange-900/50 rounded-xl flex items-center justify-center group-hover:bg-orange-800/50 transition-colors shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white mb-2">{stats.totalProducts}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs">
                  <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                  <span className="text-green-400 font-medium">+3</span>
                  <span className="text-gray-400 ml-1">new this week</span>
                </div>
                <div className="text-xs text-gray-500">12 categories</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300 group border border-gray-700">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/5 rounded-full translate-y-8 -translate-x-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-sm font-semibold text-gray-300 mb-1">Revenue</CardTitle>
                <p className="text-xs text-gray-500">Total earnings</p>
              </div>
              <div className="h-12 w-12 bg-green-900/50 rounded-xl flex items-center justify-center group-hover:bg-green-800/50 transition-colors shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white mb-2">${stats.revenue.toLocaleString()}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs">
                  <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                  <span className="text-green-400 font-medium">+15%</span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
                <div className="text-xs text-gray-500">$2.1k today</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation & Content Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Management Center</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="!w-full !h-auto grid grid-cols-5 bg-gray-800/50 p-1.5 rounded-xl border border-gray-700 shadow-inner backdrop-blur-sm">
            <TabsTrigger 
              value="overview" 
              className="!h-auto py-2 data-[state=active]:bg-black data-[state=active]:shadow-md data-[state=active]:text-white text-gray-300 rounded-lg font-medium transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="!h-auto py-2 data-[state=active]:bg-black data-[state=active]:shadow-md data-[state=active]:text-white text-gray-300 rounded-lg font-medium transition-all duration-200"
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="!h-auto py-2 data-[state=active]:bg-black data-[state=active]:shadow-md data-[state=active]:text-white text-gray-300 rounded-lg font-medium transition-all duration-200"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="!h-auto py-2 data-[state=active]:bg-black data-[state=active]:shadow-md data-[state=active]:text-white text-gray-300 rounded-lg font-medium transition-all duration-200"
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="!h-auto py-2 data-[state=active]:bg-black data-[state=active]:shadow-md data-[state=active]:text-white text-gray-300 rounded-lg font-medium transition-all duration-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border border-gray-700 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2 text-lg text-white">
                        <div className="h-8 w-8 bg-blue-900/50 rounded-lg flex items-center justify-center">
                          <Activity className="h-4 w-4 text-white" />
                        </div>
                        <span>Recent Activity</span>
                      </CardTitle>
                      <CardDescription className="text-gray-300 mt-1">Latest system activities and updates</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <span className="text-gray-200 font-medium">New user registration</span>
                        <p className="text-gray-400 text-sm">john.doe@example.com joined the platform</p>
                      </div>
                      <span className="text-gray-500 text-sm">2 min ago</span>
                    </div>
                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <div className="flex-1">
                        <span className="text-gray-200 font-medium">Order #1234 completed</span>
                        <p className="text-gray-400 text-sm">Payment processed successfully</p>
                      </div>
                      <span className="text-gray-500 text-sm">5 min ago</span>
                    </div>
                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <div className="flex-1">
                        <span className="text-gray-200 font-medium">Product inventory updated</span>
                        <p className="text-gray-400 text-sm">Nike Air Max inventory refreshed</p>
                      </div>
                      <span className="text-gray-500 text-sm">10 min ago</span>
                    </div>
                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <div className="flex-1">
                        <span className="text-gray-200 font-medium">System backup completed</span>
                        <p className="text-gray-400 text-sm">Daily backup process finished</p>
                      </div>
                      <span className="text-gray-500 text-sm">1 hour ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                {/* System Status */}
                <Card className="border border-gray-700 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-lg text-white">
                      <div className="h-8 w-8 bg-green-900/50 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                      <span>System Status</span>
                    </CardTitle>
                    <CardDescription className="text-gray-300">Current system health and performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-start p-3 rounded-lg bg-green-900/20 border border-green-700/30 h-12">
                        <div className="h-8 w-8 bg-green-900/50 rounded-lg flex items-center justify-center mr-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-green-300 font-medium">Server Online</span>
                      </div>
                      <div className="flex items-center justify-start p-3 rounded-lg bg-green-900/20 border border-green-700/30 h-12">
                        <div className="h-8 w-8 bg-green-900/50 rounded-lg flex items-center justify-center mr-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-green-300 font-medium">Database Connected</span>
                      </div>
                      <div className="flex items-center justify-start p-3 rounded-lg bg-blue-900/20 border border-blue-700/30 h-12">
                        <div className="h-8 w-8 bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        </div>
                        <span className="text-blue-300 font-medium">API Operational</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border border-gray-700 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-lg text-white">
                      <div className="h-8 w-8 bg-purple-900/50 rounded-lg flex items-center justify-center">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                      <span>Quick Actions</span>
                    </CardTitle>
                    <CardDescription className="text-gray-300">Common administrative tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start h-12 border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all text-white" onClick={() => router.push('/admin/products')}>
                        <div className="h-8 w-8 bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                          <Package className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Manage Products</span>
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-12 border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all text-white" onClick={() => router.push('/admin/orders')}>
                        <div className="h-8 w-8 bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                          <ShoppingBag className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">View Orders</span>
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-12 border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all text-white" onClick={() => router.push('/admin/users')}>
                        <div className="h-8 w-8 bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Manage Users</span>
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-12 border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all text-white" onClick={() => router.push('/admin/settings')}>
                        <div className="h-8 w-8 bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                          <Settings className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">System Settings</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-white" />
                    Product Overview
                  </CardTitle>
                  <CardDescription className="text-gray-300">Current product statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div 
                      className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                      onClick={() => router.push('/admin/products?filter=all')}
                    >
                      <span className="text-gray-300">Total Products</span>
                      <span className="text-white font-semibold">1,247</span>
                    </div>
                    <div 
                      className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                      onClick={() => router.push('/admin/products?filter=active')}
                    >
                      <span className="text-gray-300">Active Products</span>
                      <span className="text-green-400 font-semibold">1,198</span>
                    </div>
                    <div 
                      className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                      onClick={() => router.push('/admin/products?filter=out-of-stock')}
                    >
                      <span className="text-gray-300">Out of Stock</span>
                      <span className="text-red-400 font-semibold">49</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-white" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-gray-300">Product management tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white"
                      onClick={() => router.push('/admin/products/new')}
                    >
                      <Package className="h-4 w-4 mr-3 text-white" />
                      Add New Product
                    </Button>
                    <Button 
                      className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white"
                      onClick={() => router.push('/admin/inventory')}
                    >
                      <Package className="h-4 w-4 mr-3 text-white" />
                      Manage Inventory
                    </Button>
                    <Button 
                      className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white"
                      onClick={() => router.push('/admin/products')}
                    >
                      <Eye className="h-4 w-4 mr-3 text-white" />
                      View All Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-white" />
                    Order Statistics
                  </CardTitle>
                  <CardDescription className="text-gray-300">Recent order analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Today's Orders</span>
                      {isLoadingOrders ? (
                        <div className="h-4 w-8 bg-gray-600 rounded animate-pulse"></div>
                      ) : (
                        <span className="text-white font-semibold">{orderStats.todayOrders}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Pending Orders</span>
                      {isLoadingOrders ? (
                        <div className="h-4 w-8 bg-gray-600 rounded animate-pulse"></div>
                      ) : (
                        <span className="text-yellow-400 font-semibold">{orderStats.pendingOrders}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Completed Orders</span>
                      {isLoadingOrders ? (
                        <div className="h-4 w-8 bg-gray-600 rounded animate-pulse"></div>
                      ) : (
                        <span className="text-green-400 font-semibold">{orderStats.completedOrders}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Processing Orders</span>
                      {isLoadingOrders ? (
                        <div className="h-4 w-8 bg-gray-600 rounded animate-pulse"></div>
                      ) : (
                        <span className="text-blue-400 font-semibold">{orderStats.processingOrders}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-white" />
                    Order Actions
                  </CardTitle>
                  <CardDescription className="text-gray-300">Order management tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white"
                      onClick={() => router.push('/admin/orders')}
                    >
                      <Eye className="h-4 w-4 mr-3 text-white" />
                      View All Orders
                    </Button>
                    <Button 
                      className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white"
                      onClick={() => router.push('/admin/orders?status=pending')}
                    >
                      <Package className="h-4 w-4 mr-3 text-white" />
                      Process Pending
                    </Button>
                    <Button 
                      className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white"
                      onClick={() => router.push('/admin/analytics/orders')}
                    >
                      <TrendingUp className="h-4 w-4 mr-3 text-white" />
                      Order Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-white" />
                    User Statistics
                  </CardTitle>
                  <CardDescription className="text-gray-300">Current user metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Total Users</span>
                      {isLoadingUsers ? (
                        <div className="h-4 w-8 bg-gray-600 rounded animate-pulse"></div>
                      ) : (
                        <span className="text-white font-semibold">{userStats.totalUsers.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Active Users</span>
                      {isLoadingUsers ? (
                        <div className="h-4 w-8 bg-gray-600 rounded animate-pulse"></div>
                      ) : (
                        <span className="text-green-400 font-semibold">{userStats.activeUsers.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">New This Week</span>
                      {isLoadingUsers ? (
                        <div className="h-4 w-8 bg-gray-600 rounded animate-pulse"></div>
                      ) : (
                        <span className="text-blue-400 font-semibold">{userStats.newUsersThisWeek}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-white" />
                    User Management
                  </CardTitle>
                  <CardDescription className="text-gray-300">User administration tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white"
                      onClick={() => router.push('/admin/users')}
                    >
                      <Users className="h-4 w-4 mr-3 text-white" />
                      View All Users
                    </Button>
                    <Button 
                      className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white"
                      onClick={() => router.push('/admin/users/new')}
                    >
                      <Users className="h-4 w-4 mr-3 text-white" />
                      Add New User
                    </Button>
                    <Button 
                      className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white"
                      onClick={() => router.push('/admin/users/permissions')}
                    >
                      <Shield className="h-4 w-4 mr-3 text-white" />
                      Manage Permissions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-white" />
                    General Settings
                  </CardTitle>
                  <CardDescription className="text-gray-300">Basic system configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Site Name</span>
                      <span className="text-white font-medium">Ovela Store</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Maintenance Mode</span>
                      <span className="text-green-400 font-medium">Disabled</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Debug Mode</span>
                      <span className="text-red-400 font-medium">Enabled</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-white" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-gray-300">Security and access control</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white">
                      <Shield className="h-4 w-4 mr-3 text-white" />
                      Security Audit
                    </Button>
                    <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white">
                      <Users className="h-4 w-4 mr-3 text-white" />
                      Access Control
                    </Button>
                    <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 hover:text-white">
                      <Activity className="h-4 w-4 mr-3 text-white" />
                      Activity Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-white" />
                    Store Settings
                  </CardTitle>
                  <CardDescription className="text-gray-300">E-commerce configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      Payment Methods
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      Shipping Options
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      Tax Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-white" />
                    Analytics
                  </CardTitle>
                  <CardDescription className="text-gray-300">Tracking and reporting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      Google Analytics
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      Custom Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      Data Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-white" />
                    Performance
                  </CardTitle>
                  <CardDescription className="text-gray-300">System optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      Cache Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      Database Optimization
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      Performance Monitor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}