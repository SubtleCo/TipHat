import React, { createContext, useState } from 'react'
import { authApi } from './authSettings'

export const UserContext = createContext()

export const UserProvider = props => {

    const [currentUser, setCurrentUser] = useState({})

    const getCurrentUser = () => {
        const id = parseInt(sessionStorage.getItem(`app_user_id`))
        return fetch(`${authApi.localApiBaseUrl}/users/${id}`)
            .then(res => res.json())
            .then(setCurrentUser)
    }

    return (
        <UserContext.Provider value={{
            currentUser, getCurrentUser
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

