import { Outlet } from "react-router-dom"

function Auth() {
  return (
    <>
      <div id='loginPage' className='bg-yellow'>
        <div className='conatiner loginPage vhContainer'>
          <div className='side'>
            <a href='#'>
              <img
                className='logoImg'
                src='../src/images/logo.png'
                alt='Online Todo List'
              />
            </a>
            <img
              className='d-m-n'
              src='../src/images/todo.png'
              alt='Todo List Image'
            />
          </div>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Auth
