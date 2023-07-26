function productsData (state = {}, action) {
  switch (action.type) {
    case 'STORE_PRODUCTS':

      return action.payload

    case 'STORE_SINGLE_PRODUCT':

      return action.payload

    case 'MODIFY_SINGLE_PRODUCT':

      return action.payload

    case 'DELETE_PRODUCT':

      Object.keys(action.payload).map((i) => {
        if (action.payload[i].length === 0) {
          delete action.payload[i]
        }
      })

      return { ...state, ...action.payload }

    default:
      return state
  }
}

export default productsData
