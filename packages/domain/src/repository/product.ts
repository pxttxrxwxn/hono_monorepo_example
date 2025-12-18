import type {IProduct, IProductEntity} from "../entity/product.js";

export interface IProductRepository {
    findAll(): Promise<IProduct[]>;
    findById(id: number): Promise<IProduct | null>;

    create(product: string): Promise<IProduct>;

    update(code: string , product_name: string , cost: number): Promise<IProduct>;

    delete(id: number): Promise<void>;
}