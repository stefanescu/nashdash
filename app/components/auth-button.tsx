'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { UserCircle2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { getThemeClass } from '@/app/styles/theme'

interface AuthButtonProps {
  isNightMode?: boolean
}

export function AuthButton({ isNightMode }: AuthButtonProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Button 
        variant="ghost" 
        size="sm"
        className={getThemeClass(
          "text-sm font-medium",
          isNightMode,
          "text-slate-100"
        )}
        disabled
      >
        <UserCircle2 className="h-4 w-4" />
      </Button>
    )
  }

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={getThemeClass(
              "text-sm font-medium relative",
              isNightMode,
              "text-slate-100 hover:text-slate-100 hover:bg-slate-800"
            )}
          >
            <UserCircle2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className={getThemeClass(
            "",
            isNightMode,
            "night-mode night-mode-border"
          )}
        >
          <DropdownMenuItem className={getThemeClass(
            "text-sm",
            isNightMode,
            "text-slate-100"
          )}>
            Signed in as {session.user?.name}
          </DropdownMenuItem>
          <Link href="/orders">
            <DropdownMenuItem className={getThemeClass(
              "",
              isNightMode,
              "text-slate-100 hover:bg-slate-800"
            )}>
              Order History
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem 
            onClick={() => signOut()}
            className={getThemeClass(
              "",
              isNightMode,
              "text-slate-100 hover:bg-slate-800"
            )}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button 
      variant="ghost" 
      size="sm"
      className={getThemeClass(
        "text-sm font-medium",
        isNightMode,
        "text-slate-100 hover:text-slate-100 hover:bg-slate-800"
      )}
      onClick={() => signIn()}
    >
      Login
    </Button>
  )
}
