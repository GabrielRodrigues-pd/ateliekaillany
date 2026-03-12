import { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";
import "./DeliveryModal.css";

export default function DeliveryModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem("atelie_delivery_modal_seen");
    
    if (!hasSeenModal) {
      // Delay showing the modal slightly for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("atelie_delivery_modal_seen", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="delivery-modal-overlay" onClick={handleClose}>
      <div 
        className="delivery-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="delivery-modal-close" onClick={handleClose} aria-label="Fechar">
          <X size={24} />
        </button>
        
        <div className="delivery-modal-icon">
          <MapPin size={48} color="white" />
        </div>
        
        <h2 className="delivery-modal-title">Aviso de Entregas</h2>
        
        <p className="delivery-modal-text">
          Olá! Atualmente estamos atendendo e realizando entregas exclusivamente para as cidades de:
        </p>
        
        <ul className="delivery-modal-cities">
          <li>Emas-PB</li>
          <li>Olho d'Água-PB</li>
          <li>Catingueira-PB</li>
        </ul>
        
        <p className="delivery-modal-text-small">
          Agradecemos a compreensão!
        </p>
        
        <button className="delivery-modal-button" onClick={handleClose}>
          Entendido
        </button>
      </div>
    </div>
  );
}
