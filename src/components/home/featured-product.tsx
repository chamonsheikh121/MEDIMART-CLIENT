'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGetAllMedicines } from '@/React-Query/Queries/medicineQueries';
import { Loader2 } from 'lucide-react';
import MedicineCard from '../medicines/medicineCard';
import Title from '../shared/title';


export default function FeaturedProducts() {

  const { data: medicines, isPending } = useGetAllMedicines({
    limit: 4,
    page: 1
  });

  return (
    <section className="py-32 bg-slate-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">

        <Title 
          title='Featured Medical Products'
          desc='Discover our selection of high-quality medical equipment and supplies chosen by healthcare professionals.'
        />

        {/* Loading indicator */}
        {isPending && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        )}

        {/* Products grid */}
        {!isPending && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
              {medicines?.data && medicines.data.length > 0 ? (
                medicines.data.map((medicine: IMedicine) => (
                  <MedicineCard key={medicine._id} medicine={medicine} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-700 dark:text-gray-300">No products found.</p>
                </div>
              )}
            </div>

            {/* Shop more button */}
            <div className="flex justify-center mt-12">
              <Link href="/shop">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-800 ">
                  Shop More Products
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}