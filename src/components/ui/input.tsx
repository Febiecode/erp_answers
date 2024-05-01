import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react"; // Import Eye and EyeOff icons from Lucide library

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordToggle?: boolean; // Option to show password toggle icon
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false); // State to manage password visibility

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : type} // Toggle between text and password
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {/* Icon to toggle password visibility */}
        {showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {showPassword ? (
              <EyeOff
                onClick={togglePasswordVisibility}
                className="text-gray-500 cursor-pointer"
              />
            ) : (
              <Eye
                onClick={togglePasswordVisibility}
                className="text-gray-500 cursor-pointer"
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
