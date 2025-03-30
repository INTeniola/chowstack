
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Code, Terminal, Database, ChefHat, Server } from 'lucide-react';
import { ResponsiveImage } from '@/components/uploads/ResponsiveImage';

const teamMembers = [
  {
    id: 1,
    name: 'Carmy Berzatto',
    role: 'Chief Technology Officer',
    specialties: ['System Architecture', 'Backend Development', 'Recipe Algorithms'],
    bio: 'After years of developing culinary software systems at top-tier companies, Carmy now leads our tech stack ensuring ChowStack\'s systems run as smoothly as a well-oiled kitchen. His approach combines technical precision with culinary insights.',
    achievements: ['Redesigned order processing pipeline', 'Reduced system latency by 40%'],
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5'
  },
  {
    id: 2,
    name: 'Sydney Adamu',
    role: 'Lead Frontend Developer',
    specialties: ['UI/UX Design', 'React Development', 'User Experience Optimization'],
    bio: 'Sydney brings the same intensity to coding as she does to cooking. Known for crafting pixel-perfect interfaces, she ensures every user interaction with ChowStack is as satisfying as the perfect bite. Her frontend systems support thousands of daily orders.',
    achievements: ['Implemented responsive design overhaul', 'Reduced loading times by 60%'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  },
  {
    id: 3,
    name: 'Richard "Richie" Jerimovich',
    role: 'DevOps & Infrastructure Manager',
    specialties: ['Cloud Infrastructure', 'Deployment Automation', 'System Reliability'],
    bio: 'Richie keeps our tech kitchen running hot without burning down. Managing our cloud infrastructure like a seasoned line cook manages multiple orders, he ensures ChowStack\'s systems are always online, scalable, and ready to handle peak delivery hours.',
    achievements: ['99.98% platform uptime', 'Automated deployment pipeline'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
  },
  {
    id: 4,
    name: 'Tina Marrero',
    role: 'Database Administrator & Analytics Chef',
    specialties: ['Data Engineering', 'Business Intelligence', 'Performance Optimization'],
    bio: 'Tina slices and dices our data like a chef with perfect knife skills. She designs our database schemas and data pipelines to ensure ChowStack can analyze customer preferences, optimize delivery routes, and identify emerging food trends.',
    achievements: ['Reduced query times by 75%', 'Implemented real-time analytics dashboard'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
  }
];

const OurTeam = () => {
  return (
    <>
      <Navbar />
      <main className="container-custom py-12">
        <section className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <Users size={36} className="text-mealstock-orange" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Meet Our Technical Team</h1>
          <p className="max-w-3xl mx-auto text-muted-foreground">
            The backbone of ChowStack is our talented technical team who bring the perfect blend of 
            coding expertise and culinary understanding. Each member contributes unique skills 
            that keep our platform reliable, scalable, and deliciously functional.
          </p>
        </section>
        
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          {teamMembers.map(member => (
            <Card key={member.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <ResponsiveImage 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                  fallbackSrc="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
                />
              </div>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-mealstock-green">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <Code size={16} className="mr-2 text-mealstock-orange" />
                    Technical Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{member.bio}</p>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <Terminal size={16} className="mr-2 text-mealstock-green" />
                    Technical Achievements
                  </h3>
                  <ul className="space-y-1">
                    {member.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Server size={12} className="mr-2 text-yellow-500" />
                        {achievement}
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

export default OurTeam;
