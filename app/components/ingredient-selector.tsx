'use client'

import { Badge } from '@/components/ui/badge'
import { CartItemIngredient, IngredientModification } from '@/app/types/menu'
import { cn } from '@/lib/utils'

interface IngredientSelectorProps {
  name: string
  modification: IngredientModification
  onClick: () => void
  disabled?: boolean
  isNightMode?: boolean
}

function IngredientBadge({ name, modification, onClick, disabled, isNightMode }: IngredientSelectorProps) {
  const getVariant = () => {
    if (isNightMode) {
      switch (modification) {
        case 'removed':
          return 'outline'
        case 'extra':
          return 'secondary'
        default:
          return 'outline'
      }
    }
    switch (modification) {
      case 'removed':
        return 'destructive'
      case 'extra':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Badge
      variant={getVariant()}
      className={cn(
        "cursor-pointer transition-all duration-200",
        modification === 'extra' && "bg-green-600 hover:bg-green-700 ring-2 ring-green-500 ring-offset-1 shadow-sm",
        modification === 'removed' && isNightMode && "border-red-800 text-red-300 hover:bg-red-900/50",
        disabled && "opacity-50 cursor-default",
        !disabled && "hover:opacity-80",
        isNightMode && modification === 'regular' && "border-slate-700 text-slate-300",
        isNightMode && modification === 'extra' && "ring-offset-slate-900 bg-green-700 hover:bg-green-800 ring-green-600"
      )}
      onClick={disabled ? undefined : onClick}
    >
      {modification === 'extra' && (
        <span className="mr-0.5 text-white font-bold">+</span>
      )}
      {name}
      {modification === 'removed' && (
        <span className="ml-0.5">✕</span>
      )}
    </Badge>
  )
}

interface IngredientListProps {
  ingredients: string[]
  modifications?: CartItemIngredient[]
  onModificationChange: (ingredient: string, modification: IngredientModification) => void
  disabled?: boolean
  isNightMode?: boolean
}

export function IngredientSelector({ 
  ingredients, 
  modifications = [], 
  onModificationChange,
  disabled,
  isNightMode
}: IngredientListProps) {
  const getModification = (ingredient: string): IngredientModification => {
    return modifications.find(m => m.name === ingredient)?.modification || 'regular'
  }

  const cycleModification = (ingredient: string) => {
    const current = getModification(ingredient)
    const next: IngredientModification = 
      current === 'regular' ? 'removed' :
      current === 'removed' ? 'extra' :
      'regular'
    
    onModificationChange(ingredient, next)
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {ingredients.map(ingredient => (
        <IngredientBadge
          key={ingredient}
          name={ingredient}
          modification={getModification(ingredient)}
          onClick={() => cycleModification(ingredient)}
          disabled={disabled}
          isNightMode={isNightMode}
        />
      ))}
    </div>
  )
}
