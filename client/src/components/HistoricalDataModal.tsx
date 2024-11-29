import React from "react";
import StockChart from "./StockChart";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    historicalData: { symbol: string, date: string; price: string }[] | null;
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose, title, historicalData}) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
          <div className="modal-content">
              <button className="modal-close" onClick={onClose}>Закрыть</button>
              <h2>{title}</h2>
              {historicalData && <StockChart historicalData={historicalData} />}
          </div>
      </div>
    );
}

export default Modal;