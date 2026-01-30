import type { Metadata } from 'next';
import ProductsSlugClient from './ProductsSlugClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const formattedName = slug
    .map(word => word.replace(/-/g, ' '))
    .join(' | ');

  return {
    title: `${formattedName} | IT Services & Educational Trainer Kits`,
    description:
      'Explore IT services, educational trainer kits, electronics and electrical products for learning, training, and innovation.',
    keywords: [
      'IT services',
      'educational trainer kits',
      'electronics trainer kit',
      'electrical trainer kit',
      'learning kits',
      'engineering training kits',
    ],
    openGraph: {
      title: `${formattedName} | Lovosis`,
      description:
        'IT Services and Educational Trainer Kits including electronics and electrical solutions for education and industry.',
      url: `https://lovosis.in/${slug.join('/')}`,
      siteName: 'Lovosis',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductsSlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: slugArray } = await params;

  return <ProductsSlugClient slugArray={slugArray} />;
}
