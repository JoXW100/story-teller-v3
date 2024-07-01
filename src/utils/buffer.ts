import Logger from 'utils/logger'

class RequestBuffer {
    private readonly waitTime: number = 1000
    private requestWorkerTimeout: Record<string, number | null> = {}

    public get requestIsQueued (): boolean {
        return Object.values(this.requestWorkerTimeout).some(x => x !== null)
    }

    public constructor (waitTime: number = 1000) {
        this.waitTime = waitTime
    }

    /** Adds a request to the queue */
    public add<T extends unknown[]>(action: (...args: T) => void, id: string, ...args: T): void {
        const timeout = this.requestWorkerTimeout[id]
        if (timeout != null) {
            clearTimeout(timeout)
        }
        this.requestWorkerTimeout[id] = setTimeout(
            this.handle,
            this.waitTime,
            action, id, ...args
        )
    }

    private readonly handle = (action: (...args: any[]) => void, id: string, ...args: any[]): void => {
        try {
            action(...args)
        } catch (error: unknown) {
            Logger.throw('Buffer.handleRequest', error)
        }
        this.requestWorkerTimeout[id] = null
        delete this.requestWorkerTimeout[id]
    }
}

export default RequestBuffer
