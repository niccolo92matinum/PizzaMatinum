function userData (state = {}, action) {
  switch (action.type) {
    case 'STORE_USER_DETAILS':

      return action.payload

    default:
      return state
  }
}

export default userData
