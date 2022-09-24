import bcrypt from 'bcryptjs'

export default class RentSheet {
    private memberId! : string; 
    private helmetId!: number;
    private startLocker! : number;
    private startRoom! : number;
    private startDate! : string;
    private endLocker! : number;
    private endRoom! : number;
    private endDate! : string;
    private status! : number;

    public constructor(init?:Partial<RentSheet>) {
        Object.assign(this, init);
    }

    public getMemberId(): string{
        return this.memberId;
    }

    public setMemberId(memberId: string): RentSheet{
        this.memberId = memberId;
        return this;
    }

    public getHelmetId(): number{
        return this.helmetId;
    }

    public setHelmetId(helmetId: number): RentSheet{
        this.helmetId = helmetId;
        return this;
    }

    public getStartLocker(): number{
        return this.startLocker;
    }

    public setStartLocker(startLocker: number): RentSheet{
        this.startLocker = startLocker;
        return this;
    }

    public getStartRoom(): number{
        return this.startRoom;
    }

    public setStartRoom(startRoom: number): RentSheet{
        this.startRoom = startRoom;
        return this;
    }

    public getStartDate(): string{
        return this.startDate;
    }

    public setStartDate(startDate: string): RentSheet{
        this.startDate = startDate;
        return this;
    }

    public getEndLocker(): number{
        return this.endLocker;
    }

    public setEndLocker(endLocker: number): RentSheet{
        this.endLocker = endLocker;
        return this;
    }

    public getEndRoom(): number{
        return this.endRoom;
    }

    public setEndRoom(endRoom: number): RentSheet{
        this.endRoom = endRoom;
        return this;
    }

    public getEndDate(): string{
        return this.endDate;
    }

    public setEndDate(endDate: string): RentSheet{
        this.endDate = endDate;
        return this;
    }

    public getStatus(): number{
        return this.status;
    }

    public setStatus(status: number): RentSheet{
        this.status = status;
        return this;
    }
}