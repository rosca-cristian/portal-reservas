import * as React from 'react'

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

const Select = ({ children, value, onValueChange }: { children: React.ReactNode; value: string; onValueChange: (value: string) => void }) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)
SelectTrigger.displayName = 'SelectTrigger'

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = React.useContext(SelectContext)
  return <span>{context?.value || placeholder}</span>
}

const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
      <div className="p-1">{children}</div>
    </div>
  )
}

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = React.useContext(SelectContext)
  return (
    <div
      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      onClick={() => context?.onValueChange(value)}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
