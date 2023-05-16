import { db } from '@vercel/postgres';

export default async function handler(request, response) {
   
    const client = await db.connect();
    
    
    if(request.method === 'GET'){
        
        const allProducts = await client.sql
        `
        SELECT *
        FROM products
        WHERE idadmin=${request.query.id}
        `;
        
        response.status(200).json({product:allProducts.rows})
        
    }else if(request.method === 'POST'){
        
        const product = request.body
       
        // const dat = JSON.parse(request.body);
        const addProduct = await client.sql
        `
        INSERT INTO products (title, description, category, price, img,idAdmin)
        VALUES
        (${product.title},${product.description},${product.category},${product.price},${product.img},${product.adminId})
        `
        response.status(200).json('OK');
        
        
        
    }
}