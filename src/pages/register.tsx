import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'

const REGISTER_MUTATION = gql`
  mutation Register {
    register {
      _id
      token
    }
  }
`

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState('')
  const [register] = useMutation(REGISTER_MUTATION)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('visitorToken')
    if (token) {
      router.push('/').then()
    }
  }, [router])

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const { data } = await register({
        variables: { email, password }
      })

      if (data?.register?.token) {
        localStorage.setItem('visitorToken', data.register.token)
        await router.push('/')
      }
    } catch (error) {
      console.error('Registration failed:', error)
      setError('Registration failed. Please try again.')
    }
  }

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
