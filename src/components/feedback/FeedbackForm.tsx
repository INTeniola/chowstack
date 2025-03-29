
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { sendFeedback } from "@/lib/sentry";
import { useConnectivity } from "@/contexts/ConnectivityContext";

const feedbackSchema = z.object({
  type: z.enum(["meal", "delivery", "preservation"]),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  orderId: z.string().optional(),
  mealId: z.string().optional(),
});

type FeedbackFormProps = {
  type: "meal" | "delivery" | "preservation";
  orderId?: string;
  mealId?: string;
  onSubmitSuccess?: () => void;
};

export const FeedbackForm = ({ type, orderId, mealId, onSubmitSuccess }: FeedbackFormProps) => {
  const [rating, setRating] = useState(0);
  const { isOnline } = useConnectivity();
  
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type,
      rating: 0,
      comment: "",
      orderId,
      mealId,
    },
  });

  const onSubmit = async (values: z.infer<typeof feedbackSchema>) => {
    if (!isOnline) {
      // Store feedback locally for later submission
      const offlineFeedback = JSON.parse(localStorage.getItem('offlineFeedback') || '[]');
      offlineFeedback.push(values);
      localStorage.setItem('offlineFeedback', JSON.stringify(offlineFeedback));
      
      toast({
        title: "Feedback saved offline",
        description: "Your feedback will be submitted when you're back online.",
      });
      
      if (onSubmitSuccess) onSubmitSuccess();
      return;
    }
    
    try {
      sendFeedback(values);
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback helps us improve our services.",
      });
      
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      toast({
        title: "Error submitting feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    form.setValue("rating", selectedRating);
  };

  const typeLabels = {
    meal: "Rate Your Meal",
    delivery: "Rate Your Delivery Experience",
    preservation: "Rate Your Preservation Experience",
  };

  const typeDescriptions = {
    meal: "How satisfied were you with the taste, quality, and portion size?",
    delivery: "How was your delivery experience including timing and driver interaction?",
    preservation: "Did our preservation methods help keep your food fresh?",
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{typeLabels[type]}</CardTitle>
        <CardDescription>{typeDescriptions[type]}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center space-x-2 my-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="focus:outline-none"
                >
                  <StarIcon
                    className={`h-8 w-8 ${
                      rating >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your experience..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your feedback helps us improve our service.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={form.getValues().rating === 0}
            >
              Submit Feedback
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
