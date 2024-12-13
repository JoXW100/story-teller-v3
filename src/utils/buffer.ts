import Logger from 'utils/logger'

class RequestBuffer {
    private readonly waitTime: number = 1000
    private requestWorkerTimeout = new Map<string, number>()

    public get requestIsQueued (): boolean {
        return Object.values(this.requestWorkerTimeout).some(x => x !== null)
    }

    public constructor (waitTime: number = 1000) {
        this.waitTime = waitTime
    }

    /** Adds a request to the queue */
    public add<T extends unknown[]>(action: (...args: T) => void, id: string, ...args: T): void {
        const timeout = this.requestWorkerTimeout.get(id)
        if (timeout !== undefined) {
            clearTimeout(timeout)
        }
        const newTimeout = setTimeout(
            this.handle,
            this.waitTime,
            action, id, ...args
        )
        this.requestWorkerTimeout.set(id, newTimeout)
    }

    private readonly handle = (action: (...args: never[]) => void, id: string, ...args: never[]): void => {
        try {
            action(...args)
        } catch (error: unknown) {
            Logger.throw('Buffer.handleRequest', error)
        }
        this.requestWorkerTimeout.delete(id)
    }
}

export default RequestBuffer
