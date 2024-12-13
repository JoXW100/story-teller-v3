const Logger = {
    log (sender: string, value: unknown, ...extra: unknown[]): void {
        if (process.env.NODE_ENV !== 'development') return
        console.log(`[${this.time}]: ${sender} →`, value, ...extra)
    },

    warn (sender: string, value: unknown, ...extra: unknown[]): void {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`[${this.time}]: ${sender} →`, value, ...extra)
        } else {
            console.warn(String(value))
        }
    },

    error (sender: string, value: unknown, ...extra: unknown[]): void {
        if (process.env.NODE_ENV === 'development') {
            console.error(`[${this.time}]: ${sender} →`, value, ...extra)
        } else {
            console.error(String(value))
        }
    },

    throw (sender: string, value: unknown, ...extra: unknown[]): void {
        if (process.env.NODE_ENV === 'development') {
            console.error(`[${this.time}]: ${sender} →`, value, ...extra)
            throw value
        } else {
            console.error(String(value))
        }
    },

    get time (): string {
        const now: Date = new Date()
        const milliseconds = now.getMilliseconds()
        const msText = milliseconds.toString()
        const timeText = now.toLocaleString('sv-Se')
        return `${timeText}.${msText}${'0'.repeat(3 - msText.length)}`
    }
} as const

export default Logger
