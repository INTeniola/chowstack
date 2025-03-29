
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Info, Users, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <>
      <Navbar />
      <main className="container-custom py-12">
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-center mb-8">About ChowStack</h1>
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-lg text-muted-foreground mb-4">
              ChowStack is Nigeria's premier bulk meal delivery service, designed to solve the challenge of nutritious meal planning for busy professionals, families, and organizations.
            </p>
            <p className="text-lg text-muted-foreground">
              Founded in 2022, we've grown from a small startup to a nationwide service delivering thousands of meals weekly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 text-mealstock-green" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>To make healthy eating effortless for Nigerians through convenient, affordable, and delicious meal solutions that save time and reduce food waste.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 text-mealstock-orange" />
                  Our Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our diverse team brings together culinary experts, nutritionists, logistics specialists, and tech innovators all united by a passion for food and service.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 text-mealstock-cream" />
                  Our Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Quality ingredients, no compromises</li>
                  <li>Exceptional customer service</li>
                  <li>Environmental responsibility</li>
                  <li>Community support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <div className="max-w-4xl mx-auto">
            <p className="mb-4">
              ChowStack began when our founder, a busy Lagos professional, struggled to maintain healthy eating habits while balancing work and life. After discovering many colleagues shared the same challenge, the idea for a bulk meal preparation and delivery service was born.
            </p>
            <p className="mb-4">
              Starting with just three local chefs and serving only the Lagos Island area, we've expanded to serve major cities across Nigeria with a network of over 50 partner chefs and food vendors.
            </p>
            <p>
              Our commitment to quality, convenience, and supporting local food ecosystems has made us the trusted meal solution for thousands of individuals, families, and corporate clients nationwide.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
