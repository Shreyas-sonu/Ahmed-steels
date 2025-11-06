"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Hero() {
  const [dragPosition, setDragPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [clickSequence, setClickSequence] = useState<number[]>([]);
  const [randomNumbers] = useState([
    Math.floor(Math.random() * 900) + 100,
    Math.floor(Math.random() * 900) + 100,
    Math.floor(Math.random() * 900) + 100,
  ]);
  const router = useRouter();
  const badgeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  // Drag threshold - how far to drag to reveal buttons (in pixels)
  const DRAG_THRESHOLD = 150;

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX - dragPosition;
  };

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const newPosition = clientX - startXRef.current;

      // Limit drag to positive values only (right direction) and max threshold
      const clampedPosition = Math.max(
        0,
        Math.min(newPosition, DRAG_THRESHOLD)
      );
      setDragPosition(clampedPosition);

      // Reveal buttons when dragged past threshold
      if (clampedPosition >= DRAG_THRESHOLD && !showButtons) {
        setShowButtons(true);
      }
    },
    [isDragging, showButtons]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);

    // If not dragged enough, snap back
    if (dragPosition < DRAG_THRESHOLD) {
      setDragPosition(0);
      setShowButtons(false);
    } else {
      // Keep it at the threshold position
      setDragPosition(DRAG_THRESHOLD);
    }
  }, [dragPosition]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove);
      window.addEventListener("touchend", handleDragEnd);

      return () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleDragMove);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleButtonClick = (buttonIndex: number) => {
    const newSequence = [...clickSequence, buttonIndex];
    setClickSequence(newSequence);

    // Check for correct sequence: 2 clicks on button 3 (last), then 3 clicks on button 2 (center)
    // Sequence should be: [3, 3, 2, 2, 2]
    if (newSequence.length >= 5) {
      const lastFive = newSequence.slice(-5);
      if (
        lastFive[0] === 3 &&
        lastFive[1] === 3 &&
        lastFive[2] === 2 &&
        lastFive[3] === 2 &&
        lastFive[4] === 2
      ) {
        // Correct sequence! Set access token and navigate to login
        sessionStorage.setItem("admin_access_token", Date.now().toString());
        router.push("/admin/login");
      }
    }

    // Reset after 10 seconds of inactivity
    setTimeout(() => {
      setClickSequence([]);
    }, 10000);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
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
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 py-20">
        <div className="max-w-4xl">
          {/* Draggable Badge Container */}
          <div ref={containerRef} className="relative mb-6 h-10">
            {/* Track/Rail for visual feedback */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-64 h-1 bg-primary-400/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-400 transition-all duration-200"
                style={{ width: `${(dragPosition / DRAG_THRESHOLD) * 100}%` }}
              />
            </div>

            {/* Draggable Badge */}
            <div
              ref={badgeRef}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              className={`inline-flex items-center px-4 py-2 bg-primary-600/20 backdrop-blur-sm border border-primary-400/30 rounded-full animate-fade-in select-none touch-none ${
                isDragging ? "cursor-grabbing scale-105" : "cursor-grab"
              } transition-all duration-200 shadow-lg hover:shadow-xl`}
              style={{
                transform: `translateX(${dragPosition}px)`,
              }}
            >
              <span className="w-2 h-2 bg-primary-400 rounded-full mr-2 animate-pulse" />
              <span className="text-primary-300 text-sm font-medium">
                Trusted Construction Material Supplier
              </span>
              {dragPosition > 0 && dragPosition < DRAG_THRESHOLD && (
                <span className="ml-2 text-primary-400 text-xs">
                  → {Math.round((dragPosition / DRAG_THRESHOLD) * 100)}%
                </span>
              )}
            </div>
          </div>

          {/* Secret Buttons - Hidden until badge is dragged */}
          {showButtons && (
            <div className="flex gap-2 mb-6 animate-fade-in">
              {randomNumbers.map((num, idx) => (
                <button
                  key={idx}
                  onClick={() => handleButtonClick(idx + 1)}
                  className="px-3 py-1.5 bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded text-gray-400 text-xs hover:bg-gray-700/50 hover:text-gray-200 transition-all"
                >
                  {num}
                </button>
              ))}
            </div>
          )}

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Your Trusted Partner in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-500 mt-2">
              Steel & Cement
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed animate-slide-up-delay">
            Supplying quality construction materials for every project. From TMT
            bars to cement, we&apos;ve got your building needs covered.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 animate-fade-in-delay">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-primary-600/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-medium">Premium Quality</span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-primary-600/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-medium">Best Prices</span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-primary-600/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
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
  );
}
