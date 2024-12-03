'use client'

import { Sun, Moon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface MenuToggleProps {
  isNightMenu: boolean
  onToggle: (value: boolean) => void
}

export function MenuToggle({ isNightMenu, onToggle }: MenuToggleProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-4 py-2">
      <div className="flex items-center gap-2">
        <Sun className={`h-4 w-4 ${!isNightMenu ? 'text-yellow-500' : 'text-muted-foreground'}`} />
        <Switch
          checked={isNightMenu}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-indigo-500"
        />
        <Moon className={`h-4 w-4 ${isNightMenu ? 'text-indigo-500' : 'text-muted-foreground'}`} />
      </div>
      <div className="flex flex-col items-center text-[10px] text-muted-foreground">
        <span>{isNightMenu ? 'Night' : 'Breakfast'}</span>
        <span>{isNightMenu ? '5pm-7pm' : '7am-1pm'}</span>
      </div>
    </div>
  )
}
