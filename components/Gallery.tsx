'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

export default function Gallery() {
  const swiperRef = useRef<SwiperType | null>(null)

  const galleryImages = [
    {
      id: 1,
      src: '/images/gallery/shop-front.jpg',
      alt: 'Ahmed Steels & Cement Shop Front',
      title: 'Our Store',
    },
    {
      id: 2,
      src: '/images/gallery/cement-stock.jpg',
      alt: 'UltraTech Cement Stock',
      title: 'Premium Cement',
    },
    {
      id: 3,
      src: '/images/gallery/tmt-bars.jpg',
      alt: 'TMT Bars Collection',
      title: 'TMT Bars',
    },
    {
      id: 4,
      src: '/images/gallery/roofing-sheets.jpg',
      alt: 'Color Coated Roofing Sheets',
      title: 'Roofing Solutions',
    },
    {
      id: 5,
      src: '/images/gallery/steel-tubes.jpg',
      alt: 'Steel Tubes & Pipes',
      title: 'Steel Tubes',
    },
    {
      id: 6,
      src: '/images/gallery/warehouse.jpg',
      alt: 'Warehouse & Storage',
      title: 'Our Warehouse',
    },
    {
      id: 7,
      src: '/images/gallery/products-display.jpg',
      alt: 'Products Display',
      title: 'Product Range',
    },
    {
      id: 8,
      src: '/images/gallery/team.jpg',
      alt: 'Our Team',
      title: 'Expert Team',
    },
  ]

  return (
    <section id="gallery" className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary-100 rounded-full mb-4">
            <span className="text-primary-700 font-semibold text-sm">GALLERY</span>
          </div>
          <h2 className="section-title">
            Our Products & Facilities
          </h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Take a look at our extensive range of products and our well-stocked warehouse facilities.
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <Swiper
            modules={[Autoplay, Navigation, Pagination, EffectFade]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            speed={800}
            effect="fade"
            fadeEffect={{
              crossFade: true,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                effect: 'slide',
              },
              768: {
                slidesPerView: 2,
                effect: 'slide',
              },
              1024: {
                slidesPerView: 3,
                effect: 'slide',
              },
            }}
            className="gallery-swiper"
          >
            {galleryImages.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {image.title}
                      </h3>
                      <p className="text-gray-200 text-sm mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
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
            <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
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
  )
}
