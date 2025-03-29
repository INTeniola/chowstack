
import React from 'react';
import { Bell, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { NotificationType } from '@/services/notificationService';

interface NotificationsFilterProps {
  filterType: NotificationType | 'all';
  searchTerm: string;
  setFilterType: (value: NotificationType | 'all') => void;
  setSearchTerm: (value: string) => void;
  isMobile?: boolean;
}

const NotificationsFilter: React.FC<NotificationsFilterProps> = ({
  filterType,
  searchTerm,
  setFilterType,
  setSearchTerm,
  isMobile = false
}) => {
  return (
    <>
      {!isMobile ? (
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
      ) : (
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
      )}

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
    </>
  );
};

export default NotificationsFilter;
