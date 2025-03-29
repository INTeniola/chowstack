
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, Banknote, ArrowRight, Users, Heart, TrendingUp, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const positions = [
  {
    id: 1,
    title: 'Senior Chef',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    salary: '₦350,000 - ₦500,000',
    description: 'We're looking for an experienced chef to join our culinary team and help develop new menu items while maintaining our high standards for existing recipes.',
    requirements: [
      'Minimum 5 years professional cooking experience',
      'Strong knowledge of Nigerian cuisine',
      'Experience in meal planning and preparation at scale',
      'Food safety certification',
      'Ability to work in a fast-paced environment'
    ]
  },
  {
    id: 2,
    title: 'Operations Manager',
    location: 'Abuja, Nigeria',
    type: 'Full-time',
    salary: '₦400,000 - ₦600,000',
    description: 'Oversee our meal delivery operations in Abuja, ensuring timely preparation, packaging, and delivery of orders while optimizing processes and maintaining quality.',
    requirements: [
      'Bachelor's degree in business, operations, or related field',
      'Minimum 3 years experience in food service operations',
      'Strong problem-solving and decision-making abilities',
      'Experience with logistics and supply chain management',
      'Excellent leadership and team management skills'
    ]
  },
  {
    id: 3,
    title: 'Customer Success Representative',
    location: 'Remote (Nigeria)',
    type: 'Full-time',
    salary: '₦200,000 - ₦300,000',
    description: 'Help our customers have the best experience with MealStock by providing exceptional support via phone, email, and chat while resolving issues and gathering feedback.',
    requirements: [
      'Excellent communication skills in English (additional Nigerian languages a plus)',
      'Previous customer service experience',
      'Problem-solving mindset',
      'Proficiency with CRM systems',
      'Patience and empathy when dealing with customer concerns'
    ]
  },
  {
    id: 4,
    title: 'Marketing Specialist',
    location: 'Hybrid (Lagos)',
    type: 'Full-time',
    salary: '₦300,000 - ₦450,000',
    description: 'Drive growth through creative marketing campaigns, content creation, and community engagement, with a focus on digital marketing channels relevant to the Nigerian market.',
    requirements: [
      'Bachelor's degree in Marketing or related field',
      'Minimum 2 years of marketing experience, preferably in food service',
      'Strong understanding of digital marketing channels',
      'Experience with social media management and content creation',
      'Analytical mindset with ability to track and report on campaign performance'
    ]
  }
];

const Careers = () => {
  const { toast } = useToast();
  
  const handleApply = (jobTitle: string) => {
    toast({
      title: `Application initiated for ${jobTitle}`,
      description: "Our careers portal would open in a real application.",
    });
  };

  return (
    <>
      <Navbar />
      <main className="container-custom py-12">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="max-w-3xl mx-auto text-muted-foreground">
            At MealStock, we're on a mission to transform how Nigerians eat. We're looking for passionate 
            individuals who share our vision and want to make a meaningful impact on people's lives through food.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Work With Us?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Heart className="mr-2 text-mealstock-orange" />
                  Meaningful Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Help solve real food challenges for busy Nigerians while reducing food waste and supporting local food ecosystems.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <TrendingUp className="mr-2 text-mealstock-orange" />
                  Growth Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>We're expanding rapidly, creating plenty of opportunities for advancement and skill development across departments.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Users className="mr-2 text-mealstock-orange" />
                  Collaborative Culture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Join a diverse, supportive team that values innovation, collaboration, and celebration of achievements together.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Open Positions</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen size={16} />
              Our Hiring Process
            </Button>
          </div>
          
          <div className="space-y-6">
            {positions.map(position => (
              <Card key={position.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1">{position.title}</CardTitle>
                      <CardDescription className="flex flex-col sm:flex-row sm:gap-4">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {position.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {position.type}
                        </span>
                        <span className="flex items-center">
                          <Banknote className="h-4 w-4 mr-1" />
                          {position.salary}
                        </span>
                      </CardDescription>
                    </div>
                    <Briefcase className="h-6 w-6 text-mealstock-green hidden sm:block" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{position.description}</p>
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {position.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{req}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => handleApply(position.title)}
                  >
                    Apply Now
                    <ArrowRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Careers;
