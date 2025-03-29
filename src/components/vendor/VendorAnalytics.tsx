
import React, { useState } from 'react';
import { Vendor } from '@/hooks/useVendorAuth';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  TrendingUp,
  ShoppingBag,
  ArrowDown,
  ArrowUp,
  Calendar,
  RefreshCcw,
  Download,
  Users
} from 'lucide-react';

interface VendorAnalyticsProps {
  vendor: Vendor;
}

// Mock data for charts
const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
  { name: 'Aug', value: 4000 },
  { name: 'Sep', value: 5000 },
  { name: 'Oct', value: 4500 },
  { name: 'Nov', value: 3500 },
  { name: 'Dec', value: 4200 },
];

const weeklyRevenueData = [
  { name: 'Mon', value: 1200 },
  { name: 'Tue', value: 1800 },
  { name: 'Wed', value: 1600 },
  { name: 'Thu', value: 2400 },
  { name: 'Fri', value: 2800 },
  { name: 'Sat', value: 1900 },
  { name: 'Sun', value: 1500 },
];

const weeklyOrdersData = [
  { name: 'Mon', value: 12 },
  { name: 'Tue', value: 18 },
  { name: 'Wed', value: 16 },
  { name: 'Thu', value: 24 },
  { name: 'Fri', value: 28 },
  { name: 'Sat', value: 19 },
  { name: 'Sun', value: 15 },
];

const packagePerformanceData = [
  { name: 'Family Meal Bundle', value: 4200 },
  { name: 'Vegetarian Weekly Pack', value: 3800 },
  { name: 'Protein Power Pack', value: 2900 },
  { name: 'Breakfast Essentials', value: 2400 },
];

const customerTrendsData = [
  { name: 'Jan', new: 65, returning: 45 },
  { name: 'Feb', new: 58, returning: 52 },
  { name: 'Mar', new: 70, returning: 60 },
  { name: 'Apr', new: 75, returning: 72 },
  { name: 'May', new: 82, returning: 80 },
  { name: 'Jun', new: 90, returning: 85 },
  { name: 'Jul', new: 95, returning: 90 },
];

