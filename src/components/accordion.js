import { connect } from 'react-redux'
import styles from '../styles/Makeorder.module.css'
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
    if(isClient){
      return(
        <div className="m-2 space-y-2">
        { Object.values(state.productsData).map((categoryArr, i) => {
          
          return(
            <div
          className="group flex flex-col gap-2 rounded-lg bg-black p-5 text-white"
          tabindex={i}
          >
          <div className="flex cursor-pointer items-center justify-between">
          <span>{categoryArr[0].category}</span>
          <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/96/Chevron-icon-drop-down-menu-WHITE.png"
          className="h-2 w-3 transition-all duration-500 group-focus:-rotate-180"
          />
          </div>
          <div
          className="invisible h-auto max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-screen group-focus:opacity-100 group-focus:duration-1000"
          >
            {categoryArr.map((singleObj) => {
                  return (
                    <div>
                     <h1>{singleObj.title} </h1>
                    <button onClick={() => { showProductOnChoosen(singleObj) }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Select Product</button>
                    <p>{singleObj.description}</p>
                    </div>
                    
                  )})

            }
         
         
          </div>
          </div>
          )
          
        }) }
        
        
        
        </div>
        
        )
    }else{
      <h1>Waiting</h1>
    }
    
      
      
      
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
    