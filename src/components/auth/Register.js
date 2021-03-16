import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { authApi, userStorageKey } from "./authSettings"
import "./Login.css"

export const Register = () => {

    const [registerUser, setRegisterUser] = useState({ firstName: "", lastName: "", email: "", password: "", userTrackValue: 0.0104 })
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [conflictDialog, setConflictDialog] = useState(false)
    const loggedInUserId = parseInt(sessionStorage.getItem('app_user_id'))
    let text = {}

    const history = useHistory()

    useEffect(() => {
        if (loggedInUserId) {
            return fetch(`${authApi.localApiBaseUrl}/${authApi.endpoint}/${loggedInUserId}`)
                .then(res => res.json())
                .then(setRegisterUser)
        }
    }, [])

    const handleInputChange = (event) => {
        const newUser = { ...registerUser }
        newUser[event.target.id] = event.target.value
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
                password: registerUser.password,
                userTrackValue: parseFloat(registerUser.userTrackValue)
            })
        })
            .then(history.push("/"))
    }

    const handleRegister = (e) => {
        e.preventDefault()
        if (loggedInUserId) {
            if (registerUser.password === passwordConfirm) {
                return editUser()
            } else {
                return window.alert('Passwords do not match')
            }
        }
        existingUserCheck()
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
                                password: registerUser.password,
                                userTrackValue: parseFloat(registerUser.userTrackValue)
                            })
                        })
                            .then(res => res.json())
                            .then(createdUser => {
                                if (createdUser.hasOwnProperty("id")) {
                                    sessionStorage.setItem(userStorageKey, createdUser.id)
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

    }

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
                    <label htmlFor="userTrackValue"> Track Value: $</label>
                    <input type="number" step="0.0001" name="userTrackValue" id="userTrackValue" className="form-control" value={registerUser.userTrackValue} required onChange={handleInputChange} />
                    <p><strong>What is this?</strong></p>
                    <p>You may set a default value per track for your reports. If you're not sure, leave it as the default value ($0.0104) for now, and we'll talk about it later. You'll be able to change this later as well. </p>
                </fieldset>
                <fieldset>
                    <button type="submit"> {text.button} </button>
                </fieldset>
            </form>
        </main>
    )
}

