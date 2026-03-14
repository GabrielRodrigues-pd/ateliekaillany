import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import "./FAQ.css";

const faqData = [
  {
    question: "Como faço o pagamento?",
    answer: "Trabalhamos com Pix e dinheiro. A finalização e os detalhes de pagamento são combinados diretamente pelo WhatsApp após você enviar seu carrinho pelo site."
  },
  // {
  //   question: "Vocês entregam em domicílio?",
  //   answer: "Não! Realizaremos as entregas da sua região em um ponto específico da sua cidade. O valor final continua o mesmo. Não cobramos taxa de entrega. Para mais dúvidas entre em contato pelo nosso WhatsApp."
  // },
  {
    question: "Até quando posso fazer meu pedido?",
    answer: "Os pedidos podem ser feitos até o dia 01 de abril ou até durar o estoque!"
  },
  {
    question: "Como posso acompanhar meu pedido?",
    answer: "Você pode fazer login no site e acessar a aba 'Meus Pedidos' no menu lateral (celular) ou superior (computador). Além disso, mantemos você informado via WhatsApp."
  },
  {
    question: "Os doces podem ser personalizados?",
    answer: "Com certeza! Para isso basta entrar em contato via WhatsApp e fazer o seu pedido personalizado."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="duvidas">
      <div className="container">
        <div className="faq-header">
          <span className="faq-eyebrow">Suporte</span>
          <h2>Dúvidas Frequentes</h2>
          <p>Tudo o que você precisa saber para adoçar seu dia.</p>
        </div>

        <div className="faq-container">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <button 
                className="faq-question" 
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
              >
                <div className="question-text">
                  <HelpCircle size={20} className="q-icon" />
                  <span>{item.question}</span>
                </div>
                <ChevronDown size={20} className="chevron-icon" />
              </button>
              <div className="faq-answer">
                <div className="answer-content">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
