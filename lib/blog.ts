import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogPost {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  slug: string;
  content: string;
  readingTime: ReturnType<typeof readingTime>;
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

/**
 * Ensures the blog directory exists
 */
function ensureBlogDirectory(): void {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

/**
 * Get all blog post slugs
 */
export function getAllBlogPostSlugs(): string[] {
  ensureBlogDirectory();

  return fs.readdirSync(BLOG_DIR)
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .map(file => file.replace(/\.(md|mdx)$/, ''));
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    ensureBlogDirectory();

    // Try with .mdx extension first
    let fullPath = path.join(BLOG_DIR, `${slug}.mdx`);

    // If not found, try with .md extension
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(BLOG_DIR, `${slug}.md`);

      // If still not found, return null
      if (!fs.existsSync(fullPath)) {
        return null;
      }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      title: data.title || 'Untitled Post',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'Anonymous',
      tags: data.tags || [],
      slug,
      content,
      readingTime: readingTime(content)
    };
  } catch (e) {
    console.error(`Error reading blog post ${slug}:`, e);
    return null;
  }
}

/**
 * Get all blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const slugs = getAllBlogPostSlugs();
  const postPromises = slugs.map(slug => getBlogPost(slug));
  const posts = (await Promise.all(postPromises)).filter((post): post is BlogPost => post !== null);

  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get all blog posts
 */
export async function getRecentBlogPosts(): Promise<BlogPost[]> {
  const slugs = getAllBlogPostSlugs();
  const postPromises = slugs.map(slug => getBlogPost(slug));
  const posts = (await Promise.all(postPromises)).filter((post): post is BlogPost => post !== null);

  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 2);
}

/**
 * Get related posts based on matching tags
 */
export async function getRelatedPosts(currentSlug: string, limit: number = 3): Promise<BlogPost[]> {
  const currentPost = await getBlogPost(currentSlug);
  if (!currentPost || !currentPost.tags.length) {
    return [];
  }

  const allPosts = await getAllBlogPosts();

  return allPosts
    .filter(post =>
      post.slug !== currentPost.slug &&
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, limit);
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter(post => post.tags.includes(tag));
}

/**
 * Get all unique tags from all posts
 */
export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllBlogPosts();
  const tagSet = new Set<string>();

  allPosts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

