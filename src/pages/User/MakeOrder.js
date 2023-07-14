import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import AccordionOrder from '../../components/accordion'
import CardMakeOrder from '../../components/card'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'

function MakeOrder ({ state,insertProductsOnStore }) {
  const [productsChoosen, setProductsChoosen] = useState({})

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


 /*useEffect(()=>{

    if(Object.keys(state.adminData).length === 0){

      const getAllProducts = async () => {
        try {
          const response = await fetch(
       `/api/products?idrestaurant=${state.restaurantId}`,
       {
         method: 'GET',
         'Content-Type': 'application/json',
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

    
    }

  },[])*/



  




  return (
        <>
        <Navbar></Navbar>

        <div className='main  flex justify-center '>
            <div className="left w-1/2 pt-12">
              <AccordionOrder  showProductOnChoosen={showProductOnChoosen} ></AccordionOrder>
            </div>
            <div className="rigth w-1/2">
                <CardMakeOrder productsChoosen={productsChoosen} setProductsChoosen={setProductsChoosen}></CardMakeOrder>
            </div>

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


export const insertProductsOnStore = (data) => ({
  type: 'STORE_PRODUCTS',
  payload: data
})

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  insertProductsOnStore
}

export default connect(mapStateToProps, mapDispatchToProps)(MakeOrder)
