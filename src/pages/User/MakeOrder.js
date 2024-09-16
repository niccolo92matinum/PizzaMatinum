import { useEffect, useState } from 'react'
import styles from '../../styles/makeorder.module.css'
import Navbar from '../../components/Navbar'
import AccordionOrder from '../../components/accordion'
import CardMakeOrder from '../../components/card'
import CategoryList from '../../components/categorylist'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'

function MakeOrder ({ state, insertProductsOnStore, insertIngredientsRedux }) {
  const [productsChoosen, setProductsChoosen] = useState({})
  const [show, setShow] = useState(false)
  const [ingredients, setIngredients] = useState([])
  
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
        setIngredients(final)
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
      
      const categoryToPass = Object.keys(state.productsData)
      
      const productsData = state.productsData
      
      return (
        <>
        
        <Navbar></Navbar>
        
        <div className="grid pt-20  relative mx-auto place-items-center">
        <div>
        <Image
        src="/img/makeimg.svg"
        width={400}
        height={400}
        alt="icon nav"
        />
        </div>
        
        <h1 className="text-due font-bold  text-4xl pt-14">Nome del ristorante</h1>
        </div>
        
        <div className=" flex  overflow-y-scroll  grid-cols-3 place-content-center pt-4">
        
        <div className={styles.container_categories}>
        <CategoryList categoryToPass={categoryToPass}></CategoryList>
        </div>
        <div className={styles.container_accordion_makeorder}>
        
        <AccordionOrder
        showProductOnChoosen={showProductOnChoosen}
        setShow={setShow}
        productsData={productsData}
        
        ></AccordionOrder>
        
        </div>
        
        <div className={styles.main_container_card}>
        <CardMakeOrder
        productsChoosen={productsChoosen}
        setProductsChoosen={setProductsChoosen}
        setShow={setShow}
        show={show}
        ingredients={ingredients}
        ></CardMakeOrder>
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
      