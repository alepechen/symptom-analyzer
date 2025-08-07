'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/features/auth/authContext'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Symptom Analyzer', href: '/' },
  { name: 'Appointments', href: '/appointments' },
]

const NavBar: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className='hidden lg:flex lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:flex-row bg-white dark:bg-gray-800'>
      <div className='lg:w-64 bg-white dark:bg-gray-800 overflow-y-auto'>
        <div className='pt-5 pb-4'>
          <nav className='mt-5 flex-1 space-y-1 px-2'>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className='group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default NavBar
