import type { ISession } from "../entity/session.js"


export interface SessionDto extends ISession { }
export interface SessionCreateDto extends Omit<ISession, "id"> { }


