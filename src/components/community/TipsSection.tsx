
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Thermometer, Archive, Droplet } from 'lucide-react';

const TipsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="storage">
        <TabsList className="grid grid-cols-3 w-full md:w-auto md:inline-grid">
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="reheating">Reheating</TabsTrigger>
          <TabsTrigger value="preservation">Preservation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="storage" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-mealstock-green/10 p-3 rounded-full">
                  <Thermometer className="h-6 w-6 text-mealstock-green" />
                </div>
                <div>
                  <CardTitle>Optimal Storage Temperatures</CardTitle>
                  <CardDescription>Keep your food fresh for longer</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-mealstock-green font-semibold mr-2">•</span>
                    <span>Store rice and rice dishes at 4°C (40°F) in the fridge for up to 3-4 days.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-green font-semibold mr-2">•</span>
                    <span>Keep soups and stews at 4°C (40°F) and consume within 3-5 days.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-green font-semibold mr-2">•</span>
                    <span>Freeze meals at -18°C (0°F) for long-term storage up to 2-3 months.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-green font-semibold mr-2">•</span>
                    <span>Refrigerate prepared dishes within 2 hours of cooking to prevent bacterial growth.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-mealstock-orange/10 p-3 rounded-full">
                  <Archive className="h-6 w-6 text-mealstock-orange" />
                </div>
                <div>
                  <CardTitle>Container Selection</CardTitle>
                  <CardDescription>Choose the right containers for different foods</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-mealstock-orange font-semibold mr-2">•</span>
                    <span>Use glass containers for soups and stews to prevent staining and odor retention.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-orange font-semibold mr-2">•</span>
                    <span>Store dry ingredients like rice and beans in airtight containers to prevent moisture.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-orange font-semibold mr-2">•</span>
                    <span>Use silicone bags for marinating meats and storing vegetables.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-orange font-semibold mr-2">•</span>
                    <span>Separate components of meals (rice, protein, sauce) for better preservation and reheating.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reheating" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-mealstock-green/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-mealstock-green" />
                </div>
                <div>
                  <CardTitle>Reheating Methods</CardTitle>
                  <CardDescription>Best practices for different dishes</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-mealstock-green font-semibold mr-2">•</span>
                    <span>Reheat rice by adding a tablespoon of water, covering, and microwaving for 1-2 minutes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-green font-semibold mr-2">•</span>
                    <span>Soups and stews are best reheated on the stovetop over medium-low heat, stirring occasionally.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-green font-semibold mr-2">•</span>
                    <span>For fried foods, use an oven or air fryer at 350°F for 5-10 minutes to restore crispiness.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-green font-semibold mr-2">•</span>
                    <span>Thaw frozen meals in the refrigerator overnight before reheating for even warming.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-mealstock-orange/10 p-3 rounded-full">
                  <Thermometer className="h-6 w-6 text-mealstock-orange" />
                </div>
                <div>
                  <CardTitle>Safe Temperatures</CardTitle>
                  <CardDescription>Ensure food safety while reheating</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-mealstock-orange font-semibold mr-2">•</span>
                    <span>Reheat all food to at least 74°C (165°F) to kill harmful bacteria.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-orange font-semibold mr-2">•</span>
                    <span>Use a food thermometer to check internal temperature, especially for thick foods.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-orange font-semibold mr-2">•</span>
                    <span>Stir food during reheating to ensure even temperature distribution.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-orange font-semibold mr-2">•</span>
                    <span>Never reheat food more than once to prevent bacterial growth.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="preservation" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-mealstock-green/10 p-3 rounded-full">
                  <Droplet className="h-6 w-6 text-mealstock-green" />
                </div>
                <div>
                  <CardTitle>Natural Preservatives</CardTitle>
                  <CardDescription>Extend shelf life naturally</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-mealstock-green font-semibold mr-2">•</span>
                    <span>Add a tablespoon of palm oil on top of soups and stews before refrigerating to create a natural seal.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-green font-semibold mr-2">•</span>
                    <span>Use citrus juice (lime or lemon) to prevent browning in fruits and certain vegetable dishes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-green font-semibold mr-2">•</span>
                    <span>Salt is a natural preservative - properly salted dishes will last longer.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-green font-semibold mr-2">•</span>
                    <span>Herbs like rosemary and thyme have natural antimicrobial properties that help food last longer.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-mealstock-orange/10 p-3 rounded-full">
                  <Archive className="h-6 w-6 text-mealstock-orange" />
                </div>
                <div>
                  <CardTitle>Freezing Techniques</CardTitle>
                  <CardDescription>Properly freeze meals for later use</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-mealstock-orange font-semibold mr-2">•</span>
                    <span>Cool food completely before freezing to prevent ice crystal formation and freezer burn.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-orange font-semibold mr-2">•</span>
                    <span>Portion food into meal-sized containers for easier thawing and less waste.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-orange font-semibold mr-2">•</span>
                    <span>Label containers with contents and date to keep track of freshness.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-mealstock-orange font-semibold mr-2">•</span>
                    <span>Leave some space in containers when freezing liquids, as they expand when frozen.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TipsSection;
