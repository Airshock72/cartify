import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { REGISTER_MUTATION } from '@/graphql/mutation'

interface UseRegister {
    handleRegister: (e: FormEvent) => void
    email: string
    setEmail: Dispatch<SetStateAction<string>>
    password: string
    repeatPassword: string
    setRepeatPassword: Dispatch<SetStateAction<string>>
    setPassword: Dispatch<SetStateAction<string>>
    error: string
}

const useRegister = (): UseRegister => {
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

  return {
    handleRegister,
    repeatPassword,
    setPassword,
    setRepeatPassword,
    password,
    error,
    setEmail,
    email
  }
}

export default useRegister
