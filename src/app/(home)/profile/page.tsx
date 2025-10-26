'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, User, Mail, Phone, MapPin, Building, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useGetMe, useUpdateUser } from '@/React-Query/Queries/authQueries';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Define form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email.',
  }),
  phone: z.string().min(6, {
    message: 'Phone number must be at least 6 characters.',
  }),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    },
  });

  // Set form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
      });
    }
  }, [user, form]);

  // Redirect if no user
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  function onSubmit(data: ProfileFormValues) {
    if (!user) return;

    updateUser({
      id: user._id,
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });
  }

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="pt-20 px-4 py-8  bg-slate-50 dark:bg-gray-900 min-h-screen ">
      <div className='container mx-auto max-w-3xl'>
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user.name.charAt(0)}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-300">Your Profile</h1>
          <p className="text-gray-500  mt-2">Manage your personal information</p>
        </div>

        <Card className="  shadow-lg border-0 dark:bg-gray-800">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 dark:text-gray-300">Personal Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 ">
                <div className="space-y-4 mt-10">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <User className="h-4 w-4" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            {...field}
                            className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Mail className="h-4 w-4" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your email"
                            {...field}
                            type="email"
                            className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your phone number"
                            {...field}
                            className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Separator className="my-4 dark:text-gray-200 dark:bg-gray-200" />
                    <h3 className="text-lg font-medium flex items-center gap-2 text-gray-700 mb-4 dark:text-gray-300">
                      <MapPin className="h-5 w-5" />
                      Address Details
                    </h3>

                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 mt-5">Street Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Street address"
                              {...field}
                              className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <Building className="h-4 w-4" />
                              City
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="City"
                                {...field}
                                className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">State/Province</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="State"
                                {...field}
                                className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="address.postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">Postal Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Postal code"
                                {...field}
                                className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <Map className="h-4 w-4" />
                              Country
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Country"
                                {...field}
                                className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-4 pt-2 pb-6 px-6 mt-10">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:text-white transition-all px-8"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}