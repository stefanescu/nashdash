'use client'

import { useState, useEffect } from 'react'
import { MenuItem, CartItem, CartItemIngredient, IngredientModification } from '@/app/types/menu'
import { menuItems } from '@/app/lib/menu-data'
import { MenuToggle } from '@/app/components/menu-toggle'
import { CartButton } from '@/app/components/cart-button'
import { CartSheet } from '@/app/components/cart-sheet'
import { MenuItemCard } from '@/app/components/menu-item-card'
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthButton } from '@/app/components/auth-button'
import { OrdersButton } from '@/app/components/orders-button'
import { useSession } from 'next-auth/react'
import { getThemeClass } from '@/app/styles/theme'
import { Toaster } from "@/components/ui/toaster"

export default function Menu() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isNightMenu, setIsNightMenu] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedPickupTime, setSelectedPickupTime] = useState<string>('')
  const { toast } = useToast()
  const { data: session } = useSession()

  // Set initial menu based on current time
  useEffect(() => {
    const checkTime = () => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      // Morning menu: 8 AM to 12:45 PM
      // Night menu: 5 PM to 7:30 PM
      const isMorningTime = (currentHour >= 8 && currentHour < 12) || 
                           (currentHour === 12 && currentMinute <= 45)
      const isNightTime = (currentHour >= 17 && currentHour < 19) || 
                         (currentHour === 19 && currentMinute <= 30)

      setIsNightMenu(!isMorningTime)
    }

    checkTime()
    const interval = setInterval(checkTime, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const filteredItems = menuItems.filter(item => 
    item.type === 'drink' || item.timeOfDay === 'all' || item.timeOfDay === (isNightMenu ? 'night' : 'morning')
  )

  const getItemQuantity = (item: MenuItem) => {
    return cartItems.reduce((total, cartItem) => 
      cartItem.originalItemId === item.id ? total + cartItem.quantity : total
    , 0)
  }

  const handleAddToCart = (item: MenuItem, modifications: CartItemIngredient[] = []) => {
    const newItem: CartItem = {
      id: Date.now(),
      originalItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      ingredients: modifications,
      extraPrice: modifications.reduce((total, mod) => 
        mod.modification === 'extra' && mod.extraPrice ? total + mod.extraPrice : total
      , 0),
      image: item.image,
      type: item.type,
      timeOfDay: item.timeOfDay
    }
    setCartItems(prev => [...prev, newItem])
    toast({
      title: "Added to cart",
      description: `${item.name.en} has been added to your cart.`
    })
  }

  const handleRemoveFromCart = (item: MenuItem) => {
    const existingItem = cartItems.find(i => 
      i.originalItemId === item.id && !i.ingredients?.length
    )
    if (existingItem) {
      handleUpdateQuantity(existingItem, -1)
    }
  }

  const handleUpdateQuantity = (item: CartItem, delta: number) => {
    setCartItems(prev => prev.map(cartItem => {
      if (cartItem.id === item.id) {
        const newQuantity = Math.max(0, cartItem.quantity + delta)
        return newQuantity === 0 ? null : { ...cartItem, quantity: newQuantity }
      }
      return cartItem
    }).filter(Boolean) as CartItem[])
  }

  const handleIngredientModification = (
    item: CartItem,
    ingredientId: string,
    modification: IngredientModification
  ) => {
    setCartItems(prev => prev.map(cartItem => {
      if (cartItem.id === item.id) {
        const ingredients = cartItem.ingredients?.map(ing => 
          ing.id === ingredientId ? { ...ing, modification } : ing
        )
        return { ...cartItem, ingredients }
      }
      return cartItem
    }))
  }

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id.toString() !== id))
  }

  const handleUpdateItem = (id: string, updates: Partial<CartItem>) => {
    setCartItems(prev => prev.map(item => 
      item.id.toString() === id ? { ...item, ...updates } : item
    ))
  }

  const handleClearCart = () => {
    setCartItems([])
    setSelectedPickupTime('')
  }

  const handleCheckout = () => {
    if (!selectedPickupTime) {
      toast({
        title: "Select pickup time",
        description: "Please select a pickup time before checking out.",
        variant: "destructive"
      })
      return
    }

    try {
      // Calculate total with modifications
      const total = cartItems.reduce((sum, item) => {
        const basePrice = item.price * item.quantity
        const extraPrice = item.ingredients?.reduce((total, ing) => 
          ing.modification === 'extra' && ing.extraPrice ? total + (ing.extraPrice * item.quantity) : total
        , 0) || 0
        return sum + basePrice + extraPrice
      }, 0)

      // Create new order
      const newOrder = {
        id: Date.now().toString(),
        items: cartItems,
        total,
        timestamp: Date.now(),
        pickupTime: selectedPickupTime,
        status: 'pending',
        language: 'en'
      }

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]))

      // Format time for display
      const pickupDate = new Date(selectedPickupTime)
      const timeDisplay = pickupDate.toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
      const dateDisplay = pickupDate.toLocaleDateString([], {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      })

      toast({
        title: "Order placed!",
        description: `Your order will be ready for pickup on ${dateDisplay} at ${timeDisplay}.`,
      })
      
      setCartItems([])
      setIsCartOpen(false)
      setSelectedPickupTime('')
    } catch (error) {
      console.error('Error during checkout:', error)
      toast({
        title: "Error placing order",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className={getThemeClass(
      "min-h-screen transition-colors duration-300",
      isNightMenu,
      "night-mode"
    )}>
      <Toaster />
      <header className={getThemeClass(
        "sticky top-0 z-40 w-full border-b backdrop-blur-sm bg-white/80",
        isNightMenu,
        "night-mode night-mode-border bg-slate-900/80"
      )}>
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className={getThemeClass(
              "text-xl font-bold md:text-2xl",
              isNightMenu,
              "text-slate-100"
            )}>NashDash</h1>
            <MenuToggle isNightMenu={isNightMenu} onToggle={setIsNightMenu} />
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <OrdersButton isNightMode={isNightMenu} />
            <AuthButton isNightMode={isNightMenu} />
            <CartButton 
              items={cartItems} 
              onClick={() => setIsCartOpen(true)} 
              isNightMode={isNightMenu}
            />
          </div>
        </div>
      </header>

      <main className="container py-4 px-4 md:py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={getItemQuantity(item)}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              isNightMode={isNightMenu}
            />
          ))}
        </div>
      </main>

      <CartSheet
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={handleRemoveItem}
        onUpdateItem={handleUpdateItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
        isNightMode={isNightMenu}
        selectedPickupTime={selectedPickupTime}
        onPickupTimeChange={setSelectedPickupTime}
        onUpdateQuantity={handleUpdateQuantity}
        onIngredientModification={handleIngredientModification}
      />
    </div>
  )
}
