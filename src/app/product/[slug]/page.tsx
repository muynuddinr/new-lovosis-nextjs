import type { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const productName = slug.replace(/-/g, ' ');

  return {
    title: `${productName} | Contact Us for Details`,
    description: `Contact us for details, and training information about ${productName}.`,
    keywords: [
      productName,
      'educational trainer kit',
      'electronics trainer kit',
      'electrical trainer kit',
      'IT training solutions',
      'contact us for details',
    ],
    openGraph: {
      title: `${productName} | Lovosis`,
      description: `Contact us for details and training support for ${productName}.`,
      url: `https://lovosis.in/product/${slug}`,
      siteName: 'Lovosis',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ProductDetailClient slug={slug} />;
}
