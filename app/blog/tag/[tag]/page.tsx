import { Metadata } from 'next';
import { getPostsByTag, getAllTags } from '@/lib/blog';
import DateDisplay from '@/components/blog/DateDisplay';
import TagList from '@/components/blog/TagList';
import { Header } from '@/components/blog/Header';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: Promise<{ tag: string }>; // Corrected type
}

export const metadata: Metadata = {
  title: 'Tagged posts | Kelly King',
  description: 'Thoughts on software development, web technologies, and engineering culture.',
  openGraph: {
    title: 'Tagged posts | Kelly King',
    description: 'Thoughts on software development, web technologies, and engineering culture.',
    type: 'website',
  },
};

export default async function BlogTagPage({ params }: BlogPostPageProps) {
  // Await the params before using
  const resolvedParams = await Promise.resolve(params);
  const { tag } = resolvedParams;

  try {

    const [posts, tags] = await Promise.all([
      getPostsByTag(tag),
      getAllTags()
    ]);

    if (!posts) {
      notFound();
    }

    return (
      <div className="min-h-screen pb-10 bg-gradient-to-br from-pink-50 via-white to-indigo-50 text-gray-800 font-sans">
      <Header />
      <div>
          {tags.length > 0 && (
            <div className="mt-6 mb-6">
              <TagList tags={tags} className="justify-center" />
            </div>
          )}
        </div>
        <div className="max-w-3xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No blog posts found yet. Check back soon!</p>
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.slug} className="mb-10 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold mb-2 text-indigo-700 hover:text-indigo-900 transition-colors">
                    {post.title}
                  </h2>
                </Link>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <DateDisplay dateString={post.date} />
                  <span className="mx-2">•</span>
                  <span>{post.readingTime.text}</span>
                </div>

                <p className="text-gray-700 mb-4">{post.description}</p>

                <div className="flex justify-between items-center">
                  <TagList tags={post.tags} />
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                  >
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading blog index:", error);
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-700 mb-4">Error Loading Blog</h1>
            <p className="text-red-600">There was an error loading the blog posts. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
}

