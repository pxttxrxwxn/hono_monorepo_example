//อธิบาย input ว่าเอาอะไรเข้ามา
import type {ProductCreateDto, ProductDto} from "../dto/product.dto.js";

export interface IProductService {

    // ไม่รับข้อมูลแต่ให้ส่งผลลัพท์เป็น productdto
    findAllProduct() : Promise<ProductDto[]>
    // สร้าง product และส่งผลลัพท์เป็น productdto
    create(productDto : ProductCreateDto) : Promise<ProductDto>
}