'use client'

import { useState } from 'react'
import { MenuItem, CartItemIngredient } from '@/app/types/menu'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IngredientSelector } from './ingredient-selector'
import { Plus, Minus, Coffee, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getThemeClass } from '@/app/styles/theme'

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
      extraPrice: ing.extraPrice,
      modification: 'regular'
    })) || []
  )

  const handleAddToCart = () => {
    const activeModifications = modifications.filter(mod => mod.modification !== 'regular')
    onAddToCart(item, activeModifications)
  }

  const ItemIcon = item.type === 'drink' ? Coffee : UtensilsCrossed

  return (
    <Card className={getThemeClass(
      "transition-all duration-300 relative overflow-hidden bg-white hover:bg-slate-50 hover:shadow-md",
      isNightMode,
      "night-mode night-mode-hover"
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <ItemIcon className={cn(
              "h-5 w-5",
              isNightMode ? "text-amber-400" : "text-slate-600"
            )} />
            <span className="text-base font-semibold md:text-lg">{item.name.en}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold md:text-lg">${item.price.toFixed(2)}</span>
            {quantity > 0 && (
              <Badge variant={isNightMode ? "outline" : "secondary"} className={getThemeClass(
                "text-xs",
                isNightMode,
                "night-mode-border text-slate-100"
              )}>
                {quantity}
              </Badge>
            )}
          </div>
        </CardTitle>
        {item.description?.en && (
          <p className={getThemeClass(
            "text-xs md:text-sm text-slate-600 line-clamp-2",
            isNightMode,
            "text-slate-400"
          )}>
            {item.description.en}
          </p>
        )}
      </CardHeader>
      
      {item.ingredients && (
        <CardContent className="pt-0">
          <IngredientSelector
            ingredients={item.ingredients.map(ing => ({
              ...ing,
              modification: 'regular'
            }))}
            modifications={modifications}
            onModificationChange={(ingredient, modification) => {
              setModifications(prev => {
                const existing = prev.find(mod => mod.id === ingredient.id);
                if (existing) {
                  return prev.map(mod => 
                    mod.id === ingredient.id 
                      ? { ...mod, modification }
                      : mod
                  );
                }
                return [...prev, { ...ingredient, modification }];
              });
            }}
            isNightMode={isNightMode}
          />
        </CardContent>
      )}

      <CardFooter className="flex justify-end gap-1.5 pt-2">
        {quantity > 0 && (
          <Button
            variant="outline"
            size="icon"
            className={getThemeClass(
              "h-8 w-8",
              isNightMode,
              "night-mode-border night-mode-hover"
            )}
            onClick={() => onRemoveFromCart(item)}
          >
            <Minus className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          className={getThemeClass(
            "h-8 w-8",
            isNightMode,
            "night-mode-border night-mode-hover"
          )}
          onClick={handleAddToCart}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
