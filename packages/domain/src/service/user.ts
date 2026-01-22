import type {UserCreateDto, UserDto} from "../dto/user.dto.js";

export interface IUserService {

    //UserDtoค่าfontrendต้องการ
    findAllUser() : Promise<UserDto[]>
    create(userDto : UserCreateDto) : Promise<UserDto>
    findById(userId : number) : Promise<UserDto|null>
}