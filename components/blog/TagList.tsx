'use client';

import TagLink from './TagLink';

interface TagListProps {
  tags: string[];
  className?: string;
  linkable?: boolean;
}

export default function TagList({ tags, className = '', linkable = true }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        linkable ? (
          <TagLink key={tag} tag={tag} />
        ) : (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {tag}
          </span>
        )
      ))}
    </div>
  );
}
