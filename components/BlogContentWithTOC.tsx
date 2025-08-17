"use client"

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface BlogContentWithTOCProps {
  content: string;
  className?: string;
}

export default function BlogContentWithTOC({ 
  content, 
  className = "" 
}: BlogContentWithTOCProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Add IDs to headings that don't have them
    const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const usedIds = new Set<string>();
    
    headings.forEach((heading, index) => {
      if (!heading.id) {
        // Create a slug from the heading text
        const text = heading.textContent || '';
        const baseSlug = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        let id = baseSlug || `heading-${index}`;
        
        // Ensure uniqueness
        let counter = 1;
        const originalId = id;
        while (usedIds.has(id)) {
          id = `${originalId}-${counter}`;
          counter++;
        }
        usedIds.add(id);
        
        heading.id = id;
      } else {
        // If heading already has an ID, add it to usedIds to avoid conflicts
        usedIds.add(heading.id);
      }
    });
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className={cn("prose prose-lg max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
