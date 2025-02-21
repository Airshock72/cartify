const ProductListError = ({ message }: { message: string }) => (
  <div className='text-center text-danger mt-5'>
    <p>Error: {message}</p>
    <button className='btn btn-danger' onClick={() => window.location.reload()}>
                Retry
    </button>
  </div>
)

export default ProductListError
