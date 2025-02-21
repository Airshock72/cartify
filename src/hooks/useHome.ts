import { useEffect } from 'react'
import { useRouter } from 'next/router'

const useHome = () => {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('visitorToken')
    if (!token) {
      router.push('/register').then()
    }
  }, [router])
}

export default useHome
