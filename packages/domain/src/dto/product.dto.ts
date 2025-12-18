import type {IProductEntity} from "../entity/product.js"
import {createResponseSchema} from "../utils/index.js";
import {z} from "zod";

export interface ProductDto extends Omit<IProductEntity, ""> { }
export interface ProductCreateDto extends Omit<IProductEntity, "id"> { }
export interface ProductUpdateDto extends IProductEntity { }

export const ProductSchema = z.object({
    id : z.number().optional(),
    code : z.string().optional(),
    product_name : z.string().optional(),
    cost : z.number().optional(),
    is_published : z.boolean().optional(),
} as Record<keyof  IProductEntity,any>)

export const ProductResponseSchema = createResponseSchema(ProductSchema)
export const ProductListResponseSchema = createResponseSchema(z.array(ProductSchema))