/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowRight,
  Loader2,
  UploadCloud,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle
} from "lucide-react";
import { useRef, useState } from "react";
import { useRegister } from "@/React-Query/Queries/authQueries";

// Form validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your full address"),
});

type RegisterData = z.infer<typeof registerSchema> & {
  Image?: File;
};

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Form setup with Zod validation
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
  });

  const { mutate: registerUser, isPending } = useRegister();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        toast.success("Profile image uploaded");
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: RegisterData) => {
    let formData = { ...data };
    if (fileInputRef.current?.files?.[0]) {
      formData = { ...formData, Image: fileInputRef.current.files[0] };
    }

    registerUser(formData, {
      onSuccess: () => {
        toast.success("Registration successful! Welcome aboard.");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div className={cn("flex flex-col  gap-6 max-w-6xl mx-auto", className)} {...props}>
      <TooltipProvider>
        <Card className="overflow-hidden p-0 border-0 shadow-xl bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl">
          <CardContent className="grid p-0 md:grid-cols-5 ">
            {/* Left image panel - spans 2 columns */}
            <div className="relative hidden md:block h-full md:col-span-2 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_50%)] opacity-30"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-white">
                <div className="w-full max-w-xs space-y-6">
                  <h2 className="text-3xl font-bold">Welcome to Medimart</h2>
                  <p className="text-white/80">
                    Your trusted online pharmacy for quality medicines, health products, and reliable service at your fingertips.
                  </p>

                  <div className="space-y-4 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Certified and genuine medicines</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Easy prescriptions upload</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-sm">24/7 pharmacist support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Form section - spans 3 columns */}
            <div className="p-6 md:p-10 md:col-span-3">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create your account</h1>
                    <p className="text-muted-foreground dark:text-gray-400">
                      Enter your details to get started with our platform
                    </p>
                  </div>

                  {/* Profile Image Upload */}
                  <div className="flex justify-center items-center">
                    <div className="flex flex-col items-center md:items-start">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative group cursor-pointer">
                            <Avatar className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-200">
                              <AvatarImage src={previewImage || ""} />
                              <AvatarFallback className="bg-gray-50 dark:bg-gray-700/50">
                                <User className="h-10 w-10 text-gray-400" />
                              </AvatarFallback>
                            </Avatar>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition-all duration-200"
                            >
                              <UploadCloud className="h-4 w-4" />
                            </button>
                            <input
                              id="Image"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              ref={fileInputRef}
                              onChange={handleImageChange}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload profile photo</p>
                        </TooltipContent>
                      </Tooltip>
                      <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">Add a photo (optional)</span>
                    </div>
                   
                  </div>

                  {/* Form Fields in Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-gray-400" />
                              </div>
                              <Input
                                placeholder="Full Name"
                                className="pl-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 rounded-lg"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-gray-400" />
                              </div>
                              <Input
                                placeholder="Email Address"
                                type="email"
                                className="pl-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 rounded-lg"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                              </div>
                              <Input
                                placeholder="Password"
                                type="password"
                                className="pl-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 rounded-lg"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-4 w-4 text-gray-400" />
                              </div>
                              <Input
                                placeholder="Phone Number"
                                type="tel"
                                className="pl-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 rounded-lg"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address - Full Width */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                              placeholder="Your address"
                              className="pl-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 rounded-lg"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/log-in" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                      Sign in
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>

        <div className="text-balance text-center text-xs text-muted-foreground dark:text-gray-400">
          By creating an account, you agree to our{" "}
          <Link href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Privacy Policy
          </Link>
        </div>
      </TooltipProvider>
    </div>
  );
}