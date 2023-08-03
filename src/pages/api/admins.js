import { getAdminId, addIngredientsByAdmin } from '../../services/database'

export default async function handler (request, response) {
  if (request.method === 'GET') {
    try {
      const admins = await getAdminId(request.query.email)

      response.status(200).json(admins)
    } catch (err) {
      response.status(500).send({ message: ['Post not available'], err })
    }
  } else if (request.method === 'PATCH') {
    try {
      const adminId = request.body.id
      const arrIngredients = request.body.ingredients

      const getIngresients = await addIngredientsByAdmin(adminId, arrIngredients)

      response.status(200).json(getIngresients)
    } catch (err) {
      response.status(500).send({ message: ['Insert Failed'], err })
    }
  }
}
