import ProductList from '@/components/ProductList'
import useHome from '@/hooks/useHome'

const Home = () => {
  useHome()
  return (
    <div>
      <ProductList />
    </div>
  )
}

export default Home
