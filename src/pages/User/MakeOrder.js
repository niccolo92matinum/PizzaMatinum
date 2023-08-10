import { useEffect, useState } from 'react'
import styles from '../../styles/makeorder.module.css'
import Navbar from '../../components/Navbar'
import AccordionOrder from '../../components/accordion'
import CardMakeOrder from '../../components/card'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'

function MakeOrder ({ state, insertProductsOnStore, insertIngredientsRedux }) {
  const [productsChoosen, setProductsChoosen] = useState({})
  const [show, setShow] = useState(false)

  const router = useRouter()
  useEffect(() => {
    const redirectIfNoRestaurantChoosen = async () => {
      if (state.restaurantId === 0) {
        router.push('/')
      }
    }
    redirectIfNoRestaurantChoosen()
  }, [])

  const showProductOnChoosen = (product) => {
    setProductsChoosen(product)
  }

  const getAllIngredients = async () => {
    try {
      const response = await fetch(
 `/api/ingredientsUser?restaurantid=${state.restaurantId}`,
 {
   method: 'GET',
   'Content-Type': 'application/json'
 }
      )

      const final = await response.json()

      // inserisco  gli ingredienti nello store redux

      await insertIngredientsRedux(final)

      return final
    } catch (error) {
      return { error: 'Not allowed get Ingredients' }
    }
  }

  const getAllProducts = async () => {
    try {
      const response = await fetch(
        `/api/products?idrestaurant=${state.restaurantId}`,
        {
          method: 'GET',
          'Content-Type': 'application/json'
        }
      )

      const final = await response.json()
      const finalProduct = await convertBufferIngredient(final.product)
      console.log(finalProduct, 'dio porco')
      const prod = await filterProductsByCategory(finalProduct, 'category')

      await insertProductsOnStore(prod)

      return final
    } catch (error) {
      return { error: 'get all products failed' }
    }
  }

  useEffect(() => {
    getAllIngredients()

    getAllProducts()
  }, [])

  const convertBufferIngredient = (objProducts) => {
    Object.values(objProducts).map((singleCategory) => {
      if (singleCategory.ingredients !== null) {
        const buf = singleCategory.ingredients.data

        const str = String.fromCharCode.apply(String, buf)
        const obj = JSON.parse(str)

        singleCategory.ingredients = obj
      }
    })
    return objProducts
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

  return (
        <>
        <Navbar></Navbar>

        <div className='main flex justify-center pt-36 ' >

            <div className="place-content-center  w-1/2  pt-8">
              <div className={styles.container_accordion_makeorder}>
              <AccordionOrder showProductOnChoosen={showProductOnChoosen} setShow={setShow} ></AccordionOrder>
              </div>

            </div>
            <div className="rigth w-1/2 pt-8">
                <CardMakeOrder productsChoosen={productsChoosen} setProductsChoosen={setProductsChoosen} setShow={setShow} show={show}></CardMakeOrder>
            </div>

        </div>

        </>
  )
}

export const insertProductsOnStore = (data) => ({
  type: 'STORE_PRODUCTS',
  payload: data
})

export const insertIngredientsRedux = (data) => ({
  type: 'INSERT_ALL_INGREDIENTS',
  payload: data

})

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  insertProductsOnStore,
  insertIngredientsRedux
}

export default connect(mapStateToProps, mapDispatchToProps)(MakeOrder)
