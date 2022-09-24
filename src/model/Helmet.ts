import bcrypt from 'bcryptjs'

export default class Helmet {
    private helmetId!: number;
    private lockerId! : number;
    private roomId! : number;
    private status! : number;

    public constructor(init?:Partial<Helmet>) {
        Object.assign(this, init);
    }

    public getHelmetId(): number{
        return this.helmetId;
    }

    public setHelmetId(helmetId: number): Helmet{
        this.helmetId = helmetId;
        return this;
    }
    
    public getLockerId(): number{
        return this.lockerId;
    }

    public setLockerId(lockerId: number): Helmet{
        this.lockerId = lockerId;
        return this;
    }

    public getRoomId(): number{
        return this.roomId;
    }

    public setRoomId(roomId: number): Helmet{
        this.roomId = roomId;
        return this;
    }

    public getStatus(): number{
        return this.status;
    }

    public setStatus(status: number): Helmet{
        this.status = status;
        return this;
    }
}