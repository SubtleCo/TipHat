import { authApi } from './authSettings'

export let currentUser = {}

export const getCurrentUser = () => {
        const id = parseInt(sessionStorage.getItem(`app_user_id`))
        return fetch(`${authApi.localApiBaseUrl}/users/${id}`)
            .then(res => res.json())
            .then(pRes => currentUser = pRes)
    }
