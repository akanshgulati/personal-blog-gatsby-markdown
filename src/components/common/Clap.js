import React from 'react'
import mojs from '@mojs/core'
import './clap.css'

const GetClap = '/.netlify/functions/get-clap'
const SetClap = '/.netlify/functions/post-clap'

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
        this.state = {
            count: 0,
            countTotal: 0,
            isClicked: false,
            showSidebar: false
        }
        this._handleClick = this._handleClick.bind(this)
    }

    initClap() {
        const tlDuration = 300
        const triangleBurst = new mojs.Burst({
            parent: `#clap`,
            radius: { 50: 95 },
            count: 5,
            angle: 30,
            children: {
                shape: `polygon`,
                radius: { 6: 0 },
                scale: 1,
                stroke: `rgba(211, 84, 0, 0.5)`,
                strokeWidth: 2,
                angle: 210,
                delay: 30,
                speed: 0.2,
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
                duration: tlDuration,
            },
        })
        const circleBurst = new mojs.Burst({
            parent: `#clap`,
            radius: { 50: 75 },
            angle: 25,
            duration: tlDuration,
            children: {
                shape: `circle`,
                fill: `rgba(149, 165, 166, 0.5)`,
                delay: 30,
                speed: 0.2,
                radius: { 3: 0 },
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
            },
        })
        const countAnimation = new mojs.Html({
            el: `#clap--count`,
            isShowStart: false,
            isShowEnd: true,
            y: { 0: -30 },
            opacity: { 0: 1 },
            duration: tlDuration,
        }).then({
            opacity: { 1: 0 },
            y: -80,
            delay: tlDuration / 2,
        })
        const countTotalAnimation = new mojs.Html({
            el: `#clap--count-total`,
            isShowStart: true,
            isShowEnd: true,
            delay: 3 * (tlDuration) / 2,
            duration: tlDuration,
            y: { 0: -3 },
        })
        const scaleButton = new mojs.Html({
            el: `#clap`,
            duration: tlDuration,
            scale: { 1.3: 1 },
            easing: mojs.easing.out,
        })
        const clap = document.getElementById(`clap`)
        clap.style.transform = `scale(1, 1)`
        this._animationTimeline = new mojs.Timeline()
        this._animationTimeline.add([
            countAnimation,
            countTotalAnimation,
            scaleButton,
            circleBurst,
            triangleBurst,
        ])
    }

    getUserId() {
        const userId = localStorage.getItem('uuid') || _generateUUID()
        localStorage.setItem('uuid', userId)
        return userId
    }

    componentWillMount() {
        const userId = this.getUserId()
        setTimeout(() => {
            console.log("Called here in clap")
            const url = `${GetClap}?pageId=${window.pageId}&userId=${userId}`
            fetch(url).then(resp => resp.json()).then(resp => {
                this.setState(function (prevState) {
                    return {
                        countTotal: resp.count,
                        isClicked: resp.isClicked
                    }
                })
            })
        }, 1000)
    }

    componentDidMount() {
        this.initClap()
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
    }

    _handleClick() {
        this._animationTimeline.replay()

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
        }).then(resp => resp.json()).then(resp => {
            this.setState((prevState) => {
                return {
                    countTotal: resp.count,
                    isClicked: resp.isClicked
                }
            })
        })
    }

    render() {
        const { count, countTotal, isClicked, showSidebar } = this.state

        return this.renderAppContent(count, countTotal, isClicked, this._handleClick, showSidebar)
    }

    onTwitterClick() {
        window.open("https://twitter.com/share?url=" + encodeURIComponent(window.location.href) + "&text=" + document.title);
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

    renderAppContent(count, countTotal, isClicked, handleClick, toShow) {
        return (
            <aside className={'share-icon ' + `${toShow ? 'fade-in' : 'fade-out'}`}>
                <button id="clap" className="clap" onClick={handleClick}>
                <span>
                    <svg id="clap--icon" xmlns="http://www.w3.org/2000/svg" viewBox="-549 338 100.1 125"
                         className={`${isClicked && `checked`}`}>
                        <path
                            d="M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z"/>
                        <path
                            d="M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9"/>
                    </svg>
                </span>
                    <span
                        id="clap--count" className="clap--count">+{count}</span>

                    <span
                        id="clap--count-total" className="clap--count-total">{countTotal}</span>
                </button>
                <button onClick={() => {
                    this.onTwitterClick()
                }} style={{ marginTop: '10px', outline: 0 }}>
                    {this.renderTwitterIcon()}
                </button>
            </aside>
        )
    }
}


