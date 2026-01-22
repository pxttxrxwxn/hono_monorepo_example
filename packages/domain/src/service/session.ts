import {SessionDto} from "../dto/session.dto";

export interface ISessionService {

    createByUserId(user_id : number): Promise<SessionDto>
    getUserIdByToken(token :string): Promise<number | null>

}