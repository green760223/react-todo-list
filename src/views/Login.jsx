import axios from "axios"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

function Login() {
  const { VITE_APP_HOST } = import.meta.env
  const navigate = useNavigate()
  const emailRef = useRef()
  const passwordRef = useRef()
  const [isEmailEmpty, setIsEmailEmpty] = useState(true)

  // Email input check function
  const handleEmailChange = () => {
    const emailInput = emailRef.current.value
    setIsEmailEmpty(!emailInput)
  }

  // Login function
  const handleLogin = async () => {
    const email = emailRef.current.value
    const password = passwordRef.current.value
    const params = { email, password }

    try {
      const response = await axios.post(
        `${VITE_APP_HOST}/users/sign_in`,
        params
      )
      const token = response.data.token
      const tokenDuration = new Date()
      tokenDuration.setDate(tokenDuration.getDate() + 1)
      document.cookie = `token=${token}; expires=${tokenDuration.toUTCString()}`
      setTimeout(() => {
        navigate("/todo")
      }, 1000)

      console.log(response)
      console.log(token)
      console.log(tokenDuration)
    } catch (error) {
      console.log("catch error:", error)
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: "請確認是否正確輸入Email或密碼",
        confirmButtonText: "確認",
      })
    }
  }

  return (
    <>
      <div>
        <form className='formControls' action='index.html'>
          <h2 className='formControls_txt'>最實用的線上代辦事項服務</h2>
          <label className='formControls_label' htmlFor='email'>
            Email
          </label>
          <input
            className='formControls_input'
            type='text'
            id='email'
            name='email'
            placeholder='請輸入 email'
            ref={emailRef}
            onChange={handleEmailChange}
            required
          />
          <span>{isEmailEmpty ? "此欄位不可留空" : ""}</span>
          <label className='formControls_label' htmlFor='password'>
            密碼
          </label>
          <input
            className='formControls_input'
            type='password'
            name='password'
            id='password'
            placeholder='請輸入密碼'
            ref={passwordRef}
            required
          />
          <input
            className='formControls_btnSubmit'
            type='button'
            onClick={handleLogin}
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
