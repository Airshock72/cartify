import { gql, useQuery } from '@apollo/client'

const GET_PRODUCTS = gql`
    query GetProducts {
        getProducts {
            products {
                _id
                title
                cost
                availableQuantity
            }
            total
        }
    }
`

export default function ProductList() {
  const { data, loading, error } = useQuery(GET_PRODUCTS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className='container mt-5'>
      <h2>Products</h2>
      <div className='row'>
        {data?.getProducts?.products.map((product: any) => (
          <div key={product._id} className='col-md-4 mb-4'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>{product.title}</h5>
                <p className='card-text'>${product.cost}</p>
                <p className='card-text'>
                                    Available: {product.availableQuantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
