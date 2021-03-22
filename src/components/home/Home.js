import React, { useEffect } from 'react'
import { getCurrentUser } from '../auth/UserProvider'
import './Home.css'

export const Home = () => {

    useEffect(() => {
        getCurrentUser()
    },[])

    return (
        <>
            <h2>Welcome to TipHat</h2>
            <section className="home__container">
                <article className="home__about">
                    I'm baby hexagon cornhole kitsch palo santo bespoke heirloom. Umami chambray snackwave, gastropub fixie succulents franzen bitters yr tattooed live-edge master cleanse. Pork belly shaman cardigan vegan sustainable craft beer fixie wayfarers photo booth. Flannel hell of pickled shaman, brooklyn four loko sartorial austin. Asymmetrical polaroid normcore semiotics vexillologist, street art organic forage cray four loko woke post-ironic gentrify farm-to-table. Yr chillwave mumblecore, waistcoat raclette succulents cornhole woke etsy before they sold out bushwick keytar vape listicle.
                </article>
                <article className="home__about">
                    Umami copper mug austin artisan celiac. Banh mi umami jianbing, edison bulb craft beer succulents roof party chicharrones copper mug fashion axe trust fund direct trade chillwave. Letterpress kale chips chambray mlkshk salvia mumblecore, quinoa street art edison bulb ennui pour-over mustache polaroid. Cronut readymade 8-bit, hell of polaroid drinking vinegar wayfarers kogi glossier fanny pack. Vaporware celiac blog VHS subway tile banh mi swag single-origin coffee disrupt pug craft beer. Kickstarter etsy actually pabst cornhole art party sartorial roof party organic godard man braid.
                 </article>
                <article className="home__about">
                    Adaptogen offal small batch edison bulb slow-carb. Portland try-hard locavore truffaut affogato photo booth, post-ironic next level food truck tilde single-origin coffee taiyaki lomo. Sriracha taxidermy hell of crucifix. Ugh palo santo farm-to-table iceland prism poke listicle intelligentsia. Shoreditch bespoke distillery biodiesel keytar quinoa copper mug tousled irony 90's everyday carry try-hard coloring book.
                </article>
                <article className="home__about">
                    IPhone keffiyeh cloud bread, bushwick snackwave kickstarter normcore tousled skateboard gentrify fixie banh mi forage readymade. Dreamcatcher raw denim truffaut pickled, four dollar toast af mustache pop-up pabst gentrify vape hexagon meditation hot chicken tumblr. Coloring book chicharrones four loko cold-pressed pitchfork fanny pack farm-to-table VHS 8-bit chillwave shoreditch chartreuse fixie edison bulb. Locavore DIY pickled cronut letterpress kombucha. Tousled kinfolk freegan viral taxidermy hell of letterpress iceland readymade selfies gentrify cronut next level.
                </article>
                <button  className="button btn-go" id="getStarted">Get Started</button>
            </section>
        </>
    )
}