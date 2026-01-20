import {Hono} from "hono"
import {UserService} from "../services/user.js"
import {UserRepositorySqlite} from "../repository/sqlite/user.js"
import {CreateUserRequest} from "@repo/domain/request/user.js";
import {zValidator} from "@hono/zod-validator"
import type {UserCreateDto, UserDto} from "@repo/domain/dto/user.dto.js";
import {SessionService} from "../services/service.js";
import {SessionRepositorySqlite} from "../repository/sqlite/session.js";
import {LoginRequest} from "@repo/domain/request/login.js";
import type {IUser} from "@repo/domain/entity/user.js";
import {z} from "zod";

const api = new Hono()

let userService = new UserService(new UserRepositorySqlite());
let sessionService = new SessionService(new SessionRepositorySqlite());

const AuthorizationReq = z.object({
    authorization: z.string()
})
api.post('/me',zValidator('header',AuthorizationReq,(result,c)=>{
    if (!result.success) {
        return c.json({ message: 'Invalid Headers' }, 400)
    }
}),async (c)=>{
    let BearerToken = c.req.header('Authorization')
    let [Bearer,token] = BearerToken!.split(' ')
    let user_id = await sessionService.getUserIdByToken(token)

    if(!user_id) {
        return c.json({
            error: "Cannot find user from token"
        },400)
    }
    let user =await  userService.findById(user_id);
    if(user) {
        // user.password = undefined
    }
    return c.json({
        message : "ok",
        token :token,
        user : user,
        user_id : user_id
    })
})

api.post('/login',zValidator('json',LoginRequest,(result,c)=> {
    if (!result.success){
        return c.json({ error: result.error.issues }, 400)
    }
}), async (c)=> {
    const data : z.infer<typeof LoginRequest> = c.req.valid('json')
    let user : UserDto|null = await userService.loginUser(data)
    if(!user) {
        return c.json({ error: "username or password is not correct." }, 400)
    }
    let session = await sessionService.createByUserId(user.id)
    return c.json({
        message : "user login successfully",
        data : session
    })
})


api.get('/users', (c) => {

    let data = userService.findAllUser();
    return c.json({ "message": "Get User List", data: data })
})
let createUserRequest = CreateUserRequest.extend({}).refine((data) => data.password === data.password_confirmation, {
    error: "Passwords do not match",
    path : ["password"],
})
api.post('/users',zValidator("json",createUserRequest, (result, c) => {
        if (!result.success) {
            return c.json({ error: result.error.issues }, 400)
        }
    })
, async (c)=>{

    const data = c.req.valid("json")
    const dto : UserCreateDto = {
        email : data.email,
        password : data.password,
        username : data.username,
    }
    let result =await userService.create(dto);

    return c.json({
        message : "User Created",
        data : result
    })
})



export default api