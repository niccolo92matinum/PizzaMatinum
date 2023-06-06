
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useSession } from 'next-auth/react'

function SimpleAccordion ({ state, setShowModal, insertProductsOnStore, deleteProduct }) {
  
  const { data: session } = useSession()

const deleteProductFromRedux = (productToDelete) =>{
  const prodData = state.productsData

  const deleteProduct = prodData[productToDelete.category].filter((product)=>{

    return product.id !==  productToDelete.id
   })
   
   prodData[productToDelete.category] = deleteProduct 

   const newState = {prodData}

return newState

   
   
}

  
//____________API________start_____
  useEffect(() => {
   
    const getAllProducts = async () => {
    
      try {
        const response = await fetch(
     `/api/products?adminId=${state.adminData.ID}`,
     {
       method: 'GET',
       'Content-Type': 'application/json',
       Authorization: session.accessToken
     }
        )

        const final = await response.json()

        const prod = await filterProductsByCategory(final.product, 'category')

        await insertProductsOnStore(prod)

        return final
      } catch (error) {
        return {error:'get all products failed'}
      }
    }
      getAllProducts()

  }, [])


  const deleteProductApi = async (product) =>{

    try{
      const response = await fetch(
        `/api/products`
        ,
      {
         method: 'DELETE',
        'Content-Type': 'application/json',
       Authorization: session.accessToken,
       body: JSON.stringify({
        productTitle:product.title
       })
      }
      )

      const final = await response.json()

       
       deleteProduct(deleteProductFromRedux(product))
   
      return final

    }catch(err){
      return {error:'delation failed'}
    }

  }



  const modifyProductApi = async () =>{
    const response = await fetch(
      `/api/products`
      ,
    {
       method: 'PUT',
      'Content-Type': 'application/json',
     Authorization: session.accessToken,
   
    }
    )

 

  
  }

//____________API________end_____


  const splitAllKeyValueStore = Object.keys(state.productsData).map(key => ({ [key]: state.productsData[key] }))

  return (
  <>
   <div>
    {
     splitAllKeyValueStore.map((category) => {
       return (
       <>
        <div>
         <h2>{Object.keys(category)[0]}</h2>
         {Object.values(category).map((arrCategory) => {
           return (
           <>
            <div>
             {arrCategory.map((singleProduct) => {
              
               return (
               <>
                <p key={Math.random()}> {singleProduct.title} <button  onClick={() => setShowModal(true)}  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Modify</button> <button onClick={()=>deleteProductApi(singleProduct)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Delete</button></p>
               </>
               )
             })}

            </div>
           </>
           )
         })
         }
        </div>
       </>

       )
     })

    }
   </div>
  </>
  )
}

function filterProductsByCategory (obj, prop) {
  return obj.reduce(function (acc, item) {
    const key = item[prop]

    if (!acc[key]) {
      acc[key] = []
    }

    acc[key].push(item)

    return acc
  }, {})
}
//______ACTION______START_____
export const insertProductsOnStore = (data) => ({
  type: 'STORE_PRODUCTS',
  payload: data
})



 export const deleteProduct = (data) => ({
  type: 'DELETE_PRODUCT',
  payload: data.prodData

 })
//_______ACTION______DONE__________

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {

  insertProductsOnStore,
  deleteProduct
}

export default connect(mapStateToProps, mapDispatchToProps)(SimpleAccordion)

