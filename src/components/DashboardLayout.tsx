'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  FiHome,
  FiUsers,
  FiTag,
  FiCamera,
  FiMessageSquare,
  FiHelpCircle,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiFileText,
  FiGrid,
  FiImage,
} from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Doctors', href: '/dashboard/doctors', icon: FiUsers },
  { name: 'Poly Clinic', href: '/dashboard/polyclinics', icon: FiGrid },
  { name: 'Articles', href: '/dashboard/articles', icon: FiFileText },
  { name: 'Promos', href: '/dashboard/promos', icon: FiTag },
  { name: 'Facilities', href: '/dashboard/facilities', icon: FiCamera },
  { name: 'Testimonials', href: '/dashboard/testimonials', icon: FiMessageSquare },
  { name: 'FAQ', href: '/dashboard/faqs', icon: FiHelpCircle },
  { name: 'Partners', href: '/dashboard/partners', icon: FiImage },
  { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-3">
            <Image 
              src="/images/logo_icon.png" 
              alt="Klinik Taksim Medika Logo" 
              width={32} 
              height={32}
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-bold">Taksim Medika</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <FiX className="w-4 h-4" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    isActive ? 'bg-primary/10 text-primary' : ''
                  }`}
                  asChild
                >
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Link>
                </Button>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center mb-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                <FiUsers className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <FiLogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0 flex flex-col">
        {/* Top bar - Fixed */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-between h-16 px-6 bg-background border-b shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <FiMenu className="w-4 h-4" />
          </Button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome back, Admin
            </span>
          </div>
        </div>

        {/* Page content - with top padding for fixed header */}
        <main className="flex-1 overflow-y-auto p-6" style={{ paddingTop: '88px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}