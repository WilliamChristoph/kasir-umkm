const Input = ({ type = 'text', placeholder, value, onChange, disabled, className }) => {
  const classes = 'rounded-md border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:placeholder-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full'
  
  return (
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={classes}
    />
  )
}

Input.displayName = 'Input'

export default Input