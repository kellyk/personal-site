'use client';

import Link from 'next/link';

interface TagLinkProps {
  tag: string;
  className?: string;
}

export default function TagLink({ tag, className = '' }: TagLinkProps) {
  return (
    <Link
      href={`/blog/tag/${encodeURIComponent(tag)}`}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors ${className}`}
    >
      {tag}
    </Link>
  );
}

