function ingredients (state = [], action) {

  switch (action.type) {
    case 'INSERT_ALL_INGREDIENTS':

      return action.payload

    case 'ADD_INGREDIENT':

      return action.payload

      case 'DELETE_INGREDIENT':

      return action.payload

    default:
      return state
  }
}

export default ingredients
