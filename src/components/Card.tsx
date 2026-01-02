import React from 'react'
import styles from './Card.module.css'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  elevated?: boolean
}

/**
 * 卡片组件
 * 需求: 7.1, 7.2, 7.3
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ elevated = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.card} ${elevated ? styles.elevated : ''} ${className || ''}`}
        {...props}
      />
    )
  },
)

Card.displayName = 'Card'
