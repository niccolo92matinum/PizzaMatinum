function orderSelectedByAdmin (state = [], action) {
    switch (action.type) {
      case 'INSERT_SELECTD_ORDER_BY_ADMIN':
  
        return action.payload
  
       
  
      default:
        return state
    }
  }
  
  export default orderSelectedByAdmin