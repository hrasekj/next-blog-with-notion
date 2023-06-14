import { BlogPost } from '@/types/schema';
import Image from 'next/image';
import { FC } from 'react';

type Props = {
  className?: string;
  post: BlogPost;
};

export const SimplePost: FC<Props> = ({ className, post }) => (
  <div className={'bg-white rounded shadow mb-4 ' + (className ?? '')}>
    <Image src={post.cover} alt={post.title} width={500} height={300} className="rounded-t" />
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
      <p className="text-gray-700">{post.description}</p>
    </div>
  </div>
);
