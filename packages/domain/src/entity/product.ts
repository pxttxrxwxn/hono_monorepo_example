export interface IProduct {
    id : number
    code : string
    product_name : string
    cost : number
    created_at : Date
    updated_at : Date
    is_published : boolean
}
export interface IProductEntity extends Partial<IProduct> {}