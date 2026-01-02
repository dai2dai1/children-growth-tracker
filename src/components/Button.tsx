import React from 'react'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

/**
 * 按钮组件
 * 需求: 7.1, 7.2, 7.3
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    const variantClass = styles[`variant-${variant}`]
    const sizeClass = styles[`size-${size}`]

    return (
      <button
        ref={ref}
        className={`${styles.button} ${variantClass} ${sizeClass} ${className || ''}`}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
