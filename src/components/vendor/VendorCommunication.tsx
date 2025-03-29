
import React, { useState } from 'react';
import { Vendor } from '@/hooks/useVendorAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Mail, 
  Phone,
  Clock,
  User,
  Plus,
  Search,
  MessageCircle,
  UserCheck,
  Star
} from 'lucide-react';

interface VendorCommunicationProps {
  vendor: Vendor;
}

interface Message {
  id: string;
  conversationId: string;
  sender: 'customer' | 'vendor';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'archived';
}

interface Review {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  content: string;
  date: string;
  replied: boolean;
  reply?: string;
  replyDate?: string;
}

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    customerId: 'cust123',
    customerName: 'John Smith',
    lastMessage: 'Thank you for the quick response! Looking forward to the delivery.',
    lastMessageTime: '2023-10-20T10:30:00Z',
    unreadCount: 0,
    status: 'active',
  },
  {
    id: 'conv2',
    customerId: 'cust456',
    customerName: 'Sarah Johnson',
    lastMessage: 'Do you offer any vegetarian options in the Family Meal Bundle?',
    lastMessageTime: '2023-10-19T15:45:00Z',
    unreadCount: 2,
    status: 'active',
  },
  {
    id: 'conv3',
    customerId: 'cust789',
    customerName: 'Michael Brown',
    lastMessage: 'Can I modify my order to add one more Protein Power Pack?',
    lastMessageTime: '2023-10-18T09:20:00Z',
    unreadCount: 0,
    status: 'active',
  },
  {
    id: 'conv4',
    customerId: 'cust012',
    customerName: 'Emily Davis',
    lastMessage: 'The meal packages were excellent, thank you!',
    lastMessageTime: '2023-10-15T14:10:00Z',
    unreadCount: 0,
    status: 'archived',
  },
];

// Mock messages data
const mockMessages: Record<string, Message[]> = {
  conv1: [
    {
      id: 'msg1',
      conversationId: 'conv1',
      sender: 'customer',
      senderName: 'John Smith',
      content: 'Hi, I wanted to ask about my upcoming delivery this Friday.',
      timestamp: '2023-10-20T10:15:00Z',
      read: true,
    },
    {
      id: 'msg2',
      conversationId: 'conv1',
      sender: 'vendor',
      senderName: 'Green Feast Catering',
      content: 'Hello John! Your delivery is scheduled for Friday between 2-4pm. Does that work for you?',
      timestamp: '2023-10-20T10:20:00Z',
      read: true,
    },
    {
      id: 'msg3',
      conversationId: 'conv1',
      sender: 'customer',
      senderName: 'John Smith',
      content: 'Perfect! That works for me. Will I get a notification when the driver is on the way?',
      timestamp: '2023-10-20T10:25:00Z',
      read: true,
    },
    {
      id: 'msg4',
      conversationId: 'conv1',
      sender: 'vendor',
      senderName: 'Green Feast Catering',
      content: 'Yes, you\'ll receive an SMS notification when the driver is about 15 minutes away from your location.',
      timestamp: '2023-10-20T10:28:00Z',
      read: true,
    },
    {
      id: 'msg5',
      conversationId: 'conv1',
      sender: 'customer',
      senderName: 'John Smith',
      content: 'Thank you for the quick response! Looking forward to the delivery.',
      timestamp: '2023-10-20T10:30:00Z',
      read: true,
    },
  ],
  conv2: [
    {
      id: 'msg6',
      conversationId: 'conv2',
      sender: 'customer',
      senderName: 'Sarah Johnson',
      content: 'Hello, I\'m interested in ordering the Family Meal Bundle, but I\'m vegetarian. Do you offer vegetarian options?',
      timestamp: '2023-10-19T15:30:00Z',
      read: true,
    },
    {
      id: 'msg7',
      conversationId: 'conv2',
      sender: 'vendor',
      senderName: 'Green Feast Catering',
      content: 'Hi Sarah! Yes, we do offer vegetarian options for all our meal bundles. We can substitute meat items with plant-based proteins.',
      timestamp: '2023-10-19T15:35:00Z',
      read: true,
    },
    {
      id: 'msg8',
      conversationId: 'conv2',
      sender: 'customer',
      senderName: 'Sarah Johnson',
      content: 'That\'s great! What kind of plant-based proteins do you use?',
      timestamp: '2023-10-19T15:40:00Z',
      read: false,
    },
    {
      id: 'msg9',
      conversationId: 'conv2',
      sender: 'customer',
      senderName: 'Sarah Johnson',
      content: 'Do you offer any vegetarian options in the Family Meal Bundle?',
      timestamp: '2023-10-19T15:45:00Z',
      read: false,
    },
  ],
};

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: 'rev1',
    customerId: 'cust345',
    customerName: 'Jennifer Wilson',
    rating: 5,
    content: 'The Family Meal Bundle was perfect for my busy week! Everything was fresh, delicious, and so convenient. Will definitely order again.',
    date: '2023-10-15T18:30:00Z',
    replied: true,
    reply: 'Thank you for your wonderful review, Jennifer! We\'re so glad you enjoyed the Family Meal Bundle and look forward to serving you again soon.',
    replyDate: '2023-10-16T09:45:00Z',
  },
  {
    id: 'rev2',
    customerId: 'cust678',
    customerName: 'Robert Garcia',
    rating: 4,
    content: 'Great quality meals and good variety. Delivery was a bit later than expected, but the food made up for it.',
    date: '2023-10-12T19:20:00Z',
    replied: false,
  },
  {
    id: 'rev3',
    customerId: 'cust901',
    customerName: 'Lisa Thompson',
    rating: 5,
    content: 'I love the Vegetarian Weekly Pack! The meals are creative and flavorful, proving that vegetarian doesn\'t mean boring. The portion sizes are generous too.',
    date: '2023-10-10T12:15:00Z',
    replied: true,
    reply: 'Thank you for your kind words, Lisa! We put a lot of thought into making our vegetarian options exciting and satisfying. We appreciate your business!',
    replyDate: '2023-10-10T14:30:00Z',
  },
  {
    id: 'rev4',
    customerId: 'cust234',
    customerName: 'David Miller',
    rating: 3,
    content: 'The food quality was good, but I found some of the instructions for reheating a bit confusing. Maybe include clearer directions next time?',
    date: '2023-10-08T20:45:00Z',
    replied: true,
    reply: 'Thank you for your feedback, David. We apologize for the confusion with the reheating instructions. We\'re working on making them clearer and more detailed. We appreciate you bringing this to our attention!',
    replyDate: '2023-10-09T10:10:00Z',
  },
];

