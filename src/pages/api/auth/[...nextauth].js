import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
// import { db } from '@vercel/postgres'
import { createClient } from '@vercel/postgres'

// const client = await db.connect()

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET

    }
    )
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt ({ token, account }) {
      // Persist the OAuth access_token to the token right after signin

      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session ({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.

      const client = createClient()
      await client.connect()

      const prova = await client.sql`
    SELECT ID FROM admins WHERE email=${session.user.email}
    `
      const restaurantId = await client.sql`
    SELECT idrestaurant FROM admins WHERE email=${session.user.email}
    `
     const final = await restaurantId.rows[0].idrestaurant
   
      session.admin = prova
      session.restaurantId = final
      session.accessToken = token.accessToken

      return session
    }

  }

}
export default NextAuth(authOptions)
