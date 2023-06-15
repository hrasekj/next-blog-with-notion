import { NotionService } from '@/services/NotionService';
import { PostPage } from '@/types/schema';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { cache } from 'react';
import ReactMarkdown from 'react-markdown';

// @see https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating#background-revalidation
export const revalidate = 3600; // revalidate this page every 60 minutes

type PageProps = {
  params: Record<string, string>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { post } = await getSingleBlogPost(params.slug);

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      images: post.cover && {
        url: post.cover,
        width: 1920,
        height: 1080,
      },
    },
  };
}

export default async function Post({ params }: PageProps) {
  const { post, markdown } = await getSingleBlogPost(params.slug);

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <Link
          className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-125 filter invert mt-8"
          href="/"
        >
          <Image className="w-32 h-32 rounded-full" src="/maze2.svg" alt="maze" width="80" height="80" />
        </Link>
      </div>

      <article>
        <header className="text-center pt-16 md:pt-32">
          <h1 className="text-white font-bold break-normal text-3xl md:text-5xl">{post.title}</h1>
          <p className="text-sm md:text-base text-green-500 font-bold pt-4">
            <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
          </p>
        </header>

        <div
          className="container w-full max-w-6xl mx-auto bg-white bg-cover mt-8 rounded h-[75vh]"
          style={{
            backgroundImage: `url(${post.cover})`,
          }}
        />

        <div className="container max-w-5xl mx-auto -mt-32">
          <section className="bg-gray-900 w-full p-8 md:p-24 text-xl md:text-2xl text-gray-300 leading-normal">
            <ReactMarkdown className="prose max-w-none lg:prose-xl">{markdown}</ReactMarkdown>
          </section>
        </div>
      </article>
    </>
  );
}

const getSingleBlogPost = cache(async (slug: string): Promise<PostPage> => {
  const notionService = new NotionService();
  return notionService.getSingleBlogPost(slug);
});

function formatDate(date: Date) {
  const intl = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return intl.format(date);
}
