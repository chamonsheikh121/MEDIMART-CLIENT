'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MedicineCardProps {
  medicine: IMedicine;
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <Link href={`/medicine/${medicine._id}`} passHref>
      <Card className="overflow-hidden border p-0 border-gray-200 dark:border-gray-800 dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
        <div className="relative pt-[75%] bg-gray-100 dark:bg-gray-800">
          <Image
            src={medicine.images[0]?.url || "/api/placeholder/320/240"}
            alt={medicine.name}
            fill
            className="w-full h-full object-cover"
            sizes="100vw"
          />

          {medicine.requiredPrescription && (
            <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700">
              Prescription
            </Badge>
          )}
          {medicine.stock <= 5 && medicine.stock > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
              Low Stock
            </Badge>
          )}
          {medicine.stock === 0 && (
            <Badge className="absolute top-2 left-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700">
              Out of Stock
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{medicine.name}</h3>
          <Badge variant="outline" className="mt-2 text-sm dark:bg-gray-700">
            {medicine.category}
          </Badge>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{medicine.description}</p>
          <p className="mt-2 font-bold text-blue-600 dark:text-blue-400">${medicine.price.toFixed(2)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}