import { UserPlus, ShoppingBag, ShoppingCart, MessageCircle } from "lucide-react";
import "./OrderGuide.css";

export default function OrderGuide() {
  const steps = [
    {
      icon: <UserPlus size={32} />,
      title: "1. Identificação",
      description: "Faça login com sua conta Google para salvar seus pedidos e endereços."
    },
    {
      icon: <ShoppingBag size={32} />,
      title: "2. Escolha",
      description: "Navegue pelos doces, escolha o tamanho e o recheio que desejar."
    },
    {
      icon: <ShoppingCart size={32} />,
      title: "3. Carrinho",
      description: "Confira seus itens no carrinho e clique para finalizar seu pedido."
    },
    {
      icon: <MessageCircle size={32} />,
      title: "4. WhatsApp",
      description: "Você será direcionado para nosso WhatsApp para confirmar o pagamento e entrega."
    }
  ];

  return (
    <section className="order-guide" id="como-pedir">
      <div className="container">
        <div className="guide-header">
          <span className="guide-eyebrow">Simples e rápido</span>
          <h2>Como fazer seu pedido</h2>
          <p>Siga estes passos para garantir suas delícias.</p>
        </div>

        <div className="guide-grid">
          {steps.map((step, index) => (
            <div key={index} className="guide-step">
              <div className="step-icon">
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
