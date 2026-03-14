import { X, HelpCircle, LayoutGrid, User, ShoppingBag, CheckCircle } from "lucide-react";
import "./HelpModal.css";

export default function HelpModal({ onClose }) {
  const helpItems = [
    {
      icon: <LayoutGrid size={24} />,
      title: "O Menu (☰)",
      description: "No celular, clique no ícone de três barrinhas para ver todas as categorias: Produtos, Sobre nós e Meus Pedidos."
    },
    {
      icon: <User size={24} />,
      title: "Login do Google",
      description: "O login serve apenas para identificarmos quem está pedindo. É seguro e não temos acesso à sua senha do Google."
    },
    {
      icon: <ShoppingBag size={24} />,
      title: "Meus Pedidos",
      description: "Após fazer o login, você pode clicar em 'Meus Pedidos' no menu para ver todo o seu histórico de doces pedidos."
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Finalização",
      description: "Sempre terminamos o pedido no WhatsApp. Lá combinamos o horário exato da entrega ou retirada."
    }
  ];

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="help-modal-close" onClick={onClose} aria-label="Fechar ajuda">
          <X size={24} />
        </button>

        <div className="help-header">
          <div className="help-icon-wrapper">
            <HelpCircle size={40} color="white" />
          </div>
          <h2>Central de Ajuda</h2>
          <p>Tire suas dúvidas sobre como usar nosso site</p>
        </div>

        <div className="help-body">
          {helpItems.map((item, index) => (
            <div key={index} className="help-item">
              <div className="help-item-icon">
                {item.icon}
              </div>
              <div className="help-item-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="help-footer">
          <button className="help-btn-primary" onClick={onClose}>
            Entendido, obrigado!
          </button>
        </div>
      </div>
    </div>
  );
}
