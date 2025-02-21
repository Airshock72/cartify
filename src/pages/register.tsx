import useRegister from '@/hooks/useRegister'

const Register = () => {
  const {
    handleRegister,
    email,
    setEmail,
    setRepeatPassword,
    password,
    setPassword,
    repeatPassword,
    error
  } = useRegister()
  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <h1 className='text-center'>Registration</h1>
          <form onSubmit={handleRegister}>
            <div className='mb-3'>
              <label htmlFor='email' className='form-label'>
                  Email
              </label>
              <input
                type='email'
                className='form-control'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='password' className='form-label'>
                  Password
              </label>
              <input
                type='password'
                className='form-control'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='repeatPassword' className='form-label'>
                  Repeat Password
              </label>
              <input
                type='password'
                className='form-control'
                id='repeatPassword'
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className='alert alert-danger'>{error}</div>}
            <button type='submit' className='btn btn-primary w-100'>
                Register
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
