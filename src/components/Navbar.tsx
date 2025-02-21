import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('visitorToken')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('visitorToken')
    setIsAuthenticated(false)
    router.push('/register').then()
  }

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <div className='container-fluid'>
        <Link href='/' className='navbar-brand'>
            Shopping Cart
        </Link>
        <div className='collapse navbar-collapse'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <li className='nav-item'>
              <Link href='/' className='nav-link'>
                  Products
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/cart' className='nav-link'>
                  Cart
              </Link>
            </li>
          </ul>
          {isAuthenticated && (
            <button className='btn btn-outline-light' onClick={handleLogout}>
                  Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
