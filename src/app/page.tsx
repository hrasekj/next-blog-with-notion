import PostList from '@/components/post-list/PostList';
import { NotionService } from '@/services/NotionService';

export default async function Home() {
  const notionService = new NotionService();
  const posts = await notionService.getPublishedBlogPots();

  return (
    <main className="container relative px-4 md:px-0 max-w-6xl mx-auto -mt-32">
      <PostList posts={posts} />
    </main>
  );
}
