function orderAdmin (state = [], action) {
    switch (action.type) {
      case 'INSERT_ORDERS_ADMIN':
  
        return action.payload
  
       case 'CHANGE_STATUS_ORDERS_ARRAY':
        return  action.payload
  
      default:
        return state
    }
  }
  
  export default orderAdmin