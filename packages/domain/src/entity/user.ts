// ต้องการเก็บข้อมูลอะไรลงในdata base
export interface IRole { }
export interface IRoleEntity extends Partial<IRole> { }
export interface IUser {
    id: number
    username: string
    email: string
    password: string
}
export interface IUserEntity extends Partial<IUser> {
    // roles : IRoleEntity[]
}
