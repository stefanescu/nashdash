'use client'

import { useState, useEffect } from 'react'
import { MenuItem, CartItem, CartItemIngredient, IngredientModification } from '@/app/types/menu'
import { menuItems } from '@/app/lib/menu-data'
import { MenuToggle } from '@/app/components/menu-toggle'
import { CartButton } from '@/app/components/cart-button'
import { CartSheet } from '@/app/components/cart-sheet'
import { MenuItemCard } from '@/app/components/menu-item-card'
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from '@/lib/utils'
import { AuthButton } from '@/app/components/auth-button'
import { OrdersButton } from '@/app/components/orders-button'
import { useSession } from 'next-auth/react'

export default function Menu() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isNightMenu, setIsNightMenu] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedPickupTime, setSelectedPickupTime] = useState<string>('')
  const { toast } = useToast()
  const { data: session } = useSession()

  // Set initial menu based on current time
  useEffect(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Morning menu: 8 AM to 12:45 PM
    // Night menu: 5 PM to 7:30 PM
    const isMorningTime = (currentHour >= 8 && currentHour < 12) || 
                         (currentHour === 12 && currentMinute <= 45)
    const isNightTime = (currentHour >= 17 && currentHour < 19) || 
                       (currentHour === 19 && currentMinute <= 30)

    // If we're in morning hours, set to morning menu
    // If we're in night hours or past morning hours, set to night menu
    setIsNightMenu(!isMorningTime)
  }, [])

  const filteredItems = menuItems.filter(item => 
    item.type === 'drink' || item.timeOfDay === 'all' || item.timeOfDay === (isNightMenu ? 'night' : 'morning')
  )

  const findMatchingCartItem = (item: MenuItem, modifications: CartItemIngredient[] = []) => {
    return cartItems.find(cartItem => {
      if (cartItem.originalItemId !== item.id) return false
      
      const cartMods = cartItem.ingredients || []
      if (cartMods.length !== modifications.length) return false
      
      return modifications.every(mod => 
        cartMods.some(cartMod => 
          cartMod.name === mod.name && 
          cartMod.modification === mod.modification
        )
      )
    })
  }

  const getItemQuantity = (itemId: number) => {
    return cartItems.reduce((total, item) => {
      if (item.originalItemId === itemId) {
        return total + item.quantity
      }
      return total
    }, 0)
  }

  const handleAddToCart = (item: MenuItem, modifications: CartItemIngredient[] = []) => {
    setCartItems(prev => {
      // Check if we're trying to mix morning and night food items
      if (item.type === 'food' && item.timeOfDay !== 'all') {
        const existingFoodType = prev.find(i => i.type === 'food')?.timeOfDay
        if (existingFoodType && existingFoodType !== item.timeOfDay) {
          toast({
            variant: "destructive",
            title: "Cannot mix menu items",
            description: "You cannot mix breakfast and dinner items in the same order."
          })
          return prev
        }
      }

      const existing = findMatchingCartItem(item, modifications)
      if (existing) {
        return prev.map(i => 
          i === existing ? { ...i, quantity: i.quantity + 1 } : i
        )
      }

      const newCartItem: CartItem = {
        id: item.id,
        originalItemId: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        timeOfDay: item.timeOfDay,
        type: item.type,
        quantity: 1,
        ingredients: modifications.length > 0 ? modifications : undefined
      }
      return [...prev, newCartItem]
    })
  }

  const handleUpdateQuantity = (cartItem: CartItem, delta: number) => {
    setCartItems(prev => {
      const newItems = prev.map(item => {
        if (item === cartItem) {
          const newQuantity = item.quantity + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
        }
        return item
      }).filter((item): item is CartItem => item !== null)

      return newItems.length > 0 ? newItems : []
    })
  }

  const handleIngredientModification = (cartItem: CartItem, ingredient: string, modification: IngredientModification) => {
    const baseItem = menuItems.find(item => item.id === cartItem.originalItemId)!
    const currentMods = cartItem.ingredients || baseItem.ingredients?.map(ing => ({ 
      name: ing, 
      modification: 'regular' 
    })) || []

    const newMods = currentMods.map(mod => 
      mod.name === ingredient ? { ...mod, modification } : mod
    )

    // If all modifications are 'regular', remove modifications array
    const finalMods = newMods.every(mod => mod.modification === 'regular') ? [] : newMods

    // If quantity > 1, split the item
    if (cartItem.quantity > 1) {
      setCartItems(prev => [
        ...prev.filter(item => item !== cartItem),
        { ...cartItem, quantity: cartItem.quantity - 1 },
        { 
          ...cartItem, 
          quantity: 1, 
          ingredients: finalMods.length > 0 ? finalMods.map(mod => ({
            id: typeof mod.name === 'string' ? mod.name : mod.name.id,
            name: typeof mod.name === 'string' ? mod.name : mod.name.name,
            modification: mod.modification,
            extraPrice: typeof mod.name === 'string' ? 0 : mod.name.extraPrice
          })) : undefined 
        }
      ])
    } else {
      setCartItems(prev => prev.map(item => 
        item === cartItem 
          ? { 
              ...item, 
              ingredients: finalMods.length > 0 ? finalMods.map(mod => ({
                id: typeof mod.name === 'string' ? mod.name : mod.name.id,
                name: typeof mod.name === 'string' ? mod.name : mod.name.name,
                modification: mod.modification,
                extraPrice: typeof mod.name === 'string' ? 0 : mod.name.extraPrice
              })) : undefined 
            }
          : item
      ))
    }
  }

  const handleClearCart = () => {
    setCartItems([])
    setIsCartOpen(false)
  }

  const handleCheckout = () => {
    if (!selectedPickupTime) {
      toast({
        variant: "destructive",
        title: "Pickup Time Required",
        description: "Please select a pickup time for your order."
      })
      return
    }

    // Create a new order object
    const newOrder = {
      id: crypto.randomUUID(),
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      timestamp: Date.now(),
      pickupTime: selectedPickupTime,
      language: 'en' as const,
      userName: session?.user?.name || undefined,
      userEmail: session?.user?.email || undefined
    }

    // Get existing orders and add the new one
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]))

    toast({
      title: "Order Placed!",
      description: `Your order will be ready for pickup at ${selectedPickupTime}.`
    })
    handleClearCart()
    setSelectedPickupTime('')
  }

  return (
    <div className={cn(
      "container mx-auto p-4 min-h-screen transition-colors duration-300",
      isNightMenu && "bg-slate-950"
    )}>
      <header className={cn(
        "text-center mb-8",
        isNightMenu && "text-slate-100"
      )}>
        <h1 className="text-3xl font-bold mb-6">NashDash</h1>
        <MenuToggle 
          isNightMenu={isNightMenu} 
          onToggle={setIsNightMenu} 
        />
      </header>

      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <AuthButton />
        <OrdersButton />
        <CartButton 
          items={cartItems} 
          onClick={() => setIsCartOpen(true)} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            quantity={getItemQuantity(item.id)}
            isNightMode={isNightMenu}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={(item) => {
              const existingItem = cartItems.find(i => 
                i.originalItemId === item.id && !i.ingredients
              )
              if (existingItem) {
                handleUpdateQuantity(existingItem, -1)
              }
            }}
          />
        ))}
      </div>

      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        isNightMode={isNightMenu}
        selectedPickupTime={selectedPickupTime}
        onPickupTimeChange={setSelectedPickupTime}
        onUpdateQuantity={handleUpdateQuantity}
        onIngredientModification={handleIngredientModification}
        onRemoveItem={(id) => {
          setCartItems(prev => prev.filter(item => item.id.toString() !== id))
        }}
        onUpdateItem={(id, updates) => {
          setCartItems(prev => prev.map(item => 
            item.id.toString() === id ? { ...item, ...updates } : item
          ))
        }}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />
    </div>
  )
}
