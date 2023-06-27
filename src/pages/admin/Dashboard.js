import Navbar from '../../components/Navbar'
function Dashboard () {
  return (
  <div>
   <Navbar> </Navbar>
   <h1>DASHBOARD</h1>
   <div className="main  flex justify-center">

    <div className="left w-1/2">
    <h1>sinistra</h1>
    <p>1 ordini in attesa / stima del tempo / nome cliente / button con pop up per tutti dettagli/ button delete</p>
    </div>

    <div className="rigth w-1/2">
    <h1>destra</h1>
    <p>2 ordini fatti / nome cliente / button con pop up per tutti dettagli/ button delete</p>
    </div>

   </div>
  </div>
  )
}

export default Dashboard
