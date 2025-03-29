
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real application, you would send this data to your backend
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="container-custom py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have a question about our service, or want to partner with us? Fill out the form and our team will get back to you shortly.
            </p>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="flex items-start space-x-4 pt-6">
                  <MapPin className="text-mealstock-green mt-1" />
                  <div>
                    <h3 className="font-medium">Our Address</h3>
                    <p className="text-muted-foreground">123 Admiralty Way, Lekki Phase 1, Lagos</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-start space-x-4 pt-6">
                  <Phone className="text-mealstock-green mt-1" />
                  <div>
                    <h3 className="font-medium">Phone Number</h3>
                    <p className="text-muted-foreground">+234 (0) 123 456 7890</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-start space-x-4 pt-6">
                  <Mail className="text-mealstock-green mt-1" />
                  <div>
                    <h3 className="font-medium">Email Address</h3>
                    <p className="text-muted-foreground">info@chowstack.ng</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-start space-x-4 pt-6">
                  <Clock className="text-mealstock-green mt-1" />
                  <div>
                    <h3 className="font-medium">Working Hours</h3>
                    <p className="text-muted-foreground">Monday to Friday: 8am to 6pm</p>
                    <p className="text-muted-foreground">Saturday: 9am to 3pm</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Your Message</label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
