import type {ISessionRepository} from "@repo/domain/repository/session.js";
import type {ISession} from "@repo/domain/entity/session.js";
import {db} from "../../db/sqlite/index.js";
import {sessions} from "../../db/sqlite/schemas/index.js";
import {eq} from "drizzle-orm";
import type {SessionCreateDto} from "@repo/domain/dto/session.dto.js";

export class SessionRepositorySqlite implements ISessionRepository {
    async createSession(session: SessionCreateDto): Promise<ISession> {
        let [returning] = await db.insert(sessions).values(session).returning();
        return returning as ISession;
    }

    async findSessionByToken(token: string): Promise<ISession | null> {
        let [session] = await db.select().from(sessions)
            .where(eq(sessions.token,token)).limit(1)

        return session as ISession;
    }

}