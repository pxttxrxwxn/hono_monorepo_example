import { describeRoute, resolver } from "hono-openapi";
import { createValidator } from "../utils/index.js";
import {Hono} from "hono"
import {UserService} from "../services/user.js"
import {UserRepositorySqlite} from "../repository/sqlite/user.js"
import {CreateUserRequest} from "@repo/domain/request/user.js";
import {zValidator} from "@hono/zod-validator"
import {
    type UserCreateDto,
    type UserDto,
    UserListResponseSchema,
    UserResponseSchema
} from "@repo/domain/dto/user.dto.js";
import {SessionService} from "../services/service.js";
import {SessionRepositorySqlite} from "../repository/sqlite/session.js";
import {LoginRequest} from "@repo/domain/request/login.js";
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
    let session = await sessionService.createByUserId(user.id!)
    return c.json({
        message : "user login successfully",
        data : session
    })
})


api.get('/users',
    describeRoute({
        description: "List of users",

        responses: {
            200: {
                description: "Successful response",
                content: {
                    "application/json": {
                        schema: resolver(UserListResponseSchema),
                        example: {

                            "message": "Get User List",
                            "data": []
                        }
                    },

                },

            }
        }
    }),
    async (c) => {

        let data = await userService.findAllUser();
        return c.json({ "message": "Get User List", data: data })
    })


let createUserRequest = CreateUserRequest.extend({}).refine((data) => data.password === data.password_confirmation, {
    error: "Passwords do not match",
    path: ["password"],
})

api.post('/users',
    describeRoute({
        description: "Create User",
        requestBody: {
            content: {
                "application/json": {
                    schema: (await resolver(CreateUserRequest).toOpenAPISchema()).schema,
                    example: {
                        "username": "admin",
                        "password": "admin",
                        "password_confirmation": "admin",
                        "email": "admin@admin.com"
                    }
                }
            }
        },
        responses: {
            200: {
                description: "Successful response",
                content: {
                    "application/json": {
                        schema: resolver(UserResponseSchema),
                        example: {
                            message: "User Created",
                            data: {
                                id: 1,
                                username: 'admin123',
                                email: 'admin123@admin.com'
                            } as UserDto
                        }
                    }
                }
            }
        }
    }),
    createValidator("json", createUserRequest)
    , async (c) => {

        const data = c.req.valid("json")
        const dto: UserCreateDto = {
            email: data.email,
            password: data.password,
            username: data.username,
        }
        let result = await userService.create(dto);

        return c.json({
            message: "User Created",
            data: result
        })
    })


export default api

