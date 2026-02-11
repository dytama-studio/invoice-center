import * as React from "react";
import { cn } from "@/lib/utils";

const Form = React.forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>(
  ({ className, ...props }, ref) => (
    <form ref={ref} className={cn("space-y-4", className)} {...props} />
  )
);
Form.displayName = "Form";

const FormRow = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid grid-cols-12 gap-3", className)} {...props} />
);

const FormField = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("col-span-12 md:col-span-6 space-y-1", className)} {...props} />
);

export { Form, FormRow, FormField };
