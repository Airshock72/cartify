import { gql } from '@apollo/client'

export const REMOVE_ITEM_FROM_CART = gql`
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

export const UPDATE_ITEM_QUANTITY = gql`
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

export const REGISTER_MUTATION = gql`
    mutation Register {
        register {
            _id
            token
        }
    }
`

export const ADD_ITEM_TO_CART = gql`
    mutation AddItem($input: AddItemArgs!) {
        addItem(input: $input) {
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
