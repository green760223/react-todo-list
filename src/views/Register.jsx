import axios from "axios"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"

function Register() {
  const { VITE_APP_HOST } = import.meta.env

  const navigate = useNavigate()
  const emailRef = useRef()
  const nicknameRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()

  // Handle sign up function
  const handleSignUp = async () => {
    console.log("handleSignUp")

    //這邊要新增一個註冊密碼與再次確認輸入密碼是否相同的判斷

    const email = emailRef.current.value
    const nickname = nicknameRef.current.value
    const password = passwordRef.current.value
    const signUpData = {
      email,
      nickname,
      password,
    }

    try {
      const response = await axios.post(
        `${VITE_APP_HOST}/users/sign_up`,
        signUpData
      )
      console.log(response)
      navigate("/")
    } catch (error) {
      console.log("catch error:", error.response.data.message)
    }
  }

  return (
    <>
      <div>
        <form className='formControls' action='index.html'>
          <h2 className='formControls_txt'>註冊帳號</h2>
          <label className='formControls_label' htmlFor='email'>
            Email
          </label>
          <input
            className='formControls_input'
            type='email'
            id='email'
            name='email'
            placeholder='請輸入Eamil'
            ref={emailRef}
            required
          />
          <label className='formControls_label' htmlFor='nickname'>
            您的暱稱
          </label>
          <input
            className='formControls_input'
            type='text'
            id='nickname'
            placeholder='請輸入您的暱稱'
            name='nickname'
            ref={nicknameRef}
            required
          />
          <label className='formControls_label' htmlFor='password'>
            密碼
          </label>
          <input
            className='formControls_input'
            type='password'
            id='password'
            name='password'
            placeholder='請輸入密碼'
            ref={passwordRef}
            required
          />
          <label className='formControls_label' htmlFor='confirm_password'>
            請再次輸入密碼
          </label>
          <input
            className='formControls_input'
            type='password'
            id='confirm_password'
            name='confirm_password'
            placeholder='請再次輸入密碼'
            ref={confirmPasswordRef}
            required
          />
          <input
            type='button'
            value='註冊帳號'
            className='formControls_btnSubmit'
            onClick={handleSignUp}
          />
          <a className='formControls_btnLink' href='#'>
            登入
          </a>
        </form>
      </div>
    </>
  )
}

export default Register
