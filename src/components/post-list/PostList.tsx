import { BlogPost } from '@/types/schema';
import { FC } from 'react';
import { SimplePost } from '../simple-post/SimplePost';

type Props = {
  posts: BlogPost[];
};

const PostList: FC<Props> = ({ posts }) => (
  <div className="bg-gray-100 p-4">
    <h2 className="text-2xl font-bold mb-4">Post List</h2>
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <SimplePost key={post.id} post={post} />
      ))}
    </div>
  </div>
);

export default PostList;
