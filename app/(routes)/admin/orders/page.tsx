'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Trash2, ArrowLeft, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface OrderItem {
  id: number
  name: { en: string; es: string }
  price: number
  quantity: number
  ingredients?: { [key: string]: 'regular' | 'remove' | 'extra' }
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  timestamp: number
  language: 'en' | 'es'
  userName?: string
  userEmail?: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    // Load orders from localStorage and filter out expired ones
    const loadOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[]
      const currentTime = Date.now()
      const validOrders = storedOrders.filter(order => {
        const orderAge = currentTime - order.timestamp
        return orderAge < 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      })
      
      if (validOrders.length !== storedOrders.length) {
        localStorage.setItem('orders', JSON.stringify(validOrders))
      }
      
      setOrders(validOrders)
    }

    loadOrders()
    // Check for expired orders every minute
    const interval = setInterval(loadOrders, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const handleAcceptOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    setOrders(updatedOrders)
  }

  const handleDeleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    setOrders(updatedOrders)
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString(language === 'en' ? 'en-US' : 'es-ES', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: language === 'en'
    })
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return null
  }

  return (
    <motion.div 
      className="min-h-screen p-4 bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {language === 'en' ? 'Orders' : 'Pedidos'}
          </h1>
          <Button
            variant="ghost"
            onClick={() => setLanguage(prev => prev === 'en' ? 'es' : 'en')}
          >
            {language === 'en' ? 'ES' : 'EN'}
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? 'No orders to display'
                  : 'No hay pedidos para mostrar'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>
                      {formatDate(order.timestamp)}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {formatTime(order.timestamp)}
                    </span>
                  </CardTitle>
                  {order.userName && (
                    <p className="text-sm text-muted-foreground">
                      Ordered by: {order.userName}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">
                            {item.quantity}x {item.name[order.language]}
                          </span>
                          {item.ingredients && Object.entries(item.ingredients).length > 0 && (
                            <ul className="text-sm text-muted-foreground ml-4">
                              {Object.entries(item.ingredients).map(([ingredient, state]) => (
                                <li key={ingredient}>
                                  {state === 'remove' && '- '}
                                  {state === 'extra' && '+ '}
                                  {ingredient}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-muted/50">
                  <span className="font-bold">
                    {language === 'en' ? 'Total:' : 'Total:'} ${order.total.toFixed(2)}
                  </span>
                  <div className="space-x-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
