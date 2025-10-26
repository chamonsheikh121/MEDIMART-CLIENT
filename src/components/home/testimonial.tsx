'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarIcon } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Title from '../shared/title';

const testimonials = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Cardiologist',
    avatar: '/placeholder/48/48',
    content: 'MediMart has been our clinic\'s go-to supplier for years. Their quality and reliability have never disappointed us.',
    rating: 5,
  },
  {
    id: 2,
    name: 'James Wilson',
    role: 'Hospital Administrator',
    avatar: '/placeholder/48/48',
    content: 'The range of products and competitive pricing make MediMart our preferred partner for medical supplies.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Dr. Michael Chang',
    role: 'Family Physician',
    avatar: '/placeholder/48/48',
    content: 'Quick delivery and excellent customer service. I highly recommend MediMart to all healthcare practitioners.',
    rating: 4,
  },
  {
    id: 4,
    name: 'Nurse Emily Carter',
    role: 'ER Nurse',
    avatar: '/placeholder/48/48',
    content: 'Having reliable medical supplies during emergencies is crucial. MediMart always delivers on time.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Dr. Raj Patel',
    role: 'Orthopedic Surgeon',
    avatar: '/placeholder/48/48',
    content: 'Great quality instruments and friendly support staff. MediMart has become an integral part of our workflow.',
    rating: 4,
  },
  {
    id: 6,
    name: 'Linda Green',
    role: 'Clinic Manager',
    avatar: '/placeholder/48/48',
    content: 'Ordering and tracking supplies is so easy with MediMart. Their platform is intuitive and reliable.',
    rating: 5,
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-32 bg-slate-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">

        <Title
          title='What Our Customers Say'
          desc='Don&apos;t just take our word for it - hear from healthcare professionals who trust MediMart.'
        />

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 5000 }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className='mt-20'
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <Card className="bg-gray-50 dark:bg-gray-800 border-0 shadow-sm h-full">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex items-center gap-3 mt-auto">
                    <Avatar>
                      <AvatarImage src={`/api${testimonial.avatar}`} alt={testimonial.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {testimonial.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mt-5">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-4">
                      &quot;{testimonial.content}&quot;
                    </p>
                  </div>

                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
