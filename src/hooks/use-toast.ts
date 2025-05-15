
import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = React.ComponentPropsWithoutRef<typeof sonnerToast>;

const useToast = () => {
  const toast = ({ title, description, variant, ...props }: {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
    [key: string]: any;
  }) => {
    return sonnerToast(title, {
      description,
      ...props,
    });
  };

  return {
    toast,
    toasts: [], // Added for compatibility with existing code
  };
};

export { useToast, sonnerToast as toast };
