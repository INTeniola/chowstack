
export interface RatedItem {
  id: string;
  name: string;
  image?: string;
}

export interface UserRating {
  id: string;
  userId: string;
  itemId: string;
  orderId: string;
  rating: number;
  review?: string;
  date: string;
  item: RatedItem;
}

export const mockUserRatings: UserRating[] = [
  {
    id: 'rating1',
    userId: '123',
    itemId: 'meal1',
    orderId: '1',
    rating: 5,
    review: 'The jollof rice was amazing! Perfect spice level and the portion size was generous. Will definitely order again.',
    date: '2025-03-30T10:30:00Z',
    item: {
      id: 'meal1',
      name: 'Nigerian Jollof Rice Bundle',
      image: 'https://images.unsplash.com/photo-1644783943890-d788c3740979'
    }
  },
  {
    id: 'rating2',
    userId: '123',
    itemId: 'meal2',
    orderId: '1',
    rating: 4.5,
    review: 'Egusi soup was delicious and authentic. The pounded yam was smooth and paired perfectly with the soup.',
    date: '2025-03-30T11:15:00Z',
    item: {
      id: 'meal2',
      name: 'Egusi Soup with Pounded Yam',
      image: 'https://images.unsplash.com/photo-1643301128183-056d5dc64dee'
    }
  },
  {
    id: 'rating3',
    userId: '123',
    itemId: 'meal3',
    orderId: '2',
    rating: 3.5,
    review: 'The Afang soup was good but could use more vegetables. Semovita was perfect consistency though.',
    date: '2025-03-26T15:45:00Z',
    item: {
      id: 'meal3',
      name: 'Afang Soup with Semovita',
      image: 'https://images.unsplash.com/photo-1643301126313-d07353a443fb'
    }
  },
  {
    id: 'rating4',
    userId: '123',
    itemId: 'meal4',
    orderId: '2',
    rating: 5,
    review: 'Best suya I\'ve had in a long time! Perfectly spiced and the meat was tender.',
    date: '2025-03-26T16:00:00Z',
    item: {
      id: 'meal4',
      name: 'Suya Platter',
      image: 'https://images.unsplash.com/photo-1655123996172-13ef46db8432'
    }
  },
  {
    id: 'rating5',
    userId: '123',
    itemId: 'meal6',
    orderId: '4',
    rating: 2,
    date: '2025-03-16T10:30:00Z',
    item: {
      id: 'meal6',
      name: 'Vegetarian Special Pack',
      image: 'https://images.unsplash.com/photo-1539136788836-5699e78bfc75'
    }
  }
];
