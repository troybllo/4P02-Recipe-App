import React from "react";

interface ModoalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModoalProps> = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="contain-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}></button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
