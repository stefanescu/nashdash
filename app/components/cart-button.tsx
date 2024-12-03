'use client'

import { CartItem } from '@/app/types/menu'
import { useState, useEffect } from 'react'

interface CartButtonProps {
  items: CartItem[]
  onClick: () => void
  isNightMode?: boolean
}

export function CartButton({ items, onClick, isNightMode }: CartButtonProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price + item.extraPrice) * item.quantity, 0)

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-accent/50 transition-colors"
    >
      <span className="text-sm font-medium">${totalPrice.toFixed(2)}</span>
      <div className="text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      </div>
    </button>
  )
}
