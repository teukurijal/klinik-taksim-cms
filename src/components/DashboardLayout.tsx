'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FiHome,
  FiUsers,
  FiTag,
  FiCamera,
  FiMessageSquare,
  FiHelpCircle,
  FiImage,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi'

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Doctors', href: '/dashboard/doctors', icon: FiUsers },
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
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Taksim Medika</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUsers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0 flex flex-col">
        {/* Top bar - Fixed */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
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