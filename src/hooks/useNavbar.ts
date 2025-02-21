import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface UseNavbar {
    isAuthenticated: boolean
    handleLogout: () => void
}

const useNavbar = (): UseNavbar => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('visitorToken')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('visitorToken')
    setIsAuthenticated(false)
    router.push('/register').then()
  }

  return { isAuthenticated, handleLogout }
}

export default useNavbar
