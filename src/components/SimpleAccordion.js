import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useSession } from 'next-auth/react'
import { options } from '../pages/Admin/InsertProducts'
import styles from '../styles/makeorder.module.css'
import Image from 'next/image'

function SimpleAccordion ({ state, setProduct, setModify, modify, insertProductsOnStore, deleteProduct, setSingleProductSelected }) {
  const { data: session } = useSession()

  const deleteProductFromRedux = (productToDelete) => {
    const prodData = state.productsData

    const deleteProduct = prodData[productToDelete.category].filter((product) => {
      return product.id !== productToDelete.id
    })

    prodData[productToDelete.category] = deleteProduct

    const newStateFinal = Object.keys(prodData).map((i) => {
      if (prodData[i].length === 0) {
        delete prodData[i]
      }
      return prodData
    })

    return newStateFinal
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

    parsedIngredient.forEach((num) => {
      const createOptionsObj = options.filter(s => s.value === num)
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

  return (
    <div className="m-2 space-y-2 pt-4">
    { Object.values(state.productsData).map((categoryArr, i) => {
      return (
        <div key={Math.random()}
      className="group flex flex-col gap-2 rounded-lg bg-neutral-50 p-5 text-white"
      tabIndex={i}
      >
      <div className="flex cursor-pointer items-center justify-between">
      <span className='name_category_accordion'>{categoryArr[0]?.category}</span>
      <Image
      src="https://upload.wikimedia.org/wikipedia/commons/9/96/Chevron-icon-drop-down-menu-WHITE.png"
      width={30} height={30}
      alt='icon'
      className="h-2 w-3 transition-all duration-500 group-focus:-rotate-180"

      />
      </div>
      <div
      className="invisible h-auto max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-screen group-focus:opacity-100 group-focus:duration-1000"
      >
        {categoryArr.map((singleObj) => {
          return (
                <div className={styles.accordion_main_div_makeorder} key={singleObj.id}>
                  <div className='grid grid-cols-2 gap-4 '>
                    <div className="">
                    <h1 className=' h1_accordion_title text-stone-700' >{singleObj.title} </h1>

                    </div>
                    <div>
                    <button onClick={ () => { setDataOnClickModifyButton(singleObj); setSingleProductSelected(singleObj) }} className="middle mb-8 mr-8 none center rounded-lg bg-red-600 py-1 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ">Modify</button>
                    <button onClick={() => deleteProductApi(singleObj)} className="middle mb-8 none center rounded-lg bg-red-600 py-1 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all duration-500 hover:scale-125 hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ">Delete</button>
                    </div>
                    <div>

                    </div>

                  </div>

                </div>

          )
        })

        }

      </div>
      </div>
      )
    }) }

    </div>

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
