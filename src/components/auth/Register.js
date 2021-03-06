// Registration module

import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { services, getServices } from "../services/ServiceProvider"
import { suggestions, getSuggestions } from "../suggestions/SuggestionsProvider"
import { authApi, userStorageKey } from "./authSettings"
import "./Login.css"
import { getCurrentUser } from "./UserProvider"

export const Register = () => {

    const [registerUser, setRegisterUser] = useState({
        firstName: "",
        lastName: "",
        lastFmAccount: "",
        email: "",
        password: "",
        serviceId: 0,
        suggestionId: 0
    })
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [conflictDialog, setConflictDialog] = useState(false)
    const loggedInUserId = parseInt(sessionStorage.getItem('app_user_id'))
    let text = {}

    const history = useHistory()

    useEffect(() => {
        getServices()
            .then(getSuggestions)
            .then(() => {
                // Check to see if a user is logged in (editing account) or not (adding account)
                if (loggedInUserId) {
                    return fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}/${loggedInUserId}`)
                        .then(res => res.json())
                        .then(setRegisterUser)
                }
            })
    }, [])

    // Keep track of user input
    const handleInputChange = (event) => {
        const newUser = { ...registerUser }
        if (event.target.id.includes("Id")) {
            newUser[event.target.id] = parseInt(event.target.value)
        } else {
            newUser[event.target.id] = event.target.value
        }
        setRegisterUser(newUser)
    }

    const existingUserCheck = () => {

        return fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}?email=${registerUser.email}`)
            .then(res => res.json())
            .then(user => !!user.length)
    }

    const editUser = () => {
        return fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}/${loggedInUserId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: registerUser.email,
                firstName: registerUser.firstName,
                lastName: registerUser.lastName,
                lastFmAccount: registerUser.lastFmAccount,
                password: registerUser.password,
                serviceId: registerUser.serviceId,
                suggestionId: registerUser.suggestionId
            })
        })
            .then(history.push("/"))
    }

    const handleRegister = (e) => {
        if (checkForSelects()) {
            e.preventDefault()
            // If the user is logged in, check to see the passwords match, then edit the user
            if (loggedInUserId) {
                if (registerUser.password === passwordConfirm) {
                    return editUser()
                } else {
                    return window.alert('Passwords do not match')
                }
            }
            existingUserCheck()
            // if the new user has a unique email to the API, register a new user
                .then((userExists) => {
                    if (!userExists) {
                        if (registerUser.password === passwordConfirm) {
                            fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    email: registerUser.email,
                                    firstName: registerUser.firstName,
                                    lastName: registerUser.lastName,
                                    lastFmAccount: registerUser.lastFmAccount,
                                    password: registerUser.password,
                                    serviceId: registerUser.serviceId,
                                    suggestionId: registerUser.suggestionId
                                })
                            })
                                .then(res => res.json())
                                .then(createdUser => {
                                    if (createdUser.hasOwnProperty("id")) {
                                        sessionStorage.setItem(userStorageKey, createdUser.id)
                                        getCurrentUser()
                                        history.push("/")
                                    }
                                })
                        } else {
                            window.alert('Passwords do not match')
                        }
                    }
                    else {
                        setConflictDialog(true)
                    }
                })
        } else {
            window.alert('Please select a streaming service and how you would like to value music!')
        }

    }

    // Make sure user has chosen something in the two selects
    const checkForSelects = () => {
        if (registerUser.suggestionId === 0 || registerUser.serviceId === 0) return false
        return true
    }

    // Set display text based on if this is a create or an edit session
    if (loggedInUserId) {
        text.greeting = "Changed your mind about something?"
        text.detail = "No problem! You can change your name, email, password, or track value!"
        text.button = "Edit Account"
    } else {
        text.greeting = "Howdy, stranger!"
        text.detail = "Tell us about yourself"
        text.button = "Create Account"
    }
    return (
        <main style={{ textAlign: "center" }}>

            <dialog className="dialog dialog--password" open={conflictDialog}>
                <div>Account with that email address already exists</div>
                <button className="button--close" onClick={e => setConflictDialog(false)}>Close</button>
            </dialog>

            <form className="form--login" onSubmit={handleRegister}>
                <h1 className="h3 mb-3 font-weight-normal">{text.greeting}</h1>
                <h4 className="h4 mb-3 font-weight-normal">{text.detail}</h4>
                <fieldset>
                    <label htmlFor="firstName"> First Name </label>
                    <input type="text" name="firstName" id="firstName" className="form-control" placeholder="First name" required autoFocus value={registerUser.firstName} onChange={handleInputChange} />
                </fieldset>
                <fieldset>
                    <label htmlFor="lastName"> Last Name </label>
                    <input type="text" name="lastName" id="lastName" className="form-control" placeholder="Last name" required value={registerUser.lastName} onChange={handleInputChange} />
                </fieldset>
                <fieldset>
                    <label htmlFor="lastFmAccount"> <a href="http://last.fm">last.fm</a> Account </label>
                    <input type="text" name="lastFmAccount" id="lastFmAccount" className="form-control" placeholder="Account Name" required value={registerUser.lastFmAccount} onChange={handleInputChange} />
                </fieldset>
                <fieldset>
                    <label htmlFor="inputEmail"> Email address </label>
                    <input type="email" name="email" id="email" className="form-control" placeholder="Email address" required value={registerUser.email} onChange={handleInputChange} />
                </fieldset>
                <fieldset>
                    <label htmlFor="password"> Password </label>
                    <input type="password" name="password" id="password" className="form-control" placeholder="password" required value={registerUser.password} onChange={handleInputChange} />
                </fieldset>
                <fieldset>
                    <label htmlFor="confirm"> Confirm Password </label>
                    <input type="password" name="confirm" id="confirm" className="form-control" placeholder="confirm password" required onChange={e => setPasswordConfirm(e.target.value)} />
                </fieldset>
                <fieldset>
                    <label htmlFor="serviceId">My streaming service is </label>
                    <select id="serviceId" value={registerUser.serviceId} onChange={handleInputChange}>
                        <option value="0">My Streaming Service</option>
                        {
                            services.map(service => <option key={"service " + service.id} value={service.id}>{service.name}</option>)
                        }
                    </select>
                </fieldset>
                <fieldset>
                    <label htmlFor="suggestionId">I'd like to value music like </label>
                    <select required id="suggestionId" value={registerUser.suggestionId} onChange={handleInputChange}>
                        <option value="0">How I want to value music</option>
                        {
                            suggestions.map(suggestion => <option key={"suggestion " + suggestion.id} value={suggestion.id}>{suggestion.name}</option>)
                        }
                    </select>
                </fieldset>
                <fieldset>
                    <button type="submit"> {text.button} </button>
                </fieldset>
            </form>
        </main>
    )
}

