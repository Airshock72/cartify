import { CSSTransition, TransitionGroup } from 'react-transition-group'
import useCart from '@/hooks/useCart'
import Loading from '@/components/Loading'
import Link from 'next/link'
import Modal from '@/components/Modal'

const CartModule = () => {
  const {
    loading,
    error,
    quantities,
    setQuantities,
    handleUpdateQuantity,
    updatingItemId,
    handleRemoveItem,
    removingItemId,
    showModal,
    cartUpdates,
    handleAcknowledge,
    cartItems,
    itemRefs
  } = useCart()

  if (loading) return <Loading />

  if (error) return <p className='text-danger text-center mt-5'>Error: {error.message}</p>

  return (
    <div className='container mt-5'>
      <h2 className='mb-4 text-center fw-bold text-primary'>Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className='card text-center border-0 shadow-lg'>
          <div className='card-body bg-light py-5'>
            <h5 className='card-title text-muted'>Your Cart is Empty</h5>
            <p className='card-text text-muted mb-4'>
                  It looks like you haven&#39;t added any items to your cart yet. Start shopping now!
            </p>
            <Link href='/' className='btn btn-primary btn-lg'>
                  Go to Products
            </Link>
          </div>
        </div>
      ) : (
        <TransitionGroup component={null}>
          {cartItems.map((item) => (
            <CSSTransition
              key={item._id}
              timeout={300}
              classNames='cart-item'
              nodeRef={itemRefs.current[item._id]}
            >
              <div
                ref={itemRefs.current[item._id]} // Attach the ref to the DOM element
                className='card mb-3 border-0 shadow-sm'
              >
                <div className='card-body'>
                  <div className='row align-items-center'>
                    <div className='col-md-8'>
                      <h5 className='card-title fw-bold text-dark'>{item.product.title}</h5>
                      <p className='card-text text-muted'>
                        <span className='fw-bold'>Price: </span>${item.product.cost.toFixed(2)}
                      </p>
                    </div>
                    <div className='col-md-4'>
                      <div className='d-flex align-items-center justify-content-end'>
                        <input
                          type='number'
                          className='form-control me-2 text-center'
                          style={{ width: '80px' }}
                          value={quantities[item._id] || item.quantity}
                          onChange={(e) =>
                            setQuantities({
                              ...quantities,
                              [item._id]: parseInt(e.target.value)
                            })
                          }
                          min='1'
                        />
                        <button
                          className='btn btn-outline-primary btn-sm me-2'
                          onClick={() => handleUpdateQuantity(item._id, quantities[item._id] || item.quantity)}
                          disabled={updatingItemId === item._id}
                        >
                          {updatingItemId === item._id ? (
                            <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                          ) : (
                            'Update'
                          )}
                        </button>
                        <button
                          className='btn btn-outline-danger btn-sm'
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={removingItemId === item._id}
                        >
                          {removingItemId === item._id ? (
                            <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                          ) : (
                            'Remove'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      )}

      {cartItems.length > 0 && (
        <div className='text-end mt-4'>
          <h4 className='fw-bold text-dark'>
                Total: $
            {cartItems
              .reduce((total, item) => total + item.product.cost * (quantities[item._id] || item.quantity), 0)
              .toFixed(2)}
          </h4>
          <button className='btn btn-primary btn-lg mt-3'>Checkout</button>
        </div>
      )}

      {showModal && <Modal cartUpdates={cartUpdates} handleAcknowledge={handleAcknowledge} />}
    </div>
  )
}

export default CartModule
