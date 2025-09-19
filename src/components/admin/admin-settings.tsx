'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Settings,
  Save,
  Database,
  Mail,
  Shield,
  Bell,
  Globe,
  Users
} from 'lucide-react'
import { PasswordChangeForm } from '@/components/auth/password-change-form'

export function AdminSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'REBALL',
    siteDescription: 'Professional football training platform',
    siteUrl: 'https://reball.uk',
    
    // Email Settings
    fromEmail: 'harry@reball.uk',
    supportEmail: 'support@reball.uk',
    emailNotifications: true,
    
    // Profile Settings
    requireProfileCompletion: true,
    allowIncompleteBookings: false,
    profileCompletionDeadline: 7, // days
    
    // Booking Settings
    maxBookingsPerUser: 5,
    bookingAdvanceDays: 30,
    allowCancellations: true,
    cancellationDeadline: 24, // hours
    
    // Security Settings
    requireEmailVerification: true,
    allowGoogleAuth: true,
    sessionTimeout: 24, // hours
    
    // Notification Settings
    emailNewRegistrations: true,
    emailProfileCompletions: true,
    emailBookingConfirmations: true,
    emailBookingReminders: true,
    
    // Analytics Settings
    trackUserBehavior: true,
    trackPageViews: true,
    trackConversions: true,
    
    // Maintenance Settings
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing maintenance. Please check back later.'
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // In a real implementation, this would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Configure platform settings and preferences</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            General Settings
          </CardTitle>
          <CardDescription>
            Basic platform configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => updateSetting('siteUrl', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => updateSetting('siteDescription', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Settings
          </CardTitle>
          <CardDescription>
            Configure email notifications and templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={settings.fromEmail}
                onChange={(e) => updateSetting('fromEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => updateSetting('supportEmail', e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
            <Label htmlFor="emailNotifications">Enable email notifications</Label>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Configure profile completion requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="requireProfileCompletion"
              checked={settings.requireProfileCompletion}
              onCheckedChange={(checked) => updateSetting('requireProfileCompletion', checked)}
            />
            <Label htmlFor="requireProfileCompletion">Require profile completion</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="allowIncompleteBookings"
              checked={settings.allowIncompleteBookings}
              onCheckedChange={(checked) => updateSetting('allowIncompleteBookings', checked)}
            />
            <Label htmlFor="allowIncompleteBookings">Allow bookings with incomplete profiles</Label>
          </div>
          <div>
            <Label htmlFor="profileCompletionDeadline">Profile completion deadline (days)</Label>
            <Input
              id="profileCompletionDeadline"
              type="number"
              value={settings.profileCompletionDeadline}
              onChange={(e) => updateSetting('profileCompletionDeadline', parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Booking Settings
          </CardTitle>
          <CardDescription>
            Configure booking rules and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxBookingsPerUser">Max bookings per user</Label>
              <Input
                id="maxBookingsPerUser"
                type="number"
                value={settings.maxBookingsPerUser}
                onChange={(e) => updateSetting('maxBookingsPerUser', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="bookingAdvanceDays">Booking advance days</Label>
              <Input
                id="bookingAdvanceDays"
                type="number"
                value={settings.bookingAdvanceDays}
                onChange={(e) => updateSetting('bookingAdvanceDays', parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="allowCancellations"
              checked={settings.allowCancellations}
              onCheckedChange={(checked) => updateSetting('allowCancellations', checked)}
            />
            <Label htmlFor="allowCancellations">Allow booking cancellations</Label>
          </div>
          <div>
            <Label htmlFor="cancellationDeadline">Cancellation deadline (hours)</Label>
            <Input
              id="cancellationDeadline"
              type="number"
              value={settings.cancellationDeadline}
              onChange={(e) => updateSetting('cancellationDeadline', parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure security and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="requireEmailVerification"
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) => updateSetting('requireEmailVerification', checked)}
            />
            <Label htmlFor="requireEmailVerification">Require email verification</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="allowGoogleAuth"
              checked={settings.allowGoogleAuth}
              onCheckedChange={(checked) => updateSetting('allowGoogleAuth', checked)}
            />
            <Label htmlFor="allowGoogleAuth">Allow Google authentication</Label>
          </div>
          <div>
            <Label htmlFor="sessionTimeout">Session timeout (hours)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure automated notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="emailNewRegistrations"
                checked={settings.emailNewRegistrations}
                onCheckedChange={(checked) => updateSetting('emailNewRegistrations', checked)}
              />
              <Label htmlFor="emailNewRegistrations">Email new registrations</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="emailProfileCompletions"
                checked={settings.emailProfileCompletions}
                onCheckedChange={(checked) => updateSetting('emailProfileCompletions', checked)}
              />
              <Label htmlFor="emailProfileCompletions">Email profile completions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="emailBookingConfirmations"
                checked={settings.emailBookingConfirmations}
                onCheckedChange={(checked) => updateSetting('emailBookingConfirmations', checked)}
              />
              <Label htmlFor="emailBookingConfirmations">Email booking confirmations</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="emailBookingReminders"
                checked={settings.emailBookingReminders}
                onCheckedChange={(checked) => updateSetting('emailBookingReminders', checked)}
              />
              <Label htmlFor="emailBookingReminders">Email booking reminders</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Analytics Settings
          </CardTitle>
          <CardDescription>
            Configure data tracking and analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="trackUserBehavior"
                checked={settings.trackUserBehavior}
                onCheckedChange={(checked) => updateSetting('trackUserBehavior', checked)}
              />
              <Label htmlFor="trackUserBehavior">Track user behavior</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="trackPageViews"
                checked={settings.trackPageViews}
                onCheckedChange={(checked) => updateSetting('trackPageViews', checked)}
              />
              <Label htmlFor="trackPageViews">Track page views</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="trackConversions"
                checked={settings.trackConversions}
                onCheckedChange={(checked) => updateSetting('trackConversions', checked)}
              />
              <Label htmlFor="trackConversions">Track conversions</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Maintenance Settings
          </CardTitle>
          <CardDescription>
            Configure maintenance mode and messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
            />
            <Label htmlFor="maintenanceMode">Enable maintenance mode</Label>
          </div>
          <div>
            <Label htmlFor="maintenanceMessage">Maintenance message</Label>
            <Textarea
              id="maintenanceMessage"
              value={settings.maintenanceMessage}
              onChange={(e) => updateSetting('maintenanceMessage', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <PasswordChangeForm />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="min-w-32"
        >
          {saving ? (
            <>
              <Settings className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
