'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <div className='dark:bg-gray-900 bg-slate-100 pt-20'>
      <div className="relative container mx-auto overflow-hidden rounded-3xl md:px-20 p-5">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/SLIDE.webp"
            alt="Background"
            fill
            className="object-cover "
            priority
          />
        </div>

        <div className="relative z-10  px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">
                Your Health, Our Priority
              </h1>
              <p className="text-sm md:text-lg text-gray-300">
                MediMart offers a wide range of trusted healthcare products and medical supplies to support your well-being.
                Whether at home or in a clinic, we make it easy to access the essentials you need <br /> <br /> — with reliability you can count on.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="dark:bg-white dark:hover:bg-slate-100  dark:text-blue-600 bg-blue-700 hover:bg-blue-800">
                  Browse Products
                </Button>

              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-full  h-72 md:h-[450px]">
                <Image
                  src="/image.webp"
                  alt="Medical Equipment"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}