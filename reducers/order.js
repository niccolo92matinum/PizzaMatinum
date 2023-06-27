function order (state = [], action) {
  switch (action.type) {
    case 'INSERT_SINGLE_ORDER':

      return [...state, action.payload]

    case 'MODIFY_QUANTITY_ORDER':

      return action.payload
      

    default:
      return state
  }
}

export default order
