import Link from 'next/link'
import useCart from '@/hooks/useCart'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'

const CartModule = () => {
  const {
    data,
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
    handleAcknowledge
  } = useCart()

  if (loading) return <Loading />

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
                <span className='fw-bold'>Price: </span>${item.product.cost.toFixed(2)}
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
                  disabled={updatingItemId === item._id}
                >
                  {updatingItemId === item._id && (
                    <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                  )}
                                    Update Quantity
                </button>
                <button
                  className='btn btn-danger'
                  onClick={() => handleRemoveItem(item._id)}
                  disabled={removingItemId === item._id}
                >
                  {removingItemId === item._id && (
                    <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                  )}
                    Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      {showModal && <Modal cartUpdates={cartUpdates} handleAcknowledge={handleAcknowledge} />}
    </div>
  )
}


export default CartModule
