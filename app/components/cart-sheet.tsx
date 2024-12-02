'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { type CartItem, CartItemIngredient, IngredientModification, MenuItem } from "@/app/types/menu"
import { menuItems } from "@/app/lib/menu-data"
import { IngredientSelector } from "./ingredient-selector"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Minus, Plus, Trash2 } from "lucide-react"

interface CartSheetProps {
  isOpen: boolean
  items: CartItem[]
  onClose: () => void
  onRemoveItem: (id: string) => void
  onUpdateItem: (id: string, updates: Partial<CartItem>) => void
  onClearCart: () => void
  onCheckout: () => void
  isNightMode?: boolean
  selectedPickupTime: string
  onPickupTimeChange: (time: string) => void
  onUpdateQuantity: (item: CartItem, delta: number) => void
  onIngredientModification: (item: CartItem, ingredientId: string, modification: IngredientModification) => void
}

interface CartItemProps {
  data: CartItem
  onRemove: (id: string) => void
  onUpdate: (id: string, updates: Partial<CartItem>) => void
  isNightMode?: boolean
}

const CartItem: React.FC<CartItemProps> = ({
  data,
  onRemove,
  onUpdate,
  isNightMode
}) => {
  const handleQuantityChange = (value: number) => {
    onUpdate(data.id.toString(), { quantity: value })
  }

  const handleIngredientChange = (ingredient: { id: string; name: string; extraPrice: number }, modification: IngredientModification) => {
    const currentIngredients = data.ingredients || []
    const updatedIngredients: CartItemIngredient[] = currentIngredients
      .filter(m => m.name !== ingredient.name)
      .concat({ 
        id: ingredient.id,
        name: ingredient.name,
        modification,
        extraPrice: ingredient.extraPrice
      })
    
    let extraPrice = 0
    updatedIngredients.forEach(mod => {
      if (mod.modification === 'extra') {
        const baseIngredient = baseItem.ingredients?.find(i => i.name === mod.name)
        if (baseIngredient?.extraPrice) {
          extraPrice += baseIngredient.extraPrice
        }
      }
    })

    onUpdate(data.id.toString(), { 
      ingredients: updatedIngredients,
      extraPrice: extraPrice
    })
  }

  const baseItem = menuItems.find(item => item.id === data.originalItemId)!

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex justify-between gap-2">
        <div className="flex-1">
          <div className="flex justify-between">
            <span className={cn(
              "font-medium",
              isNightMode && "text-slate-200"
            )}>{data.name.en}</span>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                isNightMode && "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
              )}
              onClick={() => onRemove(data.id.toString())}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <p className={cn(
            "text-sm text-muted-foreground",
            isNightMode && "text-slate-400"
          )}>
            ${data.price.toFixed(2)} x {data.quantity} = ${(data.price * data.quantity).toFixed(2)}
            {data.extraPrice ? ` + $${data.extraPrice.toFixed(2)}` : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-8 w-8",
            isNightMode && "border-slate-700 bg-slate-800 hover:bg-slate-700"
          )}
          onClick={() => handleQuantityChange(Math.max(1, data.quantity - 1))}
          disabled={data.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className={cn(
          "text-center w-8",
          isNightMode && "text-slate-300"
        )}>{data.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-8 w-8",
            isNightMode && "border-slate-700 bg-slate-800 hover:bg-slate-700"
          )}
          onClick={() => handleQuantityChange(data.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {baseItem.ingredients && (
        <IngredientSelector
          ingredients={baseItem.ingredients.map(ing => ({
            id: ing.id,
            name: ing.name,
            extraPrice: ing.extraPrice,
            modification: 'regular' as const
          }))}
          modifications={data.ingredients || []}
          onModificationChange={(ingredient, modification) => {
            const baseIngredient = baseItem.ingredients?.find(i => i.id === ingredient.id);
            if (baseIngredient) {
              handleIngredientChange(baseIngredient, modification);
            }
          }}
          isNightMode={isNightMode}
        />
      )}
      <Separator className={cn(
        "my-2",
        isNightMode && "bg-slate-700"
      )} />
    </div>
  )
}

export function CartSheet({
  isOpen,
  items,
  onClose,
  onRemoveItem,
  onUpdateItem,
  onClearCart,
  onCheckout,
  isNightMode,
  selectedPickupTime,
  onPickupTimeChange,
  onUpdateQuantity,
  onIngredientModification
}: CartSheetProps) {
  const total = items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity
    const extraTotal = item.extraPrice || 0
    return sum + itemTotal + extraTotal
  }, 0)

  const getBaseItem = (cartItem: CartItem): MenuItem => {
    return menuItems.find(item => item.id === cartItem.originalItemId)!
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className={cn(
        "w-full sm:max-w-lg",
        isNightMode && "bg-slate-900 border-slate-700"
      )}>
        <SheetHeader>
          <SheetTitle className={cn(
            isNightMode && "text-slate-200"
          )}>Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          <ScrollArea className="h-[calc(100vh-280px)]">
            {items.map((item) => (
              <CartItem
                key={item.id}
                data={item}
                onRemove={onRemoveItem}
                onUpdate={onUpdateItem}
                isNightMode={isNightMode}
              />
            ))}
          </ScrollArea>
          <div className="space-y-4 mt-4">
            <Separator className={cn(
              isNightMode && "bg-slate-700"
            )} />
            <div className="flex items-center justify-between">
              <span className={cn(
                "font-semibold",
                isNightMode && "text-slate-200"
              )}>Total</span>
              <span className={cn(
                "font-semibold",
                isNightMode && "text-slate-200"
              )}>${total.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={onCheckout}
                className={cn(
                  isNightMode && "bg-green-700 hover:bg-green-800"
                )}
              >
                Checkout
              </Button>
              <Button
                variant="outline"
                onClick={onClearCart}
                className={cn(
                  isNightMode && "border-slate-700 bg-slate-800 hover:bg-slate-700"
                )}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
