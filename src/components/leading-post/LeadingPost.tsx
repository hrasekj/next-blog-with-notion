import { BlogPost } from '@/types/schema';
import Link from 'next/link';
import { FC } from 'react';
import ImageWithShimmer from '../images/ImageWithShimmer';
import SimplePostFooter from '../simple-post/SimplePostFooter';
import TagList from '../simple-post/TagList';

type Props = {
  className?: string;
  post: BlogPost;
};

const LeadingPost: FC<Props> = ({ post }) => (
  <div className="flex rounded overflow-hidden shadow-lg">
    <div className="flex flex-wrap no-underline hover:no-underline">
      <div className="w-full md:w-2/3 rounded-t">
        <ImageWithShimmer
          className="h-full w-full object-cover shadow"
          src={post.cover}
          alt={post.title}
          width={800}
          height={600}
        />
      </div>

      <div className="w-full md:w-1/3 flex flex-col flex-grow flex-shrink bg-gray-900 text-white">
        <TagList tags={post.tags} />

        <Link className="flex flex-wrap no-underline hover:no-underline" href={post.slug}>
          <h3 className="w-full font-bold text-xl mt-6 px-6">{post.title}</h3>
          <p className="font-serif text-base px-6 mb-5">{post.description}</p>
        </Link>

        <div className="bg-gray-900 flex-none mt-auto rounded-b overflow-hidden shadow-lg p-6">
          <div className="flex items-center justify-between">
            <SimplePostFooter />
            <p className=" text-xs md:text-sm">1 MIN READ</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LeadingPost;
