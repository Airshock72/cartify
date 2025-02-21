import { gql } from '@apollo/client'

export const GET_CART = gql`
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

export const GET_PRODUCTS = gql`
    query GetProducts {
        getProducts {
            products {
                _id
                title
                cost
                availableQuantity
            }
            total
        }
    }
`

export const GET_CART_FOR_PRODUCTS = gql`
    query GetCart {
        getCart {
            _id
            items {
                _id
                product {
                    _id
                }
            }
        }
    }
`
