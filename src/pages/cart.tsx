import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import { useState } from 'react'
import Link from 'next/link'

const GET_CART = gql`
    query GetCart {
        getCart {
            _id
            hash
            items {
                _id
                product {
                    _id
                    title
                    cost
                    availableQuantity
                }
                quantity
            }
        }
    }
`

const REMOVE_ITEM_FROM_CART = gql`
    mutation RemoveItem($input: RemoveItemArgs!) {
        removeItem(input: $input) {
            _id
            hash
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

const UPDATE_ITEM_QUANTITY = gql`
    mutation UpdateItemQuantity($input: UpdateItemQuantityArgs!) {
        updateItemQuantity(input: $input) {
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

const CART_ITEM_SUBSCRIPTION = gql`
    subscription CartItemUpdate {
        cartItemUpdate {
            event
            payload {
                _id
                product {
                    _id
                    title
                    cost
                    availableQuantity
                }
                quantity
            }
        }
    }
`

interface CartItem {
    _id: string
    product: {
        _id: string
        title: string
        cost: number
        availableQuantity: number
    }
    quantity: number
}

interface Cart {
    _id: string
    hash: string
    items: Array<CartItem>
}

export default function Cart() {
  const { data, loading, error, refetch } = useQuery<{ getCart: Cart }>(GET_CART, {
    pollInterval: 5000 // Poll every 5 seconds
  })
  const [removeItem] = useMutation(REMOVE_ITEM_FROM_CART)
  const [updateItemQuantity] = useMutation(UPDATE_ITEM_QUANTITY)
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})

  useSubscription(CART_ITEM_SUBSCRIPTION, {
    onData: ({ data }) => {
      const { event } = data.data.cartItemUpdate
      if (event === 'ITEM_OUT_OF_STOCK') {
        refetch().then()
      } else if (event === 'ITEM_QUANTITY_UPDATED') {
        refetch().then()
      }
    }
  })

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeItem({
        variables: {
          input: {
            cartItemId
          }
        },
        update: (cache) => {
          const cartData = cache.readQuery<{ getCart: Cart }>({ query: GET_CART })
          if (cartData) {
            const updatedItems = cartData.getCart.items.filter(item => item._id !== cartItemId)
            cache.writeQuery({
              query: GET_CART,
              data: {
                getCart: {
                  ...cartData.getCart,
                  items: updatedItems
                }
              }
            })
          }
        }
      })
    } catch (error) {
      console.error('Error removing item from cart:', error)
    }
  }

  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      await updateItemQuantity({
        variables: {
          input: {
            cartItemId,
            quantity
          }
        },
        update: (cache) => {
          const cartData = cache.readQuery<{ getCart: Cart }>({ query: GET_CART })
          if (cartData) {
            const updatedItems = cartData.getCart.items.map(item =>
              item._id === cartItemId ? { ...item, quantity } : item
            )
            cache.writeQuery({
              query: GET_CART,
              data: {
                getCart: {
                  ...cartData.getCart,
                  items: updatedItems
                }
              }
            })
          }
        }
      })
    } catch (error) {
      console.error('Error updating item quantity:', error)
    }
  }

  if (loading) {
    return (
      <div className='container mt-5 d-flex justify-content-center align-items-center' style={{ minHeight: '300px' }}>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    )
  }

  if (error) return <p>Error: {error.message}</p>

  return (
    <div className='container mt-5'>
      <h2 className='mb-4 text-center'>Your Cart</h2>

      {data?.getCart?.items.length === 0 ? (
        <div className='card text-center'>
          <div className='card-body bg-warning'>
            <h5 className='card-title'>Your Cart is Empty</h5>
            <p className='card-text'>It looks like you haven&#39;t added any items to your cart yet. Start shopping now!</p>
            <Link href='/' className='btn btn-primary'>Go to Products</Link>
          </div>
        </div>
      ) : (
        data?.getCart?.items.map((item) => (
          <div key={item._id} className='card mb-3'>
            <div className='card-body'>
              <h5 className='card-title'>{item.product.title}</h5>
              <p className='card-text'>${item.product.cost.toFixed(2)}</p>
              <div className='d-flex align-items-center'>
                <input
                  type='number'
                  className='form-control me-2'
                  style={{ width: '100px' }}
                  value={quantities[item._id] || item.quantity}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [item._id]: parseInt(e.target.value)
                    })
                  }
                />
                <button
                  className='btn btn-primary me-2'
                  onClick={() => handleUpdateQuantity(item._id, quantities[item._id] || item.quantity)}
                >
                                    Update Quantity
                </button>
                <button
                  className='btn btn-danger'
                  onClick={() => handleRemoveItem(item._id)}
                >
                                    Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
