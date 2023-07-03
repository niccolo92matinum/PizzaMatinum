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

export const insertAllProductOnStore = async (adminId) => {
  const client = createClient()
  await client.connect()

  const final = await client.sql`
    SELECT *
    FROM products
    WHERE idadmin=${adminId}
    `
  return final.rows
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
  const client = createClient()
  await client.connect()
  const final = await client.sql`
  INSERT INTO orders (orderid, ordertime, clientname, clientsurname,clientemail, clientphone,clientphone2,orderdetails,extimatedwait,idrestaurant)
  VALUES
  (${order.orderid},${order.ordertime},${order.name},${order.surname},${order.email},${order.phone},${order.phone2},${order.details},${order.extimatedwait},${order.idrestaurant})
  `
  return final
}
