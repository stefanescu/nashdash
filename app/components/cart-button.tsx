'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartItem } from '@/app/types/menu'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CartButtonProps {
  items: CartItem[]
  onClick: () => void
}

export function CartButton({ items, onClick }: CartButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationType, setAnimationType] = useState<'add' | 'remove' | null>(null)
  const [prevCount, setPrevCount] = useState(0)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    if (totalItems !== prevCount) {
      setIsAnimating(true)
      setAnimationType(totalItems > prevCount ? 'add' : 'remove')
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setAnimationType(null)
      }, 300)
      setPrevCount(totalItems)
      return () => clearTimeout(timer)
    }
  }, [totalItems, prevCount])

  return (
    <Button
      size="lg"
      onClick={onClick}
      className={cn(
        "relative transition-colors duration-300",
        isAnimating && animationType === 'add' && "bg-green-600 hover:bg-green-700",
        isAnimating && animationType === 'remove' && "bg-red-600 hover:bg-red-700"
      )}
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
          {totalItems}
        </span>
      )}
    </Button>
  )
}
