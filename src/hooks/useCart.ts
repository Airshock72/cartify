import { createRef, Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { ApolloError, useMutation, useQuery, useSubscription } from '@apollo/client'
import { CardUpdate, Cart, CartItem } from '@/types'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { cartRemoveItemSchema, cartUpdateItemQuantitySchema } from '@/helpers'
import { GET_CART } from '@/graphql/query'
import { REMOVE_ITEM_FROM_CART, UPDATE_ITEM_QUANTITY } from '@/graphql/mutation'
import { CART_ITEM_SUBSCRIPTION } from '@/graphql/subscription'

interface UseCart {
    loading: boolean
    error?: ApolloError | undefined,
    quantities: { [p: string]: number }
    setQuantities: Dispatch<SetStateAction<{[p: string]: number }>>
    handleUpdateQuantity: (cartItemId: string, quantity: number) => void
    updatingItemId: string | null
    handleRemoveItem: (cartItemId: string) => void
    removingItemId: string | null
    showModal: boolean
    cartUpdates: Array<CardUpdate>
    handleAcknowledge: () => void
    cartItems: Array<CartItem>
    itemRefs: RefObject<{[p: string]: RefObject<HTMLDivElement | null> }>
}

const useCart = (): UseCart => {
  const { data, loading, error, refetch } = useQuery<{ getCart: Cart }>(GET_CART, { pollInterval: 5000 })
  const [removeItem] = useMutation(REMOVE_ITEM_FROM_CART)
  const [updateItemQuantity] = useMutation(UPDATE_ITEM_QUANTITY)
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null)
  const [cartUpdates, setCartUpdates] = useState<{ event: string; item: CartItem }[]>([])
  const [showModal, setShowModal] = useState(false)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)
  const router = useRouter()
  const [cartItems, setCartItems] = useState(data?.getCart?.items || [])
  const itemRefs = useRef<{ [key: string]: RefObject<HTMLDivElement | null> }>({})

  useSubscription(CART_ITEM_SUBSCRIPTION, {
    onData: ({ data }) => {
      const { event, payload } = data.data.cartItemUpdate
      setCartUpdates((prev) => [...prev, { event, item: payload }])
      setShowModal(true)
      refetch().then()
    }
  })

  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    try {
      cartUpdateItemQuantitySchema.parse({ cartItemId, quantity })

      const cartItem = data?.getCart?.items.find(item => item._id === cartItemId)
      if (cartItem && quantity > cartItem.product.availableQuantity) {
        toast.error(`Only ${cartItem.product.availableQuantity} items are available. Please choose a smaller quantity.`)
        return
      }

      setUpdatingItemId(cartItemId)
      updateItemQuantity({ variables: { input: { cartItemId, quantity } } })
        .then(() => toast.success('Quantity updated successfully!'))
        .catch(() => toast.error('Failed to update quantity.'))
        .finally(() => setUpdatingItemId(null))
    } catch (error) {
      if (error instanceof z.ZodError) toast.error(error.errors[0]?.message)
    }
  }

  const handleRemoveItem = (cartItemId: string) => {
    try {
      cartRemoveItemSchema.parse({ cartItemId })

      setRemovingItemId(cartItemId)
      removeItem({ variables: { input: { cartItemId } } })
        .then(() => {
          toast.success('Item removed successfully!')
          refetch().then()
        })
        .catch(() => {
          toast.error('Failed to remove item.')
        })
        .finally(() => setRemovingItemId(null))
    } catch (error) {
      if (error instanceof z.ZodError) toast.error(error.errors[0]?.message)
    }
  }

  const handleAcknowledge = () => {
    setCartUpdates([])
    setShowModal(false)
  }

  useEffect(() => {
    const token = localStorage.getItem('visitorToken')
    if (!token) {
      router.push('/register').then()
    }
  }, [router])

  useEffect(() => {
    if (data?.getCart?.items) {
      setCartItems(data.getCart.items)
      data.getCart.items.forEach((item) => {
        if (!itemRefs.current[item._id]) {
          itemRefs.current[item._id] = createRef<HTMLDivElement>()
        }
      })
    }
  }, [data])

  return {
    loading,
    error,
    updatingItemId,
    quantities,
    handleUpdateQuantity,
    setQuantities,
    cartUpdates,
    handleRemoveItem,
    removingItemId,
    showModal,
    handleAcknowledge,
    cartItems,
    itemRefs
  }
}

export default useCart
