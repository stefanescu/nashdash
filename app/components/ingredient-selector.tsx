'use client'

import { Badge } from '@/components/ui/badge'
import { CartItemIngredient, IngredientModification } from '@/app/types/menu'
import { cn } from '@/lib/utils'

interface IngredientSelectorProps {
  name: string
  modification: IngredientModification
  onClick: () => void
  extraPrice?: number
  disabled?: boolean
  isNightMode?: boolean
}

function IngredientBadge({ name, modification, onClick, extraPrice, disabled, isNightMode }: IngredientSelectorProps) {
  const getVariant = () => {
    if (isNightMode) {
      switch (modification) {
        case 'no':
          return 'outline'
        case 'extra':
          return 'secondary'
        default:
          return 'outline'
      }
    }
    switch (modification) {
      case 'no':
        return 'destructive'
      case 'extra':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const displayName = () => {
    if (modification === 'extra' && extraPrice && extraPrice > 0) {
      return `${name} (+$${extraPrice.toFixed(2)})`
    }
    return name
  }

  return (
    <Badge
      variant={getVariant()}
      className={cn(
        "cursor-pointer transition-all duration-200",
        modification === 'extra' && "bg-green-600 hover:bg-green-700 ring-2 ring-green-500 ring-offset-1 shadow-sm",
        modification === 'no' && isNightMode && "border-red-800 text-red-300 hover:bg-red-900/50",
        disabled && "opacity-50 cursor-default",
        !disabled && "hover:opacity-80",
        isNightMode && modification === 'normal' && "border-slate-700 text-slate-300",
        isNightMode && modification === 'extra' && "ring-offset-slate-900 bg-green-700 hover:bg-green-800 ring-green-600"
      )}
      onClick={disabled ? undefined : onClick}
    >
      {modification === 'extra' && (
        <span className="mr-0.5 text-white font-bold">+</span>
      )}
      {displayName()}
      {modification === 'no' && (
        <span className="ml-0.5">✕</span>
      )}
    </Badge>
  )
}

interface IngredientListProps {
  ingredients: CartItemIngredient[]
  modifications?: CartItemIngredient[]
  onModificationChange: (ingredient: CartItemIngredient, modification: IngredientModification) => void
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
  const getModification = (ingredient: CartItemIngredient): IngredientModification => {
    return modifications.find(m => m.id === ingredient.id)?.modification || 'normal'
  }

  const cycleModification = (ingredient: CartItemIngredient) => {
    const current = getModification(ingredient)
    const next: IngredientModification = 
      current === 'normal' ? 'no' :
      current === 'no' ? 'extra' :
      'normal'
    
    onModificationChange(ingredient, next)
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {ingredients.map(ingredient => (
        <IngredientBadge
          key={ingredient.id}
          name={ingredient.name}
          modification={getModification(ingredient)}
          extraPrice={ingredient.extraPrice}
          onClick={() => cycleModification(ingredient)}
          disabled={disabled}
          isNightMode={isNightMode}
        />
      ))}
    </div>
  )
}
