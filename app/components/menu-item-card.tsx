'use client'

import { useState } from 'react'
import { MenuItem, CartItemIngredient } from '@/app/types/menu'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IngredientSelector } from './ingredient-selector'
import { Plus, Minus, Coffee, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuItemCardProps {
  item: MenuItem
  quantity: number
  isNightMode?: boolean
  onAddToCart: (item: MenuItem, modifications: CartItemIngredient[]) => void
  onRemoveFromCart: (item: MenuItem) => void
}

export function MenuItemCard({ 
  item, 
  quantity,
  isNightMode,
  onAddToCart, 
  onRemoveFromCart 
}: MenuItemCardProps) {
  const [modifications, setModifications] = useState<CartItemIngredient[]>(
    item.ingredients?.map(ing => ({ name: ing, modification: 'regular' })) || []
  )

  const handleAddToCart = () => {
    const activeModifications = modifications.filter(mod => mod.modification !== 'regular')
    onAddToCart(item, activeModifications)
  }

  const ItemIcon = item.type === 'drink' ? Coffee : UtensilsCrossed

  return (
    <Card className={cn(
      "transition-colors duration-300",
      isNightMode && "bg-slate-900 text-slate-100"
    )}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ItemIcon className={cn(
              "h-5 w-5",
              isNightMode ? "text-slate-300" : "text-slate-600"
            )} />
            <span>{item.name.en}</span>
          </div>
          <Badge variant={isNightMode ? "secondary" : "outline"} className={cn(
            isNightMode && "bg-slate-800 text-slate-100"
          )}>
            ${item.price.toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.ingredients && (
          <IngredientSelector
            ingredients={item.ingredients}
            modifications={modifications}
            isNightMode={isNightMode}
            onModificationChange={(ingredient, modification) => {
              setModifications(prev => 
                prev.map(mod => 
                  mod.name === ingredient ? { ...mod, modification } : mod
                )
              )
            }}
          />
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-1.5 ml-auto">
          <Button 
            variant="outline"
            size="icon"
            className={cn(
              "h-7 w-7 transition-colors",
              quantity > 0 ? "hover:bg-red-100 hover:text-red-700" : "opacity-50",
              isNightMode && "border-slate-700 text-slate-300 hover:bg-red-900 hover:text-red-300"
            )}
            disabled={quantity === 0}
            onClick={() => onRemoveFromCart(item)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className={cn(
            "font-medium min-w-[1.5rem] text-center",
            isNightMode && "text-slate-300"
          )}>
            {quantity}
          </span>
          <Button 
            size="icon"
            className={cn(
              "h-7 w-7 bg-green-600 hover:bg-green-700",
              "shadow-sm hover:shadow-md transition-all duration-200",
              "ring-2 ring-green-500 ring-offset-2",
              "active:scale-95",
              isNightMode && "ring-offset-slate-900 bg-green-700 hover:bg-green-800"
            )}
            onClick={handleAddToCart}
          >
            <Plus className="h-3.5 w-3.5 text-white font-bold" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
