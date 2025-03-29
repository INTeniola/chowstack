
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, ArrowRight, User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "10 Nigerian Superfoods to Include in Your Meal Plan",
    excerpt: "Discover local nutrient-dense foods that can elevate your health and add authentic flavors to your meal preparation.",
    date: "June 28, 2023",
    category: "Nutrition",
    author: {
      name: "Amara Okafor",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      role: "Nutritionist"
    },
    image: "https://images.unsplash.com/photo-1576402187878-974f70c890a5",
    tags: ["nutrition", "nigerian food", "superfoods"]
  },
  {
    id: 2,
    title: "The Economics of Bulk Meal Planning: How Much Can You Save?",
    excerpt: "A detailed breakdown of how planning and preparing meals in bulk can reduce your food costs by up to 40% while saving time.",
    date: "May 15, 2023",
    category: "Budget",
    author: {
      name: "Ibrahim Mohammed",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      role: "Financial Analyst"
    },
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
    tags: ["budget", "savings", "planning"]
  },
  {
    id: 3,
    title: "How to Store and Reheat Your MealStock Deliveries for Maximum Freshness",
    excerpt: "Expert tips on keeping your bulk-delivered meals fresh for longer and reheating techniques that preserve nutrients and flavor.",
    date: "April 10, 2023",
    category: "How-To",
    author: {
      name: "Chioma Eze",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      role: "Chef"
    },
    image: "https://images.unsplash.com/photo-1584263347416-85a696b4660e",
    tags: ["storage", "freshness", "tips"]
  },
  {
    id: 4,
    title: "Meal Prepping for Nigerian Professionals: Balancing Tradition and Convenience",
    excerpt: "How busy professionals can maintain cultural connections through food while embracing modern meal preparation methods.",
    date: "March 22, 2023",
    category: "Lifestyle",
    author: {
      name: "Emeka Okafor",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      role: "Food Writer"
    },
    image: "https://images.unsplash.com/photo-1620791144170-8a443bf37a33",
    tags: ["lifestyle", "culture", "busy professionals"]
  },
  {
    id: 5,
    title: "The Environmental Impact of Sustainable Food Delivery in Nigeria",
    excerpt: "How MealStock and similar services are reducing food waste and carbon footprints through optimized logistics and packaging.",
    date: "February 14, 2023",
    category: "Sustainability",
    author: {
      name: "Folake Adeyemi",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      role: "Environmental Scientist"
    },
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
    tags: ["sustainability", "environment", "green"]
  },
  {
    id: 6,
    title: "Family Meal Planning: Feeding a Nigerian Household Efficiently",
    excerpt: "Strategies for families to coordinate meals, accommodate diverse preferences, and streamline cooking for everyone's benefit.",
    date: "January 8, 2023",
    category: "Family",
    author: {
      name: "Ngozi Okonkwo",
      avatar: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c",
      role: "Family Nutritionist"
    },
    image: "https://images.unsplash.com/photo-1547592180-85f173990554",
    tags: ["family", "planning", "household"]
  }
];

const categories = [
  "All",
  "Nutrition",
  "Budget",
  "How-To",
  "Lifestyle",
  "Sustainability",
  "Family"
];

const Blog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Filter posts based on search query and active category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleReadMore = (postId: number) => {
    // In a real app, this would navigate to a blog post details page
    console.log(`Navigating to blog post ${postId}`);
    // navigate(`/blog/${postId}`);
  };

  return (
    <>
      <Navbar />
      <main className="container-custom py-12">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-center">MealStock Blog</h1>
          <p className="max-w-3xl mx-auto text-center text-muted-foreground mb-8">
            Insights, tips, and stories about food, nutrition, and building healthier eating habits in Nigeria
          </p>
          
          <div className="max-w-2xl mx-auto relative mb-10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="flex h-10 bg-muted p-1 rounded-md mb-8 overflow-auto">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="flex-1"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </section>
        
        <section className="mb-12">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <Card key={post.id} className="flex flex-col overflow-hidden h-full">
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="bg-mealstock-cream/20">{post.category}</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.date}
                      </div>
                    </div>
                    <CardTitle className="text-xl hover:text-mealstock-green transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2 h-10">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">{post.author.role}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-mealstock-green p-0 h-auto"
                      onClick={() => handleReadMore(post.id)}
                    >
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
              <Button 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </section>
        
        <section className="mb-12">
          <Card className="bg-mealstock-cream/10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Subscribe to Our Newsletter</CardTitle>
              <CardDescription className="text-center">
                Get the latest articles, recipes, and tips delivered straight to your inbox
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Your email address" className="pl-10" />
                </div>
                <Button type="submit">Subscribe</Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
