import React from 'react';
import './Modal.css';

export default function Modal (props){
    if(!props.show || props.show === false) return null;
    else return (
        <div className='modal' onClick={props.onClose}>
            <hr />
            <div className='modal-content' onClick={(event) => event.stopPropagation()}>
                <div className='modal-header'>
                    <h5 className='modal-title'>{props.title ? props.title : 'no title'}</h5>
                </div>
                <div className='modal-body'>{props.children? props.children : 'no content'}</div>
                <button className='button' onClick={props.onClose}>OK</button>
                <button className='button' onClick={props.onCancel}>Cancel</button>
            </div>
        </div>
    )
}