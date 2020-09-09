import React from 'react'
import classes from "./Backdrop.module.css"

const Backdrop = (props) => {
    return props.show ? <div onClick={props.backdropClicked} className={classes.Backdrop}></div> : null;
}

export default Backdrop
