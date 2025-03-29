
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, StarHalf, StarOff, MoreHorizontal, Edit, Trash } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { mockUserRatings } from '@/utils/mockData/ratings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// For demo purposes, we'll use mock data
// In a real app, this would be fetched from the backend
const fetchUserRatings = async (userId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockUserRatings;
};

export function UserRatings() {
  const { user } = useAuth();
  const [filter, setFilter] = React.useState('all');
  
  const { data: ratings = [], isLoading } = useQuery({
    queryKey: ['userRatings', user?.id],
    queryFn: () => fetchUserRatings(user?.id || ''),
    enabled: !!user?.id
  });
  
  const filteredRatings = filter === 'all' 
    ? ratings 
    : ratings.filter(rating => {
        if (filter === 'high') return rating.rating >= 4;
        if (filter === 'medium') return rating.rating >= 3 && rating.rating < 4;
        if (filter === 'low') return rating.rating < 3;
        return true;
      });
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<StarOff key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return (
      <div className="flex">{stars}</div>
    );
  };
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Please sign in to view your ratings.</p>
        <Button className="mt-4" onClick={() => window.location.href = '/login'}>
          Sign In
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">My Ratings & Reviews</h2>
        <p className="text-muted-foreground mb-6">
          Manage the ratings and reviews you've given to meal packages
        </p>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All Ratings</TabsTrigger>
          <TabsTrigger value="high">High (4-5★)</TabsTrigger>
          <TabsTrigger value="medium">Medium (3-4★)</TabsTrigger>
          <TabsTrigger value="low">Low (1-3★)</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 h-32 bg-gray-100 dark:bg-gray-800"></CardContent>
            </Card>
          ))}
        </div>
      ) : filteredRatings.length === 0 ? (
        <div className="text-center py-10">
          <p>No ratings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRatings.map(rating => (
            <Card key={rating.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={rating.item.image || '/placeholder.svg'} 
                        alt={rating.item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-medium">{rating.item.name}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(rating.rating)}
                        <span className="text-sm font-medium">{rating.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Rated on {new Date(rating.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Review
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2 text-red-500">
                          <Trash className="h-4 w-4" />
                          Delete Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {rating.review && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="italic text-muted-foreground">"{rating.review}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
