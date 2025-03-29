
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  ArrowLeft, 
  Check, 
  Trash2,
  Package,
  Truck,
  Clock,
  MessageCircle,
  Filter,
  X
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/contexts/NotificationsContext';
import NotificationItem from '@/components/notifications/NotificationItem';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';
import { NotificationType } from '@/services/notificationService';

const Notifications: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter notifications based on tab, type, and search term
  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = activeTab === 'all' || (activeTab === 'unread' && !notification.read);
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesSearch = !searchTerm || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesType && matchesSearch;
  });
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-mealstock-cream">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl md:text-2xl font-bold flex items-center">
                  <Bell className="h-6 w-6 mr-2" />
                  Notifications
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleMarkAllAsRead}
                    className="hidden md:flex"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>
            
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'all' | 'unread' | 'settings')}
            >
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread
                    {unreadCount > 0 && (
                      <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                        {unreadCount}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                {activeTab !== 'settings' && (
                  <div className="hidden md:block">
                    <Select 
                      value={filterType} 
                      onValueChange={(value) => setFilterType(value as NotificationType | 'all')}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="orderStatus">Order Status</SelectItem>
                          <SelectItem value="deliveryUpdate">Delivery Updates</SelectItem>
                          <SelectItem value="mealExpiration">Expiration Reminders</SelectItem>
                          <SelectItem value="supportMessage">Support Messages</SelectItem>
                          <SelectItem value="driverMessage">Driver Messages</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              {activeTab !== 'settings' && (
                <div className="mb-4">
                  <div className="relative">
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <div className="absolute left-3 top-2.5">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-5 w-5"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              <TabsContent value="all" className="space-y-2 mt-0">
                <div className="md:hidden flex justify-between items-center mb-3">
                  <Select 
                    value={filterType} 
                    onValueChange={(value) => setFilterType(value as NotificationType | 'all')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="orderStatus">Order Status</SelectItem>
                        <SelectItem value="deliveryUpdate">Delivery Updates</SelectItem>
                        <SelectItem value="mealExpiration">Expiration Reminders</SelectItem>
                        <SelectItem value="supportMessage">Support Messages</SelectItem>
                        <SelectItem value="driverMessage">Driver Messages</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                {unreadCount > 0 && (
                  <div className="md:hidden mb-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleMarkAllAsRead}
                      className="w-full"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark all as read
                    </Button>
                  </div>
                )}
                
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground mb-1">No notifications found</p>
                    <p className="text-xs text-muted-foreground">
                      {searchTerm 
                        ? 'Try a different search term' 
                        : 'You will see your notifications here'}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[450px] pr-4 -mr-4">
                    <div className="space-y-1">
                      {filteredNotifications.map((notification) => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
              
              <TabsContent value="unread" className="space-y-2 mt-0">
                {unreadCount > 0 && (
                  <div className="md:hidden mb-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleMarkAllAsRead}
                      className="w-full"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark all as read
                    </Button>
                  </div>
                )}
                
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Check className="h-10 w-10 mx-auto mb-3 text-green-500 opacity-70" />
                    <p className="text-sm text-muted-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground">You have no unread notifications</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[450px] pr-4 -mr-4">
                    <div className="space-y-1">
                      {filteredNotifications.map((notification) => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <NotificationPreferences />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Notifications;
