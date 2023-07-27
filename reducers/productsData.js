function productsData (state = {}, action) {
  switch (action.type) {
    case 'STORE_PRODUCTS':

      return action.payload

    case 'STORE_SINGLE_PRODUCT':

      return action.payload

    case 'MODIFY_SINGLE_PRODUCT':

      return action.payload

    case 'DELETE_PRODUCT':

      return { ...state, ...action.payload }

    default:
      return state
  }
}

export default productsData
