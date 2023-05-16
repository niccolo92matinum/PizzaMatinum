import { db } from '@vercel/postgres';

export default async function handler(request, response) {
  const client = await db.connect();

  

  if (request.method === 'GET') {

      const admins = await client.sql`select ID from admins where email = ${request.query.email}`;
     
        response.status(200).json(admins)
  
  }else{

  }
}


