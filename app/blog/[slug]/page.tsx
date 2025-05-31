import { notFound } from 'next/navigation';
import { highlight } from 'sugar-high';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Metadata } from 'next';
import { getBlogPost, getAllBlogPostSlugs, getRelatedPosts } from '@/lib/blog';
import DateDisplay from '@/components/blog/DateDisplay';
import TagList from '@/components/blog/TagList';
import { Header } from '@/components/blog/Header';

const components = {
  h1: () => <hr style={{ marginBottom: '2em'}} />,
  code: ({ children } : {children: string }) => {
    console.log('type', typeof children);
    const codeHTML = typeof children === 'string' ? highlight(children) : children;
    return <code dangerouslySetInnerHTML={{ __html: codeHTML as string }} />;
  }
};
interface Params {
  slug: string;
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>; // Corrected type
}

interface Props {
  params: Params;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  // Await the params before using
  const { slug } = await params;

  try {
    const post = await getBlogPost(slug);

    if (!post) {
      return {
        title: 'Post Not Found | Kelly King',
        description: 'The requested blog post could not be found.',
      };
    }

    return {
      title: `${post.title} | Kelly King`,
      description: post.description,
      authors: [{ name: post.author }],
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.date,
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        creator: '@kellyking',
      },
    };
  } catch (error) {
    console.error(`Error generating metadata for post ${slug}:`, error);
    return {
      title: 'Error | Kelly King',
      description: 'There was an error loading this blog post.',
    };
  }
}

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const slugs = getAllBlogPostSlugs();
    return slugs.map(slug => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: Props) {
  // Await the params before using
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  try {
    const post = await getBlogPost(slug);

    if (!post) {
      notFound();
    }

    // Get related posts
    const relatedPosts = await getRelatedPosts(slug);

  return (
    <div className="min-h-screen pb-10 bg-gradient-to-br from-pink-50 via-white to-indigo-50 text-gray-800 font-sans">
      <Header />
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 mt-8 inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all posts
        </Link>

        <article className="mt-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center text-gray-600 mb-6">
              <div className="mr-4">
                By <span className="font-medium">{post.author}</span>
              </div>
              <DateDisplay dateString={post.date} className="mr-4" />
              <span>{post.readingTime.text}</span>
            </div>

            <p className="text-xl text-gray-600 mb-6">{post.description}</p>

            <TagList tags={post.tags} className="mb-8" />
          </header>

          <div className="blog-content">
            <MDXRemote source={post.content}  components={components}  />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors">{relatedPost.title}</h3>
                    <div className="text-sm text-gray-500 mb-2">
                      <DateDisplay dateString={relatedPost.date} />
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link href="/blog" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all posts
            </Link>
          </div>
        </article>
      </div>
    </div>
    );
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    notFound();
  }
}

