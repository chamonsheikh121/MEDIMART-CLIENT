'use client'
import Image from 'next/image'

export default function MedicalServicesSection() {
  return (
    <div className="relative w-full bg-slate-100 dark:bg-gray-900 overflow-hidden py-16 px-4 md:px-6 lg:px-8">
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 text-blue-600 dark:text-blue-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 0L15.464 8.536L24 12L15.464 15.464L12 24L8.536 15.464L0 12L8.536 8.536L12 0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute top-20 left-8 text-red-500 dark:text-red-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 0L15.464 8.536L24 12L15.464 15.464L12 24L8.536 15.464L0 12L8.536 8.536L12 0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute bottom-16 right-12 text-red-500 dark:text-red-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 0L15.464 8.536L24 12L15.464 15.464L12 24L8.536 15.464L0 12L8.536 8.536L12 0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute bottom-40 left-1/4 text-purple-500 dark:text-purple-400">
        <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
          <path d="M0 12C4 6 8 0 12 12C16 24 20 6 24 12C28 18 32 0 36 12C40 24 44 6 48 12" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left - Image and Info */}
          <div className="w-full lg:w-1/2 relative mb-12 lg:mb-0">
            <div className="relative rounded-xl overflow-hidden w-4/5 mx-auto aspect-[4/3] shadow-lg">
              <Image 
                src="https://azim.hostlin.com/Medimart/assets/images/resource/about-1.jpg" 
                alt="Doctor with patient and child" 
                layout="fill" 
                objectFit="cover" 
              />
            </div>

            {/* Medical Shield Icon */}
            <div className="absolute top-12 left-0 lg:left-12 p-4 bg-red-500 dark:bg-red-600 rounded-lg shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="white" />
                <path d="M12 8v4M10 10h4" stroke="red" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Heartbeat Icon */}
            <div className="absolute bottom-12 right-12 p-4 bg-blue-600 dark:bg-blue-700 rounded-lg shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M2 12h6l2-6 4 12 2-6h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            
          </div>

          {/* Right - Content */}
          <div className="w-full lg:w-1/2 lg:pl-12">
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-400 bg-clip-text text-transparent mb-4">About Us</div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Medical Services & Diagnostics
            </h2>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
              Committed To Delivering High Quality Medical & Diagnostics Services!
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. 
              Velit officia consequat duis enim velit mollit. Exercitation veniam 
              consequat sunt nostrud amet.
            </p>

            {/* Services List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-10">
              {[
                "Ambulance Services",
                "Oxygen on Wheel",
                "Pharmacy in Clinic",
                "On Duty Doctors",
                "24/7 Medical Emergency"
              ].map((service, i) => (
                <div className="flex items-center" key={i}>
                  <svg className="text-blue-600 dark:text-blue-400 mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-800 dark:text-gray-200">{service}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div>
              <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full transition-all">
                Discover More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Squiggle */}
      <div className="absolute right-10 bottom-10">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
          <path d="M30 40C40 30 60 10 70 30C80 50 60 90 30 70C0 50 70 10 90 40" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      {/* Go to top */}
      <div className="absolute right-2 bottom-2 rotate-90 text-blue-600 dark:text-blue-400 font-medium">
        Go to top
      </div>
    </div>
  )
}
