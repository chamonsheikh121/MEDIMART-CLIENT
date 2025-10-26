"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useState, useCallback, useRef } from "react";
import { useAddMedicine } from "@/React-Query/Queries/medicineQueries";
import { X, Upload } from "lucide-react";
import Image from "next/image";

const MAX_IMAGE_COUNT = 5;

type MedicineFormData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  requiredPrescription: boolean;
  manufacturer: {
    name: string;
    address: string;
    contact: string;
  };
  symptoms: string[];
  category: string;
  images: File[];
};

export default function AddMedicineDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: addMedicine } = useAddMedicine();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<MedicineFormData>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      requiredPrescription: false,
      manufacturer: {
        name: "",
        address: "",
        contact: "",
      },
      symptoms: [],
      category: "",
      images: [],
    },
  });

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const newFiles = Array.from(e.target.files);
    const existingImages = watch("images") || [];
    

    const totalImages = existingImages.length + newFiles.length;
    const filesToAdd = totalImages > MAX_IMAGE_COUNT 
      ? newFiles.slice(0, MAX_IMAGE_COUNT - existingImages.length)
      : newFiles;
    

    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
    
  
    setValue("images", [...existingImages, ...filesToAdd]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = useCallback((index: number) => {
    const currentImages = watch("images");
    

    URL.revokeObjectURL(imagePreviews[index]);
    

    const newImages = [...currentImages];
    newImages.splice(index, 1);
    setValue("images", newImages);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  }, [setValue, imagePreviews, watch]);

  const handleSymptomsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const symptomsArray = e.target.value.split(",").map(s => s.trim()).filter(s => s);
    setValue("symptoms", symptomsArray);
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setUploading(true);

    addMedicine(data, {
      onSuccess: () => {

        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setImagePreviews([]);
        
        reset();
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

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen && imagePreviews.length > 0) {

        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setImagePreviews([]);
      }
      setOpen(newOpen);
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
          <DialogDescription>
            Fill in the details of the medicine you want to add.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Medicine name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Category"
                {...register("category", { required: "Category is required" })}
              />
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Medicine description"
              className="resize-none"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="Price"
                {...register("price", { 
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Price cannot be negative" } 
                })}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                placeholder="Stock quantity"
                {...register("stock", { 
                  required: "Stock is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Stock cannot be negative" } 
                })}
              />
              {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Requires Prescription</Label>
              <p className="text-sm text-muted-foreground">
                Check if this medicine requires a prescription
              </p>
            </div>
            <Switch
              checked={watch("requiredPrescription")}
              onCheckedChange={(checked) => setValue("requiredPrescription", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Manufacturer Details</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manufacturer.name">Name</Label>
                <Input
                  id="manufacturer.name"
                  placeholder="Manufacturer name"
                  {...register("manufacturer.name", { required: "Manufacturer name is required" })}
                />
                {errors.manufacturer?.name && <p className="text-sm text-red-500">{errors.manufacturer.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="manufacturer.contact">Contact</Label>
                <Input
                  id="manufacturer.contact"
                  placeholder="Contact info"
                  {...register("manufacturer.contact", { required: "Contact info is required" })}
                />
                {errors.manufacturer?.contact && <p className="text-sm text-red-500">{errors.manufacturer.contact.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="manufacturer.address">Address</Label>
              <Input
                id="manufacturer.address"
                placeholder="Manufacturer address"
                {...register("manufacturer.address", { required: "Address is required" })}
              />
              {errors.manufacturer?.address && <p className="text-sm text-red-500">{errors.manufacturer.address.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="symptoms">Symptoms (comma separated)</Label>
            <Input
              id="symptoms"
              placeholder="Fever, Headache, Pain"
              onChange={handleSymptomsChange}
              defaultValue={watch("symptoms")?.join(", ")}
            />
            {errors.symptoms && <p className="text-sm text-red-500">{errors.symptoms.message}</p>}
          </div>

          <div>
            <Label>Images (Max {MAX_IMAGE_COUNT})</Label>
            <div className="space-y-4">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
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
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageSelection}
                disabled={imagePreviews.length >= MAX_IMAGE_COUNT}
              />
              
              {/* Custom upload button */}
              {imagePreviews.length < MAX_IMAGE_COUNT && (
                <div 
                  className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={triggerFileInput}
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Click to upload images</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {imagePreviews.length > 0 
                      ? `${imagePreviews.length} of ${MAX_IMAGE_COUNT} images selected` 
                      : `You can upload up to ${MAX_IMAGE_COUNT} images`}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Add Medicine"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}