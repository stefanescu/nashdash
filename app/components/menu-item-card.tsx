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
    item.ingredients?.map(ing => ({
      id: ing.id,
      name: ing.name,
      modification: 'regular',
      extraPrice: ing.extraPrice
    })) || []
  )

  const handleAddToCart = () => {
    const activeModifications = modifications.filter(mod => mod.modification !== 'regular')
    onAddToCart(item, activeModifications)
  }

  const ItemIcon = item.type === 'drink' ? Coffee : UtensilsCrossed

  return (
    <Card className={cn(
      "transition-colors duration-300 relative overflow-hidden",
      isNightMode 
        ? "bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700" 
        : "bg-white hover:bg-slate-50"
    )}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ItemIcon className={cn(
              "h-5 w-5",
              isNightMode ? "text-amber-400" : "text-slate-600"
            )} />
            <span>{item.name.en}</span>
          </div>
          <Badge variant={isNightMode ? "secondary" : "default"} className={cn(
            isNightMode && "bg-slate-700 hover:bg-slate-600"
          )}>
            ${item.price.toFixed(2)}
          </Badge>
        </CardTitle>
        {item.description && (
          <p className={cn(
            "text-sm",
            isNightMode ? "text-slate-300" : "text-slate-600"
          )}>{item.description.en}</p>
        )}
      </CardHeader>
      <CardContent>
        {item.ingredients && (
          <div className={cn(
            "space-y-2",
            isNightMode ? "text-slate-300" : "text-slate-600"
          )}>
            {item.ingredients.map(ing => (
              <div key={ing.id} className="flex items-center gap-2 text-sm">
                <span>{ing.name}</span>
                <Badge variant="outline" className={cn(
                  "ml-auto",
                  isNightMode && "border-slate-600 text-slate-300"
                )}>
                  +${ing.extraPrice.toFixed(2)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {quantity > 0 && (
            <>
              <Button
                variant={isNightMode ? "secondary" : "outline"}
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isNightMode && "bg-slate-700 hover:bg-slate-600"
                )}
                onClick={() => onRemoveFromCart(item)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className={cn(
                "w-8 text-center",
                isNightMode ? "text-slate-100" : "text-slate-900"
              )}>{quantity}</span>
            </>
          )}
          <Button
            variant={isNightMode ? "secondary" : "outline"}
            size="icon"
            className={cn(
              "h-8 w-8",
              isNightMode && "bg-slate-700 hover:bg-slate-600"
            )}
            onClick={handleAddToCart}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
