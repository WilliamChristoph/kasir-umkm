const Modal = ({ 
  open, 
  onClose, 
  children, 
  title, 
  showCancel = true,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  onConfirm,
  className = ''
}) => {
  if (!open) return null
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center pt-4 pb-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="relative w-full max-w-lg max-md max-sm-full bg-white rounded-lg p-6 shadow-lg transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path className="stroke-2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mt-4 space-y-4">
          {children}
          
          {showCancel && !onConfirm && (
            <button 
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-input px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              {cancelText}
            </button>
          )}
          
          {onConfirm && (
            <>
              <button 
                onClick={onClose}
                className="w-full inline-flex justify-center rounded-md border border-input px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
              >
                {cancelText}
              </button>
              <button 
                onClick={() => { onConfirm(); onClose() }}
                className="w-full mt-2 inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                {confirmText}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

Modal.displayName = 'Modal'

export default Modal