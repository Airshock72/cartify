export interface CartItem {
    _id: string
    product: {
        _id: string
        title: string
        cost: number
    }
    quantity: number
}
