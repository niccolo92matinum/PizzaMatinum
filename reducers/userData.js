function userData (state = {}, action) {
  switch (action.type) {
    case 'STORE_USER_DETAILS':

      return action.payload

    case 'RESET_USERDATA':
      return {}

    default:
      return state
  }
}

export default userData
