import React from 'react'
import './Footer.css'

export const Footer = () => {

    return (
        <footer id="footer">
            <p className="footer--item">Created by <a href="https://github.com/SubtleCo">Alex Martin</a></p>
            <p className="footer--item"><a href="https://github.com/SubtleCo/TipHat">TipHat on Github</a></p>
            <p className="footer--item">User data from <a href="https://last.fm">last.fm</a></p>
            <p className="footer--item">Built at <a href="https://nashvillesoftwareschool.com">Nashville Software School</a></p>
        </footer>
    )
}