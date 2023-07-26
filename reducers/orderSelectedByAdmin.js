function orderSelectedByAdmin (state = {}, action) {
  switch (action.type) {
    case 'INSERT_SELECTD_ORDER_BY_ADMIN':

      return action.payload
    case 'CHANGE_STATUS_ORDER':
      return {}

    default:
      return state
  }
}

export default orderSelectedByAdmin
