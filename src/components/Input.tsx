import React from 'react'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

/**
 * 输入框组件
 * 需求: 7.1, 7.2, 7.3
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <input
          ref={ref}
          className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`}
          {...props}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    )
  },
)

Input.displayName = 'Input'
