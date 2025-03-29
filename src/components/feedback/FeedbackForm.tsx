
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, StarIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sendFeedback } from "@/lib/sentry";
import { analytics } from "@/lib/analytics";

type FeedbackFormProps = {
  type: "meal" | "delivery" | "preservation";
  mealId?: string;
  orderId?: string;
  onSubmitSuccess?: () => void;
};

export const FeedbackForm = ({
  type,
  mealId,
  orderId,
  onSubmitSuccess,
}: FeedbackFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send feedback to your backend service and Sentry
      const success = sendFeedback({
        type,  // This is now guaranteed to be non-optional
        rating,  // This is now guaranteed to be non-optional
        comment: comment || undefined,
        orderId,
        mealId,
      });
      
      if (success) {
        // Track the submitted feedback
        analytics.trackFeedbackSubmitted(type, rating);
        
        toast({
          title: "Feedback received",
          description: "Thank you for your feedback!",
        });
        
        // Reset form
        setRating(0);
        setComment("");
        
        // Notify parent component
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your feedback could not be submitted. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const ratings = [
    { value: 1, label: "Poor" },
    { value: 2, label: "Fair" },
    { value: 3, label: "Good" },
    { value: 4, label: "Very Good" },
    { value: 5, label: "Excellent" },
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <p className="text-sm font-medium">Your Rating</p>
          {rating > 0 && (
            <Badge variant="outline" className="text-xs">
              {ratings.find((r) => r.value === rating)?.label}
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="rounded-md p-1 hover:bg-primary/10 transition-colors"
            >
              {value <= rating ? (
                <StarIcon className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              ) : (
                <Star className="h-8 w-8 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="comment" className="text-sm font-medium">
          Additional Comments
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us more about your experience..."
          className="mt-1"
          rows={4}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
};
