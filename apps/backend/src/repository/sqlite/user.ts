import type { IUser } from "@repo/domain/entity/user.js";
import type { IUserRepository } from "@repo/domain/repository/user.js";

import { db } from "../../db/sqlite/index.js"
import { users } from "../../db/sqlite/schemas/index.js";
import {and, eq} from "drizzle-orm";

export class UserRepositorySqlite implements IUserRepository {

    async findAll(): Promise<IUser[]> {
        return db.select().from(users) as Promise<IUser[]>
    }
    findById(id: number): Promise<IUser | null> {
        return db.select().from(users).where(eq(users.id, id)).get() as Promise<IUser>
    }
    async create(user: Partial<IUser>): Promise<IUser> {
        const [inserted]  = await db.insert(users)
            .values(user)
            .returning()   // ensures we get the inserted row back
        return inserted as IUser
    }


    update(id: number, user: Partial<IUser>): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }


    async checkUsernameAndPassword(username: string, password: string) {
        let [user] = await db.select().from(users)
            .where(and(
                eq(users.username, username),
                eq(users.password, password)
            )).limit(1)

        return user as IUser
    }
}