import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  touched?: boolean
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, touched, success, id, ...props }, ref) => {
    // Generate ID if not provided (for label association)
    const inputId = id || React.useId()

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          id={inputId}
          type={type}
          className={cn(
            // Base styles - matches Google/prototype design
            "flex w-full rounded-lg border bg-white px-4 text-base transition-all duration-200",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            
            // Touch-optimized height for mobile (from prototype)
            "h-14", // 56px - optimal for touch
            
            // Border states
            "border-gray-300",
            "focus:border-[#0f766e] focus:ring-[#0f766e]/20",
            
            // Error state
            error && touched && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
            
            // Success state  
            success && touched && "border-green-400 focus:border-green-500 focus:ring-green-500/20",
            
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            
            className
          )}
          ref={ref}
          {...props}
        />
        
        {/* Error message */}
        {error && touched && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}
        
        {/* Success message */}
        {success && touched && !error && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <span>✓</span>
            Looks good
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }