import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
}

export default function Products() {
  const products: Product[] = [
    {
      id: 1,
      name: "UltraTech Cement",
      description:
        "Premium quality cement for all construction needs. Trusted brand with superior strength and durability.",
      image: "/images/products/ultratech-cement.jpg",
      category: "Cement",
    },
    {
      id: 2,
      name: "Leakage Oil",
      description:
        "Advanced waterproofing solution for roofing. Prevents water seepage and extends roof life.",
      image: "/images/products/leakage-oil.jpg",
      category: "Waterproofing",
    },
    {
      id: 3,
      name: "TMT Bars (Apex)",
      description:
        "High-strength reinforcement bars with superior bendability. Fe 500D grade for maximum safety.",
      image: "/images/products/tmt-apex.jpg",
      category: "Steel",
    },
    {
      id: 4,
      name: "TMT Bars (Turbo)",
      description:
        "Premium quality TMT bars with excellent corrosion resistance. Ideal for all construction projects.",
      image: "/images/products/tmt-turbo.jpg",
      category: "Steel",
    },
    {
      id: 5,
      name: "Color Coated Roofing Sheet",
      description:
        "Durable and weather-resistant roofing sheets. Available in various colors and profiles.",
      image: "/images/products/roofing-sheet.jpg",
      category: "Roofing",
    },
    {
      id: 6,
      name: "Apollo Steel Tubes",
      description:
        "High-quality steel tubes for structural applications. Available in various sizes and specifications.",
      image: "/images/products/apollo-tubes.jpg",
      category: "Steel Tubes",
    },
    {
      id: 7,
      name: "A-1 Steel Tubes",
      description:
        "Reliable steel tubes with consistent quality. Perfect for construction and fabrication work.",
      image: "/images/products/a1-tubes.jpg",
      category: "Steel Tubes",
    },
    {
      id: 8,
      name: "Hexagon Rods",
      description:
        "Premium hexagon rods for windows, grills, and decorative metalwork. Various sizes available.",
      image: "/images/products/hexagon-rods.jpg",
      category: "Steel",
    },
    {
      id: 9,
      name: "MS Channels",
      description:
        "Mild steel channels for structural applications. Available in standard and custom sizes.",
      image: "/images/products/ms-channels.jpg",
      category: "Structural Steel",
    },
    {
      id: 10,
      name: "MS Sections",
      description:
        "Various structural steel sections including angles, beams, and joists for construction.",
      image: "/images/products/ms-sections.jpg",
      category: "Structural Steel",
    },
    {
      id: 11,
      name: "Hardware Items",
      description:
        "Complete range of construction hardware including nails, screws, bolts, and fasteners.",
      image: "/images/products/hardware.jpg",
      category: "Hardware",
    },
    {
      id: 12,
      name: "Wire & Binding Wire",
      description:
        "High-quality GI wire and binding wire for construction purposes. Available in various gauges.",
      image: "/images/products/wire.jpg",
      category: "Hardware",
    },
  ];

  return (
    <section id="products" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary-100 rounded-full mb-4">
            <span className="text-primary-700 font-semibold text-sm">
              OUR PRODUCTS
            </span>
          </div>
          <h2 className="section-title">Quality Construction Materials</h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            We offer a comprehensive range of premium construction materials
            from trusted brands. All products meet industry standards and
            specifications.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6 text-lg">
            Can&apos;t find what you&apos;re looking for? We have many more
            products in stock!
          </p>
          <a href="#enquiry" className="btn-primary inline-flex items-center">
            Contact Us for More Products
          </a>
        </div>
      </div>
    </section>
  );
}
