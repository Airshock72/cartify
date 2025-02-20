import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'

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
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null) // Track updating item
  const [cartUpdates, setCartUpdates] = useState<{ event: string; item: CartItem }[]>([])
  const [showModal, setShowModal] = useState(false)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null) // Track removing item

  useSubscription(CART_ITEM_SUBSCRIPTION, {
    onData: ({ data }) => {
      const { event, payload } = data.data.cartItemUpdate
      setCartUpdates((prev) => [...prev, { event, item: payload }])
      setShowModal(true)
      refetch().then()
    }
  })

  const handleRemoveItem = (cartItemId: string) => {
    setRemovingItemId(cartItemId)
    removeItem({ variables: { input: { cartItemId } } })
      .then(() => {
        toast.success('Item removed successfully!')
      })
      .catch(() => {
        toast.error('Failed to remove item.')
      })
      .finally(() => setRemovingItemId(null))
  }

  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    setUpdatingItemId(cartItemId)
    updateItemQuantity({ variables: { input: { cartItemId, quantity } } })
      .then(() => {
        toast.success('Quantity updated successfully!')
      })
      .catch(() => {
        toast.error('Failed to update quantity.')
      })
      .finally(() => setUpdatingItemId(null))
  }

  const handleAcknowledge = () => {
    setCartUpdates([])
    setShowModal(false)
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
              <p className='card-text'>
                <span className='fw-bold'>Price: </span>
               ${item.product.cost.toFixed(2)}
              </p>
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
                  disabled={updatingItemId === item._id} // Disable button if updating
                >
                  {updatingItemId === item._id && <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>}
                                    Update Quantity
                </button>
                <button
                  className='btn btn-danger'
                  onClick={() => handleRemoveItem(item._id)}
                  disabled={removingItemId === item._id}
                >
                  {removingItemId === item._id && <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>}
                    Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className='modal fade show d-block' tabIndex={-1} role='dialog'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Cart Update</h5>
              </div>
              <div className='modal-body'>
                {cartUpdates.map(({ event, item }) => (
                  <p key={item._id}>{item.product.title} - {event === 'ITEM_OUT_OF_STOCK' ? 'Out of stock' : 'Quantity updated'}</p>
                ))}
              </div>
              <div className='modal-footer'>
                <button className='btn btn-primary' onClick={handleAcknowledge}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
