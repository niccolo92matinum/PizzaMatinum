
import { connect } from 'react-redux'
import Navbar from '../../components/Navbar'

function Menu () {
  return (
    <>
    <Navbar></Navbar>
    
    <div>
    Menu
    </div>
    
    </>
    )
  }
  
  export default connect(null, null)(Menu)
  