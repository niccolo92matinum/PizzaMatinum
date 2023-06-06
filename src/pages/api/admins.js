import { getAdminId } from '../../services/database'

export default async function handler (request, response) {
  if (request.method === 'GET') {
    try {
      const admins = await getAdminId(request.query.email)

      response.status(200).json(admins)
    } catch (err) {
      response.status(500).send({ message: ['Post not available'], err })
    }
  }
}
