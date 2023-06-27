function restaurantId (state = 0, action) {
  switch (action.type) {
    case 'STORE_RESTAURANT_ID':
     
      return action.payload

    default:
      return state
  }
}

export default restaurantId
