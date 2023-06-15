import { BlogPost } from '@/types/schema';
import { FC } from 'react';
import { SimplePost } from '../simple-post/SimplePost';

type Props = {
  posts: BlogPost[];
};

const PostList: FC<Props> = ({ posts }) => {
  const leadPost = posts.shift();

  return (
    <div className="w-full text-xl md:text-2xl text-gray-800 leading-normal rounded-t">
      {/*lead post*/}
      {leadPost && <SimplePost post={leadPost} />}

      {/*posts container*/}
      <div className="flex flex-wrap justify-between pt-12 -mx-6">
        {posts.map((post) => (
          <SimplePost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostList;
