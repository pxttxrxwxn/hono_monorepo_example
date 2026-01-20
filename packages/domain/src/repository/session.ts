import type {ISession} from "../entity/session.js";
import type {SessionCreateDto} from "../dto/session.dto.js";

export interface ISessionRepository {
    createSession(user: SessionCreateDto): Promise<ISession>
    findSessionByToken(token: string): Promise<ISession | null>

}