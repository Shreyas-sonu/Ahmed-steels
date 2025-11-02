import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/70" />
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 py-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary-600/20 backdrop-blur-sm border border-primary-400/30 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-primary-400 rounded-full mr-2 animate-pulse" />
            <span className="text-primary-300 text-sm font-medium">
              Trusted Construction Material Supplier
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Your Trusted Partner in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-500 mt-2">
              Steel & Cement
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed animate-slide-up-delay">
            Supplying quality construction materials for every project. 
            From TMT bars to cement, we&apos;ve got your building needs covered.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 animate-fade-in-delay">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-primary-600/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Premium Quality</span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-primary-600/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Best Prices</span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-primary-600/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Fast Delivery</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-delay-2">
            <a
              href="#enquiry"
              className="btn-primary inline-flex items-center justify-center group"
            >
              Send Enquiry
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#products"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 border border-white/30 hover:border-white/50 inline-flex items-center justify-center"
            >
              View Products
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full animate-scroll" />
        </div>
      </div>
    </section>
  )
}
