import { insertAllProductOnStore, insertProduct , deleteProductByTitle} from '../../services/database'

export default async function handler (request, response) {

  if (request.method === 'GET') {

    try {
        const allProducts = await insertAllProductOnStore(request.query.adminId)

        response.status(200).json({ product: allProducts })
      } catch (err) {
        response.status(500).send({message: ["Get not available"], error: error})
      }


    
  } else if (request.method === 'POST') {

    try {
        const product = request.body

        const addProduct = await insertProduct(product)
    
        response.status(200).json('Product Inserted')
      } catch (err) {
        response.status(500).send({message: ["Post not available"], error: error})
      }

    
  }else if(request.method === 'DELETE') {

    try {
        const product = JSON.parse(request.body)
        
        await deleteProductByTitle(product.productTitle)
       
        //const allProducts = await insertAllProductOnStore(request.query.adminId)
        response.status(200).json('Product Deleted')
      } catch (err) {
       
        response.status().send({message: ["Delation failed "], error: err})
      }

  }else if(request.method === 'PUT'){

    try{

    }catch (err) {

    }
  }
}
