import axios from 'axios'
import { useUserStore } from '../stores/users'
import { useLeaderboard } from '../stores/leaderboard'

const dev_host = 'http://localhost:5080'
const prod_host = 'https://wikifeet-trivia.cyclic.app'
let host

if (process.env.NODE_ENV === 'prod') host = prod_host
else host = dev_host

export const useDatabase = () => {
  const protect = axios.create()
  protect.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('access_token')
    config.headers = {
      Authorization: `Bearer ${token}`
    }
    return config
  })

  /**
   * Login user
   * @param {username, password} user user credentials
   * @returns error true or false
   */
  async function login(user) {
    try {
      const result = await axios.post(`${host}/api/auth/login`, user)
      sessionStorage.setItem('access_token', result.data)

      // const userStore = useUserStore()
      // const user = await getMe()
      // userStore.setUser(user)

      return { error: false }
    } catch (error) {
      return { error: true }
    }
  }

  /**
   * Get the current logged in user
   * @returns user data or error
   */
  async function getMe() {
    try {
      const res = await protect.get(`${host}/api/auth/me`)
      return res.data
    } catch (error) {
      return { error: true, message: 'Unauthorized'}
    }
  }

  async function isAuthenticated() {
    try {
      await protect.get(`${host}/api/auth/authenticated`)
      return true
    } catch (error) {
      return false
    }
  }

  async function updateUser(updated) {
    try {
      const result = await protect.put(`${host}/api/auth/update`, updated)
      const userStore = useUserStore()
      userStore.setUser(result.data)
      return {}
    } catch (error) {
      return { error: true }
    }
  }

  async function updateScore(update) {
    try {
      const result = await protect.put(`${host}/api/scores`, update)
      const leaderboard = useLeaderboard()
      leaderboard.updateLeaderboard(result.data.leaders)
    } catch (error) {
      return { error: true }
    }
  }

  async function getLeaderboard() {
    try {
      const result = await protect.put(`${host}/api/leaderboard`)
      const leaderboard = useLeaderboard()
      leaderboard.updateLeaderboard(result.data.leaders)
    } catch (error) {
      return { error: true }
    }
  }

  return {
    login,
    getMe,
    isAuthenticated,
    updateUser,
    updateScore,
    getLeaderboard
  }
}

