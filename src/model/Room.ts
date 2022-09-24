import bcrypt from 'bcryptjs'

export default class Room {
    private lockerId!: number;
    private roomId! : number;
    private status! : number;

    public constructor(init?:Partial<Room>) {
        Object.assign(this, init);
    }

    public getLockerId(): number{
        return this.lockerId;
    }

    public setLockerId(lockerId: number): Room{
        this.lockerId = lockerId;
        return this;
    }

    public getRoomId(): number{
        return this.roomId;
    }

    public setRoomId(roomId: number): Room{
        this.roomId = roomId;
        return this;
    }

    public getStatus(): number{
        return this.status;
    }

    public setStatus(status: number): Room{
        this.status = status;
        return this;
    }
}