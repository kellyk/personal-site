'use client';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';
import DateDisplay from './DateDisplay';
// import TagList from './TagList';

export default function BlogSection({posts }: {posts: BlogPost[]}) {
  const recentPosts = posts.slice(0, 3);


  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-pink-700">Blog posts</h2>
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
        >
          View all posts
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      <div className="grid md:grid-cols-1 gap-8">
        {recentPosts.map((post) => (
          <article key={post.slug} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <Link href={`/blog/${post.slug}`}>
              <h3 className="text-xl font-bold mb-2 text-indigo-700 hover:text-indigo-900 transition-colors">
                {post.title}
              </h3>
            </Link>

            <div className="text-sm text-gray-500 mb-3">
              <DateDisplay dateString={post.date} />
              {post.readingTime && (
                <span className="ml-2 text-xs">• {post.readingTime.text}</span>
              )}
            </div>

            <p className="text-gray-700 mb-4 line-clamp-3">{post.description}</p>

            {/* <div className="flex justify-between items-center">
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
            </div> */}
          </article>
        ))}
      </div>
    </section>
  );
}

