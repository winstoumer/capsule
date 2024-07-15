import React, { useEffect, useRef } from 'react';
import './modal.scss';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    position: { top: number; left: number; right: number };
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, position }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!isOpen) return null;

    const { top, left, right } = position;

    const modalStyle = left + 300 > window.innerWidth ? { top: top + 10, right: window.innerWidth - right + 10 } : { top: top + 10, left: left + 10 };

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef} style={modalStyle}>
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
