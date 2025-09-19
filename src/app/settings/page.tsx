"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Eye, 
  Shield, 
  Mail, 
  Smartphone,
  Globe,
  Palette,
  Save,
  AlertTriangle,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { PasswordChangeForm } from '@/components/auth/password-change-form';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState({
    // Account Settings
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    
    // Privacy Settings
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowAnalytics: true,
    
    // Notification Settings
    newSessionAlerts: true,
    progressUpdates: true,
    weeklyReports: true,
    achievementAlerts: true,
    
    // Theme Settings
    autoTheme: true,
    compactMode: false,
    highContrast: false
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      console.log('Account deletion requested');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and privacy</p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-200">Settings saved successfully!</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Account Settings */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-900 dark:text-white">
                  <User className="w-5 h-5" />
                  <span>Account Settings</span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Email Address</Label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Account Type</Label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">Premium Member</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-700 dark:text-gray-300">Email Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive important updates via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-700 dark:text-gray-300">SMS Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts via text message</p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-700 dark:text-gray-300">Marketing Emails</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive promotional content and offers</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Change */}
            <PasswordChangeForm />

            {/* Privacy Settings */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-900 dark:text-white">
                  <Eye className="w-5 h-5" />
                  <span>Privacy Settings</span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Control who can see your profile and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Profile Visibility</Label>
                    <Select
                      value={settings.profileVisibility}
                      onValueChange={(value) => setSettings({ ...settings, profileVisibility: value })}
                    >
                      <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <SelectItem value="public" className="text-gray-900 dark:text-white">Public</SelectItem>
                        <SelectItem value="private" className="text-gray-900 dark:text-white">Private</SelectItem>
                        <SelectItem value="friends" className="text-gray-900 dark:text-white">Friends Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-700 dark:text-gray-300">Show Email Address</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Display your email on your public profile</p>
                    </div>
                    <Switch
                      checked={settings.showEmail}
                      onCheckedChange={(checked) => setSettings({ ...settings, showEmail: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-700 dark:text-gray-300">Show Phone Number</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Display your phone number on your public profile</p>
                    </div>
                    <Switch
                      checked={settings.showPhone}
                      onCheckedChange={(checked) => setSettings({ ...settings, showPhone: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-700 dark:text-gray-300">Allow Analytics</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Help us improve by sharing usage data</p>
                    </div>
                    <Switch
                      checked={settings.allowAnalytics}
                      onCheckedChange={(checked) => setSettings({ ...settings, allowAnalytics: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-900 dark:text-white">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-700 dark:text-gray-300">New Session Alerts</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when new training sessions are available</p>
                  </div>
                  <Switch
                    checked={settings.newSessionAlerts}
                    onCheckedChange={(checked) => setSettings({ ...settings, newSessionAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-700 dark:text-gray-300">Progress Updates</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates on your training progress</p>
                  </div>
                  <Switch
                    checked={settings.progressUpdates}
                    onCheckedChange={(checked) => setSettings({ ...settings, progressUpdates: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-700 dark:text-gray-300">Weekly Reports</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get a summary of your weekly performance</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-700 dark:text-gray-300">Achievement Alerts</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Celebrate your milestones and achievements</p>
                  </div>
                  <Switch
                    checked={settings.achievementAlerts}
                    onCheckedChange={(checked) => setSettings({ ...settings, achievementAlerts: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-900 dark:text-white">
                  <Palette className="w-5 h-5" />
                  <span>Appearance</span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Customize the look and feel of your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-700 dark:text-gray-300">Auto Theme</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Automatically switch between light and dark mode</p>
                    </div>
                    <Switch
                      checked={settings.autoTheme}
                      onCheckedChange={(checked) => setSettings({ ...settings, autoTheme: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-700 dark:text-gray-300">Compact Mode</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Reduce spacing for a more compact layout</p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, compactMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-700 dark:text-gray-300">High Contrast</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Increase contrast for better visibility</p>
                    </div>
                    <Switch
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => setSettings({ ...settings, highContrast: checked })}
                    />
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Theme</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                      className={theme === 'light' ? 'bg-black dark:bg-white text-white dark:text-black' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'}
                    >
                      Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                      className={theme === 'dark' ? 'bg-black dark:bg-white text-white dark:text-black' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'}
                    >
                      Dark
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('system')}
                      className={theme === 'system' ? 'bg-black dark:bg-white text-white dark:text-black' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'}
                    >
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-white dark:bg-gray-800 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Danger Zone</span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-red-800 dark:text-red-200">Delete Account</h4>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/profile')}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                {isLoading ? 'Saving...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
