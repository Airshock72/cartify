import { ApolloError, useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { CartItemForProduct, GetProductsResponse } from '@/types'
import { cartAddItemSchema } from '@/helpers'
import { GET_CART_FOR_PRODUCTS, GET_PRODUCTS } from '@/graphql/query'
import { ADD_ITEM_TO_CART } from '@/graphql/mutation'

interface UseProductList {
    loading: boolean
    error?: ApolloError | undefined
    data: GetProductsResponse | undefined
    addedToCart: Array<string>
    handleAddToCart: (productId: string) => void
    loadingStates: Record<string, boolean>
}

const useProductList = (): UseProductList => {
  const { data, loading, error } = useQuery<GetProductsResponse>(GET_PRODUCTS)
  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART_FOR_PRODUCTS)
  const [addItem] = useMutation(ADD_ITEM_TO_CART)
  const [addedToCart, setAddedToCart] = useState<Array<string>>([])
  const [outOfStock, setOutOfStock] = useState<Array<string>>([])
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const handleAddToCart = async (productId: string) => {
    setLoadingStates((prev) => ({ ...prev, [productId]: true }))
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
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }))
    }
  }

  useEffect(() => {
    if (cartData?.getCart?.items) {
      const cartItemIds = cartData.getCart.items.map((item: CartItemForProduct) => item.product._id)
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

  return {
    data,
    loading,
    error,
    addedToCart,
    handleAddToCart,
    loadingStates
  }
}

export default useProductList
