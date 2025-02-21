import { gql } from '@apollo/client'

export const CART_ITEM_SUBSCRIPTION = gql`
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
