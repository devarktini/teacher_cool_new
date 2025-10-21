import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { mockProducts } from '@/data/mockData'
import { Card, CardContent } from '@/components/ui/cards/Card'
import AddToCartButton from '@/components/products/AddToCartButton'

interface ProductPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = mockProducts.find(p => p.id.toString() === params.id)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: `${product.name} | Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
      type: 'product'
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts.find(p => p.id.toString() === params.id)
  if (!product) return notFound()

  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center space-x-2 text-sm">
                  <li>
                    <a href="/" className="text-gray-500 hover:text-gray-700">
                      Home
                    </a>
                  </li>
                  <li>/</li>
                  <li>
                    <a href="/products" className="text-gray-500 hover:text-gray-700">
                      Products
                    </a>
                  </li>
                </ol>
              </nav>

              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold text-blue-600 mb-4">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Product Metadata */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm text-gray-500">Category</h3>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Brand</h3>
                  <p className="font-medium">{product.brand}</p>
                </div>
              </div>

              <AddToCartButton product={product} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
