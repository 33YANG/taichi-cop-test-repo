import axios from 'axios'

/**
 * redirect url for github oauth
 */
export const REACT_APP_REDIRECT_URL = 'https://github.com/33YANG/taichi-cop-testing'

/**
 * github oauth client id
 */
// export const REACT_APP_GITHUB_CLIENT_ID = '693217078fda07dc20cc' // localhost:5137 use
export const REACT_APP_GITHUB_CLIENT_ID = '983a25ae4aded4c93d38' // https://github.com/33YANG/taichi-cop-testing use

/**
 * github oauth client secret. should be kept secret in production!
 */
// export const REACT_APP_GITHUB_CLIENT_SECRET = 'f3bf22ff016a5e04e0b7e51674b2723c20c05eab' // localhost:5137 use
export const REACT_APP_GITHUB_CLIENT_SECRET = '8e6c91a1eeb00bf55c5faba1dfd1bbdb68822188' // https://github.com/33YANG/taichi-cop-testing use

/**
 * github oauth url
 */
export const REACT_APP_GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${REACT_APP_GITHUB_CLIENT_ID}&redirect_uri=${REACT_APP_REDIRECT_URL}&scope=user`

/**
 * github oauth access token api, should run in server side
 */
export const REACT_APP_GITHUB_AUTH_ACCESS_TOKEN_API = `/api/login/oauth/access_token?client_id=${REACT_APP_GITHUB_CLIENT_ID}&client_secret=${REACT_APP_GITHUB_CLIENT_SECRET}`

/**
 * github oauth user api
 */
export const REACT_APP_GITHUB_AUTH_USER_API = 'https://api.github.com/user'

/**
 * github repo url
 */
export const REACT_APP_GITHUB_REPO_URL = 'https://github.com/33YANG/taichi-cop-testing'

/**
 * get github access token by code
 * @param code github oauth code
 * @returns access_token
 */
export async function getGithubAccessToken(code: string) {
  try {
    const response = await axios({
      method: 'POST',
      url: `${REACT_APP_GITHUB_AUTH_ACCESS_TOKEN_API}&code=${code}`,
      headers: {
        Accept: 'application/json',
      },
    })
    const { error, error_description } = response?.data
    if (error) {
      console.error(error_description)
      window.location.href = REACT_APP_REDIRECT_URL
      return
    }
    const { access_token } = response?.data
    return access_token
  } catch (error) {
    console.error(error)
  }
}
/**
 * get github user info by access token
 * @param access_token github access token
 * @returns user info data
 */
export async function getGithubUserInfo(access_token: string) {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://api.github.com/user`,
      headers: {
        accept: 'application/json',
        Authorization: `token ${access_token}`,
      },
    })
    return response?.data
  } catch (error) {
    console.error(error)
  }
}
