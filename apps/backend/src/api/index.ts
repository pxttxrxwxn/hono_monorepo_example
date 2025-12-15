import {UserService} from "../services/user.js"
import {UserRepositorySqlite} from "../repository/sqlite/user.js"
import {CreateUserRequest} from "@repo/domain/request/user.js";
import {zValidator} from "@hono/zod-validator"
import {type UserCreateDto, UserListResponseSchema, UserResponseSchema} from "@repo/domain/dto/user.dto.js";
import {Hono} from 'hono'
import {describeRoute, resolver} from "hono-openapi";
import {createValidator} from "../utils/index.js";

let userService = new UserService(new UserRepositorySqlite());

const api = new Hono()


api.get('/users',
    describeRoute({
        description : "List of users",
        responses : {
            200 : {
                description : "Successful response",
                content : {
                    "application/json": {
                        schema : resolver(UserListResponseSchema)
                    }
                }
            }
        }
    }),
    (c) => {

        let data = userService.findAllUser();
        return c.json({"message": "Get User List", data: data})
    })


let createUserRequest = CreateUserRequest.extend({}).refine((data) => data.password === data.password_confirmation, {
    error: "Passwords do not match",
    path: ["password"],
})

api.post('/users',
    describeRoute({
        description : "Create User",
        responses : {
            200 : {
                description : "Successful response",
                content : {
                    "application/json": {
                        schema : resolver(UserResponseSchema)
                    }
                }
            }
        }
    }),
    createValidator("json",createUserRequest)
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

