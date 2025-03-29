
export type PreservationMethod = 'refrigerate' | 'freeze' | 'room_temperature';

export type ReheatingMethod = 'microwave' | 'oven' | 'stovetop' | 'air_fryer' | 'none';

export type TimeUnit = 'minutes' | 'hours' | 'days';

export type PreservationInstruction = {
  method: PreservationMethod;
  duration: {
    value: number;
    unit: TimeUnit;
  };
  tips: string[];
};

export type ReheatingInstruction = {
  method: ReheatingMethod;
  duration: {
    value: number;
    unit: TimeUnit;
  };
  temperature?: number; // in celsius
  steps: string[];
};

export type MealPreservationGuide = {
  id: string;
  mealId: string;
  mealName: string;
  imageUrl: string;
  preservationInstructions: PreservationInstruction[];
  reheatingInstructions: ReheatingInstruction[];
  freshnessDuration: number; // in days
  audioInstructionUrl?: string;
  qrCodeUrl?: string;
  customNotes?: string;
  createdAt: Date;
  updatedAt: Date;
};
