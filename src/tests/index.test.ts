import { getGithubAccessToken, getGithubUserInfo } from '../utils'

// TODO: mock axios

/**
 * Test getGithubAccessToken function
 */
describe('Test getGithubAccessToken function', () => {
  it('is string', () => {
    expect(typeof getGithubAccessToken('some code')).toBe('string')
  })
})

/**
 * Test getGithubUserInfo function
 */
describe('Test getGithubUserInfo function', () => {
  it('is object', () => {
    expect(typeof getGithubUserInfo('some token')).toBe('object')
  })
})
