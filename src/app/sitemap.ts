import { MetadataRoute } from 'next'
import { supabase } from '@/app/lib/supabase'

interface Category {
    id: string
    name: string
    slug: string
    description: string
    image_url: string | null
    status: string
    created_at: string
    updated_at: string
}

interface Subcategory {
    id: string
    name: string
    slug: string
    description: string
    category_id: string
    image_url: string | null
    status: string
    created_at: string
    updated_at: string
}

interface SuperSubcategory {
    id: string
    name: string
    slug: string
    description: string
    sub_category_id: string
    image_url: string | null
    status: string
    created_at: string
    updated_at: string
}

interface Product {
    id: string
    name: string
    slug: string
    description: string
    key_features: string
    image_url: string | null
    status: string
    created_at: string
    updated_at: string
}

// Internal functions that replicate API logic
async function getCategories() {
    if (!supabase) return []
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('status', 'active')
        .order('name')
    return error ? [] : data || []
}

async function getSubcategories() {
    if (!supabase) return []
    const { data, error } = await supabase
        .from('sub_categories')
        .select('*')
        .eq('status', 'active')
        .order('name')
    return error ? [] : data || []
}

async function getSuperSubcategories() {
    if (!supabase) return []
    const { data, error } = await supabase
        .from('super_sub_categories')
        .select('*')
        .eq('status', 'active')
        .order('name')
    return error ? [] : data || []
}

async function getProducts() {
    if (!supabase) return []
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
    return error ? [] : data || []
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://lovosis.in'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/Services`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/Contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/Certificates`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ]

    try {
        if (!supabase) {
            console.warn('Supabase not configured, returning static pages only')
            return staticPages
        }

        // Fetch all data using internal functions (same logic as API routes)
        const [categories, subcategories, superSubcategories, products] = await Promise.all([
            getCategories(),
            getSubcategories(),
            getSuperSubcategories(),
            getProducts()
        ])

        // Process categories
        const categoryPages: MetadataRoute.Sitemap = categories.map((category: Category) => ({
            url: `${baseUrl}/products/${category.slug}`,
            lastModified: new Date(category.updated_at || category.created_at),
            changeFrequency: 'weekly',
            priority: 0.7,
        }))

        // Process subcategories
        const subcategoryPages: MetadataRoute.Sitemap = subcategories.map((subcategory: Subcategory) => ({
            url: `${baseUrl}/products/${subcategory.slug}`,
            lastModified: new Date(subcategory.updated_at || subcategory.created_at),
            changeFrequency: 'weekly',
            priority: 0.6,
        }))

        // Process super-subcategories
        const superSubcategoryPages: MetadataRoute.Sitemap = superSubcategories.map((superSubcategory: SuperSubcategory) => ({
            url: `${baseUrl}/products/${superSubcategory.slug}`,
            lastModified: new Date(superSubcategory.updated_at || superSubcategory.created_at),
            changeFrequency: 'weekly',
            priority: 0.5,
        }))

        // Process products
        const productPages: MetadataRoute.Sitemap = products.map((product: Product) => ({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: new Date(product.updated_at || product.created_at),
            changeFrequency: 'weekly',
            priority: 0.8,
        }))

        return [...staticPages, ...categoryPages, ...subcategoryPages, ...superSubcategoryPages, ...productPages]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        // Return only static pages if database calls fail
        return staticPages
    }
}