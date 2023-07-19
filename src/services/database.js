// eslint-disable-next-line import/no-duplicates
import { createClient } from '@vercel/postgres'

// const client = await db.connect()

export const insertProduct = async (product) => {
  const client = createClient()
  await client.connect()

  const strngIngredients = JSON.stringify(product.ingredients)

  const final = await client.sql`
      INSERT INTO products (title, description, category, price, img,idAdmin,id,ingredients,idrestaurant)
      VALUES
      (${product.title},${product.description},${product.category},${product.price},${product.img},${product.adminId},${product.id},${strngIngredients},${product.restaurantId
      })
      `
  return final
}

export const insertAllProductOnStore = async (nameColumn, id) => {
  const client = createClient()
  await client.connect()
  
  if(nameColumn === 'idadmin'){
    const final = await client.sql`
    SELECT *
    FROM products
    WHERE idadmin=${id}`
    
  return final.rows
  }else{
    const final = await client.sql`
    SELECT *
    FROM products
    WHERE idrestaurant=${id}`
    
  return final.rows
  }
  
  
}

export const getAdminId = async (email) => {
  const client = createClient()
  await client.connect()
  const final = await client.sql`
    SELECT ID FROM admins WHERE email=${email}
    `
  return final
}

export const deleteProductById = async (id) => {
  const client = createClient()
  await client.connect()
  const final = await client.sql`
    DELETE FROM products WHERE id=${id}
    `

  return final
}

export const modifyProduct = async (product) => {
  const client = createClient()
  await client.connect()
  const strngIngredients = JSON.stringify(product.ingredients)
  const final = await client.sql`
  UPDATE Products
SET title = ${product.title}, description = ${product.description},category = ${product.category}, price = ${product.price},img = ${product.img},ingredients= ${strngIngredients}, idRestaurant= ${product.restaurantId}
WHERE id = ${product.id};
    `

  return final
}

export const getAllRestaurants = async () => {
  const client = createClient()
  await client.connect()
  const final = await client.sql`
  select * from restaurants
  `
  return final
}

export const insertOrder = async (order) => {
  const parseOrder = JSON.parse(order)

  const client = createClient()
  await client.connect()
const stringifyDetails = JSON.stringify(parseOrder.details)

  const final = await client.sql`
  INSERT INTO orders (orderid, ordertime, clientname, clientsurname,clientemail, clientphone,clientphone2,orderdetails,extimatedwait,idrestaurant,status)
  VALUES
  (${parseOrder.orderId},${parseOrder.ordertime},${parseOrder.userDetails.name},${parseOrder.userDetails.surname},${parseOrder.userDetails.email},${parseOrder.userDetails.phone},${parseOrder.userDetails.phone2},${stringifyDetails},${parseOrder.extimatedwait},${parseOrder.restaurantid},'Pending')
  `

  return final
}

export const changeOrderStatus = async (id) => {
  const client = createClient()
  await client.connect()
  const final = await client.sql`
  UPDATE Orders
SET Status = 'Payed'
WHERE orderid = ${id};
  `
  return final
}

export const changeOrderStatus2 = async (id) => {
  const client = createClient()
  await client.connect()
  const final = await client.sql`
  UPDATE Orders
SET Status = 'Delivered'
WHERE orderid = ${id};
  `
  return final
}

export const deleteOrderByAdmin = async (id) => {
  const client = createClient()
  await client.connect()
  const final = await client.sql`
  DELETE FROM Orders WHERE orderid=${id};
  `
  return final
}



export const getAllOrdersByRestaurantId = async (id) =>{

  const client = createClient()
  await client.connect()
  const final = await client.sql`
  SELECT *
  FROM orders
  WHERE idrestaurant=${id}
  `
  return final

}




