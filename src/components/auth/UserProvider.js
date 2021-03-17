import React, { createContext, useState } from 'react'
import { authApi } from './authSettings'

export const UserContext = createContext()

export const UserProvider = props => {
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState({})

    const getUsers = () => {
        return fetch(`${authApi.localApiBaseUrl}/users`)
            .then(res => res.json())
            .then(setUsers)
    }

    const getCurrentUser = () => {
        const id = parseInt(sessionStorage.getItem(`app_user_id`))
        return fetch(`${authApi.localApiBaseUrl}/users/${id}`)
            .then(res => res.json())
            .then(setCurrentUser)
    }

    return (
        <UserContext.Provider value={{
            getUsers, currentUser, getCurrentUser
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

