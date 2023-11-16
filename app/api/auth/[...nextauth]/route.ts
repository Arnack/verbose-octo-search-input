import NextAuth from 'next-auth'
import { options } from './options'

const Auth = (req, res) => NextAuth(req, res, options)
export default Auth;