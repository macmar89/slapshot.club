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
