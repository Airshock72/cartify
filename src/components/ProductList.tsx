import useProductList from '@/hooks/useProductList'
import ProductListLoading from '@/components/ProductListLoading'
import ProductListError from '@/components/ProductListError'

const ProductList = () => {
  const {
    loading,
    error,
    data,
    addedToCart,
    handleAddToCart,
    loadingStates
  } = useProductList()

  if (loading) return <ProductListLoading />

  if (error) return <ProductListError message={error.message} />

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
                  <button className='btn btn-danger' disabled>
                    <i className='bi bi-x-circle'></i> Out of Stock
                  </button>
                ) : (
                  <button
                    className={`btn ${addedToCart.includes(product._id) ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => handleAddToCart(product._id)}
                    disabled={loadingStates[product._id] || addedToCart.includes(product._id)}
                  >
                    {loadingStates[product._id] ? (
                      <>
                        <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                                  Adding...
                      </>
                    ) : addedToCart.includes(product._id) ? (
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

export default ProductList
