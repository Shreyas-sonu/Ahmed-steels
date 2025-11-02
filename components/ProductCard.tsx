import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200 transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-xs font-semibold text-primary-700">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Action Button */}
        <a
          href="#enquiry"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm group/btn"
        >
          Get Quote
          <svg
            className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
