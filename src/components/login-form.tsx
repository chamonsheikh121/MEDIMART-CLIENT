'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  Heart,
  Plus,
  ShieldCheck,
  Pill,
  UserCog,
  User2
} from "lucide-react";
import { useLogin } from "@/React-Query/Queries/authQueries";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: LoginData) => {
    login(data);
  };

  const handleForgotPassword = () => {
    toast.custom((t) => (
      <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
        <div className="flex-shrink-0">
          <Pill className="h-5 w-5 text-teal-500 dark:text-teal-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">
            Password Reset Prescription
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            We&apos;ve sent a recovery link to your email. Check your inbox for your digital medicine!
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => toast.dismiss(t)}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md"
            >
              Thank you, doc!
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: 8000,
      position: 'top-center',
    });
  };

  const handleAutofill = (user: string) => {
    if (user === 'admin') {
      form.setValue('email', 'admin@example.com');
      form.setValue('password', '123456');
    } else if (user === 'customer') {
      form.setValue('email', 'brainboostservices@gmail.com');
      form.setValue('password', '123456');
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 max-w-6xl mx-auto", className)} {...props}>
      <TooltipProvider>
        <Card className="overflow-hidden p-0 border-0 shadow-xl bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl">
          <CardContent className="grid p-0 md:grid-cols-5">
            {/* Left image panel - spans 2 columns */}
            <div className="relative hidden md:block h-full md:col-span-2 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_50%)] opacity-30"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-white">
                <div className="w-full max-w-xs space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Heart className="h-6 w-6 fill-white text-white" />
                    <h2 className="text-2xl font-bold">MediMart</h2>
                  </div>

                  <h3 className="text-3xl font-bold">Your health, our priority</h3>
                  <p className="text-white/80">Sign in to access your prescriptions, refills, and health recommendations.</p>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <Plus className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Quick prescription refills</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Secure health records</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <Heart className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Health & wellness tracking</span>
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
                    <div className="flex justify-center md:justify-start items-center gap-2 mb-2">
                      <Heart className="h-6 w-6 text-teal-600 dark:text-teal-400 md:hidden" />
                      <h2 className="text-2xl font-bold text-teal-600 dark:text-teal-400 md:hidden">MediMart</h2>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back</h1>
                    <p className="text-muted-foreground dark:text-gray-400">
                      Sign in to your MediMart account
                    </p>
                  </div>

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
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 text-sm">Password</Label>
                          <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-xs font-medium cursor-pointer text-indigo-500 hover:text-indigo-600 dark:text-indigo-400"
                          >
                            Forgot your password?
                          </button>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                              placeholder="Your password"
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

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                      Remember me for 30 days
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 transition-all duration-200 shadow-md hover:shadow-lg"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white dark:bg-gray-800 px-4 text-sm text-gray-500 dark:text-gray-400">
                        or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login Options */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center justify-center gap-2 border-muted bg-indigo-600 text-white hover:bg-indigo-700"
                      onClick={() => handleAutofill("admin")}
                    >
                      <UserCog className="w-4 h-4" />
                      <span className="text-sm font-medium text-white">Admin Login</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center justify-center gap-2 border-muted bg-indigo-600 text-white hover:bg-indigo-700"
                      onClick={() => handleAutofill("customer")}
                    >
                      <User2 className="w-4 h-4" />
                      <span className="text-sm font-medium ">Demo Customer</span>
                    </Button>
                  </div>

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                      Create account
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>

        <div className="text-balance text-center text-xs text-muted-foreground dark:text-gray-400">
          By signing in, you agree to MediMart&apos;s{" "}
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