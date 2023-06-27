import { combineReducers } from 'redux'
import adminData from './adminData'
import productsData from './productsData'
import restaurantId from './restaurantId'
import order from './order'

export default combineReducers({

  adminData,
  productsData,
  restaurantId,
  order
})
