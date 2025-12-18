import type {IProduct, IProductEntity} from "../entity/product.js";

export interface IProductRepository {
    findAll(): Promise<IProductEntity>;
    findById(id: number): Promise<IProductEntity>;

    create(product_name: IProduct): Promise<IProductEntity>;

    update(code: string , product_name: Promise<IProductEntity> , cost: number): Promise<IProductEntity>;

    delete(id: number): Promise<boolean>;
}