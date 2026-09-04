const Toast = ({ title, description, variant = 'default', duration = 5000 }) => {
  const mapVariant = {
    default: 'bg-background text-foreground',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
  }
  
  const toast = document.createElement('div')
  toast.className = `rounded-md p-4 shadow-sm transition-all duration-500 ${mapVariant[variant]} mb-2`
  toast.innerHTML = `
    <div class="flex">
      <div class="flex-1">
        <p class="font-medium">${title}</p>
        <p class="mt-1 text-sm opacity-80">${description}</p>
      </div>
    </div>
  `
  
  const container = document.querySelector('.toast-container') || (() => {
    const div = document.createElement('div')
    div.className = 'toast-container fixed top-4 right-4 z-50 flex flex-col gap-2'
    document.body.appendChild(div)
    return div
  })()
  
  container.appendChild(toast)
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }, duration)
  
  return null
}

Toast.displayName = 'Toast'

export default Toast