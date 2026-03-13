# 🍫 Ateliê Kaillany Nunes - E-commerce Full Stack & Gestão de Estoque

[![Link do Projeto](https://img.shields.io/badge/Acesse_o_Site-Demo-brown?style=for-the-badge)](https://www.ateliekaillany.com.br)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

Um sistema e-commerce completo desenvolvido para o Ateliê Kaillany Nunes, especializado em ovos de páscoa gourmet. O projeto vai além de um simples catálogo, incluindo um **Painel Administrativo Robusto** para gestão de pedidos, estoque e precificação dinâmica.

---

## 🎯 Objetivo do Projeto

Este projeto foi construído para resolver dores reais de um pequeno negócio:
1.  **Automatização de Pedidos:** Integração direta com o WhatsApp para finalização de vendas.
2.  **Gestão de Estoque:** Painel administrativo para habilitar/desabilitar produtos em tempo real.
3.  **Precificação Flexível:** Suporte a múltiplos pesos e preços para o mesmo item (ex: 250g, 350g, 500g).
4.  **UX Otimizada:** Interface premium e responsiva focada na conversão de vendas.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React.js (Vite):** SPA rápida e modular.
- **Context API:** Gerenciamento de estado global (Carrinho de Compras).
- **CSS3 (Vanilla):** Estilização customizada com foco em performance e design premium.
- **React Router:** Navegação dinâmica e rotas protegidas para administração.
- **Swiper.js:** Carrossel interativo de criações.

### Backend
- **Node.js & Express:** API REST eficiente e escalável.
- **MongoDB & Mongoose:** Banco de dados NoSQL para flexibilidade de modelos de dados.
- **JWT (JSON Web Token):** Autenticação segura para o acesso administrativo.
- **Helmet & Rate Limit:** Camadas de segurança para proteção contra ataques comuns.

### Infraestrutura
- **Vercel:** Deployment do Frontend.
- **Render:** Hosting do Backend em ambiente PaaS.

---

## 🛠️ Desafios Técnicos & Soluções (Destaques para Recrutadores)

### 1. UX para "Cold Starts" de Servidor PaaS
Como o backend utiliza o plano gratuito do Render, o servidor entra em suspensão após inatividade. Implementei um **Loading State Temático ("Pré-aquecimento do Forno")** com feedback proativo ao usuário após 8 segundos de espera, transformando uma limitação de infraestrutura em uma experiência de marca positiva.

### 2. Precificação Dinâmica Complexa
Implementei uma lógica de dados que permite que um único produto possua múltiplos pesos e preços. O sistema calcula automaticamente o valor "A partir de" na vitrine e gerencia seleções específicas no carrinho, mantendo a integridade dos dados no MongoDB.

### 3. Painel Administrativo Responsivo
Desenvolvi um Dashboard completo onde o lojista pode gerenciar pedidos por status (Novo, Em Produção, Pronto, Entregue) e realizar operações CRUD completas no catálogo de produtos, tudo de forma responsiva para uso em desktop ou celular.

---

## 📸 Demonstração

*(Dica: Substitua estes placeholders por links de imagens reais do seu projeto ou GIFs do painel funcionando)*

| Vitrine de Produtos | Painel Admin (Mobile) | Carrinho com Opções |
| :---: | :---: | :---: |
| ![Home](https://placehold.co/300x200?text=Vitrine+Home) | ![Admin](https://placehold.co/300x200?text=Dashboard+Mobile) | ![Cart](https://placehold.co/300x200?text=Carrinho+Dinamico) |

---

## ⚙️ Como executar o projeto

1.  **Clone o repositório:** `git clone https://github.com/seu-usuario/ateliekaillany.git`
2.  **Frontend:**
    - `cd frontend && npm install`
    - Crie um `.env` com `VITE_API_BASE_URL`
    - `npm run dev`
3.  **Backend:**
    - `cd backend && npm install`
    - Crie um `.env` com `MONGO_URI` e `JWT_SECRET`
    - `npm start`

---

## 👨‍💻 Autor

**Seu Nome** - Desenvolvedor Full Stack
- [LinkedIn](https://www.linkedin.com/in/gabriel-rodrigues-873075236/)
- [Portfólio](https://seu-portfolio.com)

---

> [!NOTE]
> Este é um projeto real em produção, tratando dados, segurança e experiência do usuário como prioridade.
