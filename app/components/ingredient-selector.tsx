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
        case 'regular':
          return 'outline'
        case 'removed':
          return 'destructive'
        case 'extra':
          return 'secondary'
      }
    }
    switch (modification) {
      case 'regular':
        return 'outline'
      case 'removed':
        return 'destructive'
      case 'extra':
        return 'secondary'
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
        isNightMode ? (
          modification === 'extra' 
            ? "bg-amber-600 hover:bg-amber-700 border-amber-500 text-slate-100"
            : modification === 'removed'
            ? "bg-red-900 hover:bg-red-800 border-red-700 text-slate-100"
            : "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300"
        ) : (
          modification === 'extra'
            ? "bg-green-600 hover:bg-green-700 text-white"
            : modification === 'removed'
            ? "bg-red-600 hover:bg-red-700"
            : "hover:bg-slate-100"
        ),
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:opacity-80"
      )}
      onClick={disabled ? undefined : onClick}
    >
      {modification === 'extra' && (
        <span className="mr-0.5 text-white font-bold">+</span>
      )}
      {displayName()}
      {modification === 'removed' && (
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
    return modifications.find(m => m.id === ingredient.id)?.modification || 'regular'
  }

  const cycleModification = (ingredient: CartItemIngredient) => {
    const current = getModification(ingredient)
    const next: IngredientModification = 
      current === 'regular' ? 'extra' :
      current === 'extra' ? 'removed' :
      'regular'
    
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
