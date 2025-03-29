
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Calendar, Link as LinkIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PrivacyPolicy = () => {
  const { toast } = useToast();
  
  const handleDownload = () => {
    toast({
      title: "Privacy Policy PDF",
      description: "Download initiated. In a real application, this would download the privacy policy as a PDF.",
    });
  };

  return (
    <>
      <Navbar />
      <main className="container-custom py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Shield className="h-8 w-8 mr-3 text-mealstock-green" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            Last updated: May 15, 2023
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <LinkIcon className="h-5 w-5 mr-2 text-mealstock-orange" />
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-2">
              <li>
                <a href="#information-collection" className="text-mealstock-green hover:underline">Information We Collect</a>
              </li>
              <li>
                <a href="#information-use" className="text-mealstock-green hover:underline">How We Use Your Information</a>
              </li>
              <li>
                <a href="#information-sharing" className="text-mealstock-green hover:underline">Information Sharing</a>
              </li>
              <li>
                <a href="#your-rights" className="text-mealstock-green hover:underline">Your Rights and Choices</a>
              </li>
              <li>
                <a href="#data-security" className="text-mealstock-green hover:underline">Data Security</a>
              </li>
              <li>
                <a href="#children" className="text-mealstock-green hover:underline">Children's Privacy</a>
              </li>
              <li>
                <a href="#changes" className="text-mealstock-green hover:underline">Changes to This Policy</a>
              </li>
              <li>
                <a href="#contact" className="text-mealstock-green hover:underline">Contact Us</a>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <div className="mb-8">
          <p className="mb-4">
            At MealStock, we respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you 
            use our website, mobile application, and services.
          </p>
          <p className="mb-4">
            By using MealStock, you consent to the data practices described in this policy. 
            We encourage you to read this document carefully to understand how we handle your information.
          </p>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download Policy as PDF
          </Button>
        </div>
        
        <div className="space-y-8">
          <section id="information-collection">
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <p className="text-muted-foreground">
                  We collect personal information that you voluntarily provide to us when you register 
                  for an account, place an order, sign up for our newsletter, respond to surveys, or 
                  contact us. This may include:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Name, email address, phone number, and physical address</li>
                  <li>Payment information (processed securely through our payment processors)</li>
                  <li>Dietary preferences, restrictions, and allergies</li>
                  <li>Order history and preferences</li>
                  <li>Feedback and survey responses</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Automatically Collected Information</h3>
                <p className="text-muted-foreground">
                  When you use our services, we may automatically collect certain information about 
                  your device and usage patterns, including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>IP address, browser type, device type, and operating system</li>
                  <li>Pages visited, time spent on pages, and click patterns</li>
                  <li>Location information (with your consent)</li>
                  <li>Referral sources and app usage statistics</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section id="information-use">
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Processing and fulfilling your orders</li>
              <li>Creating and managing your account</li>
              <li>Providing customer support and responding to inquiries</li>
              <li>Improving our services, website, and app functionality</li>
              <li>Personalizing your experience and recommending products</li>
              <li>Sending operational communications about your orders or account</li>
              <li>Marketing our services (with your consent where required)</li>
              <li>Conducting research and analytics to improve our offerings</li>
              <li>Ensuring the security of our services and preventing fraud</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>
          
          <section id="information-sharing">
            <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell your personal information to third parties. We may share your information 
              with the following entities and under the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Service Providers:</strong> We share information with vendors, delivery partners, 
                payment processors, and other service providers who perform services on our behalf.
              </li>
              <li>
                <strong>Partner Chefs and Food Vendors:</strong> To facilitate meal preparation and delivery, 
                we share relevant order details with our network of chefs and food vendors.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information if required by law, 
                regulation, legal process, or governmental request.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all 
                or part of our business, personal information may be transferred as a business asset.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may share information with third parties when you 
                consent to such sharing.
              </li>
            </ul>
          </section>
          
          <section id="your-rights">
            <h2 className="text-2xl font-bold mb-4">Your Rights and Choices</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access, correct, or delete your personal information</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Data portability (receiving your data in a structured, machine-readable format)</li>
              <li>Withdraw consent for activities based on consent</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              You can exercise many of these rights through your account settings or by contacting us at privacy@mealstock.ng.
            </p>
          </section>
          
          <section id="data-security">
            <h2 className="text-2xl font-bold mb-4">Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. 
              These measures include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Encryption of sensitive data</li>
              <li>Secure networks and servers</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication procedures</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              While we strive to protect your information, no method of transmission over the Internet 
              or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          
          <section id="children">
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are not intended for children under the age of 18. We do not knowingly collect 
              personal information from children. If you believe we have inadvertently collected information 
              from a child, please contact us immediately, and we will take steps to delete such information.
            </p>
          </section>
          
          <section id="changes">
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time to reflect changes in our practices or 
              legal requirements. The updated policy will be posted on our website and app with a revised 
              effective date. We encourage you to review this policy periodically. Continued use of our 
              services after any changes indicates your acceptance of the revised Privacy Policy.
            </p>
          </section>
          
          <section id="contact">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="not-prose">
              <p className="mb-1"><strong>Email:</strong> privacy@mealstock.ng</p>
              <p className="mb-1"><strong>Address:</strong> 123 Admiralty Way, Lekki Phase 1, Lagos, Nigeria</p>
              <p><strong>Phone:</strong> +234 (0) 123 456 7890</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
