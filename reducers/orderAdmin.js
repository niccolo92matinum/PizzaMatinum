function orderAdmin (state = [], action) {
    switch (action.type) {
      case 'INSERT_ORDERS_ADMIN':
  
        return action.payload
  
       
  
      default:
        return state
    }
  }
  
  export default orderAdmin