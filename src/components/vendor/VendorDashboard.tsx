
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Vendor } from '@/hooks/useVendorAuth';
import { Package, ShoppingCart, TrendingUp, Users, DollarSign, Star } from 'lucide-react';

interface VendorDashboardProps {
  vendor: Vendor;
}

const salesData = [
  { name: 'Mon', value: 1200 },
  { name: 'Tue', value: 1800 },
  { name: 'Wed', value: 1600 },
  { name: 'Thu', value: 2400 },
  { name: 'Fri', value: 2800 },
  { name: 'Sat', value: 1900 },
  { name: 'Sun', value: 1500 },
];

const orderStatusData = [
  { name: 'Completed', value: 78 },
  { name: 'In Progress', value: 15 },
  { name: 'Pending', value: 7 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

const VendorDashboard: React.FC<VendorDashboardProps> = ({ vendor }) => {
  // Summary data
  const summaryItems = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      delta: '+12.3%',
      icon: DollarSign,
      trend: 'up',
    },
    {
      title: 'Total Orders',
      value: '237',
      delta: '+5.2%',
      icon: ShoppingCart,
      trend: 'up',
    },
    {
      title: 'Active Meal Packages',
      value: '18',
      delta: '+2',
      icon: Package,
      trend: 'up',
    },
    {
      title: 'Customer Base',
      value: '156',
      delta: '+14.7%',
      icon: Users,
      trend: 'up',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryItems.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-1">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{item.value}</p>
                    <span className={`text-xs font-medium ${item.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {item.delta}
                    </span>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-mealstock-cream/40">
                  <item.icon className="w-5 h-5 text-mealstock-brown" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-6">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Weekly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: { color: '#10b981' },
              }}
              className="aspect-[4/3] sm:aspect-[2/1]"
            >
              <BarChart data={salesData}>
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
                      formatter={(value) => `$${value}`}
                    />
                  )}
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--color-sales)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {orderStatusData.map((entry, index) => (
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-start space-x-4 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="h-10 w-10 rounded-full bg-mealstock-cream flex items-center justify-center">
                    <span className="text-mealstock-brown font-medium">
                      {String.fromCharCode(65 + i)}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Customer {i + 1}</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        {i !== 1 && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        {i === 1 && <Star className="h-4 w-4 text-gray-300" />}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {i === 0 && "Excellent quality and always delivered on time. The family package is perfect for us!"}
                      {i === 1 && "Great value for money. Would recommend the weekly meal plan to anyone looking for healthy options."}
                      {i === 2 && "Absolutely love the variety. The seasonal specials are always a highlight!"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i === 0 && "3 days ago"}
                      {i === 1 && "1 week ago"}
                      {i === 2 && "2 weeks ago"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Family Meal Bundle", sales: 42, revenue: "$2,100" },
                { name: "Vegetarian Weekly Pack", sales: 38, revenue: "$1,710" },
                { name: "Protein Power Pack", sales: 29, revenue: "$1,450" },
                { name: "Breakfast Essentials", sales: 24, revenue: "$960" },
              ].map((product, i) => (
                <div key={i} className="flex justify-between items-center pb-3 border-b last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded bg-mealstock-cream/60 flex items-center justify-center">
                      <span className="font-medium text-mealstock-brown text-sm">{i + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <p className="font-semibold">{product.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;
