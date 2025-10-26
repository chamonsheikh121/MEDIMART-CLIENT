import MedicineDetailedPageContent from "@/components/medicines/medicine-detailed-page";

export default async function MedicinePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <MedicineDetailedPageContent id={slug} />
        </div>
    );
}