import type { IUserService } from "@repo/domain/service/user.js";
import  { type UserRepositorySqlite } from "../repository/sqlite/user.js";
import type {UserCreateDto, UserDto} from "@repo/domain/dto/user.dto.js";
import type {LoginRequest} from "@repo/domain/request/login.js";
import {z} from "zod";

export class UserService implements IUserService {
    constructor(private readonly userRepository: UserRepositorySqlite) {

    }

    async findById(userId: number): Promise<UserDto|null> {
        let user =  await this.userRepository.findById(userId)
        if (!user) return null;
        return {
            ...user,
            password : undefined
        }as UserDto
    }
    async findAllUser(): Promise<UserDto[]> {
        const res = await this.userRepository.findAll();
        return res.map((r): UserDto => ({
            id: r.id,
            email: r.email,
            username: r.username
        }));
    }

    create(userDto: UserCreateDto): Promise<UserDto> {
        return this.userRepository.create({
            username : userDto.username,
            password : userDto.password,
            email : userDto.email
        })
    }

    async loginUser(data : z.infer<typeof LoginRequest>): Promise<UserDto|null> {
        return await this.userRepository.checkUsernameAndPassword(data.username,data.password)
    }
}