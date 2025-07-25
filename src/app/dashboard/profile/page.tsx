'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Profile {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setFormData({
          display_name: data.profile?.display_name || '',
          bio: data.profile?.bio || '',
          avatar_url: data.profile?.avatar_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        alert('Profile updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <div className="space-y-8">
            <div className="h-8 bg-muted animate-pulse rounded w-64" />
            <Card className="p-6">
              <div className="space-y-4">
                <div className="h-4 bg-muted animate-pulse rounded w-32" />
                <div className="h-10 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-24" />
                <div className="h-20 bg-muted animate-pulse rounded" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline">← Dashboard</Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">Edit Profile</h1>
          </div>
          <p className="text-muted-foreground">
            Update your public profile information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Preview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Preview</h2>
            <div className="flex items-start gap-4">
              {formData.avatar_url ? (
                <Image
                  src={formData.avatar_url}
                  alt="Profile preview"
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-orange-500/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-500">
                    {(formData.display_name || 'A').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">
                  {formData.display_name || 'Your Name'}
                </h3>
                {formData.bio && (
                  <p className="text-muted-foreground mt-2">{formData.bio}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Profile Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) =>
                    handleInputChange('display_name', e.target.value)
                  }
                  placeholder="Enter your display name"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This is how your name will appear on your posts and profile
                </p>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full h-24 p-3 border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  A brief description that will appear on your author profile
                </p>
              </div>

              <div>
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) =>
                    handleInputChange('avatar_url', e.target.value)
                  }
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Link to your profile picture (will be displayed as 80x80px)
                </p>
              </div>
            </div>
          </Card>

          {/* Account Information */}
          {profile && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Account Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono text-xs">{profile.id}</span>
                </div>
                {profile.created_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since:</span>
                    <span>
                      {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
