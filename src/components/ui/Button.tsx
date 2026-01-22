import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-95',
  {
    variants: {
      variant: {
        solid: '',
        outline: 'border border-input bg-background',
        ghost: '',
      },
      color: {
        primary: '',
        secondary: '',
        accent: '',
        destructive: '',
        warning: '',
        gold: '',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-[var(--radius)] px-3',
        lg: 'h-11 rounded-[var(--radius)] px-8',
        icon: 'h-10 w-10',
      },
    },
    compoundVariants: [
      // Primary
      {
        variant: 'solid',
        color: 'primary',
        className: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
      },
      {
        variant: 'outline',
        color: 'primary',
        className: 'border-primary text-primary hover:bg-primary hover:text-primary-foreground',
      },
      {
        variant: 'ghost',
        color: 'primary',
        className: 'text-primary hover:bg-primary/10',
      },

      // Secondary
      {
        variant: 'solid',
        color: 'secondary',
        className: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
      },
      {
        variant: 'outline',
        color: 'secondary',
        className:
          'border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground',
      },
      {
        variant: 'ghost',
        color: 'secondary',
        className: 'text-secondary hover:bg-secondary/10',
      },

      // Accent
      {
        variant: 'solid',
        color: 'accent',
        className: 'bg-accent text-accent-foreground hover:bg-accent/80 shadow-sm',
      },
      {
        variant: 'outline',
        color: 'accent',
        className: 'border-accent text-accent hover:bg-accent hover:text-accent-foreground',
      },
      {
        variant: 'ghost',
        color: 'accent',
        className: 'text-accent hover:bg-accent/10',
      },

      // Destructive
      {
        variant: 'solid',
        color: 'destructive',
        className: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
      },
      {
        variant: 'outline',
        color: 'destructive',
        className:
          'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground',
      },
      {
        variant: 'ghost',
        color: 'destructive',
        className: 'text-destructive hover:bg-destructive/10',
      },
      // Warning
      {
        variant: 'solid',
        color: 'warning',
        className: 'bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm font-bold',
      },
      {
        variant: 'outline',
        color: 'warning',
        className:
          'border-warning text-warning hover:bg-warning hover:text-warning-foreground font-bold',
      },
      {
        variant: 'ghost',
        color: 'warning',
        className: 'text-warning hover:bg-warning/10 font-bold',
      },

      // Gold (Premium)
      {
        variant: 'solid',
        color: 'gold',
        className:
          'bg-gradient-to-l from-[#a28a4c] via-[#e5d28b] to-[#a28a4c] text-black font-bold uppercase tracking-widest border border-white/20 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.4),inset_0_1px_rgba(255,255,255,0.4)] hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_20px_rgba(162,138,76,0.5)] active:scale-[0.98] transition-all duration-300',
      },
      {
        variant: 'outline',
        color: 'gold',
        className:
          'border-[#a28a4c] text-[#a28a4c] hover:bg-[#a28a4c] hover:text-black shadow-sm transition-all duration-300',
      },
      {
        variant: 'ghost',
        color: 'gold',
        className: 'text-[#a28a4c] hover:bg-[#a28a4c]/10 transition-all duration-300',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, color, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, color, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
