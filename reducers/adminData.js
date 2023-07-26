function adminData (state = {}, action) {
  switch (action.type) {
    case 'STORE_ID_EMAIL':

      return action.payload

    default:
      return state
  }
}

export default adminData
