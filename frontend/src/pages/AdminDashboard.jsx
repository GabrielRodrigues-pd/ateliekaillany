import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
      setIsLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Token expiado ou inválido
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError('Falha ao carregar os pedidos. Tente novamente mais tarde.');
        setIsLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      // Update local state directly to be faster, or refetch
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Não foi possível atualizar o status. Tente novamente.");
    }
  };

  const getStatusCounts = () => {
    return {
      novo: orders.filter((o) => o.status === 'novo').length,
      em_producao: orders.filter((o) => o.status === 'em_producao').length,
      pronto: orders.filter((o) => o.status === 'pronto').length,
      entregue: orders.filter((o) => o.status === 'entregue').length,
    };
  };

  const getRevenue = () => {
    // Faturamento apenas de pedidos entregues (concluídos)
    const entregues = orders.filter((o) => o.status === 'entregue');
    return entregues.reduce((total, order) => total + (order.totalPrice || 0), 0);
  };

  const counts = getStatusCounts();
  const revenue = getRevenue();
  
  // Categorized orders for separate tables
  const newOrders = orders.filter((o) => o.status === 'novo');
  const productionOrders = orders.filter((o) => o.status === 'em_producao');
  const readyOrders = orders.filter((o) => o.status === 'pronto');
  const deliveredOrders = orders.filter((o) => o.status === 'entregue');

  const renderOrderTable = (orderList, title, emptyMessage) => (
    <div className="table-section">
      <h2 className="table-title">{title} ({orderList.length})</h2>
      {orderList.length === 0 ? (
        <div className="empty-state-small">{emptyMessage}</div>
      ) : (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Total</th>
                <th>Status Atual</th>
                <th>Alterar Status</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((order) => (
                <tr key={order._id}>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.customerName}</td>
                  <td>{order.phone}</td>
                  <td>{order.city}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td className="price-col">{formatPrice(order.totalPrice)}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="status-select"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="novo">Novo</option>
                      <option value="em_producao">Em Produção</option>
                      <option value="pronto">Pronto p/ Entrega</option>
                      <option value="entregue">Entregue</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-container">
          <h1>Painel de Pedidos</h1>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </header>

      <main className="admin-main admin-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Carregando pedidos...</p>
          </div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card card-novo">
                <div className="card-info">
                  <h3>Pedidos Recebidos</h3>
                  <p className="card-value">{counts.novo}</p>
                </div>
                <div className="card-icon">🚀</div>
              </div>
              
              <div className="summary-card card-producao">
                <div className="card-info">
                  <h3>Em Produção</h3>
                  <p className="card-value">{counts.em_producao}</p>
                </div>
                <div className="card-icon">🍳</div>
              </div>

              <div className="summary-card card-pronto">
                <div className="card-info">
                  <h3>Prontos p/ Entrega</h3>
                  <p className="card-value">{counts.pronto}</p>
                </div>
                <div className="card-icon">🛍️</div>
              </div>

              <div className="summary-card card-entregue">
                <div className="card-info">
                  <h3>Entregues</h3>
                  <p className="card-value">{counts.entregue}</p>
                </div>
                <div className="card-icon">✅</div>
              </div>

              <div className="summary-card card-revenue">
                <div className="card-info">
                  <h3>Faturamento (Entregues)</h3>
                  <p className="card-value revenue-text">{formatPrice(revenue)}</p>
                </div>
                <div className="card-icon">💰</div>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="empty-state">Nenhum pedido encontrado no sistema.</div>
            ) : (
              <div className="tables-container">
                {renderOrderTable(newOrders, "Pedidos Recebidos (Novos)", "Não há novos pedidos no momento.")}
                {renderOrderTable(productionOrders, "Pedidos em Produção", "Nenhum pedido em produção.")}
                {renderOrderTable(readyOrders, "Pronto para Entrega/Retirada", "Nenhum pedido aguardando retirada/entrega.")}
                {renderOrderTable(deliveredOrders, "Pedidos Entregues", "Nenhum pedido finalizado ainda.")}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
