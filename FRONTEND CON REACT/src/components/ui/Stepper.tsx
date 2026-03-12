import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/Typography';

interface Step {
  id: number;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn("w-full flex items-center justify-between relative", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <React.Fragment key={step.id}>
            {/* Step Item */}
            <div className="flex flex-col items-center relative z-10 basis-0 grow">
              <div
                className={cn(
                  "w-px2 h-12 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-lg",
                  isCompleted ? "bg-primary text-white scale-110 shadow-lg" : 
                  isActive ? "bg-primary/20 text-primary border-4 border-primary scale-125 shadow-md" : 
                  "bg-gray-100 text-gray-400 border-2 border-transparent"
                )}
              >
                {isCompleted ? <Check size={24} strokeWidth={3} /> : step.id}
              </div>
              <div className="absolute top-14 text-center w-max min-w-30 px-2">
                <Typography 
                  variant="small" 
                  className={cn(
                    "font-bold m-0 transition-colors uppercase tracking-tight",
                    isActive || isCompleted ? "text-primary opacity-100" : "text-gray-400 opacity-60"
                  )}
                >
                  {step.label}
                </Typography>
                {step.description && (
                  <p className="text-[10px] text-gray-400 leading-tight mt-0.5 max-w-25 mx-auto hidden sm:block">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Progress Line */}
            {index < steps.length - 1 && (
              <div className="relative flex-1 h-1 bg-gray-100 -mt-6 -mx-6 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
