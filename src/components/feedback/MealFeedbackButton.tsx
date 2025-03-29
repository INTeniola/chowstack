
import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackModal } from "./FeedbackModal";

type MealFeedbackButtonProps = {
  mealId: string;
  orderId?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  iconOnly?: boolean;
};

export const MealFeedbackButton = ({
  mealId,
  orderId,
  variant = "outline",
  size = "sm",
  iconOnly = false,
}: MealFeedbackButtonProps) => {
  const trigger = (
    <Button variant={variant} size={size} className="gap-1">
      <MessageSquare className="h-4 w-4" />
      {!iconOnly && "Rate Meal"}
    </Button>
  );

  return (
    <FeedbackModal
      type="meal"
      mealId={mealId}
      orderId={orderId}
      trigger={trigger}
      title="How was your meal?"
      description="Your feedback helps us improve our food quality and service."
    />
  );
};
