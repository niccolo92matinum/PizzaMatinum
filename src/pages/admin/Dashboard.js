import Navbar from '../../components/Navbar'
import {useEffect,useState} from 'react'
import { connect } from 'react-redux'
import { useSession } from 'next-auth/react'
import TableDashboard from '../../components/tabledashboard'
import Modal from '../../components/modaldetailsadmin'

function Dashboard ({state, insertOrderAdminRedux}) {

  const [showModal, setShowModal] = useState(false);

  const { data: session } = useSession()


  const restaurantIdAdmin = state.adminData.restaurantId

  useEffect( ()=>{
    const getAllOrdersApi = async ()=>{


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
//chiedi a Sergio Sta cosa
    if(session?.accessToken){
      getAllOrdersApi()
    }
   
  },[session])


  const orderPayed = state.orderAdmin.filter(order => order.status === 'Payed')
  const orderDoneOrNotPayed = state.orderAdmin.filter(order => order.status !== 'Payed')



  
  return (
  <div>
   <Navbar> </Navbar>
   <h1>DASHBOARD</h1>
   <div className="main  flex justify-center">

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
}


export const insertOrderAdminRedux = (data) => ({
  type: 'INSERT_ORDERS_ADMIN',
  payload: data
})


const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {
  insertOrderAdminRedux
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)


