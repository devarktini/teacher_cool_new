import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ProductActions from '@/components/products/ProductActions'
import ProductGallery from '@/components/products/ProductGallery'
import ProductSchema from '@/components/products/ProductSchema'
import RelatedProducts from '@/components/products/RelatedProducts'
import { mockProducts } from '@/data/mockData'

interface ProductPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = mockProducts.find(p => p.id.toString() === params.slug)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: `${product.name} | Your Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
      type: 'product'
    },
    robots: {
      index: true,
      follow: true
    }
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts.find(p => p.id.toString() === params.slug)
  if (!product) return notFound()

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Product Gallery */}
        <ProductGallery images={[product.image]} />

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li><a href="/" className="text-gray-500 hover:text-gray-700">Home</a></li>
              <li><span className="text-gray-500">/</span></li>
              <li><a href="/products" className="text-gray-500 hover:text-gray-700">Products</a></li>
              <li><span className="text-gray-500">/</span></li>
              <li><span className="text-gray-900">{product.name}</span></li>
            </ol>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <p className="mt-3 text-3xl tracking-tight text-gray-900">
              ${product.price.toFixed(2)}
            </p>
          </header>

          <div className="mt-6">
            <h2 className="sr-only">Product description</h2>
            <div className="text-base text-gray-700 space-y-6">
              {product.description}
            </div>
          </div>

          {/* Product Actions */}
          <ProductActions product={product} />

          {/* Additional Details */}
          <section className="mt-12">
            <h2 className="text-lg font-medium text-gray-900">Details</h2>
            <dl className="mt-4 border-t border-gray-200">
              <div className="py-3 grid grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="text-sm text-gray-900">{product.category}</dd>
              </div>
              <div className="py-3 grid grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">Brand</dt>
                <dd className="text-sm text-gray-900">{product.brand}</dd>
              </div>
              {/* Add more details as needed */}
            </dl>
          </section>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts 
        currentProductId={product.id} 
        category={product.category} 
      />

      {/* Structured Data */}
      <ProductSchema product={product} />
    </article>
  )
}
