export interface CartItem {
    _id: string
    product: {
        _id: string
        title: string
        cost: number
        availableQuantity: number
    }
    quantity: number
}

export interface Cart {
    _id: string
    hash: string
    items: Array<CartItem>
}

export interface CardUpdate {
    event: string
    item: CartItem
}

export interface GetProductsResponse {
    getProducts: {
        products: Array<Product>
        total: number
    }
}

interface Product {
    _id: string
    title: string
    cost: number
    availableQuantity: number
}

export interface CartItemForProduct {
    _id: string
    product: {
        _id: string
        title: string
    }
}
