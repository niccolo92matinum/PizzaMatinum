import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useSession } from 'next-auth/react'
import {options} from '../pages/Admin/InsertProducts'

function SimpleAccordion ({ state, setProduct, setModify, modify, insertProductsOnStore, deleteProduct, setSingleProductSelected }) {
  const { data: session } = useSession()

  const deleteProductFromRedux = (productToDelete) => {
    const prodData = state.productsData

    const deleteProduct = prodData[productToDelete.category].filter((product) => {
      return product.id !== productToDelete.id
    })

    prodData[productToDelete.category] = deleteProduct

    const newState = { prodData }

    return newState
  }

  // ____________API________start_____
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await fetch(
     `/api/products?idadmin=${state.adminData.ID}`,
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
        return { error: 'get all products failed' }
      }
    }
    getAllProducts()
  }, [])

  const deleteProductApi = async (product) => {
    try {
      const response = await fetch(
        `/api/products?productId=${product.id}`
        ,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: session.accessToken
          }
        }
      )

      const final = await response.json()

      if (final === 'Product Deleted') {
        deleteProduct(deleteProductFromRedux(product))
      }

      return final
    } catch (err) {
      return { error: 'delation failed' }
    }
  }


  /*
  const modifyProductApi = async () => {
    const response = await fetch(
      '/api/products'
      ,
      {
        method: 'PUT',
        'Content-Type': 'application/json',
        Authorization: session.accessToken

      }
    )
  }
*/
  // ____________API________end_____

  const setDataOnClickModifyButton = (singleProduct) => {
    setModify(true)
    const parsedIngredient = JSON.parse(singleProduct.ingredients)

    const vu = []

    parsedIngredient.forEach((num)=>{
    
     const createOptionsObj = options.filter( s => s.value === num)
     vu.push(...createOptionsObj)
  
   })

    setProduct({
      title: singleProduct.title,
      description: singleProduct.description,
      category: singleProduct.category,
      price: singleProduct.price,
      img: singleProduct.img,
      id: singleProduct.id,
      restaurantId: state.adminData.restaurantId,
      ingredients: vu

    })
  }

  const splitAllKeyValueStore = Object.keys(state.productsData).map(key => ({ [key]: state.productsData[key] }))

  /*const ordersSortedByTitle = Object.values(splitAllKeyValueStore).sort(function (a, b) {
    const textA = a.title.toUpperCase()
    const textB = b.title.toUpperCase()
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
  })*/

  console.log( splitAllKeyValueStore,'elle')

  return (
    <>
      {
        splitAllKeyValueStore.map((category) => {
          return (
            <div key={Object.keys(category)[0]}>
            <h2>{Object.keys(category)[0]}</h2>
            {Object.values(category).map((arrCategory) => {
              return (
                  <div key={Math.random()}>
                    {arrCategory.map((singleProduct) => {
                      return (
                        <div key={singleProduct.id} >

                        <p >{singleProduct.title}</p>
                          <button onClick={ () => { setDataOnClickModifyButton(singleProduct); setSingleProductSelected(singleProduct) }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Modify</button>
                          <button onClick={() => deleteProductApi(singleProduct)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                        </div>
                      )
                    })}
                  </div>
              )
            })}
            </div>

          )
        })
      }
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
// ______ACTION______START_____
export const insertProductsOnStore = (data) => ({
  type: 'STORE_PRODUCTS',
  payload: data
})

export const deleteProduct = (data) => ({
  type: 'DELETE_PRODUCT',
  payload: data.prodData

})
// _______ACTION______DONE__________

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {

  insertProductsOnStore,
  deleteProduct
}

export default connect(mapStateToProps, mapDispatchToProps)(SimpleAccordion)

/*
const setDataOnClickModifyButton = (singleProduct) => {

    function dataURLtoFile (dataurl, filename) {
      const arr = dataurl.split(','); const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    }

    // Usage example:

    if (singleProduct.img !== '') {
      const file = dataURLtoFile(singleProduct.img, `${singleProduct.title}.png`)
      setProduct({
        title: singleProduct.title,
        description: singleProduct.description,
        category: singleProduct.category,
        price: singleProduct.price,
        img: file,
        id: singleProduct.id

      })

    }else{

      setProduct({
        title: singleProduct.title,
        description: singleProduct.description,
        category: singleProduct.category,
        price: singleProduct.price,
        id: singleProduct.id

      })
    }
*/
