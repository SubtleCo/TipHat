import React, { createContext, useState } from 'react'
import { Settings } from '../../Settings'

export const ServiceContext = createContext()

export const ServiceProvider = props => {
    const [services, setServices] = useState([])

    const getServices = () => {
        return fetch(`${Settings.localApi}/services`)
            .then(res => res.json())
            .then(setServices)
    }

    return (
        <ServiceContext.Provider value={{
            services, getServices
        }}>
            {props.children}
        </ServiceContext.Provider>
    )
}