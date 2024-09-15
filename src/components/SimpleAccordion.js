import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useSession } from 'next-auth/react'
import styles from '../styles/makeorder.module.css'
import { faTrash, faRotate } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SimpleAccordion ({ state, setProduct, setModify, modify, insertProductsOnStore, deleteProduct, setSingleProductSelected }) {
  const { data: session, status } = useSession()
  
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
    if (status === 'authenticated') {
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
            const finalProduct = await convertBufferIngredient(final.product)
            const prod = await filterProductsByCategory(finalProduct, 'category')
            
            await insertProductsOnStore(prod)
            
            return final
          } catch (error) {
            return { error: 'get all products failed' }
          }
        }
        
        getAllProducts()
      }
    }, [state.adminData.ID])
    
    const convertBufferIngredient = (objProducts) => {
      Object.values(objProducts).map((singleCategory) => {
        if (singleCategory.ingredients !== null) {
          const buf = singleCategory.ingredients.data
          
          const str = String.fromCharCode(...buf)
          const obj = JSON.parse(str)
          
          singleCategory.ingredients = obj
        }
        return singleCategory
      })
      return objProducts
    }
    
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
      
      // ____________API________end_____
      
      const setDataOnClickModifyButton = (singleProduct) => {
        setModify(true)
        /* const parsedIngredient = JSON.parse(singleProduct.ingredients)
        
        const vu = []
        
        parsedIngredient.forEach((num) => {
          const createOptionsObj = options.filter(s => s.value === num)
          vu.push(...createOptionsObj)
        }) */
        
        setProduct({
          title: singleProduct.title,
          description: singleProduct.description,
          category: singleProduct.category,
          price: singleProduct.price,
          img: singleProduct.img,
          id: singleProduct.id,
          restaurantId: state.adminData.restaurantId,
          ingredients: singleProduct.ingredients
          
        })
      }
      
      const sortOrderByTitle = (arr) => {
        const ingSort = arr.sort(function (a, b) {
          const textA = a.title.toUpperCase()
          const textB = b.title.toUpperCase()
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
        return ingSort
      }
      
      return (
        <div className="space-y-2 overflow-y-scroll h-5/6">
        { Object.values(state.productsData).map((categoryArr, i) => {
          const productOrdered = sortOrderByTitle(categoryArr)
          // console.log(categoryArr,'000')
          return (
            <div key={i} >
            <div className="sticky top-0 rounded-[8px]  bg-uno">
            <h1 className="text-4xl pl-4">{categoryArr[0].category}</h1>
            </div>
            
            
            
            {productOrdered.map((singleProduct) => {
              const arrLabel = singleProduct.ingredients?.map(single => single.label)
              const stringAllLabelIngredients = arrLabel?.toString()
              
              return (
                <div key={Math.random()} onClick={() => { }} className={styles.div_singleproduct}>
                <div className="p-4 w-1/2 ">
                <h1 className="font-bold text-2xl">{singleProduct.title}</h1>
                {stringAllLabelIngredients && <p>{stringAllLabelIngredients}</p>}
                <p className="font-bold" >da {singleProduct.price} €</p>
                </div>
                <div className="flex grid-cols-2 w-1/8 ">
                <div className="pr-4 pt-4 text-2xl" onClick={ () => { setDataOnClickModifyButton(singleProduct); setSingleProductSelected(singleProduct) }}>
                <FontAwesomeIcon icon={faRotate} style={{ color: '#ff8551' }} 
                className=" transition-all duration-500 hover:scale-125   disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                />
                </div>
                <div className="pr-4  pt-4 text-2xl" onClick={() => deleteProductApi(singleProduct)} >
                <FontAwesomeIcon icon={faTrash} style={{ color: '#ff8551' }} 
                className=" transition-all duration-500 hover:scale-125   disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"/>
                </div>
                
                
                </div>
                <div className="mr-5 w-1/3">
                { singleProduct.img && <Image className="w-20 h-20  m-auto rounded-bl-3xl rounded-br-3xl rounded-tl-3xl rounded-tr-3xl  " width={30} height={30} src={singleProduct.img} alt="Neil image"/>}
                
                </div>
                
                </div>
                
                )
              })}
              </div>
              
              )
            })}
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
          }
          )
          
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