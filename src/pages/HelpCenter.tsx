
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Search, Phone, Mail, MessageSquare, FileText, Clock, Package, CreditCard, User } from 'lucide-react';

// FAQs data organized by category
const faqCategories = {
  orders: [
    {
      question: "How do I place a bulk meal order?",
      answer: "You can place a bulk order by selecting your desired meals, choosing the quantity, and proceeding to checkout. Our system allows you to schedule deliveries for up to a month in advance."
    },
    {
      question: "Can I modify my order after it's been placed?",
      answer: "Yes, you can modify your order up to 24 hours before the scheduled delivery time. Go to 'My Orders' in your account dashboard and select the order you wish to modify."
    },
    {
      question: "What is the minimum order quantity?",
      answer: "Our minimum order is 5 meals per delivery. This helps us optimize our preparation and delivery processes while keeping costs reasonable."
    },
    {
      question: "How far in advance should I place my order?",
      answer: "We recommend placing orders at least 48 hours in advance to ensure availability. For large orders (20+ meals), we suggest ordering 3-5 days ahead."
    }
  ],
  delivery: [
    {
      question: "What areas do you currently serve in Nigeria?",
      answer: "We currently deliver to major urban centers including Lagos, Abuja, Port Harcourt, Ibadan, and Kano. We're constantly expanding our service areas."
    },
    {
      question: "How are my meals delivered?",
      answer: "Meals are delivered in temperature-controlled containers by our dedicated delivery fleet. We use insulated packaging to ensure your food arrives at the proper temperature."
    },
    {
      question: "What are your delivery hours?",
      answer: "We deliver 7 days a week from 8 AM to 8 PM. You can select your preferred delivery window during checkout."
    },
    {
      question: "Is there a delivery fee?",
      answer: "Delivery is free for orders above ₦15,000. For smaller orders, a delivery fee between ₦1,000-₦2,000 applies depending on your location."
    }
  ],
  payment: [
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, bank transfers, and mobile payment services including Paystack, Flutterwave, and mobile money options."
    },
    {
      question: "Can I pay on delivery?",
      answer: "Unfortunately, we do not offer cash on delivery. All orders must be paid for in advance to help us manage our inventory and preparation efficiently."
    },
    {
      question: "How do I request a refund?",
      answer: "If you're not satisfied with your order, please contact our customer service within 24 hours of delivery. If approved, refunds are typically processed within 3-5 business days."
    }
  ],
  account: [
    {
      question: "How do I create a meal plan subscription?",
      answer: "After creating an account, go to 'Meal Plans' and select your preferred plan, customize it according to your needs, and set up your delivery schedule and payment method."
    },
    {
      question: "Can I share my account with family members?",
      answer: "Yes! You can add family members as sub-accounts under your main account. Each sub-account can have their own meal preferences while sharing the delivery address and payment method."
    },
    {
      question: "How do I update my dietary preferences?",
      answer: "Log in to your account, go to 'Profile' and select 'Dietary Preferences'. Here you can update your likes, dislikes, allergies, and dietary restrictions."
    }
  ]
};

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  
  // Simple search functionality
  const filteredFaqs = Object.entries(faqCategories).reduce((acc, [category, faqs]) => {
    const filteredCategory = faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredCategory.length > 0) {
      acc[category] = filteredCategory;
    }
    return acc;
  }, {} as Record<string, typeof faqCategories.orders>);

  return (
    <>
      <Navbar />
      <main className="container-custom py-12">
        <section className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <HelpCircle size={36} className="text-mealstock-green" />
          </div>
          <h1 className="text-4xl font-bold mb-4">How Can We Help?</h1>
          <p className="max-w-3xl mx-auto text-muted-foreground mb-8">
            Find answers to frequently asked questions, or reach out to our support team for personalized assistance.
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </section>
        
        <section className="mb-12">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="flex flex-col items-center text-center p-6">
              <Phone className="h-10 w-10 text-mealstock-green mb-4" />
              <h3 className="font-semibold text-lg mb-2">Call Us</h3>
              <p className="text-muted-foreground mb-4">Available 8am - 8pm daily</p>
              <p className="font-medium">+234 (0) 123 456 7890</p>
            </Card>
            
            <Card className="flex flex-col items-center text-center p-6">
              <Mail className="h-10 w-10 text-mealstock-green mb-4" />
              <h3 className="font-semibold text-lg mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-4">We respond within 24 hours</p>
              <p className="font-medium">support@mealstock.ng</p>
            </Card>
            
            <Card className="flex flex-col items-center text-center p-6">
              <MessageSquare className="h-10 w-10 text-mealstock-green mb-4" />
              <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
              <p className="text-muted-foreground mb-4">Quick answers to quick questions</p>
              <Button size="sm">Start Chat</Button>
            </Card>
            
            <Card className="flex flex-col items-center text-center p-6">
              <FileText className="h-10 w-10 text-mealstock-green mb-4" />
              <h3 className="font-semibold text-lg mb-2">Submit Ticket</h3>
              <p className="text-muted-foreground mb-4">For complex issues</p>
              <Button size="sm" variant="outline">Open Ticket</Button>
            </Card>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Clock size={16} />
                Orders
              </TabsTrigger>
              <TabsTrigger value="delivery" className="flex items-center gap-2">
                <Package size={16} />
                Delivery
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard size={16} />
                Payment
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User size={16} />
                Account
              </TabsTrigger>
            </TabsList>
            
            {Object.keys(faqCategories).map(category => (
              <TabsContent value={category} key={category}>
                <Card>
                  <CardHeader>
                    <CardTitle className="capitalize">{category} FAQs</CardTitle>
                    <CardDescription>
                      Common questions about {category.toLowerCase()} at MealStock
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {(searchQuery ? filteredFaqs[category] || [] : faqCategories[category as keyof typeof faqCategories]).map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                          <AccordionTrigger className="text-left font-medium">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HelpCenter;
