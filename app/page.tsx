import { Metadata } from 'next';
import HomeContent from '@/components/client/HomeContent';
import { getRecentBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Kelly King - Software Engineer',
  description: 'Front End / Full Stack Engineer with 13 years of experience, previously at Twitter and Tumblr.',
  openGraph: {
    title: 'Kelly King - Software Engineer',
    description: 'Front End / Full Stack Engineer with 13 years of experience, previously at Twitter and Tumblr.',
    url: 'https://kellyking.me',
    siteName: 'Kelly King',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kelly King - Software Engineer',
    description: 'Front End / Full Stack Engineer with 13 years of experience, previously at Twitter and Tumblr.',
    creator: '@kellyking',
  },
};

export default async function HomePage() {
  const posts = await getRecentBlogPosts();
  return (
    <>
      <HomeContent posts={posts} />
    </>
  );
}
