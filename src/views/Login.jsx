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
    checkAuthToken()
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
          title: "Login success",
          text: "Welcome back!",
          timer: 2000,
          timerProgressBar: false,
        })
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Please confirm if the email and password are entered correctly",
        confirmButtonText: "Confirm",
      })
    }
  }

  // Check if user is authenticated
  const checkAuthToken = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

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
    } catch (error) {}
  }

  // Redirect to register page
  const toRegisterPage = () => {
    navigate("/register")
  }

  return (
    <>
      <div>
        <form className='formControls' action='index.html'>
          <h2 className='formControls_txt'>The online to-do service</h2>
          <label className='formControls_label' htmlFor='email'>
            Email
          </label>
          <input
            className='formControls_input'
            type='text'
            id='email'
            name='email'
            placeholder='Please enter your email'
            ref={emailRef}
            onChange={handleEmailChange}
            required
          />
          <span>{isEmailEmpty ? "This field cannot be left blank" : ""}</span>
          <label className='formControls_label' htmlFor='password'>
            Password
          </label>
          <input
            className='formControls_input'
            type='password'
            name='password'
            id='password'
            placeholder='Please enter your password'
            ref={passwordRef}
            onChange={handlePasswordChange}
            required
          />
          <span>
            {isPasswordEmpty
              ? "Password must contain at least 6 characters"
              : ""}
          </span>
          <input
            className='formControls_btnSubmit'
            type='button'
            onClick={handleLogin}
            value='Login'
          />
          <a
            type='button'
            className='formControls_btnLink'
            onClick={toRegisterPage}>
            Register
          </a>
        </form>
      </div>
    </>
  )
}

export default Login
