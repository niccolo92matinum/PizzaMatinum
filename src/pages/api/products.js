import { insertAllProductOnStore, insertProduct, deleteProductById, modifyProduct } from '../../services/database'

export default async function handler (request, response) {
  if (request.method === 'GET') {
    try {
      const nameColumn = await Object.keys(request.query)[0]
      const nameValue = await Object.values(request.query)[0]
      const allProducts = await insertAllProductOnStore(nameColumn, nameValue)

      response.status(200).json({ product: allProducts })
    } catch (err) {
      response.status(500).send({ message: ['Get not available'], err })
    }
  } else if (request.method === 'POST') {
    try {
      const product = request.body

      await insertProduct(product)

      response.status(200).json('Product Inserted')
    } catch (err) {
      response.status(500).json('Insert FAILED')
    }
  } else if (request.method === 'DELETE') {
    try {
      const product = request.query.productId

      await deleteProductById(product)

      // const allProducts = await insertAllProductOnStore(request.query.adminId)
      response.status(200).json('Product Deleted')
    } catch (err) {
      response.status(500).json('Elimination Failed ')
      // response.status().send({ message: ['Delation failed '], error: err })
    }
  } else if (request.method === 'PATCH') {
    try {
      const product = request.body

      const getOnlyValueIngredient = product.ingredients.map(i => i.value)

      product.ingredients = getOnlyValueIngredient

      await modifyProduct(product)

      response.status(200).json('Product Modified')
    } catch (err) {
      response.status(500).json({ 'Operation FAILED': err })
    }
  }
}
