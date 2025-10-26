'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
  images: Array<{ url: string }>;
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="relative pt-[75%] bg-gray-200 dark:bg-gray-700">
        <Image
          src="/api/placeholder/800/600"
          alt="Placeholder"
          fill
          className="object-contain p-4"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative pt-[75%]">
        <Image
          src={images[currentIndex].url}
          alt={`Product image ${currentIndex + 1}`}
          fill
          className="object-cover p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}