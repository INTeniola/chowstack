
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Calendar, Download, ExternalLink, Award, ArrowUpRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const pressReleases = [
  {
    id: 1,
    title: 'MealStock Raises $2.5M to Expand Meal Delivery Service Across Nigeria',
    date: 'June 15, 2023',
    summary: 'MealStock announced today that it has raised $2.5 million in seed funding to expand its operations to five additional Nigerian cities by the end of 2023.',
    link: '#'
  },
  {
    id: 2,
    title: 'MealStock Partners with 20 Local Farms to Promote Sustainable Food Chain',
    date: 'March 8, 2023',
    summary: 'In an effort to support local agriculture and reduce carbon footprint, MealStock has formed partnerships with 20 farms across Nigeria to source fresh ingredients.',
    link: '#'
  },
  {
    id: 3,
    title: 'MealStock Launches New Mobile App with Enhanced Meal Planning Features',
    date: 'November 22, 2022',
    summary: 'MealStock\'s new mobile application introduces AI-powered meal recommendations and allows customers to plan deliveries up to three months in advance.',
    link: '#'
  }
];

const newsFeatures = [
  {
    id: 1,
    title: 'How MealStock is Revolutionizing Food Delivery in Nigeria',
    publication: 'TechCabal',
    date: 'July 3, 2023',
    summary: 'An in-depth look at how MealStock is addressing the unique challenges of food delivery in Nigeria while creating opportunities for local food vendors.',
    link: '#'
  },
  {
    id: 2,
    title: 'The Rise of Bulk Meal Planning Services in African Urban Centers',
    publication: 'Business Day',
    date: 'May 19, 2023',
    summary: 'MealStock is featured as a case study in how innovative food tech companies are addressing the needs of busy urban professionals across Africa.',
    link: '#'
  },
  {
    id: 3,
    title: '30 Under 30: MealStock Founder Named Among Top Young Entrepreneurs',
    publication: 'Forbes Africa',
    date: 'February 10, 2023',
    summary: 'MealStock\'s founder has been recognized for creating a business that tackles food waste while providing convenience to thousands of Nigerians.',
    link: '#'
  }
];

const awards = [
  {
    id: 1,
    title: 'Food Tech Startup of the Year',
    organization: 'Nigeria Technology Awards',
    year: '2023'
  },
  {
    id: 2,
    title: 'Innovation in Sustainable Business',
    organization: 'Lagos Business Excellence Awards',
    year: '2022'
  },
  {
    id: 3,
    title: 'Best Use of Technology in Food Service',
    organization: 'African Food Innovation Awards',
    year: '2022'
  }
];

const Press = () => {
  const { toast } = useToast();
  
  const handleDownload = (type: string) => {
    toast({
      title: `${type} downloading`,
      description: "In a real application, this would download the requested assets.",
    });
  };

  return (
    <>
      <Navbar />
      <main className="container-custom py-12">
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold">Press & Media</h1>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleDownload('Media Kit')}
              >
                <Download size={16} />
                Media Kit
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleDownload('Logo Pack')}
              >
                <Download size={16} />
                Logo Pack
              </Button>
            </div>
          </div>
          <p className="max-w-3xl text-muted-foreground mb-8">
            Find the latest news, press releases, and media coverage about MealStock. 
            For press inquiries, please contact our media team at press@mealstock.ng.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Newspaper className="mr-2 text-mealstock-green" />
            Press Releases
          </h2>
          
          <div className="space-y-6">
            {pressReleases.map(item => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="flex items-center whitespace-nowrap ml-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {item.date}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{item.summary}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.open(item.link, '_blank')}
                  >
                    Read Full Release
                    <ExternalLink size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Newspaper className="mr-2 text-mealstock-green" />
            News Coverage
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsFeatures.map(item => (
              <Card key={item.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.publication} • {item.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{item.summary}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-mealstock-green"
                    onClick={() => window.open(item.link, '_blank')}
                  >
                    Read Article
                    <ArrowUpRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Award className="mr-2 text-mealstock-green" />
            Awards & Recognition
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {awards.map(award => (
              <Card key={award.id} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-mealstock-cream flex items-center justify-center">
                      <Award className="h-8 w-8 text-mealstock-orange" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{award.title}</CardTitle>
                  <CardDescription>{award.organization}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-mealstock-green">{award.year}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Press;
