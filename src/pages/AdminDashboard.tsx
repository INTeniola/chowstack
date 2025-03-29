
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useConnectivity } from "@/contexts/ConnectivityContext";
import { Button } from "@/components/ui/button";
import { Download, Filter, RefreshCw } from "lucide-react";
import { useTheme } from "next-themes";

// Mock data for the dashboard
const userRetentionData = [
  { month: "Jan", retention: 78 },
  { month: "Feb", retention: 82 },
  { month: "Mar", retention: 85 },
  { month: "Apr", retention: 87 },
  { month: "May", retention: 84 },
  { month: "Jun", retention: 88 },
];

const orderFrequencyData = [
  { day: "Mon", orders: 65 },
  { day: "Tue", orders: 59 },
  { day: "Wed", orders: 80 },
  { day: "Thu", orders: 81 },
  { day: "Fri", orders: 95 },
  { day: "Sat", orders: 110 },
  { day: "Sun", orders: 85 },
];

const popularMealsData = [
  { name: "Jollof Rice", value: 35 },
  { name: "Egusi Soup", value: 25 },
  { name: "Suya", value: 20 },
  { name: "Pounded Yam", value: 15 },
  { name: "Moin Moin", value: 5 },
];

const feedbackRatingsData = [
  { name: "5 Stars", value: 45 },
  { name: "4 Stars", value: 30 },
  { name: "3 Stars", value: 15 },
  { name: "2 Stars", value: 7 },
  { name: "1 Star", value: 3 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const AdminDashboard = () => {
  const { isOnline, lowBandwidthMode } = useConnectivity();
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  
  // Simplified charts for low bandwidth mode
  const simplifiedLineChart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={userRetentionData}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkTheme ? "#555" : "#eee"} />
        <XAxis dataKey="month" stroke={isDarkTheme ? "#ccc" : "#333"} />
        <YAxis stroke={isDarkTheme ? "#ccc" : "#333"} />
        <Tooltip contentStyle={{ backgroundColor: isDarkTheme ? "#333" : "#fff", border: "none" }} />
        <Line type="monotone" dataKey="retention" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );

  // Full charts for normal mode
  const fullLineChart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={userRetentionData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkTheme ? "#555" : "#eee"} />
        <XAxis dataKey="month" stroke={isDarkTheme ? "#ccc" : "#333"} />
        <YAxis stroke={isDarkTheme ? "#ccc" : "#333"} />
        <Tooltip contentStyle={{ backgroundColor: isDarkTheme ? "#333" : "#fff", border: "none" }} />
        <Legend />
        <Line
          type="monotone"
          dataKey="retention"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" disabled={!isOnline}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      {!isOnline && (
        <Card className="mb-6 border-yellow-500">
          <CardContent className="p-4">
            <p className="text-yellow-500">
              You're currently viewing cached data. Connect to the internet to see the latest analytics.
            </p>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,487</div>
                <p className="text-xs text-muted-foreground">
                  +1,234 (10.9%)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,942</div>
                <p className="text-xs text-muted-foreground">
                  +842 (10.4%)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Meal Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7/5</div>
                <p className="text-xs text-muted-foreground">
                  +0.2 (4.4%)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenue (Monthly)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦24.5M</div>
                <p className="text-xs text-muted-foreground">
                  +₦3.2M (15.0%)
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>
                  Monthly retention rates for the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lowBandwidthMode ? simplifiedLineChart : fullLineChart}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Frequency</CardTitle>
                <CardDescription>
                  Orders per day of the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderFrequencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkTheme ? "#555" : "#eee"} />
                    <XAxis dataKey="day" stroke={isDarkTheme ? "#ccc" : "#333"} />
                    <YAxis stroke={isDarkTheme ? "#ccc" : "#333"} />
                    <Tooltip contentStyle={{ backgroundColor: isDarkTheme ? "#333" : "#fff", border: "none" }} />
                    {!lowBandwidthMode && <Legend />}
                    <Bar dataKey="orders" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Meals</CardTitle>
                <CardDescription>
                  Distribution of meal popularity
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div style={{ width: 300, height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={popularMealsData}
                        cx="50%"
                        cy="50%"
                        labelLine={!lowBandwidthMode}
                        label={!lowBandwidthMode ? 
                          ({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {popularMealsData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      {!lowBandwidthMode && <Tooltip />}
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Feedback Ratings</CardTitle>
                <CardDescription>
                  Distribution of user ratings
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div style={{ width: 300, height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={feedbackRatingsData}
                        cx="50%"
                        cy="50%"
                        labelLine={!lowBandwidthMode}
                        label={!lowBandwidthMode ? 
                          ({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {feedbackRatingsData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      {!lowBandwidthMode && <Tooltip />}
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics Dashboard</CardTitle>
              <CardDescription>Detailed user metrics coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab will contain detailed user analytics including:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Demographic breakdown</li>
                <li>User acquisition channels</li>
                <li>User behavior patterns</li>
                <li>Retention cohort analysis</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Analytics Dashboard</CardTitle>
              <CardDescription>Detailed order metrics coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab will contain detailed order analytics including:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Order volume by time period</li>
                <li>Average order value</li>
                <li>Most popular meal combinations</li>
                <li>Geographical distribution of orders</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Analytics Dashboard</CardTitle>
              <CardDescription>Detailed feedback metrics coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab will contain detailed feedback analytics including:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Sentiment analysis of customer comments</li>
                <li>Feedback trends over time</li>
                <li>Areas of improvement identified from feedback</li>
                <li>Correlation between feedback and retention</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
