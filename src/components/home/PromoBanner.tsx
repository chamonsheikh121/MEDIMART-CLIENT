import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const PromoBanner = () => {
    return (
        <section className="bg-indigo-600 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Get 20% off your first order!</h2>
                <p className="text-blue-100 text-lg">Sign up for our newsletter and receive a discount code.</p>
              </div>
              <div className="md:w-1/3 w-full">
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="Your email address" 
                    className="bg-white/90 border-0 focus:ring-2 focus:ring-blue-300" 
                  />
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 font-medium">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
    );
};

export default PromoBanner;