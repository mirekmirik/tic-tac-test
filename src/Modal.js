import { createPortal } from "react-dom"


const Backdrop = ({ onHideModal }) => {
    return (
        <div className='backdrop' onClick={onHideModal}></div>
    )
}

const ModalWindow = ({ text, onHideModal }) => {
    return (
        <div className='modal'>
            <div>{text}</div>
            <button onClick={onHideModal}>Ok</button>
        </div>
    )
}



const Modal = ({ onHideModal, text }) => {
    return (
        <>
            {createPortal(<Backdrop onHideModal={onHideModal} />, document.body)}
            {createPortal(<ModalWindow onHideModal={onHideModal} text={text} />, document.body)}
        </>
    )
}


export default Modal