"use client";
import useEmblaCarousel from "embla-carousel-react";

export default function BasicCarousel() {
  const [emblaRef] = useEmblaCarousel();

  return (
    <div className="overflow-hidden" ref={emblaRef}>   {/* viewport */}
      <div className="flex">                            {/* container */}
        <div className="min-w-0 flex-[0_0_100%]">Slide 1</div>
        <div className="min-w-0 flex-[0_0_100%]">Slide 2</div>
        <div className="min-w-0 flex-[0_0_100%]">Slide 3</div>
      </div>
    </div>
  );
}