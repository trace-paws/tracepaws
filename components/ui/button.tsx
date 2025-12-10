import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'teal' | 'warm'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'touch' | 'full'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles - mobile-optimized for crematorium staff
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "active:scale-[0.98]", // Touch feedback
          
          // Variants - TracePaws brand colors
          {
            // Primary TracePaws teal (from prototype)
            "default": "bg-[#0f766e] text-white hover:bg-[#0d665c] focus-visible:ring-[#0f766e]",
            
            // Destructive actions
            "destructive": "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
            
            // Outline style
            "outline": "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus-visible:ring-[#0f766e]",
            
            // Secondary style  
            "secondary": "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500",
            
            // Ghost style
            "ghost": "hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500",
            
            // Link style
            "link": "text-[#0f766e] underline-offset-4 hover:underline focus-visible:ring-[#0f766e]",
            
            // TracePaws teal variant (explicit)
            "teal": "bg-[#0f766e] text-white hover:bg-[#0d665c] focus-visible:ring-[#0f766e]",
            
            // Warm accent (pet-friendly)
            "warm": "bg-[#f59e0b] text-white hover:bg-[#e88b00] focus-visible:ring-[#f59e0b]"
          }[variant],
          
          // Sizes - touch-optimized for mobile
          {
            "default": "h-12 px-6 text-base", // Standard touch-friendly
            "sm": "h-10 px-4 text-sm",
            "lg": "h-14 px-8 text-lg",     // Large mobile primary actions
            "icon": "h-12 w-12",           // Square icon buttons
            "touch": "h-12 w-12",          // Touch-optimized icon
            "full": "h-12 w-full"          // Full-width mobile buttons
          }[size],
          
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }