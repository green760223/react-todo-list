function Register() {
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
            required
          />
          <input
            type='button'
            value='註冊帳號'
            className='formControls_btnSubmit'
            onClick=''
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
