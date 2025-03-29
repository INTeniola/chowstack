
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageSquare, Share2, Plus, Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data for bulletin board posts
const mockPosts = [
  {
    id: 'p1',
    title: 'Traditional Jollof Rice Recipe',
    content: 'Here\'s my family recipe for authentic Nigerian Jollof Rice that never fails to impress. The secret is in toasting the tomato paste before adding the stock...',
    author: {
      name: 'Chef Tolu',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2787&auto=format&fit=crop'
    },
    category: 'Recipe',
    likes: 24,
    comments: 8,
    timeAgo: '3 hours ago'
  },
  {
    id: 'p2',
    title: 'Tips for storing Egusi Soup',
    content: 'I\'ve found that Egusi soup stays fresh longer when stored in glass containers rather than plastic. Also, adding a tablespoon of palm oil on top before refrigerating helps preserve the flavors!',
    author: {
      name: 'Grandma Wisdom',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2522&auto=format&fit=crop'
    },
    category: 'Storage Tip',
    likes: 32,
    comments: 11,
    timeAgo: '1 day ago'
  },
  {
    id: 'p3',
    title: 'Weekly Meal Prep Guide',
    content: 'Here\'s how I organize my weekly meal prep to save time and money. I start by making a base of rice and beans, then prepare different proteins and stews...',
    author: {
      name: 'Organized Eater',
      avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=2670&auto=format&fit=crop'
    },
    category: 'Meal Planning',
    likes: 45,
    comments: 16,
    timeAgo: '2 days ago'
  }
];

const BulletinPost: React.FC<{post: typeof mockPosts[0]}> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  
  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };
  
  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Opening comments section...",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Shared",
      description: "Post shared successfully!",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{post.title}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <span>{post.author.name}</span>
                <span>•</span>
                <span>{post.timeAgo}</span>
              </CardDescription>
            </div>
          </div>
          <Badge>{post.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center ${liked ? 'text-mealstock-orange' : ''}`} 
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            <span>{likeCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center" onClick={handleComment}>
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>{post.comments}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="flex items-center" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

const CreatePostForm: React.FC<{onClose: () => void}> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Post Created",
      description: "Your post has been published to the bulletin board!",
    });
    onClose();
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>Share a recipe, tip, or food experience with the community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea 
              placeholder="Write your post content..."
              className="min-h-[120px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Category (e.g., Recipe, Tip, Question)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <Button variant="outline" type="button" className="w-full flex items-center justify-center">
            <Image className="h-4 w-4 mr-2" />
            <span>Add Image</span>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Publish Post</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

const BulletinBoard: React.FC = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  return (
    <div className="space-y-6">
      {!showCreatePost && (
        <div className="flex justify-end mb-4">
          <Button onClick={() => setShowCreatePost(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            <span>Create Post</span>
          </Button>
        </div>
      )}
      
      {showCreatePost ? (
        <CreatePostForm onClose={() => setShowCreatePost(false)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockPosts.map(post => (
            <BulletinPost key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BulletinBoard;
