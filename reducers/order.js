function order (state = [], action) {
  switch (action.type) {
    case 'INSERT_SINGLE_ORDER':

      return [...state, action.payload]

    case 'MODIFY_QUANTITY_ORDER':

      return action.payload
    case 'MERGE_ALL_ORDER_WITH_SAME_ID':
      return action.payload

    default:
      return state
  }
}

export default order
