'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PhoneIcon, MailIcon, MapPinIcon } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Get In Touch</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Have questions about our products or services? Our team is ready to assist you. Reach out to us using any of the contact methods below.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <PhoneIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                  <p className="text-gray-700 dark:text-gray-300">(800) 555-MEDI</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Monday to Friday, 9am-6pm EST</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MailIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                  <p className="text-gray-700 dark:text-gray-300">support@medimart.example.com</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">We&apos;ll respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MapPinIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Main Office</h3>
                  <p className="text-gray-700 dark:text-gray-300">123 Medical Avenue, Suite 500</p>
                  <p className="text-gray-700 dark:text-gray-300">Boston, MA 02115</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Send Us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <Input id="name" placeholder="Your name" className="dark:bg-gray-900 dark:border-gray-700" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <Input id="email" type="email" placeholder="Your email" className="dark:bg-gray-900 dark:border-gray-700" />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <Input id="subject" placeholder="How can we help?" className="dark:bg-gray-900 dark:border-gray-700" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us more about your inquiry..." 
                  rows={5}
                  className="resize-none dark:bg-gray-900 dark:border-gray-700" 
                />
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}