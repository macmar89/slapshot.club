import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const typographyVariants = cva('text-foreground', {
  variants: {
    variant: {
      h1: 'scroll-m-20 font-sora text-4xl font-extrabold italic uppercase tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 font-sora text-3xl font-semibold tracking-tight first:mt-0 lg:text-4xl',
      h3: 'scroll-m-20 font-sora text-2xl font-semibold tracking-tight lg:text-3xl',
      h4: 'scroll-m-20 font-sora text-xl font-semibold tracking-tight lg:text-2xl',
      p: 'font-sora leading-relaxed',
      lead: 'font-sora text-xl text-muted-foreground',
      small: 'font-sora text-sm font-medium leading-none',
      stats: 'font-space tabular-nums',
    },
    font: {
      sans: 'font-sora',
      stats: 'font-space',
    },
  },
  defaultVariants: {
    variant: 'p',
    font: 'sans',
  },
  compoundVariants: [
    {
      variant: 'stats',
      className: 'font-space',
    },
  ],
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, font, as, ...props }, ref) => {
    const Comp =
      as ||
      (variant === 'p' || variant === 'lead' || variant === 'stats' || variant === 'small'
        ? 'p'
        : variant) ||
      'p'

    // logic to determine default font based on variant if not explicitly provided
    const computedFont = font || (variant === 'stats' ? 'stats' : 'sans')

    return (
      <Comp
        className={cn(typographyVariants({ variant, font: computedFont, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Typography.displayName = 'Typography'

export { Typography, typographyVariants }
