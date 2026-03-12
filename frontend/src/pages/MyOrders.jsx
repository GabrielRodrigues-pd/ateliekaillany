import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './MyOrders.css';
import { ShoppingBag, Calendar, MapPin, Info } from "lucide-react";

const MyOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelingOrder, setCancelingOrder] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      setLoading(true);
      setError('');

      try {
        const response = await api.get('/orders/user-orders');
        setOrders(response.data);
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        setError('Não foi possível carregar seus pedidos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchOrders();
    }
  }, [user, authLoading]);

  const handleCancelClick = (order) => {
    setCancelingOrder(order);
    setCancellationReason('');
  };

  const confirmCancellation = async () => {
    if (!cancellationReason) {
      alert("Por favor, selecione um motivo para o cancelamento.");
      return;
    }

    try {
      await api.patch(`/orders/user/cancel/${cancelingOrder._id}`, { 
        reason: cancellationReason 
      });

      // Update local state
      setOrders(orders.map(o => 
        o._id === cancelingOrder._id 
          ? { ...o, status: 'cancelado', cancellationReason } 
          : o
      ));
      
      setCancelingOrder(null);
      setShowFeedback(true);
    } catch (err) {
      console.error('Erro ao cancelar:', err);
      alert(err.response?.data?.message || 'Erro ao cancelar o pedido.');
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'novo': 'Pedido Recebido',
      'em_producao': 'Em Produção',
      'pronto': 'Pronto para Entrega/Retirada',
      'entregue': 'Entregue',
      'cancelado': 'Cancelado'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading) {
    return <div className="loading-container">Verificando sua conta...</div>;
  }

  if (!user) {
    return (
      <div className="login-required">
        <div className="container">
          <ShoppingBag size={64} color="var(--primary)" />
          <h2>Acesse sua conta</h2>
          <p>Faça login com sua conta Google para ver o histórico de seus pedidos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <header className="page-header">
          <h1>Meus Pedidos</h1>
          <p>Olá, <strong>{user.name}</strong>! Aqui estão as atualizações dos seus pedidos.</p>
        </header>

        <div className="institutional-delivery-card">
          <div className="inst-icon">
            <Info size={24} />
          </div>
          <div className="inst-content">
            <h3>Como funciona a Entrega Programada?</h3>
            <p>
              Para clientes de cidades vizinhas, organizamos entregas em datas e locais específicos. 
              Isso nos ajuda a garantir que seu produto chegue com frescor e segurança. 
              Fique atento à <strong>Data</strong> e <strong>Local de Encontro</strong> informados no seu pedido abaixo!
            </p>
          </div>
        </div>

        <section className="orders-list-section">
          {loading && <div className="loading">Carregando seus pedidos...</div>}
          
          {error && <div className="error-message">{error}</div>}

          {!loading && orders.length === 0 && (
            <div className="no-orders">
              Você ainda não possui pedidos registrados nesta conta.
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div className="orders-grid">
              {orders.map((order) => (
                <div key={order._id} className="order-item-card">
                  <div className="order-header">
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                    <span className={getStatusClass(order.status)}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="order-body">
                    <h3>{order.product}</h3>
                    <div className="order-details">
                      <p><strong>Quantidade:</strong> {order.quantity}</p>
                      <p><strong>Total:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.totalPrice)}</p>
                      {order.cancellationReason && (
                        <p className="cancel-note"><strong>Motivo:</strong> {order.cancellationReason}</p>
                      )}
                    </div>

                    {order.scheduledDeliveryDate && (
                      <div className="scheduled-delivery-status">
                        <div className="scheduled-header">
                          <Calendar size={18} />
                          <span>Entrega Programada</span>
                        </div>
                        <div className="scheduled-body">
                          <p><strong>Data:</strong> {new Date(order.scheduledDeliveryDate).toLocaleDateString('pt-BR')}</p>
                          <p><strong>Local:</strong> <MapPin size={14} /> {order.scheduledDeliveryLocation}</p>
                        </div>
                      </div>
                    )}
                    
                    {order.status === 'novo' && (
                      <button 
                        className="cancel-btn-action" 
                        onClick={() => handleCancelClick(order)}
                      >
                        Cancelar Pedido
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MODAL DE CANCELAMENTO */}
        {cancelingOrder && (
          <div className="orders-modal-overlay">
            <div className="orders-modal">
              <h2>Cancelar Pedido</h2>
              <p>Sentimos muito que você precise cancelar. Poderia nos dizer o motivo?</p>
              
              <div className="reason-options">
                {[
                  "Mudei de ideia",
                  "Erro no preenchimento do pedido",
                  "O tempo de espera é muito longo",
                  "Vou pedir um sabor diferente",
                  "Outro motivo"
                ].map(reason => (
                  <label key={reason} className="reason-item">
                    <input 
                      type="radio" 
                      name="reason" 
                      value={reason}
                      checked={cancellationReason === reason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="modal-actions">
                <button className="back-btn" onClick={() => setCancelingOrder(null)}>Voltar</button>
                <button 
                  className="confirm-cancel-btn"
                  onClick={confirmCancellation}
                  disabled={!cancellationReason}
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POPUP DE FEEDBACK / INSTITUCIONAL */}
        {showFeedback && (
          <div className="orders-modal-overlay">
            <div className="orders-modal feedback-modal">
              <div className="success-icon">✨</div>
              <h2>Pedido Cancelado</h2>
              <p>Confirmamos o cancelamento do seu pedido.</p>
              <div className="institutional-box">
                <p>No Ateliê Kaillany Nunes, prezamos sempre pela sua melhor experiência. Esperamos poder te atender em uma próxima oportunidade com nossas doçuras!</p>
              </div>
              <button className="primary-btn" onClick={() => setShowFeedback(false)}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
