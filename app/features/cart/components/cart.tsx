'use client'

import { ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CartItem } from '@/app/types/menu'

interface CartProps {
  items: CartItem[]
  onRemoveItem: (itemId: number) => void
  onClearCart: () => void
}

export function Cart({ items, onRemoveItem, onClearCart }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Cart
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div>
                  <span>{item.name.en}</span>
                  <span className="text-sm text-muted-foreground ml-2">x{item.quantity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                  <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="font-bold">Total: ${total.toFixed(2)}</div>
        <Button variant="destructive" onClick={onClearCart} disabled={items.length === 0}>
          Clear Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
