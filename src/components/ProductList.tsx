import { gql, useMutation, useQuery } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import validator from 'validator'

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

const GET_CART = gql`
    query GetCart {
        getCart {
            _id
            items {
                _id
                product {
                    _id
                }
            }
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

interface CartItem {
    _id: string
    product: {
        _id: string
        title: string
    }
}

export const cartAddItemSchema = z.object({
  productId: z
    .string()
    .refine((input) => validator.isMongoId(input), 'Invalid product ID'),
  quantity: z.number().min(1)
})


export default function ProductList() {
  const { data, loading, error } = useQuery<GetProductsResponse>(GET_PRODUCTS)
  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART)
  const [addItem] = useMutation(ADD_ITEM_TO_CART)
  const [addedToCart, setAddedToCart] = useState<string[]>([])
  const [outOfStock, setOutOfStock] = useState<string[]>([])

  useEffect(() => {
    if (cartData?.getCart?.items) {
      const cartItemIds = cartData.getCart.items.map((item: CartItem) => item.product._id)
      setAddedToCart(cartItemIds)
    }
  }, [cartData])

  useEffect(() => {
    if (data?.getProducts?.products) {
      const outOfStockIds = data.getProducts.products
        .filter(product => product.availableQuantity === 0)
        .map(product => product._id)

      if (outOfStockIds.length > 0) setOutOfStock(outOfStockIds)
    }
  }, [data])

  const handleAddToCart = async (productId: string) => {
    if (addedToCart.includes(productId)) {
      toast.info('Product already in the cart!')
      return
    }

    if (outOfStock.includes(productId)) {
      toast.error('This product is out of stock!')
      return
    }

    try {
      const input = { productId, quantity: 1 }
      cartAddItemSchema.parse(input)

      await addItem({
        variables: {
          input: {
            productId,
            quantity: 1
          }
        }
      })
      setAddedToCart((prev) => [...prev, productId])
      toast.success('Product added to cart!')
      await refetchCart()
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0]?.message)
      } else {
        console.error('Error adding product to cart:', error)
        toast.error('Error adding product to cart!')
      }
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

                {product.availableQuantity === 0 ? (
                  <button
                    className='btn btn-danger'
                    disabled
                  >
                    <i className='bi bi-x-circle'></i> Out of Stock
                  </button>
                ) : (
                  <button
                    className={`btn ${addedToCart.includes(product._id) ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => handleAddToCart(product._id)}
                  >
                    {addedToCart.includes(product._id) ? (
                      <>
                        <i className='bi bi-check-circle'></i> Added
                      </>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
