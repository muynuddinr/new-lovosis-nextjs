import type { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import { supabase } from '@/app/lib/supabase';
import { createProductSchema, createBreadcrumbSchema } from '../../../utils/aeoSchemas';

async function getProduct(slug: string) {
  if (!supabase) return null;

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      sub_category:sub_categories(id, name, slug, category:categories(id, name, slug)),
      super_sub_category:super_sub_categories(id, name, slug, sub_category:sub_categories(id, name, slug, category:categories(id, name, slug)))
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !product) return null;
  return product;
}

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
     other: {
      'alternate-url-1': `https://educationaltrainerkits.com/product/${slug}`,
      'alternate-url-2': `https://electricaltrainerkits.com/product/${slug}`,
    },
     alternates: {
      canonical: `https://lovosis.in/product/${slug}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  const productSchema = product ? createProductSchema({
    name: product.name,
    description: product.description,
    image: product.image_url || '/logo0bg.png',
    category: product.category?.name || 'Educational Equipment'
  }) : null;

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://lovosis.in" },
    { name: "Products", url: "https://lovosis.in/products" },
    { name: product?.name || "Product", url: `https://lovosis.in/product/${slug}` }
  ]);

  return (
    <>
      {/* Product Schema for AEO */}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema),
          }}
        />
      )}

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <ProductDetailClient slug={slug} />
    </>
  );
}
