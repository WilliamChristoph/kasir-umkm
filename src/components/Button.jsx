const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, className, as = 'button' }) => {
  const mapVariant = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent',
  }
  
  const mapSize = {
    sm: 'h-8 rounded-sm px-3 text-xs',
    md: 'h-10 rounded-md px-4 text-base',
    lg: 'h-12 rounded-lg px-8 text-lg',
  }
  
  const classes = `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${mapVariant[variant]} ${mapSize[size]} ${className || ''}`.trim()
  
  return (
    <button 
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

Button.displayName = 'Button'

export default Button