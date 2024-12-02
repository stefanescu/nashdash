'use client'

import { CartItem } from '@/app/types/menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getThemeClass } from '@/app/styles/theme'
import { IngredientModification } from '@/app/types/menu'
import { TimePicker } from './time-picker'

interface CartSheetProps {
  isOpen: boolean
  items: CartItem[]
  onClose: () => void
  onRemoveItem: (id: string) => void
  onUpdateItem: (id: string, updates: Partial<CartItem>) => void
  onClearCart: () => void
  onCheckout: () => void
  isNightMode: boolean
  selectedPickupTime: string
  onPickupTimeChange: (time: string) => void
  onUpdateQuantity: (item: CartItem, delta: number) => void
  onIngredientModification: (item: CartItem, ingredientId: string, modification: IngredientModification) => void
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
    const basePrice = item.price * item.quantity
    const extraPrice = item.ingredients?.reduce((total, ing) => 
      ing.modification === 'extra' && ing.extraPrice ? total + (ing.extraPrice * item.quantity) : total
    , 0) || 0
    return sum + basePrice + extraPrice
  }, 0)

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className={getThemeClass(
        "w-full sm:max-w-lg",
        isNightMode,
        "night-mode"
      )}>
        <SheetHeader>
          <SheetTitle className={getThemeClass(
            "text-2xl font-semibold",
            isNightMode,
            "text-slate-100"
          )}>Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 space-y-4">
          {items.length > 0 ? (
            <>
              <ScrollArea className="h-[45vh] pr-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className="flex justify-between items-start border-b pb-3 last:border-0"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-lg">
                            {item.quantity}x {item.name.en}
                          </div>
                          <div className="font-medium ml-4">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        {item.ingredients && item.ingredients.length > 0 && (
                          <div className="space-y-1 pl-4">
                            {item.ingredients.map((ing) => (
                              <div key={ing.id} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {ing.name}
                                  {ing.modification === 'extra' && ing.extraPrice && (
                                    <span className="text-xs ml-1">
                                      (+${ing.extraPrice.toFixed(2)})
                                    </span>
                                  )}
                                </span>
                                <Select
                                  value={ing.modification}
                                  onValueChange={(value: IngredientModification) => 
                                    onIngredientModification(item, ing.id, value)
                                  }
                                >
                                  <SelectTrigger className="h-7 w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="regular">Regular</SelectItem>
                                    <SelectItem value="removed">None</SelectItem>
                                    <SelectItem value="extra">Extra</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onUpdateQuantity(item, -1)}
                            >
                              -
                            </Button>
                            <span className={getThemeClass(
                              "min-w-8 text-center",
                              isNightMode,
                              "text-slate-100"
                            )}>{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onUpdateQuantity(item, 1)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveItem(item.id.toString())}
                            className="text-red-500 hover:text-red-600"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-3 pt-2">
                <Separator />
                
                <div>
                  <label className={getThemeClass(
                    "text-sm font-medium block mb-1",
                    isNightMode,
                    "text-slate-100"
                  )}>
                    Select Pickup Time
                  </label>
                  <TimePicker
                    isNightMenu={isNightMode}
                    selectedTime={selectedPickupTime}
                    onChange={onPickupTimeChange}
                  />
                </div>

                <div className="flex items-center justify-between font-medium">
                  <span className={getThemeClass(
                    "text-lg",
                    isNightMode,
                    "text-slate-100"
                  )}>Total:</span>
                  <span className={getThemeClass(
                    "text-lg",
                    isNightMode,
                    "text-slate-100"
                  )}>${total.toFixed(2)}</span>
                </div>

                <div className="flex space-x-2 pt-1">
                  <Button 
                    variant="outline" 
                    onClick={onClearCart}
                    className={getThemeClass(
                      "",
                      isNightMode,
                      "night-mode-border night-mode-hover"
                    )}
                  >
                    Clear Cart
                  </Button>
                  <Button 
                    onClick={onCheckout}
                    disabled={!selectedPickupTime}
                    className="flex-1"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-[60vh] items-center justify-center">
              <p className={getThemeClass(
                "text-center text-gray-500",
                isNightMode,
                "text-slate-400"
              )}>Your cart is empty</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
