"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  ExternalLink
} from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

interface Author {
  id: number;
  name: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
}

interface BlogTableOfContentsProps {
  title: string;
  content: string;
  author: Author;
  publishedDate: string;
  readingTime?: number;
  category?: string;
  tags?: string[];
  className?: string;
  showAuthorInfo?: boolean;
  showReadingTime?: boolean;
  showShareButtons?: boolean;
}

export default function BlogTableOfContents({
  title,
  content,
  author,
  publishedDate,
  readingTime,
  category,
  tags = [],
  className = "",
  showAuthorInfo = true,
  showReadingTime = true,
  showShareButtons = true,
}: BlogTableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');

  // Parse headings from content and build TOC
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const items: TOCItem[] = [];
    const headingStack: TOCItem[] = [];
    const usedIds = new Set<string>();

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';
      
      // Generate unique ID
      let id = heading.id || '';
      if (!id) {
        // Create a slug from the heading text
        const baseSlug = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        id = baseSlug || `heading-${index}`;
        
        // Ensure uniqueness
        let counter = 1;
        const originalId = id;
        while (usedIds.has(id)) {
          id = `${originalId}-${counter}`;
          counter++;
        }
        usedIds.add(id);
      }

      const item: TOCItem = {
        id,
        text,
        level,
      };

      // Build hierarchical structure
      while (headingStack.length > 0 && headingStack[headingStack.length - 1].level >= level) {
        headingStack.pop();
      }

      if (headingStack.length > 0) {
        if (!headingStack[headingStack.length - 1].children) {
          headingStack[headingStack.length - 1].children = [];
        }
        headingStack[headingStack.length - 1].children!.push(item);
      } else {
        items.push(item);
      }

      headingStack.push(item);
    });

    setTocItems(items);
  }, [content]);

  // Handle scroll to track active section
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentSection = '';
             const headerOffset = 176;

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= headerOffset + 50) {
          currentSection = heading.id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate reading time if not provided
  const calculatedReadingTime = readingTime || Math.ceil(content.split(' ').length / 200);

  // Format date
  const formattedDate = new Date(publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Share functionality
  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = title;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
  };

  const renderTOCItem = (item: TOCItem, depth: number = 0) => {
    const isActive = activeSection === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="space-y-1">
        <Link
          href={`#${item.id}`}
          className={cn(
            "block text-sm transition-colors hover:text-primary",
            "border-l-2 border-transparent hover:border-primary/50",
            "pl-3 py-1 rounded-r-md",
            isActive && "text-primary border-primary bg-primary/5",
            depth > 0 && "ml-4",
            item.level === 1 && "font-semibold",
            item.level === 2 && "font-medium",
            item.level >= 3 && "font-normal text-muted-foreground"
          )}
                                           onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(item.id);
              if (element) {
                const headerOffset = -720;
                const elementPosition = element.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }
            }}
        >
          {item.text}
        </Link>
        {hasChildren && (
          <div className="space-y-1">
            {item.children!.map((child) => renderTOCItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
             {/* Table of Contents Card */}
       <Card>
         <CardHeader className="pb-3">
           <CardTitle className="flex items-center gap-2 text-lg">
             <BookOpen className="h-5 w-5" />
             Table of Contents
           </CardTitle>
         </CardHeader>
         
         <CardContent>
           <nav className="space-y-2">
             {tocItems.length > 0 ? (
               tocItems.map((item) => renderTOCItem(item))
             ) : (
               <p className="text-sm text-muted-foreground">
                 No headings found in this article.
               </p>
             )}
           </nav>
         </CardContent>
       </Card>

      {/* Author Information */}
      {showAuthorInfo && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              About the Author
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={author.avatar_url} alt={author.name} />
                <AvatarFallback>
                  {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground">{author.name}</h4>
                {author.bio && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                    {author.bio}
                  </p>
                )}
                {author.website && (
                  <Link
                    href={author.website}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Article Metadata */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Article Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Publication Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Published on {formattedDate}</span>
          </div>

          {/* Reading Time */}
          {showReadingTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{calculatedReadingTime} min read</span>
            </div>
          )}

          {/* Category */}
          {category && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Category:</span>
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Buttons */}
      {showShareButtons && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="h-5 w-5" />
              Share This Article
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <button
                onClick={() => handleShare('twitter')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Facebook
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
              >
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
