import { useRef } from "react"

function Login() {
  return (
    <>
      <div>
        <form className='formControls' action='index.html'>
          <h2 className='formControls_txt'>最實用的線上代辦事項服務</h2>
          <label className='formControls_label' for='email'>
            Email
          </label>
          <input
            className='formControls_input'
            type='text'
            id='email'
            name='email'
            placeholder='請輸入 email'
            required
          />
          <span>此欄位不可留空</span>
          <label className='formControls_label' for='pwd'>
            密碼
          </label>
          <input
            className='formControls_input'
            type='password'
            name='pwd'
            id='pwd'
            placeholder='請輸入密碼'
            required
          />
          <input
            className='formControls_btnSubmit'
            type='button'
            onclick="javascript:location.href='#todoListPage'"
            value='登入'
          />
          <a className='formControls_btnLink' href='#register'>
            註冊帳號
          </a>
        </form>
      </div>
    </>
  )
}

export default Login
