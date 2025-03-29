
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, MapPin } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const DIETARY_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'nut-free', label: 'Nut Free' },
  { id: 'halal', label: 'Halal' }
];

const CUISINE_OPTIONS = [
  { id: 'nigerian', label: 'Nigerian' },
  { id: 'west-african', label: 'West African' },
  { id: 'international', label: 'International' },
  { id: 'asian', label: 'Asian' },
  { id: 'italian', label: 'Italian' },
  { id: 'middle-eastern', label: 'Middle Eastern' }
];

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    dietary: string[];
    priceRange: { min: number; max: number };
    cuisineType: string[];
    sortBy: string;
  };
  onFilterChange: (filters: any) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  
  const handleDietaryChange = (id: string, checked: boolean) => {
    let newDietary = [...localFilters.dietary];
    
    if (checked) {
      newDietary.push(id);
    } else {
      newDietary = newDietary.filter(item => item !== id);
    }
    
    setLocalFilters({...localFilters, dietary: newDietary});
  };
  
  const handleCuisineChange = (id: string, checked: boolean) => {
    let newCuisine = [...localFilters.cuisineType];
    
    if (checked) {
      newCuisine.push(id);
    } else {
      newCuisine = newCuisine.filter(item => item !== id);
    }
    
    setLocalFilters({...localFilters, cuisineType: newCuisine});
  };
  
  const handlePriceChange = (value: number[]) => {
    setLocalFilters({
      ...localFilters, 
      priceRange: { min: value[0], max: value[1] || 100000 }
    });
  };
  
  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsFiltersOpen(false);
  };
  
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search meals, vendors, cuisine..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex gap-2">
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 p-4" align="end">
              <div className="space-y-6">
                <h3 className="font-medium text-lg">Filter Options</h3>
                
                {/* Dietary Requirements */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Dietary Requirements</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {DIETARY_OPTIONS.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`dietary-${option.id}`} 
                          checked={localFilters.dietary.includes(option.id)}
                          onCheckedChange={(checked) => 
                            handleDietaryChange(option.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={`dietary-${option.id}`}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div>
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium">Price Range</h4>
                    <span className="text-sm text-muted-foreground">
                      ₦{localFilters.priceRange.min.toLocaleString()} - 
                      ₦{localFilters.priceRange.max === 100000 ? '100k+' : localFilters.priceRange.max.toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[localFilters.priceRange.min, localFilters.priceRange.max]}
                    max={100000}
                    step={1000}
                    onValueChange={handlePriceChange}
                  />
                </div>
                
                {/* Cuisine Type */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Cuisine Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {CUISINE_OPTIONS.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`cuisine-${option.id}`} 
                          checked={localFilters.cuisineType.includes(option.id)}
                          onCheckedChange={(checked) => 
                            handleCuisineChange(option.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={`cuisine-${option.id}`}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Sort By */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Sort By</h4>
                  <RadioGroup 
                    value={localFilters.sortBy}
                    onValueChange={(value) => 
                      setLocalFilters({...localFilters, sortBy: value})
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recommended" id="sort-recommended" />
                      <Label htmlFor="sort-recommended">Recommended</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="price-low" id="sort-price-low" />
                      <Label htmlFor="sort-price-low">Price: Low to High</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="price-high" id="sort-price-high" />
                      <Label htmlFor="sort-price-high">Price: High to Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rating" id="sort-rating" />
                      <Label htmlFor="sort-rating">Highest Rated</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nearest" id="sort-nearest" />
                      <Label htmlFor="sort-nearest">Nearest to Me</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsFiltersOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Select defaultValue="location" onValueChange={(value) => console.log('Location changed:', value)}>
            <SelectTrigger className="flex gap-2 min-w-[160px]">
              <MapPin className="h-4 w-4" />
              <SelectValue placeholder="My Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Locations</SelectLabel>
                <SelectItem value="current">Current Location</SelectItem>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="abuja">Abuja</SelectItem>
                <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                <SelectItem value="ibadan">Ibadan</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {(localFilters.dietary.length > 0 || localFilters.cuisineType.length > 0 || 
        localFilters.priceRange.min > 0 || localFilters.priceRange.max < 100000) && (
        <div className="flex flex-wrap gap-2">
          {localFilters.dietary.map(item => {
            const option = DIETARY_OPTIONS.find(o => o.id === item);
            return option ? (
              <div key={item} className="bg-mealstock-lightGreen/20 text-mealstock-green px-3 py-1 rounded-full text-sm">
                {option.label}
              </div>
            ) : null;
          })}
          
          {localFilters.cuisineType.map(item => {
            const option = CUISINE_OPTIONS.find(o => o.id === item);
            return option ? (
              <div key={item} className="bg-mealstock-lightOrange/20 text-mealstock-orange px-3 py-1 rounded-full text-sm">
                {option.label}
              </div>
            ) : null;
          })}
          
          {(localFilters.priceRange.min > 0 || localFilters.priceRange.max < 100000) && (
            <div className="bg-mealstock-cream/80 text-mealstock-brown px-3 py-1 rounded-full text-sm border border-mealstock-brown/20">
              ₦{localFilters.priceRange.min.toLocaleString()} - 
              ₦{localFilters.priceRange.max === 100000 ? '100k+' : localFilters.priceRange.max.toLocaleString()}
            </div>
          )}
          
          <Button 
            variant="link" 
            className="text-sm h-auto p-0 text-mealstock-brown/70"
            onClick={() => {
              const resetFilters = {
                ...localFilters,
                dietary: [],
                cuisineType: [],
                priceRange: { min: 0, max: 100000 }
              };
              setLocalFilters(resetFilters);
              onFilterChange(resetFilters);
            }}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
