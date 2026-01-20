import type {ISessionService} from "@repo/domain/service/session.js";
import type {SessionCreateDto, SessionDto} from "@repo/domain/dto/session.dto.js";
import type {UserRepositorySqlite} from "../repository/sqlite/user.js";
import {SessionRepositorySqlite} from "../repository/sqlite/session.js";
import type {ISession} from "@repo/domain/entity/session.js";
import { randomBytes, randomUUID } from 'crypto';

export class SessionService implements ISessionService {

    constructor(private readonly sessionRepository: SessionRepositorySqlite) {

    }

    async createByUserId(user_id: number): Promise<SessionDto> {
        let session : SessionCreateDto = {
            user_id : user_id,
            token : randomUUID()
        }
        return await this.sessionRepository.createSession(session)
    }

    async getUserIdByToken(token: string): Promise<number | null> {
        let data =  await this.sessionRepository.findSessionByToken(token)
        if (!data) {
            return null
        }else {
            return data.user_id
        }
    }

}