'use client'

import { Sun, Moon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface MenuToggleProps {
  isNightMenu: boolean
  onToggle: (value: boolean) => void
}

export function MenuToggle({ isNightMenu, onToggle }: MenuToggleProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4" />
        <Switch
          checked={isNightMenu}
          onCheckedChange={onToggle}
        />
        <Moon className="h-4 w-4" />
      </div>
      <div className="text-sm text-muted-foreground">
        {isNightMenu ? (
          <span>Dinner Menu • 5:00 PM - 7:30 PM</span>
        ) : (
          <span>Breakfast Menu • 8:00 AM - 12:45 PM</span>
        )}
      </div>
    </div>
  )
}
