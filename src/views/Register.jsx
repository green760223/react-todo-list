import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"

function Register() {
  // Read environment variables
  const { VITE_APP_HOST } = import.meta.env
  // Set state
  const navigate = useNavigate()
  const emailRef = useRef()
  const nicknameRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()

  // Handle sign up function
  const handleSignUp = async () => {
    console.log("handleSignUp")

    const email = emailRef.current.value
    const nickname = nicknameRef.current.value
    const password = passwordRef.current.value
    const confirmPassword = confirmPasswordRef.current.value
    const signUpData = {
      email,
      nickname,
      password,
    }

    // Check password and confirm password if match
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: "Please confirm that the password is correct",
      })
      return
    }

    // Send sign up request
    try {
      const response = await axios.post(
        `${VITE_APP_HOST}/users/sign_up`,
        signUpData
      )

      Swal.fire({
        icon: "success",
        title: "Registration successful",
        text: "Welcome to the service!",
        timer: 2000,
        timerProgressBar: false,
      })

      navigate("/")
    } catch (error) {
      console.log("catch error:", error.response.data.message)
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: error.response.data.message,
      })
    }
  }

  // Redirect to index page
  const toIndexPage = () => {
    navigate("/")
  }

  return (
    <>
      <div>
        <form className='formControls' action='index.html'>
          <h2 className='formControls_txt'>Register Account</h2>
          <label className='formControls_label' htmlFor='email'>
            Email
          </label>
          <input
            className='formControls_input'
            type='email'
            id='email'
            name='email'
            placeholder='Please enter your email'
            ref={emailRef}
            required
          />
          <label className='formControls_label' htmlFor='nickname'>
            Your nickname
          </label>
          <input
            className='formControls_input'
            type='text'
            id='nickname'
            placeholder='Please enter your nickname'
            name='nickname'
            ref={nicknameRef}
            required
          />
          <label className='formControls_label' htmlFor='password'>
            Password
          </label>
          <input
            className='formControls_input'
            type='password'
            id='password'
            name='password'
            placeholder='Please enter your password'
            ref={passwordRef}
            required
          />
          <label className='formControls_label' htmlFor='confirm_password'>
            Confirm Password
          </label>
          <input
            className='formControls_input'
            type='password'
            id='confirm_password'
            name='confirm_password'
            placeholder='Please confirm your password'
            ref={confirmPasswordRef}
            required
          />
          <input
            type='button'
            value='Sign Up'
            className='formControls_btnSubmit'
            onClick={handleSignUp}
          />
          <a
            className='formControls_btnLink'
            type='button'
            onClick={toIndexPage}>
            Login
          </a>
        </form>
      </div>
    </>
  )
}

export default Register
