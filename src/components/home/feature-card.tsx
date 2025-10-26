import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        icon: <ShieldCheck className="w-6 h-6 text-primary" />,
        title: "Secure Payment",
        description: "Your payment information is processed securely.",
    },
    {
        icon: <Truck className="w-6 h-6 text-primary" />,
        title: "Free Shipping",
        description: "Free shipping on all orders over ৳500.",
    },
    {
        icon: <RotateCcw className="w-6 h-6 text-primary" />,
        title: "Moneyback Guarantee",
        description: "Get your money back within 7 days.",
    },
    {
        icon: <Headphones className="w-6 h-6 text-primary" />,
        title: "24/7 Support",
        description: "We’re here to help, anytime you need us.",
    },
];

export default function FeatureCards() {
    return (
        <div className="dark:bg-gray-900 bg-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 container  mx-auto px-4 py-8">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-sm"
                    >
                        <CardContent className="flex items-start gap-4 p-4">
                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                                {feature.icon}
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                    {feature.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
