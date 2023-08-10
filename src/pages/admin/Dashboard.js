import Navbaradmin from '../../components/Navbaradmin'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useSession } from 'next-auth/react'
import TableDashboard from '../../components/tabledashboard'
import Modal from '../../components/modaldetailsadmin'
import { useRouter } from 'next/navigation'

function Dashboard ({ state, insertOrderAdminRedux, setIdEmailToStore }) {
  const [showModal, setShowModal] = useState(false)

  const { data: session, status } = useSession()
  const { push } = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      setIdEmailToStore(
        {
          email: session.user.email,
          ID: session.admin.rows[0].id,
          restaurantId: session.restaurantId,
          ingredients: session.ingredients
        })
    } else if (status === 'unauthenticated') {
      push('/Admin/Login')
    }
  }, [status])

  const restaurantIdAdmin = state.adminData.restaurantId

  useEffect(() => {
    const getAllOrdersApi = async () => {
      try {
        const response = await fetch(

          `/api/orders?idrestaurant=${restaurantIdAdmin}`,
          {
            method: 'GET',
            'Content-Type': 'application/json',
            Authorization: session.accessToken
          }

        )
        const final = await response.json()

        insertOrderAdminRedux(final.orders)
      } catch (error) {
        console.log(error)
      }
    }

    // chiedi a Sergio Sta cosa
    if (session?.accessToken) {
      getAllOrdersApi()
    }
  }, [session])

  const orderPayed = state.orderAdmin.filter(order => order.status === 'Payed')
  const orderDoneOrNotPayed = state.orderAdmin.filter(order => order.status !== 'Payed')

  if (status !== 'unauthenticated') {
    return (
      <div>
       <Navbaradmin> </Navbaradmin>

       <div className="main  flex justify-center pt-8">

        <div className="left w-1/2">
       <TableDashboard props={orderPayed} setShowModal={setShowModal}/>
        </div>

        <div className="rigth w-1/2">
        <TableDashboard props={orderDoneOrNotPayed} setShowModal={setShowModal}/>
        </div>

       </div>

       <div>
        <Modal setShowModal={setShowModal} showModal={showModal} ></Modal>
       </div>

      </div>
    )
  } else {
    return (
      <>
      <Navbaradmin></Navbaradmin>
      <div className=" h-screen flex items-center justify-center">
      <h1 className="h1_loginpage">You are not logged in </h1>

       </div>
      </>
    )
  }
}

export const insertOrderAdminRedux = (data) => ({
  type: 'INSERT_ORDERS_ADMIN',
  payload: data
})

export const setIdEmailToStore = (data) => ({
  type: 'STORE_ID_EMAIL',
  payload: data
})

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  insertOrderAdminRedux,
  setIdEmailToStore

}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
