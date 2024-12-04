import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) return null;

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const modalStyle: React.CSSProperties = {
    background: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '500px',
    maxWidth: '100%',
    position: 'relative'
  };

  const modalCloseStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer'
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <button style={modalCloseStyle} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
