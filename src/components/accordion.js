import { connect } from 'react-redux'

import { Fragment, useState, useEffect } from 'react'
import {
  Accordion,
  AccordionHeader,
  AccordionBody
} from '@material-tailwind/react'

function AccordionOrder ({ showProductOnChoosen, state, insertProductsOnStore }) {
  const [open, setOpen] = useState(0)
  const [isClient, setIsClient] = useState(false)

 //Ensure that the component renders the same content server-side as it does during the initial
 // client-side render to prevent a hydration mismatch. You can intentionally render different
 // content on the client with the useEffect hook.
  useEffect(() => {
    setIsClient(true)
  }, [])



  useEffect(()=>{
   
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
  
        const prod = await filterProductsByCategory(final.product, 'category')
  
        await insertProductsOnStore(prod)
  
        return final
      } catch (error) {
        return { error: 'get all products failed' }
      }
    }
    getAllProducts()

  },[])


  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value)
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




  // il componente viene renderizzato prima delle props  perciò bisogna usare lo use effect
  return(
    <div>
      {isClient ?<Fragment>
      {
         Object.values(state.productsData).map((categoryArr, i) => {
           return (
  
              <Accordion key={Math.random()} open={open === ((i + 1)) }>
              <AccordionHeader key={i} onClick={() => handleOpen(i + 1)}>
               {categoryArr[0].category}
                </AccordionHeader>
                {categoryArr.map((singleObj) => {
                  return (
  
            <AccordionBody key={Math.random()}>
  
              <h1>{singleObj.title} </h1>
            <button onClick={() => { showProductOnChoosen(singleObj) }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Select Product</button>
            <p>{singleObj.description}</p>
  
            </AccordionBody>
  
                  )
                })}
  
            </Accordion>
  
           )
         })
      }
  
    </Fragment> :'Waiting.....'}
    </div>
 
  )



 
   
  


 
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

export default connect(mapStateToProps, mapDispatchToProps)(AccordionOrder)
