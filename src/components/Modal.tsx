import { CardUpdate } from '@/types'

interface ModalProps {
    cartUpdates: Array<CardUpdate>
    handleAcknowledge: () => void
}

const Modal = ({ cartUpdates, handleAcknowledge  }: ModalProps) => (
  <div className='modal fade show d-block' tabIndex={-1} role='dialog'>
    <div className='modal-dialog'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h5 className='modal-title'>Cart Update</h5>
        </div>
        <div className='modal-body'>
          {cartUpdates.map(({ event, item }) => (
            <p key={item._id}>
              {item.product.title} - {event === 'ITEM_OUT_OF_STOCK' ? 'Out of stock' : 'Quantity updated'}
            </p>
          ))}
        </div>
        <div className='modal-footer'>
          <button className='btn btn-primary' onClick={handleAcknowledge}>OK</button>
        </div>
      </div>
    </div>
  </div>
)

export default Modal
