"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { useState, useRef, useEffect } from "react";
import { useUpdateMedicine } from "@/React-Query/Queries/medicineQueries";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { X, Upload } from "lucide-react";
import Image from "next/image";

const MAX_IMAGE_COUNT = 5;

export default function EditMedicineDialog({
    children,
    medicine,
}: {
    children: React.ReactNode;
    medicine: IMedicine;
}) {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [remainingImages, setRemainingImages] = useState<{ url: string; publicId: string; }[]>(medicine.images || []);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: updateMedicine } = useUpdateMedicine();

    const form = useForm({
        defaultValues: {
            name: medicine.name,
            description: medicine.description,
            price: medicine.price,
            stock: medicine.stock,
            requiredPrescription: medicine.requiredPrescription,
            manufacturer: {
                name: medicine.manufacturer.name,
                address: medicine.manufacturer.address,
                contact: medicine.manufacturer.contact,
            },
            symptoms: medicine.symptoms,
            category: medicine.category,
        },
    });

  
    useEffect(() => {
        return () => {
            newImagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [newImagePreviews]);

    const handleNewImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const totalCurrentImages = remainingImages.length + newImageFiles.length;
        const newFiles = Array.from(e.target.files);
        

        const remainingSlots = MAX_IMAGE_COUNT - totalCurrentImages;
        const filesToAdd = newFiles.slice(0, remainingSlots);
        
        if (filesToAdd.length === 0) return;

        const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
        
        setNewImageFiles(prev => [...prev, ...filesToAdd]);
        setNewImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const handleRemoveExistingImage = (index: number) => {
        const imageToRemove = remainingImages[index];
        

        setImagesToDelete(prev => [...prev, imageToRemove.publicId]);
        

        const updatedImages = [...remainingImages];
        updatedImages.splice(index, 1);
        console.log("nn",updatedImages);
        setRemainingImages(updatedImages);
    };

    const handleRemoveNewImage = (index: number) => {

        URL.revokeObjectURL(newImagePreviews[index]);
        

        const updatedFiles = [...newImageFiles];
        updatedFiles.splice(index, 1);
        setNewImageFiles(updatedFiles);
        
        const updatedPreviews = [...newImagePreviews];
        updatedPreviews.splice(index, 1);
        setNewImagePreviews(updatedPreviews);
    };

    const onSubmit = form.handleSubmit(async (values) => {
        setUploading(true);
        const formData = new FormData();
        
   
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", values.price.toString());
        formData.append("stock", values.stock.toString());
        formData.append("requiredPrescription", values.requiredPrescription.toString());
        formData.append("category", values.category);
        

        if (Array.isArray(values.symptoms)) {
            const processedSymptoms = values.symptoms.map(symptom => symptom.trim());
            formData.append("symptoms", JSON.stringify(processedSymptoms));
        } else {
            formData.append("symptoms", values.symptoms);
        }
        

        formData.append("manufacturer", JSON.stringify(values.manufacturer));
        

        if (imagesToDelete.length > 0) {
            formData.append("deleteImages", JSON.stringify(imagesToDelete));
        }
        

        newImageFiles.forEach((file) => {
            formData.append("images", file);
        });

        updateMedicine({
            id: medicine._id,
            data: formData,
        }, {
            onSuccess: () => {

                newImagePreviews.forEach(url => URL.revokeObjectURL(url));
  
                setNewImageFiles([]);
                setNewImagePreviews([]);
                setImagesToDelete([]);
                setRemainingImages(medicine.images || []);
                
                form.reset();
                setUploading(false);
                setOpen(false);
            },
            onError: () => {
                setUploading(false);
            }
        });
    });

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const totalImageCount = remainingImages.length + newImageFiles.length;
    const canAddMoreImages = totalImageCount < MAX_IMAGE_COUNT;

    const handleSymptomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const symptomsArray = e.target.value
            .split(",")
            .map(s => s.trim())
            .filter(s => s);
        form.setValue("symptoms", symptomsArray);
    };

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            if (!newOpen) {

                newImagePreviews.forEach(url => URL.revokeObjectURL(url));
                setNewImageFiles([]);
                setNewImagePreviews([]);
                setImagesToDelete([]);
                setRemainingImages(medicine.images || []);
                form.reset();
            }
            setOpen(newOpen);
        }}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Medicine</DialogTitle>
                    <DialogDescription>
                        Update the details of this medicine.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Medicine name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Category" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Medicine description"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Price"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(parseFloat(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Stock quantity"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(parseInt(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="requiredPrescription"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Requires Prescription</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormLabel>Manufacturer Details</FormLabel>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="manufacturer.name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Manufacturer name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="manufacturer.contact"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contact info" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="manufacturer.address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Manufacturer address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="symptoms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Symptoms (comma separated)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Fever, Headache, Pain"
                                            value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                                            onChange={handleSymptomsChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Image Management Section */}
                        <div>
                            <FormLabel>Images (Max {MAX_IMAGE_COUNT})</FormLabel>
                            
                            {/* Existing Images */}
                            {remainingImages.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Current Images</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {remainingImages.map((image, index) => (
                                            <div key={`existing-${index}`} className="relative aspect-square">
                                                <div className="rounded-md h-full w-full relative">
                                                    <Image
                                                        src={image.url}
                                                        alt="Medicine image"
                                                        fill
                                                        className="rounded-md object-cover"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-1 top-1 h-6 w-6 rounded-full bg-red-500/80 p-0 text-white hover:bg-red-500"
                                                    onClick={() => handleRemoveExistingImage(index)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* New Images */}
                            {newImagePreviews.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">New Images</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {newImagePreviews.map((preview, index) => (
                                            <div key={`new-${index}`} className="relative aspect-square">
                                                <div className="rounded-md h-full w-full relative">
                                                    <Image
                                                        src={preview}
                                                        alt="Medicine preview"
                                                        fill
                                                        className="rounded-md object-cover"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-1 top-1 h-6 w-6 rounded-full bg-red-500/80 p-0 text-white hover:bg-red-500"
                                                    onClick={() => handleRemoveNewImage(index)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleNewImageSelection}
                                disabled={!canAddMoreImages}
                            />
                            
                            {/* Upload button */}
                            {canAddMoreImages && (
                                <div 
                                    className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mt-4"
                                    onClick={triggerFileInput}
                                >
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500 font-medium">Click to upload images</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {totalImageCount > 0 
                                            ? `${totalImageCount} of ${MAX_IMAGE_COUNT} images selected` 
                                            : `You can upload up to ${MAX_IMAGE_COUNT} images`}
                                    </p>
                                </div>
                            )}
                        </div>

                        <Button type="submit" disabled={uploading}>
                            {uploading ? "Updating..." : "Update Medicine"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}