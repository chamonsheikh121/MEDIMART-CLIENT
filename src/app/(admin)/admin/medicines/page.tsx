import MedicineTable from "@/components/manage-madicine/medicine-table";

export default async function MedicinePage() {

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Medicine Management</h1>
        </div>
        <MedicineTable />
      </div>
    </div>
  );
}