import type {ProductCreateDto, ProductDto} from "../dto/product.dto.js";

export interface IProductService {

    findAllUser() : Promise<ProductDto[]>
    create(productDto : ProductCreateDto) : Promise<ProductDto>
}