import type {IUserEntity} from "@repo/domain/entity/user.js";
import { int, sqliteTable, text, type SQLiteColumnBuilderBase } from "drizzle-orm/sqlite-core";
import type {ISession} from "@repo/domain/entity/session.js";

const userSchema: Record<keyof IUserEntity, SQLiteColumnBuilderBase> = {
    id: int().primaryKey({ autoIncrement: true }),
    username: text().unique().notNull(),
    password: text().notNull(),
    email: text().notNull().unique(),
}

export const users = sqliteTable("users_table", userSchema);

const sessionSchema : Record<keyof ISession, SQLiteColumnBuilderBase> = {
    id : int().primaryKey({autoIncrement : true}),
    token : text().notNull(),
    user_id : int().notNull().references(()=> users.id),
}

export const sessions = sqliteTable("sessions_table", sessionSchema);