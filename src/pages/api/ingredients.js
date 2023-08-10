import { getAllIngredientsByAdminId, deleteIngredientAdmin } from '../../services/database'
export default async function handler (request, response) {
  if (request.method === 'GET') {
    try {
      console.log(request.query.adminid, 'pino')
      const ingredients = await getAllIngredientsByAdminId(request.query.adminid)
      const final = ingredients.rows

      response.status(200).json(final)
    } catch (err) {
      response.status(500).send({ message: ['Get not available'], err })
    }
  } else if (request.method === 'DELETE') {
    try {
      const ingredientId = request.query.ingredientid
      console.log(ingredientId, 'gino')

      await deleteIngredientAdmin(ingredientId)

      response.status(200).json('Ingredient Deleted')
    } catch (err) {
      response.status(500).json('Action FAILED')
    }
  }
}
