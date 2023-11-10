import { Outlet } from "react-router-dom"
import logo from "../images/logo.png"
import mainPageImg from "../images/todo.png"

function Auth() {
  return (
    <>
      <div id='loginPage' className='bg-yellow'>
        <div className='conatiner loginPage vhContainer'>
          <div className='side'>
            <a href='#'>
              <img className='logoImg' src={logo} alt='Online Todo List' />
            </a>
            <img className='d-m-n' src={mainPageImg} alt='Todo List Image' />
          </div>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Auth
