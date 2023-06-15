import PostList from '@/components/post-list/PostList';
import { NotionService } from '@/services/NotionService';

export default async function Home() {
  const notionService = new NotionService();
  const posts = await notionService.getPublishedBlogPots();

  return <PostList posts={posts} />;
}
