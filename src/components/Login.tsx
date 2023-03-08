import { useState, useEffect } from 'react'
import { REACT_APP_REDIRECT_URL, REACT_APP_GITHUB_AUTH_URL, getGithubAccessToken, getGithubUserInfo } from '../utils'

export function LoginWithGithub(props: { setUserInfo: (userInfo: any) => void; setLoading: (loading: boolean) => void }) {
  const { setUserInfo, setLoading } = props

  const handleLogin = async (code: string) => {
    setLoading(true)
    // get access_token, cors issue here!!!
    // FIXME: CORS ISSUE
    const access_token = (await getGithubAccessToken(code)) || ''
    // set access_token to localStorage
    localStorage.setItem('access_token', access_token || null)
    // get user_info
    const user_info = (await getGithubUserInfo(access_token)) || {}
    setUserInfo(user_info)
    // set user_info to localStorage
    if (user_info?.id) {
      localStorage.setItem('user_info', JSON.stringify(user_info))
    } else {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_info')
      window.location.href = REACT_APP_REDIRECT_URL
    }
    console.log('user_info', user_info)
    setLoading(false)
  }

  useEffect(() => {
    const access_token = localStorage.getItem('access_token')
    const code = new URLSearchParams(window.location.search).get('code')
    if (access_token) {
      // get user_info from localStorage
      const user_info = JSON.parse(localStorage.getItem('user_info') as '')
      console.log('[ user_info ]', user_info)
      if (user_info?.id) {
        // user_info is not null
        setUserInfo(user_info)
      } else {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_info')
        window.location.href = REACT_APP_REDIRECT_URL
      }
    } else {
      if (!code) {
      } else {
        handleLogin(code)
      }
    }
  }, [])

  return <></>
}
