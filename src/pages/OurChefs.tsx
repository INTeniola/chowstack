
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Star, Award, BookOpen } from 'lucide-react';

const chefs = [
  {
    id: 1,
    name: 'Chef Olajumoke Adeyemi',
    role: 'Executive Chef',
    specialties: ['Nigerian Cuisine', 'Contemporary African', 'Farm-to-Table'],
    bio: 'With over 15 years of culinary experience, Chef Jumoke brings authentic Nigerian flavors with a modern twist. She trained at Le Cordon Bleu Paris before returning to Nigeria to celebrate local ingredients.',
    awards: ['Best Chef Award 2022', 'Culinary Innovation Prize'],
    avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
  },
  {
    id: 2,
    name: 'Chef Emeka Okafor',
    role: 'Head of Menu Development',
    specialties: ['Fusion Cuisine', 'Health-Focused Meals', 'Vegetarian'],
    bio: 'Chef Emeka specializes in nutritionally balanced meals that don't compromise on flavor. His background in nutritional science informs his approach to creating healthy, satisfying meal plans.',
    awards: ['Nutrition Excellence Award', 'Young Chef of the Year 2021'],
    avatar: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
  },
  {
    id: 3,
    name: 'Chef Fatima Ibrahim',
    role: 'Pastry Chef',
    specialties: ['Desserts', 'Gluten-Free Baking', 'Traditional Sweets'],
    bio: 'Chef Fatima transforms traditional Nigerian desserts into modern masterpieces. She's passionate about using local ingredients to create globally-inspired sweet treats that complement our meal offerings.',
    awards: ['Pastry Perfection Award', 'Innovation in Desserts 2023'],
    avatar: 'https://images.unsplash.com/photo-1481089613954-ca49bdddf431'
  },
  {
    id: 4,
    name: 'Chef David Nwachukwu',
    role: 'International Cuisine Specialist',
    specialties: ['Asian Fusion', 'Mediterranean', 'Continental'],
    bio: 'Having worked in restaurants across three continents, Chef David brings global flavors to the MealStock menu. He excels at adapting international favorites to include Nigerian ingredients and appeal to local palates.',
    awards: ['Global Cuisine Award', 'Best Use of Local Ingredients 2022'],
    avatar: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f'
  }
];

const OurChefs = () => {
  return (
    <>
      <Navbar />
      <main className="container-custom py-12">
        <section className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <ChefHat size={36} className="text-mealstock-orange" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Meet Our Culinary Team</h1>
          <p className="max-w-3xl mx-auto text-muted-foreground">
            The heart of MealStock is our talented team of chefs who bring passion, 
            expertise, and creativity to every meal. Each chef contributes unique skills 
            and specialties, ensuring our menu is diverse, delicious, and nutritionally balanced.
          </p>
        </section>
        
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          {chefs.map(chef => (
            <Card key={chef.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img 
                  src={chef.avatar} 
                  alt={chef.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-mealstock-green">
                  <AvatarImage src={chef.avatar} alt={chef.name} />
                  <AvatarFallback>{chef.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{chef.name}</CardTitle>
                  <CardDescription>{chef.role}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <BookOpen size={16} className="mr-2 text-mealstock-orange" />
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {chef.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{chef.bio}</p>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <Award size={16} className="mr-2 text-mealstock-green" />
                    Recognition
                  </h3>
                  <ul className="space-y-1">
                    {chef.awards.map((award, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Star size={12} className="mr-2 text-yellow-500" />
                        {award}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardFooter>
            </Card>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default OurChefs;
