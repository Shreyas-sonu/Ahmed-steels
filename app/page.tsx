import EnquiryForm from "@/components/EnquiryForm";
import GalleryCarousel from "@/components/GalleryCarousel";
import Hero from "@/components/Hero";
import Products from "@/components/Products";

export default function Home() {
  return (
    <>
      <Hero />
      <Products />
      <GalleryCarousel />
      <EnquiryForm />
    </>
  );
}
