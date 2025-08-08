import * as React from 'react'
import { cn } from './utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost'
  size?: 'default' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-2xl px-3 py-2 text-sm font-medium transition'
    const variants: Record<string,string> = {
      default: 'bg-sky-500 hover:bg-sky-600 text-white',
      secondary: 'bg-white/10 hover:bg-white/20 text-white',
      ghost: 'bg-transparent hover:bg-white/10 text-slate-100'
    }
    const sizes: Record<string,string> = {
      default: 'h-9',
      icon: 'h-9 w-9 p-0'
    }
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
    )
  }
)
Button.displayName = 'Button'