// Form schema for sending messages
const messageFormSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty' }),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

// Form schema for replying to reviews
const reviewReplyFormSchema = z.object({
  reply: z.string().min(1, { message: 'Reply cannot be empty' }),
});

type ReviewReplyFormValues = z.infer<typeof reviewReplyFormSchema>;

// Form schema for sending announcements
const announcementFormSchema = z.object({
  subject: z.string().min(1, { message: 'Subject cannot be empty' }),
  message: z.string().min(1, { message: 'Message cannot be empty' }),
  audience: z.enum(['all', 'active', 'recent'], {
    required_error: 'Please select an audience',
  }),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

const VendorCommunication: React.FC<VendorCommunicationProps> = ({ vendor }) => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [replyingToReview, setReplyingToReview] = useState<Review | null>(null);
  
  const messageForm = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: '',
    },
  });
  
  const reviewReplyForm = useForm<ReviewReplyFormValues>({
    resolver: zodResolver(reviewReplyFormSchema),
    defaultValues: {
      reply: '',
    },
  });
  
  const announcementForm = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      subject: '',
      message: '',
      audience: 'all',
    },
  });
  
  const selectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    
    // Mark all messages as read
    if (conversation.unreadCount > 0) {
      // Update the conversation
      const updatedConversations = conversations.map(conv => 
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      );
      setConversations(updatedConversations);
      
      // Update the messages
      const conversationMessages = messages[conversation.id] || [];
      const updatedMessages = conversationMessages.map(msg => 
        msg.sender === 'customer' && !msg.read ? { ...msg, read: true } : msg
      );
      
      setMessages({
        ...messages,
        [conversation.id]: updatedMessages,
      });
    }
  };
  
  const sendMessage = (data: MessageFormValues) => {
    if (!activeConversation) return;
    
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      conversationId: activeConversation.id,
      sender: 'vendor',
      senderName: vendor.businessName,
      content: data.message,
      timestamp: new Date().toISOString(),
      read: true,
    };
    
    // Add the message to the conversation
    const conversationMessages = messages[activeConversation.id] || [];
    const updatedMessages = {
      ...messages,
      [activeConversation.id]: [...conversationMessages, newMessage],
    };
    setMessages(updatedMessages);
    
    // Update the conversation
    const updatedConversations = conversations.map(conv => 
      conv.id === activeConversation.id 
        ? { 
            ...conv, 
            lastMessage: data.message,
            lastMessageTime: new Date().toISOString(),
          } 
        : conv
    );
    setConversations(updatedConversations);
    
    messageForm.reset();
    
    toast({
      title: "Message sent",
      description: "Your message has been sent to the customer.",
    });
  };
  
  const replyToReview = (data: ReviewReplyFormValues) => {
    if (!replyingToReview) return;
    
    const updatedReviews = reviews.map(review => 
      review.id === replyingToReview.id 
        ? { 
            ...review, 
            replied: true,
            reply: data.reply,
            replyDate: new Date().toISOString(),
          }
        : review
    );
    setReviews(updatedReviews);
    
    setReplyingToReview(null);
    reviewReplyForm.reset();
    
    toast({
      title: "Reply posted",
      description: "Your reply to the review has been posted.",
    });
  };
  
  const sendAnnouncement = (data: AnnouncementFormValues) => {
    // In a real implementation, this would send the announcement to the selected audience
    
    toast({
      title: "Announcement sent",
      description: `Your announcement has been sent to ${data.audience === 'all' ? 'all customers' : data.audience === 'active' ? 'active customers' : 'recent customers'}.`,
    });
    
    setIsAnnouncementOpen(false);
    announcementForm.reset();
  };
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };
  
  const formatFullDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Render star rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="messages" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsComposeOpen(true)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              New Message
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsAnnouncementOpen(true)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Announcement
            </Button>
          </div>
        </div>
        
        <TabsContent value="messages" className="space-y-4">
          <div className="border rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
            {/* Conversation List */}
            <div className="border-r">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[600px]">
                {conversations
                  .filter(conv => conv.status === 'active')
                  .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 border-b cursor-pointer transition-colors ${
                        activeConversation?.id === conversation.id 
                          ? 'bg-muted' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => selectConversation(conversation)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-mealstock-cream/60 flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="font-medium text-mealstock-brown">
                              {conversation.customerName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{conversation.customerName}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {conversation.lastMessage}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground flex flex-col items-end">
                          <span>{formatDateTime(conversation.lastMessageTime)}</span>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-mealstock-green text-white rounded-full px-2 py-0.5 mt-1">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                
                {conversations.filter(conv => conv.status === 'active').length === 0 && (
                  <div className="p-6 text-center text-muted-foreground">
                    No active conversations
                  </div>
                )}
              </div>
            </div>
            
            {/* Conversation Messages */}
            <div className="col-span-2 flex flex-col">
              {activeConversation ? (
                <>
                  <div className="p-3 border-b flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-mealstock-cream/60 flex items-center justify-center mr-2">
                        <span className="font-medium text-mealstock-brown">
                          {activeConversation.customerName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{activeConversation.customerName}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                    {(messages[activeConversation.id] || [])
                      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'vendor' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.sender === 'vendor' 
                                ? 'bg-mealstock-green text-white' 
                                : 'bg-muted'
                            }`}
                          >
                            <div className="text-sm">{message.content}</div>
                            <div className={`text-xs mt-1 ${message.sender === 'vendor' ? 'text-white/80' : 'text-muted-foreground'}`}>
                              {formatDateTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <Form {...messageForm}>
                    <form 
                      onSubmit={messageForm.handleSubmit(sendMessage)} 
                      className="p-3 border-t flex gap-2"
                    >
                      <FormField
                        control={messageForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="Type your message..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                  <p className="max-w-md">
                    Select a conversation from the list on the left or create a new message to start chatting with a customer.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                Respond to customer feedback and reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {reviews
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((review) => (
                  <div key={review.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-mealstock-cream/60 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-mealstock-brown" />
                        </div>
                        <div>
                          <div className="font-medium">{review.customerName}</div>
                          <div className="flex items-center mt-1">
                            {renderStars(review.rating)}
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatFullDateTime(review.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {!review.replied && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setReplyingToReview(review);
                            reviewReplyForm.reset({
                              reply: '',
                            });
                          }}
                        >
                          Reply
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-sm">{review.content}</div>
                    
                    {review.replied && review.reply && (
                      <div className="bg-muted p-3 rounded-lg mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-mealstock-green/20 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="h-3 w-3 text-mealstock-green" />
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="font-medium">Your Reply</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {review.replyDate && formatFullDateTime(review.replyDate)}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm">{review.reply}</div>
                      </div>
                    )}
                  </div>
                ))}
              
              {reviews.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-10 w-10 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p>Your reviews will appear here once customers start leaving feedback.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    className="h-5 w-5 rounded border-gray-300 text-mealstock-green focus:ring-mealstock-green"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    className="h-5 w-5 rounded border-gray-300 text-mealstock-green focus:ring-mealstock-green"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive push notifications on this device</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={false}
                    className="h-5 w-5 rounded border-gray-300 text-mealstock-green focus:ring-mealstock-green"
                  />
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium">Notification Categories</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">New Orders</h5>
                      <p className="text-xs text-muted-foreground">Get notified when a new order is placed</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      className="h-5 w-5 rounded border-gray-300 text-mealstock-green focus:ring-mealstock-green"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">Customer Messages</h5>
                      <p className="text-xs text-muted-foreground">Get notified when customers send messages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      className="h-5 w-5 rounded border-gray-300 text-mealstock-green focus:ring-mealstock-green"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">Reviews & Ratings</h5>
                      <p className="text-xs text-muted-foreground">Get notified when you receive new reviews</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      className="h-5 w-5 rounded border-gray-300 text-mealstock-green focus:ring-mealstock-green"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">Delivery Updates</h5>
                      <p className="text-xs text-muted-foreground">Get notified about order delivery status changes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      className="h-5 w-5 rounded border-gray-300 text-mealstock-green focus:ring-mealstock-green"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">Promotions</h5>
                      <p className="text-xs text-muted-foreground">Get notified about promotion performance</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={false}
                      className="h-5 w-5 rounded border-gray-300 text-mealstock-green focus:ring-mealstock-green"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Compose Message Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Send a message to a customer
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="recipient">
                Recipient
              </label>
              <Input id="recipient" placeholder="Search for a customer..." />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="subject">
                Subject (optional)
              </label>
              <Input id="subject" placeholder="Enter subject..." />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="compose-message">
                Message
              </label>
              <Textarea 
                id="compose-message" 
                placeholder="Type your message here..." 
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsComposeOpen(false)}
            >
              Cancel
            </Button>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Announcement Dialog */}
      <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Announcement</DialogTitle>
            <DialogDescription>
              Send a bulk announcement to your customers
            </DialogDescription>
          </DialogHeader>
          
          <Form {...announcementForm}>
            <form onSubmit={announcementForm.handleSubmit(sendAnnouncement)} className="space-y-4">
              <FormField
                control={announcementForm.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audience</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                      >
                        <option value="all">All Customers</option>
                        <option value="active">Active Customers (ordered in last 30 days)</option>
                        <option value="recent">Recent Customers (ordered in last 7 days)</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={announcementForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the announcement subject..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={announcementForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Type your announcement message..." 
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setIsAnnouncementOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Review Reply Dialog */}
      <Dialog open={!!replyingToReview} onOpenChange={(open) => !open && setReplyingToReview(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
            <DialogDescription>
              Respond to your customer's feedback
            </DialogDescription>
          </DialogHeader>
          
          {replyingToReview && (
            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(replyingToReview.rating)}
                </div>
                <span className="text-sm font-medium">{replyingToReview.customerName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(replyingToReview.date)}
                </span>
              </div>
              <p className="text-sm">{replyingToReview.content}</p>
            </div>
          )}
          
          <Form {...reviewReplyForm}>
            <form onSubmit={reviewReplyForm.handleSubmit(replyToReview)} className="space-y-4">
              <FormField
                control={reviewReplyForm.control}
                name="reply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Reply</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Type your response..." 
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setReplyingToReview(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Post Reply
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorCommunication;
