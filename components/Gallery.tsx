"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Gallery() {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const galleryImages = [
    {
      id: 1,
      src: "/images/gallery/shop-front.jpg",
      alt: "Ahmed Steels & Cement Shop Front - Your trusted construction materials store",
      title: "Our Store Front",
      description: "Welcome to Ahmed Steels & Cement",
    },
    {
      id: 2,
      src: "/images/gallery/ultractech.webp",
      alt: "UltraTech Cement - Premium quality cement bags in stock",
      title: "UltraTech Cement",
      description: "Premium quality cement for strong foundations",
    },
    {
      id: 3,
      src: "/images/gallery/TMT.webp",
      alt: "TMT Steel Bars - High strength reinforcement bars",
      title: "TMT Steel Bars",
      description: "High-grade TMT bars for construction",
    },
    {
      id: 4,
      src: "/images/gallery/roofSheet.jpg",
      alt: "Color Coated Roofing Sheets - Durable roofing solutions",
      title: "Roofing Sheets",
      description: "Color coated sheets for lasting protection",
    },
    {
      id: 5,
      src: "/images/gallery/wireMesh.webp",
      alt: "Wire Mesh - Quality wire mesh for various applications",
      title: "Wire Mesh",
      description: "Durable wire mesh for construction needs",
    },
    {
      id: 6,
      src: "/images/gallery/stocks.webp",
      alt: "Warehouse Stock - Well-stocked inventory of construction materials",
      title: "Our Warehouse",
      description: "Extensive stock for immediate delivery",
    },
    {
      id: 7,
      src: "/images/gallery/CementSTock.webp",
      alt: "Cement Stock - Large inventory of cement bags",
      title: "Cement Inventory",
      description: "Always stocked with premium cement",
    },
    {
      id: 8,
      src: "/images/gallery/ware-housestocks-tmt.webp",
      alt: "TMT Warehouse Stock - Organized storage of TMT bars",
      title: "TMT Storage",
      description: "Organized TMT bar storage facility",
    },
    {
      id: 9,
      src: "/images/gallery/nail-hardware.jpg",
      alt: "Nails & Hardware - Complete range of construction hardware",
      title: "Hardware Items",
      description: "Comprehensive hardware collection",
    },
    {
      id: 10,
      src: "/images/gallery/oshima-welding-rods.png",
      alt: "Oshima Welding Rods - Professional grade welding electrodes",
      title: "Welding Rods",
      description: "Premium Oshima welding electrodes",
    },
    {
      id: 11,
      src: "/images/gallery/roff-sheet-screw.jpg",
      alt: "Roff Sheet Screws - Quality fasteners for roofing",
      title: "Roofing Screws",
      description: "Durable Roff sheet screws",
    },
    {
      id: 12,
      src: "/images/gallery/ss-wire-mesh.jpeg",
      alt: "Stainless Steel Wire Mesh - Premium SS mesh for industrial use",
      title: "SS Wire Mesh",
      description: "High-quality stainless steel mesh",
    },
    {
      id: 13,
      src: "/images/gallery/yuri-cut-off-wheel-500x500.webp",
      alt: "Yuri Cut-Off Wheel - Professional cutting wheels",
      title: "Cutting Wheels",
      description: "Yuri brand cutting wheels",
    },
    {
      id: 14,
      src: "/images/gallery/cashCounter.webp",
      alt: "Cash Counter - Efficient billing and customer service",
      title: "Billing Counter",
      description: "Quick and efficient service",
    },
    {
      id: 15,
      src: "/images/gallery/cement.jpg",
      alt: "Cement Bags Display - Various cement brands available",
      title: "Cement Display",
      description: "Wide range of cement brands",
    },
  ];

  return (
    <section
      id="gallery"
      className="section-padding bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary-100 rounded-full mb-4">
            <span className="text-primary-700 font-semibold text-sm">
              GALLERY
            </span>
          </div>
          <h2 className="section-title">Our Products & Facilities</h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Take a look at our extensive range of products and our well-stocked
            warehouse facilities.
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: prevButtonRef.current,
              nextEl: nextButtonRef.current,
            }}
            onBeforeInit={swiper => {
              if (typeof swiper.params.navigation !== "boolean") {
                const navigation = swiper.params.navigation;
                if (navigation) {
                  navigation.prevEl = prevButtonRef.current;
                  navigation.nextEl = nextButtonRef.current;
                }
              }
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            speed={600}
            onSwiper={swiper => {
              swiperRef.current = swiper;
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="gallery-swiper pb-12"
          >
            {galleryImages.map(image => (
              <SwiperSlide key={image.id}>
                <div className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={image.id == 2 ? { objectFit: "contain" } : {}}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {image.title}
                      </h3>
                      <p className="text-gray-200 text-sm mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {image.description}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            ref={prevButtonRef}
            onClick={() => swiperRef.current?.slidePrev()}
            className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300 group"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            ref={nextButtonRef}
            onClick={() => swiperRef.current?.slideNext()}
            className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300 group"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600 font-medium">Products</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              1000+
            </div>
            <div className="text-gray-600 font-medium">Happy Customers</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl font-bold text-primary-600 mb-2">10+</div>
            <div className="text-gray-600 font-medium">Years Experience</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
