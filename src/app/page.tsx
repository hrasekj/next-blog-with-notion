import Header from '@/components/header/Header';
import PostList from '@/components/post-list/PostList';
import { NotionService } from '@/services/NotionService';
import { Metadata } from 'next';

// @see https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating#background-revalidation
export const revalidate = 3600; // revalidate this page every 60 minutes

const siteName = process.env.SITE_NAME;

export const metadata: Metadata = {
  title: siteName,
};

export default async function Home() {
  const notionService = new NotionService();
  const posts = await notionService.getPublishedBlogPots();

  return (
    <>
      <Header title={siteName} />

      <main className="container relative px-4 md:px-0 max-w-6xl mx-auto -mt-32">
        <PostList posts={posts} />
      </main>
    </>
  );
}
