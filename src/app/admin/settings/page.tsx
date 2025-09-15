'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Shield,
  Database,
  Mail,
  Bell,
  Users,
  CreditCard,
  Globe,
  Lock,
  Key,
  Server,
  ArrowLeft,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Ovela',
    siteDescription: 'Premium fashion and lifestyle brand',
    maintenanceMode: false,
    allowRegistration: true,
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: '24',
    passwordMinLength: '8',
    maxLoginAttempts: '5',
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    emailNotifications: true,
    
    // Payment Settings
    stripePublicKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    currency: 'USD',
    taxRate: '8.5',
    
    // Notification Settings
    orderNotifications: true,
    userNotifications: true,
    inventoryAlerts: true,
    systemAlerts: true
  });

  const handleSave = async (section: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Saving ${section} settings:`, settings);
      // Here you would make actual API calls to save settings
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/dashboard')}
              className="border-gray-600 hover:bg-gray-700 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                System Settings
              </h1>
              <p className="text-gray-400 mt-1">Configure and manage system-wide settings</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              System Online
            </Badge>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 border border-gray-700">
            <TabsTrigger value="general" className="data-[state=active]:bg-gray-700">
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gray-700">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-gray-700">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-gray-700">
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-700">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-gray-700">
              <Server className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Globe className="h-5 w-5" />
                  <span>Site Configuration</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Basic site settings and configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className="text-white">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription" className="text-white">Site Description</Label>
                    <Input
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Maintenance Mode</Label>
                      <p className="text-sm text-gray-400">Enable to temporarily disable site access</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Allow User Registration</Label>
                      <p className="text-sm text-gray-400">Allow new users to create accounts</p>
                    </div>
                    <Switch
                      checked={settings.allowRegistration}
                      onCheckedChange={(checked) => handleInputChange('allowRegistration', checked)}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleSave('general')}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save General Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Lock className="h-5 w-5" />
                  <span>Security Configuration</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Authentication and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout" className="text-white">Session Timeout (hours)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength" className="text-white">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleInputChange('passwordMinLength', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts" className="text-white">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-400">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
                  />
                </div>
                <Button
                  onClick={() => handleSave('security')}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Mail className="h-5 w-5" />
                  <span>Email Configuration</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  SMTP settings and email preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost" className="text-white">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort" className="text-white">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={settings.smtpPort}
                      onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername" className="text-white">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={settings.smtpUsername}
                      onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword" className="text-white">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-gray-400">Enable system email notifications</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  />
                </div>
                <Button
                  onClick={() => handleSave('email')}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Email Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Configuration</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Payment gateway and billing settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-white">Default Currency</Label>
                    <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate" className="text-white">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.1"
                      value={settings.taxRate}
                      onChange={(e) => handleInputChange('taxRate', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripePublicKey" className="text-white">Stripe Public Key</Label>
                    <Input
                      id="stripePublicKey"
                      value={settings.stripePublicKey}
                      onChange={(e) => handleInputChange('stripePublicKey', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripeSecretKey" className="text-white">Stripe Secret Key</Label>
                    <Input
                      id="stripeSecretKey"
                      type="password"
                      value={settings.stripeSecretKey}
                      onChange={(e) => handleInputChange('stripeSecretKey', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="sk_test_..."
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleSave('payments')}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Payment Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure system and user notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Order Notifications</Label>
                      <p className="text-sm text-gray-400">Notify admins of new orders</p>
                    </div>
                    <Switch
                      checked={settings.orderNotifications}
                      onCheckedChange={(checked) => handleInputChange('orderNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">User Notifications</Label>
                      <p className="text-sm text-gray-400">Notify admins of user registrations</p>
                    </div>
                    <Switch
                      checked={settings.userNotifications}
                      onCheckedChange={(checked) => handleInputChange('userNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Inventory Alerts</Label>
                      <p className="text-sm text-gray-400">Alert when products are low in stock</p>
                    </div>
                    <Switch
                      checked={settings.inventoryAlerts}
                      onCheckedChange={(checked) => handleInputChange('inventoryAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">System Alerts</Label>
                      <p className="text-sm text-gray-400">Critical system notifications</p>
                    </div>
                    <Switch
                      checked={settings.systemAlerts}
                      onCheckedChange={(checked) => handleInputChange('systemAlerts', checked)}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleSave('notifications')}
                  disabled={isLoading}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Database className="h-5 w-5" />
                    <span>Database Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Connection Status</span>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Last Backup</span>
                    <span className="text-gray-400">2 hours ago</span>
                  </div>
                  <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700 text-white">
                    <Database className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Server className="h-5 w-5" />
                    <span>System Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Server Status</span>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Memory Usage</span>
                    <span className="text-gray-400">68%</span>
                  </div>
                  <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700 text-white">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restart Services
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <AlertTriangle className="h-5 w-5" />
                  <span>System Logs</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Recent system events and errors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                        INFO
                      </Badge>
                      <span className="text-gray-400">2024-01-15 10:30:25</span>
                      <span className="text-gray-300">User authentication successful</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-blue-500 text-blue-400 text-xs">
                        DEBUG
                      </Badge>
                      <span className="text-gray-400">2024-01-15 10:29:15</span>
                      <span className="text-gray-300">Database connection established</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-xs">
                        WARN
                      </Badge>
                      <span className="text-gray-400">2024-01-15 10:25:10</span>
                      <span className="text-gray-300">High memory usage detected</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}