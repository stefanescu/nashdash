'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { CartItem, MenuItem, IngredientModification } from '@/app/types/menu'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Minus } from 'lucide-react'
import { IngredientSelector } from './ingredient-selector'
import { menuItems } from '@/app/lib/menu-data'
import { cn } from '@/lib/utils'

interface CartSheetProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  isNightMode?: boolean
  onUpdateQuantity: (item: CartItem, delta: number) => void
  onIngredientModification: (item: CartItem, ingredient: string, modification: IngredientModification) => void
  onClearCart: () => void
  onCheckout: () => void
}

export function CartSheet({
  isOpen,
  onClose,
  items,
  isNightMode,
  onUpdateQuantity,
  onIngredientModification,
  onClearCart,
  onCheckout,
}: CartSheetProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const getBaseItem = (cartItem: CartItem): MenuItem => {
    return menuItems.find(item => item.id === cartItem.originalItemId)!
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className={cn(
        "transition-colors duration-300",
        isNightMode && "bg-slate-900 text-slate-100 border-slate-800"
      )}>
        <SheetHeader>
          <SheetTitle className={cn(
            isNightMode && "text-slate-100"
          )}>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 my-4">
          {items.length === 0 ? (
            <p className={cn(
              "text-muted-foreground text-center",
              isNightMode && "text-slate-400"
            )}>Your cart is empty</p>
          ) : (
            items.map((item) => {
              const baseItem = getBaseItem(item)
              return (
                <div key={item.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={cn(
                        "font-medium",
                        isNightMode && "text-slate-100"
                      )}>{item.name.en}</p>
                      <p className={cn(
                        "text-sm text-muted-foreground",
                        isNightMode && "text-slate-400"
                      )}>
                        ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          "h-7 w-7",
                          isNightMode && "border-slate-700 text-slate-300 hover:bg-slate-800"
                        )}
                        onClick={() => onUpdateQuantity(item, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className={cn(
                        isNightMode && "text-slate-300"
                      )}>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          "h-7 w-7",
                          isNightMode && "border-slate-700 text-slate-300 hover:bg-slate-800"
                        )}
                        onClick={() => onUpdateQuantity(item, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {baseItem.ingredients && (
                    <IngredientSelector
                      ingredients={baseItem.ingredients}
                      modifications={item.ingredients}
                      onModificationChange={(ingredient, modification) => 
                        onIngredientModification(item, ingredient, modification)
                      }
                      isNightMode={isNightMode}
                    />
                  )}
                </div>
              )
            })
          )}
        </div>
        <SheetFooter>
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
              <span className={cn(
                "font-bold",
                isNightMode && "text-slate-100"
              )}>Total:</span>
              <span className={cn(
                "font-bold",
                isNightMode && "text-slate-100"
              )}>${total.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={cn(
                  "flex-1",
                  isNightMode && "border-slate-700 text-slate-300 hover:bg-slate-800"
                )}
                onClick={onClearCart}
                disabled={items.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button
                className={cn(
                  "flex-1",
                  isNightMode && "bg-green-700 hover:bg-green-800"
                )}
                onClick={onCheckout}
                disabled={items.length === 0}
              >
                Checkout
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
