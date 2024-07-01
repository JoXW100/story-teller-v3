import { type NextApiRequest, type NextApiResponse } from 'next'

export default function handler (req: NextApiRequest, res: NextApiResponse): void {
    const { method } = req

    if (method === 'GET') {
        res.status(200).json({})
    }
}
