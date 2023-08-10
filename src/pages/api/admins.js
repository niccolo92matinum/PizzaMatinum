import { getAdminId, addIngredientsByAdmin } from '../../services/database'

export default async function handler (request, response) {
  if (request.method === 'GET') {
    try {
      const admins = await getAdminId(request.query.email)

      response.status(200).json(admins)
    } catch (err) {
      response.status(500).send({ message: ['Post not available'], err })
    }
  } else if (request.method === 'POST') {
    try {
      const ingredient = request.body

      const getIngresient = await addIngredientsByAdmin(ingredient)

      response.status(200).json(getIngresient)
    } catch (err) {
      response.status(500).send({ message: ['Insert Failed'], err })
    }
  }
}
