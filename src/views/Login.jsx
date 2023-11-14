import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import axios from "axios"

function Login() {
  // Read environment variables
  const { VITE_APP_HOST } = import.meta.env

  // Set state
  const [isEmailEmpty, setIsEmailEmpty] = useState(true)
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigate = useNavigate()

  // Check auth token when component mounted
  useEffect(() => {
    checkAuthToken(), console.log("Login component mounted", isAuthenticated)
  }, [])

  // Email input check function
  const handleEmailChange = () => {
    const emailInput = emailRef.current.value
    setIsEmailEmpty(!emailInput)
  }

  // Password input check function
  const handlePasswordChange = () => {
    const passwordInput = passwordRef.current.value
    setIsPasswordEmpty(passwordInput.length < 6)
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
      document.cookie = `token=${token}; expires=${tokenDuration.toUTCString()}; SameSite=None; Secure`
      setIsAuthenticated(true)

      setTimeout(() => {
        navigate("/todo")
      }, 1000)

      if (response.status == 200) {
        Swal.fire({
          icon: "success",
          title: "登入成功",
          text: "歡迎回來!",
          timer: 2000,
          timerProgressBar: false,
        })
      }
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

  // Check if user is authenticated
  const checkAuthToken = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    console.log(token)
    const params = {
      headers: {
        Authorization: token,
      },
    }

    try {
      const response = await axios.get(
        `${VITE_APP_HOST}/users/checkout`,
        params
      )
      if (response.status == 200) {
        setIsAuthenticated(true)
        navigate("/todo")
      }
    } catch (error) {
      // console.log(error.response.data)
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
            onChange={handlePasswordChange}
            required
          />
          <span>{isPasswordEmpty ? "密碼必須至少包含6個字符" : ""}</span>
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
