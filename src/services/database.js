// eslint-disable-next-line import/no-duplicates
import { createClient, sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

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
  
  if (nameColumn === 'idadmin') {
    const final = await client.sql`
    SELECT *
    FROM products
    WHERE idadmin=${id}`
    
    return final.rows
  } else {
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
  console.log(1111)
  const client = createClient()
  await client.connect()
  console.log(2222)
  const final = await client.sql`
  select * from restaurants
  `
  return final
}

/*
export async function getAllRestaurants (request) {
  console.log('new3')
  const { searchParams } = new URL(request.url)
  console.log(searchParams)
  const restaurants = searchParams.get('restaurants')

  try {
    if (!restaurants) throw new Error('not foun')
    const result = await sql`select * from restaurants;`
    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

}
*/
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

export const getAllOrdersByRestaurantId = async (id) => {
  const client = createClient()
  await client.connect()
  const final = await client.sql`
  SELECT *
  FROM orders
  WHERE idrestaurant=${id}
  `
  return final
}

export const addIngredientsByAdmin = async (ingredient) => {
  // const strinIngredient = JSON.pars(ingredient)
  const client = createClient()
  await client.connect()
  const final = await client.sql`
  INSERT INTO ingredients (price, label, value, adminid, restaurantid)
  VALUES (${ingredient.price}, ${ingredient.label}, ${ingredient.value},${ingredient.adminid},${ingredient.restaurantid})
  `
  return final
}

export const getAllIngredientsByAdminId = async (adminid) => {
  const client = createClient()
  await client.connect()
  const final = await client.sql`
  SELECT *
  FROM ingredients
  WHERE adminid=${adminid}
  `
  return final
}


export const getAllIngredientsByRestaurantId = async (restaurantid) => {
  const client = createClient()
  await client.connect()
  const final = await client.sql`
  SELECT *
  FROM ingredients
  WHERE restaurantid=${restaurantid}
  `
  return final
}




export const deleteIngredientAdmin = async (id) => {
  const client = createClient()
  await client.connect()
  const final = await client.sql`
  DELETE FROM ingredients WHERE value=${id};
  `
  return final
}
/*

INSERT INTO ingredients (id, label, value,adminid, restaurantid)
VALUES ('jsjddsjfjhs', 'prova', 3, 1,1);
*/