const dietaryPreferencesData = [
  { name: 'Standard', value: 45 },
  { name: 'Vegetarian', value: 25 },
  { name: 'Vegan', value: 15 },
  { name: 'Gluten-Free', value: 10 },
  { name: 'Keto', value: 5 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

const VendorAnalytics: React.FC<VendorAnalyticsProps> = ({ vendor }) => {
  const [timeFrame, setTimeFrame] = useState('week');
  
  // Mock metrics
  const metrics = [
    {
      title: 'Revenue',
      value: '$12,450',
      change: '+12.3%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Orders',
      value: '237',
      change: '+5.2%',
      trend: 'up',
      icon: ShoppingBag,
    },
    {
      title: 'Average Order Value',
      value: '$52.53',
      change: '+6.5%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Returning Customers',
      value: '68%',
      change: '+4.2%',
      trend: 'up',
      icon: Users,
    },
  ];
  
  const refreshData = () => {
    // In a real implementation, this would fetch updated data
    // For this demo, we'll just show a toast
    toast({
      title: "Data refreshed",
      description: `Analytics data updated as of ${format(new Date(), 'MMMM d, yyyy h:mm a')}`,
    });
  };
  
  const downloadReport = () => {
    // In a real implementation, this would generate and download a report
    // For this demo, we'll just show a toast
    toast({
      title: "Report download started",
      description: "Your analytics report is being prepared and will download shortly.",
    });
  };
  
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-mealstock-brown">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your business performance and customer trends</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={timeFrame}
            onValueChange={setTimeFrame}
          >
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <SelectValue placeholder="Time Period" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={refreshData}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" onClick={downloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Report
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <span className={`text-xs font-medium ${metric.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {metric.change}
                      {metric.trend === 'up' ? (
                        <ArrowUp className="inline h-3 w-3 ml-0.5" />
                      ) : (
                        <ArrowDown className="inline h-3 w-3 ml-0.5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-mealstock-cream/40">
                  <metric.icon className="w-5 h-5 text-mealstock-brown" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                {timeFrame === 'week' ? 'Weekly' : timeFrame === 'month' ? 'Monthly' : timeFrame === 'quarter' ? 'Quarterly' : 'Yearly'} revenue performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: { color: '#10b981' },
                }}
                className="aspect-[4/3] sm:aspect-[2/1]"
              >
                <LineChart data={timeFrame === 'week' ? weeklyRevenueData : revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => (
                      <ChartTooltipContent 
                        active={active} 
                        payload={payload}
                        formatter={(value) => formatCurrency(value as number)}
                      />
                    )}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--color-revenue)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-revenue)', strokeWidth: 2, r: 4 }}
                    activeDot={{ fill: 'var(--color-revenue)', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Direct', value: 5600 },
                          { name: 'Marketplace', value: 3800 },
                          { name: 'Community Hub', value: 2200 },
                          { name: 'Group Orders', value: 850 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {[0, 1, 2, 3].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Average Order Value Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    aov: { color: '#8b5cf6' },
                  }}
                  className="aspect-[4/3] sm:aspect-[2/1]"
                >
                  <LineChart data={[
                    { name: 'Week 1', value: 48.5 },
                    { name: 'Week 2', value: 49.2 },
                    { name: 'Week 3', value: 50.7 },
                    { name: 'Week 4', value: 51.3 },
                    { name: 'Week 5', value: 52.5 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      domain={['dataMin - 5', 'dataMax + 5']}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => (
                        <ChartTooltipContent 
                          active={active} 
                          payload={payload}
                          formatter={(value) => `$${value}`}
                        />
                      )}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--color-aov)" 
                      strokeWidth={2}
                      dot={{ fill: 'var(--color-aov)', strokeWidth: 2, r: 4 }}
                      activeDot={{ fill: 'var(--color-aov)', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Volume</CardTitle>
              <CardDescription>
                {timeFrame === 'week' ? 'Weekly' : timeFrame === 'month' ? 'Monthly' : timeFrame === 'quarter' ? 'Quarterly' : 'Yearly'} order count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  orders: { color: '#3b82f6' },
                }}
                className="aspect-[4/3] sm:aspect-[2/1]"
              >
                <BarChart data={weeklyOrdersData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <ChartTooltip
                    content={({ active, payload }) => (
                      <ChartTooltipContent 
                        active={active} 
                        payload={payload}
                        formatter={(value) => `${value} orders`}
                      />
                    )}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="var(--color-orders)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: 78 },
                          { name: 'In Progress', value: 15 },
                          { name: 'Pending', value: 7 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Direct', value: 45 },
                          { name: 'Marketplace', value: 30 },
                          { name: 'Community', value: 15 },
                          { name: 'Group Orders', value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {[0, 1, 2, 3].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Package Performance</CardTitle>
              <CardDescription>Revenue by meal package</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  packages: { color: '#f59e0b' },
                }}
                className="aspect-[4/3] sm:aspect-[2/1]"
              >
                <BarChart 
                  data={packagePerformanceData}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis 
                    type="number" 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    width={150}
                  />
                  <ChartTooltip
                    content={({ active, payload, label }) => (
                      <ChartTooltipContent 
                        active={active} 
                        payload={payload}
                        label={label}
                        formatter={(value) => formatCurrency(value as number)}
                      />
                    )}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="var(--color-packages)" 
                    radius={[0, 4, 4, 0]} 
                    barSize={30}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Popular Add-ons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Fresh Bread", count: 142, percent: 65 },
                    { name: "Seasonal Fruit", count: 98, percent: 45 },
                    { name: "Dessert Package", count: 76, percent: 35 },
                    { name: "Organic Wine", count: 54, percent: 25 },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.count} orders</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-mealstock-green rounded-full" 
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dietary Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dietaryPreferencesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {dietaryPreferencesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
              <CardDescription>New vs. returning customers</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  new: { color: '#3b82f6' },
                  returning: { color: '#10b981' },
                }}
                className="aspect-[4/3] sm:aspect-[2/1]"
              >
                <BarChart data={customerTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <ChartTooltip
                    content={({ active, payload }) => (
                      <ChartTooltipContent 
                        active={active} 
                        payload={payload}
                      />
                    )}
                  />
                  <Bar 
                    dataKey="new" 
                    fill="var(--color-new)" 
                    name="New Customers"
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                  <Bar 
                    dataKey="returning" 
                    fill="var(--color-returning)" 
                    name="Returning Customers"
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      <svg 
                        className="w-full h-full"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          className="text-gray-200"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-green-500"
                          strokeWidth="10"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={
                            2 * Math.PI * 40 * (1 - 0.92)
                          }
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">92%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <h4 className="font-medium">Customer Satisfaction Score</h4>
                    <p className="text-sm text-muted-foreground">Based on 156 customer reviews</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 border rounded-md">
                      <div className="text-xl font-bold text-green-500">4.8</div>
                      <div className="text-xs text-muted-foreground">Quality</div>
                    </div>
                    <div className="p-2 border rounded-md">
                      <div className="text-xl font-bold text-green-500">4.6</div>
                      <div className="text-xs text-muted-foreground">Timeliness</div>
                    </div>
                    <div className="p-2 border rounded-md">
                      <div className="text-xl font-bold text-green-500">4.9</div>
                      <div className="text-xs text-muted-foreground">Value</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Families', value: 45 },
                          { name: 'Singles', value: 30 },
                          { name: 'Seniors', value: 15 },
                          { name: 'Students', value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {[0, 1, 2, 3].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorAnalytics;
