import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

const REGISTER_MUTATION = gql`
  mutation Register {
    register {
      _id
      token
    }
  }
`

export default function Register() {
  const [register] = useMutation(REGISTER_MUTATION)
  const router = useRouter()

  const handleRegister = async () => {
    try {
      const { data } = await register()
      if (data?.register?.token) {
        // Store the token in localStorage
        localStorage.setItem('visitorToken', data.register.token)
        // Redirect to the home page
        await router.push('/')
      }
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6 text-center'>
          <h1>Welcome to the Store</h1>
          <button className='btn btn-primary mt-3' onClick={handleRegister}>
              Register
          </button>
        </div>
      </div>
    </div>
  )
}
