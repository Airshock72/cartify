import { gql, useMutation, useQuery } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast } from 'react-toastify'

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

const ADD_ITEM_TO_CART = gql`
    mutation AddItem($input: AddItemArgs!) {
        addItem(input: $input) {
            _id
            items {
                _id
                product {
                    _id
                    title
                }
                quantity
            }
        }
    }
`

interface Product {
    _id: string
    title: string
    cost: number
    availableQuantity: number
}

interface GetProductsResponse {
    getProducts: {
        products: Product[]
        total: number
    }
}

export default function ProductList() {
  const { data, loading, error } = useQuery<GetProductsResponse>(GET_PRODUCTS)
  const [addItem] = useMutation(ADD_ITEM_TO_CART)

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem({
        variables: {
          input: {
            productId,
            quantity: 1
          }
        }
      })
      toast.success('Product added to cart!')
    } catch (error) {
      console.error('Error adding product to cart:', error)
      toast.error('Error adding product to cart!')
    }
  }

  if (loading)
    return (
      <div className='d-flex justify-content-center mt-5'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    )

  if (error)
    return (
      <div className='text-center text-danger mt-5'>
        <p>Error: {error.message}</p>
        <button className='btn btn-danger' onClick={() => window.location.reload()}>
                    Retry
        </button>
      </div>
    )

  return (
    <div className='container mt-5'>
      <h2 className='mb-4 text-center'>Products</h2>
      <div className='row'>
        {data?.getProducts?.products.map((product) => (
          <div key={product._id} className='col-md-4 mb-4'>
            <div className='card shadow-sm bg-light'>
              <div className='card-body'>
                <h5 className='card-title text-primary'>{product.title}</h5>
                <p className='card-text fw-bold'>${product.cost.toFixed(2)}</p>
                <p className='card-text'>Available: {product.availableQuantity}</p>
                <button
                  className='btn btn-primary'
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
