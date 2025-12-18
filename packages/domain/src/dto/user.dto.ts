// ค่าส่งออก
// dto,request -> service -> repository -> entity

import type {IUserEntity} from "../entity/user.js"
import {createResponseSchema} from "../utils/index.js";
import {z} from "zod";

// ไม่มี password
export interface UserDto extends Omit<IUserEntity, "password"> { }
// ไม่ส่ง id
export interface UserCreateDto extends Omit<IUserEntity, "id"> {
    // เพิ่ม role
    // defaultRole : IRoleEntity ;
    // defaultRole : number ;
}
export interface UserUpdateDto extends IUserEntity { }

// ข้อมูลขาเข้าเซต
export const UserSchema = z.object({
    id : z.number().optional(),
    email : z.string().optional(),
    username : z.string().optional(),
} as Record<keyof  IUserEntity,any>)

export const UserResponseSchema = createResponseSchema(UserSchema)
export const UserListResponseSchema = createResponseSchema(z.array(UserSchema))

