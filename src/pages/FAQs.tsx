
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: "Using Our Service",
    questions: [
      {
        question: "How does MealStock's bulk meal delivery work?",
        answer: "MealStock allows you to order multiple meals at once for delivery on your schedule. You can select individual meals or choose from our curated meal plans, set your preferred delivery dates, and we'll prepare and deliver fresh meals to your doorstep. All meals are prepared by our network of certified chefs and food vendors."
      },
      {
        question: "What's the difference between meal plans and one-time orders?",
        answer: "Meal plans are recurring subscriptions where we deliver a set number of meals on a regular schedule (weekly, bi-weekly, or monthly). One-time orders are single bulk deliveries with no ongoing commitment. Meal plans typically offer better pricing and can be paused or modified at any time."
      },
      {
        question: "How do I store my meals after delivery?",
        answer: "All meals come with storage instructions. Generally, meals should be refrigerated promptly and consumed within 3-5 days. Some meals are freezer-friendly and can be stored for up to 3 months. Detailed storage instructions are included with each delivery and available on our mobile app."
      },
      {
        question: "Can I customize meals to accommodate dietary restrictions?",
        answer: "Yes, we offer extensive customization options. During the ordering process, you can indicate allergies, dietary preferences (vegetarian, vegan, keto, low-carb, etc.), and specific ingredients to avoid. Many of our meal plans are designed with specific dietary needs in mind."
      }
    ]
  },
  {
    category: "Orders & Delivery",
    questions: [
      {
        question: "What is the minimum order quantity?",
        answer: "Our minimum order is 5 meals per delivery. This helps us optimize our preparation and delivery processes while keeping costs reasonable."
      },
      {
        question: "How far in advance should I place my order?",
        answer: "We recommend placing orders at least 48 hours in advance to ensure availability. For large orders (20+ meals), we suggest ordering 3-5 days ahead."
      },
      {
        question: "Can I modify or cancel my order?",
        answer: "Orders can be modified or cancelled up to 24 hours before the scheduled preparation time. For changes within 24 hours, please contact our customer support team, though modifications may be limited once preparation has begun."
      },
      {
        question: "What are your delivery hours?",
        answer: "We deliver 7 days a week from 8 AM to 8 PM. You can select your preferred delivery window during checkout."
      },
      {
        question: "Do you deliver to all locations in Nigeria?",
        answer: "We currently serve major urban centers including Lagos, Abuja, Port Harcourt, Ibadan, and Kano. We're expanding our coverage regularly - check our app or website for the most current service areas."
      }
    ]
  },
  {
    category: "Payment & Pricing",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept credit/debit cards, bank transfers, and mobile payment services including Paystack, Flutterwave, and mobile money options."
      },
      {
        question: "How does pricing work for bulk orders?",
        answer: "Our pricing offers volume discounts - the more meals you order, the lower the per-meal cost. We also offer tiered pricing based on meal complexity and ingredients. Premium meals with specialty ingredients may be priced higher than our standard options."
      },
      {
        question: "Are there any hidden fees?",
        answer: "No, we're transparent about all costs. During checkout, you'll see the meal costs, any applicable delivery fees, and taxes clearly itemized. Delivery is free for orders above ₦15,000."
      },
      {
        question: "Do you offer corporate or group discounts?",
        answer: "Yes, we offer special rates for corporate accounts, regular group orders, and community buying groups. Contact our business team at business@mealstock.ng for details and custom quotes."
      }
    ]
  },
  {
    category: "Food Quality & Safety",
    questions: [
      {
        question: "How do you ensure food quality and safety?",
        answer: "All our partner chefs and food vendors are certified and regularly audited for hygiene and food safety compliance. Ingredients are sourced from trusted suppliers, and we maintain strict cold chain protocols during preparation, storage, and delivery. Our facilities are regularly inspected by relevant health authorities."
      },
      {
        question: "What if I receive a damaged or incorrect meal?",
        answer: "We have a satisfaction guarantee. If any meal doesn't meet our standards or isn't what you ordered, simply report it through our app or contact customer service within 24 hours of delivery. We'll provide a replacement or refund."
      },
      {
        question: "How do you handle food allergies?",
        answer: "We take allergies very seriously. All ingredients are clearly listed for each meal, and you can specify allergies during the ordering process. Our kitchen follows strict protocols to prevent cross-contamination, but we do prepare various foods in the same facilities, so trace exposure is possible."
      },
      {
        question: "Are your packaging materials eco-friendly?",
        answer: "We're committed to sustainability and use biodegradable or recyclable packaging whenever possible. Our primary meal containers are made from plant-based materials, and we're continuously working to reduce our environmental footprint."
      }
    ]
  }
];

const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter FAQs based on search query
  const filteredFaqs = searchQuery 
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
          item => item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqs;

  return (
    <>
      <Navbar />
      <main className="container-custom py-12">
        <section className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <HelpCircle size={36} className="text-mealstock-orange" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="max-w-3xl mx-auto text-muted-foreground mb-8">
            Find answers to common questions about our service, ordering process, and more.
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
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, qIndex) => (
                    <AccordionItem value={`item-${index}-${qIndex}`} key={qIndex}>
                      <AccordionTrigger className="text-left font-medium">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No results found for "{searchQuery}"</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            </div>
          )}
        </section>
        
        <section className="mb-12">
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-xl">Still have questions?</CardTitle>
              <CardDescription>
                If you couldn't find the answer you were looking for, our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="flex-1">
                <Button variant="default" className="w-full">
                  Contact Us
                </Button>
              </Link>
              <Link to="/help-center" className="flex-1">
                <Button variant="outline" className="w-full flex items-center justify-center">
                  Visit Help Center <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FAQs;
