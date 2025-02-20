import ProductList from '@/components/ProductList'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('visitorToken')
    if (!token) {
      router.push('/register').then()
    }
  }, [router])
  return (
    <div>
      <h1 className='text-center my-4 text-white'>Shopping Cart</h1>
      <ProductList />
    </div>
  )
}
