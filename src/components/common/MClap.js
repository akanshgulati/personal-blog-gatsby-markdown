import React from 'react'
import './class.css'

const GetClap = '/.netlify/functions/get-clap'
const SetClap = '/.netlify/functions/post-clap'

function runAnimationCycle(el, className, duration) {
    if (el && !el.classList.contains(className)) {
        el.classList.add(className)
    } else {
        el.classList.remove(className)
        void el.offsetWidth // Trigger a reflow in between removing and adding the class name
        el.classList.add(className)
    }
}

function runParticleAnimationCycle(el, className, duration) {
    if (el && !el.classList.contains(className)) {
        el.classList.add(className)
        setTimeout(() => {
            el.classList.remove(className)
        }, duration)
    }
}

function animateParticles(particles, dur) {
    const particlesClasses = [
        {
            class: "pop-top"
        },
        {
            class: "pop-top-left"
        },
        {
            class: "pop-top-right"
        },
        {
            class: "pop-bottom-right"
        },
        {
            class: "pop-bottom-left"
        },
    ]
    const minDeg = 1
    const maxDeg = 72
    addRandomParticlesRotation(particles.id, minDeg, maxDeg)

    for (let i = 0; i < particlesClasses.length; i++) {
        runParticleAnimationCycle(particles.children[i], particlesClasses[i].class, dur)
    }
    // Boolean functionality only to activate particles2, particles3 when needed
    particles.classList.add('animating')
    setTimeout(() => {
        particles.classList.remove('animating')
    }, dur)
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function addRandomParticlesRotation(particlesName, minDeg, maxDeg) {
    const particles = document.getElementById(particlesName)
    const randomRotationAngle = getRandomInt(minDeg, maxDeg) + 'deg'
    particles.style.transform = `rotate(${randomRotationAngle})`
}

function _generateUUID() {
    var result, i, j
    result = ''
    for (let j = 0; j < 32; j++) {
        if (j === 8 || j === 12 || j === 16 || j === 20) {
            result = result + '-'
        }
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase()
        result = result + i
    }
    return result
}

export default class Clap extends React.Component {
    constructor(props) {
        super(props)
        this.clap = React.createRef()
        this.sonarClap = React.createRef()
        this.particleOne = React.createRef()
        this.particleTwo = React.createRef()
        this.particleThree = React.createRef()
        this.clicker = React.createRef()
        this.totalClickCounter = React.createRef()
        this.state = {
            totalCounter: 0,
            counter: 0,
            isClicked: false,
            showSidebar: false
        }
    }

    getUserId() {
        const userId = localStorage.getItem('uuid') || _generateUUID()
        localStorage.setItem('uuid', userId)
        return userId
    }

    upClickCounter() {
        const clickCounter = this.clicker.current
        const totalClickCounter = this.totalClickCounter.current

        fetch(SetClap, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "pageId": window.pageId || "14345",
                "userId": this.getUserId(),
                "isDelete": this.state.isClicked
            })
        })
        this.setState(() => {
            return {
                totalCounter: this.state.isClicked ? this.state.totalCounter - 1: this.state.totalCounter + 1,
                isClicked: !this.state.isClicked,
                counter: this.state.isClicked ? '-1' : '+1'
            }
        })


        if (clickCounter.classList.contains('first-active')) {
            runAnimationCycle(clickCounter, 'active')
        } else {
            runAnimationCycle(clickCounter, 'first-active')
        }
        runAnimationCycle(totalClickCounter, 'fader')
    }

    _handleClick() {

        const particles = this.particleOne.current
        const particles2 = this.particleTwo.current
        const particles3 = this.particleThree.current
        this.clap.current.classList.add('clicked')
        this.upClickCounter()

        runAnimationCycle(this.clap.current, 'scale')

        if (!particles.classList.contains('animating')) {
            animateParticles(particles, 700)
        } else if (!particles2.classList.contains('animating')) {
            animateParticles(particles2, 700)
        } else if (!particles3.classList.contains('animating')) {
            animateParticles(particles3, 700)
        }
    }

    _handleMouseover() {
        this.sonarClap.current.classList.add('hover-active')
        setTimeout(() => {
            this.sonarClap.current.classList.remove('hover-active')
        }, 2000)
    }
    onTwitterClick() {
        window.open("https://twitter.com/share?url=" + encodeURIComponent(window.location.href) + "&text=" + document.title);
    }

    render() {
        return (
            <aside className={'share-icon ' + `${this.state.showSidebar ? 'fade-in' : 'fade-out'}`}>
                <div className="clap-section">
                    <div id="totalCounter" className="total-counter"
                         ref={this.totalClickCounter}>{this.state.totalCounter}</div>

                    <div id="clap" ref={this.clap} className={"clap-container " + (this.state.isClicked ? 'clicked' : '')} onClick={() => {
                        this._handleClick()
                    }} onMouseOver={() => {
                        this._handleMouseover()
                    }}>
                        <svg width="29" height="29" className={"clap-icon " + (this.state.isClicked ? 'clicked' : '')}>
                            <g>
                                <path
                                    d="M13.74 1l.76 2.97.76-2.97zM16.82 4.78l1.84-2.56-1.43-.47zM10.38 2.22l1.84 2.56-.41-3.03zM22.38 22.62a5.11 5.11 0 0 1-3.16 1.61l.49-.45c2.88-2.89 3.45-5.98 1.69-9.21l-1.1-1.94-.96-2.02c-.31-.67-.23-1.18.25-1.55a.84.84 0 0 1 .66-.16c.34.05.66.28.88.6l2.85 5.02c1.18 1.97 1.38 5.12-1.6 8.1M9.1 22.1l-5.02-5.02a1 1 0 0 1 .7-1.7 1 1 0 0 1 .72.3l2.6 2.6a.44.44 0 0 0 .63-.62L6.1 15.04l-1.75-1.75a1 1 0 1 1 1.41-1.41l4.15 4.15a.44.44 0 0 0 .63 0 .44.44 0 0 0 0-.62L6.4 11.26l-1.18-1.18a1 1 0 0 1 0-1.4 1.02 1.02 0 0 1 1.41 0l1.18 1.16L11.96 14a.44.44 0 0 0 .62 0 .44.44 0 0 0 0-.63L8.43 9.22a.99.99 0 0 1-.3-.7.99.99 0 0 1 .3-.7 1 1 0 0 1 1.41 0l7 6.98a.44.44 0 0 0 .7-.5l-1.35-2.85c-.31-.68-.23-1.19.25-1.56a.85.85 0 0 1 .66-.16c.34.06.66.28.88.6L20.63 15c1.57 2.88 1.07 5.54-1.55 8.16a5.62 5.62 0 0 1-5.06 1.65 9.35 9.35 0 0 1-4.93-2.72zM13 6.98l2.56 2.56c-.5.6-.56 1.41-.15 2.28l.26.56-4.25-4.25a.98.98 0 0 1-.12-.45 1 1 0 0 1 .29-.7 1.02 1.02 0 0 1 1.41 0zm8.89 2.06c-.38-.56-.9-.92-1.49-1.01a1.74 1.74 0 0 0-1.34.33c-.38.29-.61.65-.71 1.06a2.1 2.1 0 0 0-1.1-.56 1.78 1.78 0 0 0-.99.13l-2.64-2.64a1.88 1.88 0 0 0-2.65 0 1.86 1.86 0 0 0-.48.85 1.89 1.89 0 0 0-2.67-.01 1.87 1.87 0 0 0-.5.9c-.76-.75-2-.75-2.7-.04a1.88 1.88 0 0 0 0 2.66c-.3.12-.61.29-.87.55a1.88 1.88 0 0 0 0 2.66l.62.62a1.88 1.88 0 0 0-.9 3.16l5.01 5.02c1.6 1.6 3.52 2.64 5.4 2.96a7.16 7.16 0 0 0 1.18.1c1.03 0 2-.25 2.9-.7A5.9 5.9 0 0 0 23 23.24c3.34-3.34 3.08-6.93 1.74-9.17l-2.87-5.04z"></path>
                            </g>
                        </svg>
                    </div>

                    <div id="clicker" className={"click-counter"}
                         ref={this.clicker}>
                        <span className="counter">{this.state.counter}</span>
                    </div>

                    <div id="sonar-clap" className="clap-container-sonar" ref={this.sonarClap}/>

                    <div id="particles" className="particles-container" ref={this.particleOne}>
                        {this.renderParticles()};
                    </div>

                    <div id="particles-2" className="particles-container" ref={this.particleTwo}>
                        {this.renderParticles()};
                    </div>

                    <div id="particles-3" className="particles-container" ref={this.particleThree}>
                        {this.renderParticles()};
                    </div>

                </div>
                <button onClick={() => {
                    this.onTwitterClick()
                }} style={{ marginTop: '10px', outline: 0, backgroundColor: "transparent" }}>
                    {this.renderTwitterIcon()}
                </button>
            </aside>
        )
    }

    renderParticles() {
        return (
            [1, 2, 3, 4, 5].map((item) => {
                return (<div className="triangle" key={item}>
                    <div className="square"/>
                </div>)
            })
        )
    }
    renderTwitterIcon() {
        return (
            <span className="svg-icon">
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 511.271 511.271">
            <g>
                <g>
                    <path d="M508.342,94.243c-2.603-2.603-6.942-3.471-10.414-2.603l-17.356,6.075c10.414-12.149,17.356-25.166,21.695-37.315
                        c1.736-4.339,0.868-7.81-1.736-10.414c-2.603-2.603-6.942-3.471-10.414-1.736c-24.298,10.414-45.125,19.092-62.481,24.298
                        c0,0.868-0.868,0-1.736,0c-13.885-7.81-47.729-25.166-72.027-25.166c-61.614,0.868-111.078,52.936-111.078,116.285v3.471
                        c-90.251-17.356-139.715-43.39-193.519-99.797L40.6,58.663l-5.207,10.414c-29.505,56.407-8.678,107.607,25.166,142.319
                        c-15.62-2.603-26.034-7.81-35.58-15.62c-3.471-2.603-7.81-3.471-12.149-0.868c-3.471,1.736-5.207,6.942-4.339,11.281
                        c12.149,40.786,42.522,73.763,75.498,93.722c-15.62,0-28.637-1.736-41.654-10.414c-3.471-1.736-8.678-1.736-12.149,0.868
                        s-5.207,6.942-3.471,11.281c15.62,44.258,45.993,67.688,94.59,73.763c-25.166,14.753-58.142,26.902-109.342,27.77
                        c-5.207,0-9.546,3.471-11.281,7.81c-1.736,5.207,0,9.546,3.471,13.017c31.241,25.166,100.664,39.919,186.576,39.919
                        c152.732,0,277.695-136.244,277.695-303.729v-2.603c19.092-9.546,34.712-27.77,42.522-52.936
                        C511.813,101.185,510.945,96.846,508.342,94.243z M456.274,143.707l-5.207,1.736v14.753
                        c0,157.939-117.153,286.373-260.339,286.373c-78.97,0-131.905-13.017-160.542-26.902c59.878-4.339,94.59-23.431,121.492-44.258
                        l21.695-15.62h-26.034c-49.464,0-79.837-13.885-97.193-46.861c15.62,5.207,32.108,5.207,50.332,4.339
                        c6.942-0.868,13.885-0.868,20.827-0.868l2.603-17.356c-32.976-9.546-72.027-39.051-91.119-78.969
                        c17.356,7.81,36.447,9.546,53.803,9.546h26.902L91.8,213.999c-18.224-13.017-72.027-59.01-45.993-124.963
                        c55.539,54.671,108.475,79.837,203.932,97.193l10.414,1.736v-24.298c0-53.803,41.654-98.061,93.722-98.929
                        c19.959-0.868,52.936,17.356,62.481,22.563c5.207,2.603,10.414,3.471,15.62,1.736c13.017-4.339,28.637-10.414,45.993-17.356
                        c-7.81,13.017-18.224,25.166-32.108,36.448c-3.471,2.603-4.339,7.81-2.603,12.149c1.736,4.339,6.942,6.075,11.281,4.339
                        l33.844-11.281C482.308,124.616,472.762,137.633,456.274,143.707z"/>
                </g>
            </g>
        </svg>
        </span>
        )
    }

    componentWillMount() {
    }

    componentDidMount() {
        const self = this

        function handleScroll() {
            const current = window.pageYOffset >= 1050
            self.setState((prevState) => {
                if (prevState.showSidebar !== current) {
                    return {
                        showSidebar: !prevState.showSidebar
                    }
                }
            })
        }

        window.removeEventListener(`scroll`, handleScroll)
        window.addEventListener(`scroll`, handleScroll)

        const userId = this.getUserId()
        const checkPageIdCounter = setInterval(() => {
            if (!window.pageId) {
                return
            }
            clearInterval(checkPageIdCounter);
            const url = `${GetClap}?pageId=${window.pageId}&userId=${userId}`
            fetch(url).then(resp => resp.json()).then(resp => {
                this.setState(function (prevState) {
                    return {
                        totalCounter: resp.count,
                        isClicked: resp.isClicked
                    }
                })
            })
        }, 1000);
    }
}
