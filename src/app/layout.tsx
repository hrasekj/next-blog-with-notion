import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import './globals.tailwind.css';

// @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#the-metadata-object
export const metadata: Metadata = {
  title: {
    // in Next.js v13.4.5 it looks like template does not work.
    template: `%s | ${process.env.SITE_NAME}`,
    default: '🥷',
  },
  description: process.env.SITE_DESCRIPTION,

  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName,
    images: [
      {
        url: 'https://img.travel.rakuten.co.jp/m17n/com/campaign/ranking/ninja/img/key.jpg',
        width: 2000,
        height: 1333,
      },
    ],
  },
};

type Props = PropsWithChildren;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="bg-black font-sans leading-normal tracking-normal">
        <Header title={siteName} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
