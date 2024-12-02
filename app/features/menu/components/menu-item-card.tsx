'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus } from 'lucide-react'
import { MenuItem } from '@/app/types/menu'

interface MenuItemCardProps {
  item: MenuItem
  quantity: number
  onAdd: (item: MenuItem) => void
  onRemove: (itemId: number) => void
}

export function MenuItemCard({ item, quantity, onAdd, onRemove }: MenuItemCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{item.name.en}</span>
          <Badge variant="secondary">${item.price.toFixed(2)}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <img src={item.image} alt={item.name.en} className="w-20 h-20 object-cover rounded" />
          <div className="text-sm text-muted-foreground">
            {item.ingredients?.join(', ')}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="icon" onClick={() => onRemove(item.id)} disabled={quantity === 0}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="mx-2">{quantity}</span>
        <Button variant="outline" size="icon" onClick={() => onAdd(item)}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
