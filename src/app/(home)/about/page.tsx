export default function AboutPage() {
  return (
    <div className="bg-gray-900 min-h-screen px-4 py-12 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
          About MediMart Pharmacy
        </h1>

        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-300">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            At MediMart Pharmacy, we are committed to providing high-quality medicines and healthcare products to our community. Our mission is to make healthcare accessible, affordable, and convenient for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-300">
              Our Story
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Founded in 2010, MediMart Pharmacy started as a small neighborhood pharmacy. Over the years, we&apos;ve grown into a trusted healthcare provider, serving thousands of customers with care and professionalism.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-300">
              Our Team
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our team consists of licensed pharmacists and healthcare professionals dedicated to your well-being. We provide personalized consultations and ensure you receive the right medications.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-gray-950 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-300">
            Why Choose Us?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start text-gray-700 dark:text-gray-300">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Wide selection of genuine medicines</span>
            </li>
            <li className="flex items-start text-gray-700 dark:text-gray-300">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Competitive prices</span>
            </li>
            <li className="flex items-start text-gray-700 dark:text-gray-300">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Professional healthcare advice</span>
            </li>
            <li className="flex items-start text-gray-700 dark:text-gray-300">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Convenient online ordering</span>
            </li>
            <li className="flex items-start text-gray-700 dark:text-gray-300">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Fast and reliable delivery</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
