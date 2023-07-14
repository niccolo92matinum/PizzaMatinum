import { combineReducers } from 'redux'
import adminData from './adminData'
import productsData from './productsData'
import restaurantId from './restaurantId'
import order from './order'
import userData from './userData'
import orderAdmin from './orderAdmin'
import orderSelectedByAdmin from './orderSelectedByAdmin'

export default combineReducers({

  adminData,
  productsData,
  restaurantId,
  order,
  userData,
  orderAdmin,
  orderSelectedByAdmin
})
