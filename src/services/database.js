import { db } from '@vercel/postgres'

const client = await db.connect()

export const insertProduct = async (product) => {
  const final = await client.sql`
    INSERT INTO products (title, description, category, price, img,idAdmin)
    VALUES
    (${product.title},${product.description},${product.category},${product.price},${product.img},${product.adminId})
    `
  return final
}

export const insertAllProductOnStore = async (adminId) => {
  const final = await client.sql`
        SELECT *
        FROM products
        WHERE idadmin=${adminId}
        `

  return final.rows
}

export const getAdminId = async (email) => {
  const final = await client.sql`
    SELECT ID FROM admins WHERE email=${email}
    `
  return final
}


export const deleteProductByTitle = async (title) =>{
    const final =  await client.sql`
    DELETE FROM products WHERE title=${title}
    `

    return final
}
