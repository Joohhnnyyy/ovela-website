'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserService } from '@/services/userService';
import { User } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowLeft,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
}

export default function AdminUsersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0
  });
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const adminAuth = localStorage.getItem('admin_authenticated');
    const adminSession = localStorage.getItem('admin_session');
    
    if (adminAuth === 'true' && adminSession) {
      const sessionTime = parseInt(adminSession);
      const currentTime = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
      
      if (currentTime - sessionTime < sessionDuration) {
        setIsAuthenticated(true);
        loadUsers();
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
    
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    // Filter users based on search term and status
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const result = await UserService.getAllActiveUsers();
      
      if (result.success && result.data) {
        setUsers(result.data);
        calculateUserStats(result.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateUserStats = (usersData: User[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const totalUsers = usersData.length;
    const activeUsers = usersData.filter(user => user.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;
    
    const newUsersToday = usersData.filter(user => {
      const userDate = new Date(user.createdAt);
      const userDay = new Date(userDate.getFullYear(), userDate.getMonth(), userDate.getDate());
      return userDay.getTime() === today.getTime();
    }).length;
    
    const newUsersThisWeek = usersData.filter(user => {
      const userDate = new Date(user.createdAt);
      return userDate >= weekAgo;
    }).length;
    
    setUserStats({
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersToday,
      newUsersThisWeek
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="bg-green-900/50 text-green-300 border-green-700 hover:bg-green-800/50">
          <UserCheck className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-900/50 text-red-300 border-red-700 hover:bg-red-800/50">
          <UserX className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      );
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center space-x-2 hover:bg-gray-800 transition-colors border-gray-600 text-white hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-gray-400">Manage user accounts and permissions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{userStats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-green-400">{userStats.activeUsers}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Inactive Users</p>
                  <p className="text-2xl font-bold text-red-400">{userStats.inactiveUsers}</p>
                </div>
                <UserX className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">New Today</p>
                  <p className="text-2xl font-bold text-blue-400">{userStats.newUsersToday}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">New This Week</p>
                  <p className="text-2xl font-bold text-purple-400">{userStats.newUsersThisWeek}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white hover:bg-gray-700">All Users</SelectItem>
                    <SelectItem value="active" className="text-white hover:bg-gray-700">Active Only</SelectItem>
                    <SelectItem value="inactive" className="text-white hover:bg-gray-700">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users ({filteredUsers.length})
            </CardTitle>
            <CardDescription className="text-gray-300">
              Manage user accounts and view user details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading users...</div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">No users found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-white font-medium">
                            {user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}
                          </h3>
                          {getStatusBadge(user.isActive)}
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          {user.phoneNumber && (
                            <div className="flex items-center text-gray-400 text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.phoneNumber}
                            </div>
                          )}
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joined {formatDate(user.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openUserModal(user)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* User Details Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              View detailed information about this user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Display Name</label>
                  <p className="text-white mt-1">{selectedUser.displayName || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedUser.isActive)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">First Name</label>
                  <p className="text-white mt-1">{selectedUser.firstName || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Last Name</label>
                  <p className="text-white mt-1">{selectedUser.lastName || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <p className="text-white mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Phone Number</label>
                  <p className="text-white mt-1">{selectedUser.phoneNumber || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Created At</label>
                  <p className="text-white mt-1">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Last Updated</label>
                  <p className="text-white mt-1">{formatDate(selectedUser.updatedAt)}</p>
                </div>
              </div>

              {/* Address */}
              {selectedUser.address && (
                <div>
                  <label className="text-sm font-medium text-gray-300">Address</label>
                  <div className="mt-2 p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-white">{selectedUser.address.street}</p>
                    <p className="text-gray-400">
                      {selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zipCode}
                    </p>
                    <p className="text-gray-400">{selectedUser.address.country}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}