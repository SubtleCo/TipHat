import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { authApi, userStorageKey } from "./authSettings"
import "./Login.css"

export const Register = () => {

    const [registerUser, setRegisterUser] = useState({ firstName: "", lastName: "", email: "", password: "", trackValue: 0.0104 })
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [conflictDialog, setConflictDialog] = useState(false)

    const history = useHistory()

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

    const handleRegister = (e) => {
        e.preventDefault()

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
                                userTrackValue: parseFloat(registerUser.trackValue)
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

    return (
        <main style={{ textAlign: "center" }}>

            <dialog className="dialog dialog--password" open={conflictDialog}>
                <div>Account with that email address already exists</div>
                <button className="button--close" onClick={e => setConflictDialog(false)}>Close</button>
            </dialog>

            <form className="form--login" onSubmit={handleRegister}>
                <h1 className="h3 mb-3 font-weight-normal">Howdy, stranger!</h1>
                <h2 className="h3 mb-3 font-weight-normal">Tell us about yourself</h2>
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
                    <label htmlFor="trackValue"> Track Value: $</label>
                    <input type="number" step="0.0001" name="trackValue" id="trackValue" className="form-control" defaultValue="0.0104" required onChange={handleInputChange} />
                    <p><strong>What is this?</strong></p>
                    <p>You may set a default value per track for your reports. If you're not sure, leave it as the default value ($0.0104) for now, and we'll talk about it later. You'll be able to change this later as well. </p>
                </fieldset>
                <fieldset>
                    <button type="submit"> Sign in </button>
                </fieldset>
            </form>
        </main>
    )
}

