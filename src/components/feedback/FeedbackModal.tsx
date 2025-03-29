
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FeedbackForm } from "./FeedbackForm";

type FeedbackModalProps = {
  type: "meal" | "delivery" | "preservation";
  orderId?: string;
  mealId?: string;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
};

export const FeedbackModal = ({
  type,
  orderId,
  mealId,
  trigger,
  title,
  description,
}: FeedbackModalProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSubmitSuccess = () => {
    setOpen(false);
  };

  const defaultTitles = {
    meal: "Rate Your Meal",
    delivery: "Rate Your Delivery Experience",
    preservation: "Rate Your Preservation Success",
  };

  const defaultDescriptions = {
    meal: "How was your meal? We'd love to hear your thoughts!",
    delivery: "Help us improve our delivery service with your feedback.",
    preservation: "Did our preservation methods work well for you?",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Give Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title || defaultTitles[type]}</DialogTitle>
          <DialogDescription>
            {description || defaultDescriptions[type]}
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm
          type={type}
          orderId={orderId}
          mealId={mealId}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
