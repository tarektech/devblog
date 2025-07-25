'use client';

import React,{ useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface PostFormData {
  title: string;
  content: string;
  imageUrl: string;
  status: 'draft' | 'published';
  featured: boolean;
}

interface PostFormProps {
  initialData?: Partial<PostFormData>;
  isEditing?: boolean;
  postId?: string;
}

// Image Upload Component
function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File size limit: 5MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, GIF)');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError('File size must be less than 5MB');
        return;
      }

      setIsUploading(true);
      try {
        // Convert file to data URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          onChange(dataUrl);
          setIsUploading(false);
        };
        reader.onerror = () => {
          setError('Failed to read the file');
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Failed to process the image');
        setIsUploading(false);
      }
    },
    [onChange, setError, setIsUploading, MAX_FILE_SIZE]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  return (
    <div className="space-y-4">
      <Label>Featured Image</Label>

      {/* Error Display */}
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${
            isDragOver
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20 scale-[1.02]'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onClick={() => document.getElementById('file-input')?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload image by clicking or dragging and dropping"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            document.getElementById('file-input')?.click();
          }
        }}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-sm font-medium">Processing image...</p>
            <p className="text-xs text-gray-400 mt-1">Please wait</p>
          </div>
        ) : value ? (
          <div className="space-y-2">
            <div className="relative w-full max-w-md mx-auto aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={value}
                alt="Featured image preview"
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={85}
                unoptimized={value.startsWith('data:')}
                onLoad={() => {
                  // Image loaded successfully
                }}
                onError={() => {
                  setError('Failed to load image preview');
                }}
              />
            </div>
            <p className="text-sm text-gray-500">
              Click or drag a new image to replace
            </p>
          </div>
        ) : (
          <div className="text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-lg font-medium mb-2">
              Drop an image here or click to select
            </p>
            <p className="text-sm">Supports JPG, PNG, GIF up to 5MB</p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        id="file-input"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileInput}
        className="sr-only"
        aria-describedby="file-input-description"
      />
      <div id="file-input-description" className="sr-only">
        Upload an image file. Supported formats: JPEG, PNG, GIF, WebP. Maximum
        size: 5MB.
      </div>

      {/* Remove Image Button */}
      {value && !isUploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onChange('');
            setError(null);
          }}
          className="mt-2"
        >
          Remove Image
        </Button>
      )}
    </div>
  );
}

export function PostForm({
  initialData,
  isEditing = false,
  postId,
}: PostFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    imageUrl: initialData?.imageUrl || '',
    status: initialData?.status || 'draft',
    featured: initialData?.featured || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required');
      }

      const url = isEditing ? `/api/posts/${postId}` : '/api/posts';
      const method = isEditing ? 'PUT' : 'POST';

      // Map form data to API format
      const apiData = {
        title: formData.title,
        content: formData.content,
        image_url: formData.imageUrl, // Convert imageUrl to image_url
        status: formData.status,
        featured: formData.featured,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(
          errorData.message || errorData.error || 'Something went wrong'
        );
      }

      const post = await response.json();

      if (formData.status === 'published') {
        router.push(`/posts/${post.id}`);
      } else {
        router.push('/dashboard/posts');    
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange =
    (field: keyof PostFormData) => (value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title')(e.target.value)}
                placeholder="Enter post title..."
                required
              />
            </div>

            <ImageUpload
              value={formData.imageUrl}
              onChange={handleChange('imageUrl')}
            />

            <div>
              <Label htmlFor="content">Content *</Label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleChange('content')(e.target.value)}
                placeholder="Write your post content here..."
                className="w-full min-h-[200px] p-3 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can use HTML tags for formatting.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Publishing Options */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleChange('featured')(e.target.checked)}
                className="rounded border-input"
              />
              <Label htmlFor="featured">Featured Post</Label>
              <p className="text-xs text-muted-foreground">
                Featured posts appear prominently on the homepage.
              </p>
            </div>

            <div>
              <Label>Status</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={(e) => handleChange('status')(e.target.value)}
                  />
                  <span>Draft</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={formData.status === 'published'}
                    onChange={(e) => handleChange('status')(e.target.value)}
                  />
                  <span>Published</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/posts')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? 'Updating...'
                : 'Creating...'
              : isEditing
              ? 'Update Post'
              : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}
