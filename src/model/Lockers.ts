import bcrypt from 'bcryptjs'

export default class Locker {
    private lockerId!: number;
    private totalCapacity! : number;
    private currentCapacity! : number;
    private locationX! : number;
    private locationY! : number;

    public constructor(init?:Partial<Locker>) {
        Object.assign(this, init);
    }

    public getLockerId(): number{
        return this.lockerId;
    }

    public setLockerId(lockerId: number): Locker{
        this.lockerId = lockerId;
        return this;
    }

    public getTotalCapacity(): number{
        return this.totalCapacity;
    }

    public setTotalCapacity(totalCapacity: number): Locker{
        this.totalCapacity = totalCapacity;
        return this;
    }

    public getCurrentCapacity(): number{
        return this.currentCapacity;
    }

    public setCurrentCapacity(currentCapacity: number): Locker{
        this.currentCapacity = currentCapacity;
        return this;
    }

    public getLocationX(): number{
        return this.locationX;
    }

    public setLocationX(locationX: number): Locker{
        this.locationX = locationX;
        return this;
    }

    public getLocationY(): number{
        return this.locationY;
    }

    public setLocationY(locationY: number): Locker{
        this.locationY = locationY;
        return this;
    }
}