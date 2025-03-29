
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNotifications } from '@/contexts/NotificationsContext';
import { NotificationType } from '@/services/notificationService';
import NotificationsHeader from '@/components/notifications/NotificationsHeader';
import NotificationsFilter from '@/components/notifications/NotificationsFilter';
import NotificationsListView from '@/components/notifications/NotificationsListView';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';

const Notifications: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  
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
            <NotificationsHeader 
              unreadCount={unreadCount}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
            
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
                  <NotificationsFilter
                    filterType={filterType}
                    searchTerm={searchTerm}
                    setFilterType={setFilterType}
                    setSearchTerm={setSearchTerm}
                  />
                )}
              </div>
              
              {activeTab !== 'settings' && (
                <NotificationsFilter
                  filterType={filterType}
                  searchTerm={searchTerm}
                  setFilterType={setFilterType}
                  setSearchTerm={setSearchTerm}
                  isMobile={true}
                />
              )}
              
              <TabsContent value="all" className="space-y-2 mt-0">
                <NotificationsListView
                  notifications={filteredNotifications}
                  handleMarkAllAsRead={handleMarkAllAsRead}
                  unreadCount={unreadCount}
                  searchTerm={searchTerm}
                />
              </TabsContent>
              
              <TabsContent value="unread" className="space-y-2 mt-0">
                <NotificationsListView
                  notifications={filteredNotifications}
                  handleMarkAllAsRead={handleMarkAllAsRead}
                  unreadCount={unreadCount}
                  searchTerm={searchTerm}
                />
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
