function productsData (state = {}, action) {
 
  switch (action.type) {
    case 'STORE_PRODUCTS':

      return action.payload

    case 'STORE_SINGLE_PRODUCT':

     
      return action.payload

    case 'DELETE_PRODUCT':
     const result = action.payload
  
   const d = Object.keys(result).map((i)=>{
   
    if(result[i].length === 0){
     
      delete result[i]
    }
  
  })
    
      return {...state,...result}
    default:
      return state
  }
}

export default productsData
