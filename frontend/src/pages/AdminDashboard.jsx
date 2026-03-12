import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('ativos'); // 'ativos' ou 'cancelados'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedulingOrder, setSchedulingOrder] = useState(null); // Pedido sendo agendado
  const [scheduledData, setScheduledData] = useState({ date: '', location: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const endpoint = activeTab === 'ativos' ? '/orders/admin/all' : '/orders/admin/history?includeDeleted=true';
      const response = await api.get(endpoint);
      
      let data = response.data;
      if (activeTab === 'cancelados') {
        // Filtrar apenas cancelados ou deletados
        data = data.filter(o => o.status === 'cancelado' || o.isDeleted);
      } else {
        // Garantir que na aba ativos não apareça o que foi 'soft-deleted' ou cancelado
        data = data.filter(o => !o.isDeleted && o.status !== 'cancelado');
      }

      setOrders(data);
      setIsLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError('Falha ao carregar os pedidos. Tente novamente mais tarde.');
        setIsLoading(false);
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Tem certeza que deseja excluir permanentemente este pedido da visão principal? (Ele continuará na lixeira)')) return;

    try {
      await api.delete(`/orders/admin/delete/${orderId}`);
      setOrders(orders.filter(o => o._id !== orderId));
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Não foi possível excluir o pedido.');
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
      await api.patch(`/orders/admin/status/${orderId}`, { status: newStatus });
      // Update local state directly to be faster, or refetch
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Não foi possível atualizar o status. Tente novamente.");
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/orders/admin/schedule/${schedulingOrder._id}`, {
        date: scheduledData.date,
        location: scheduledData.location
      });
      
      setOrders(orders.map(order => 
        order._id === schedulingOrder._id 
          ? { ...order, scheduledDeliveryDate: scheduledData.date, scheduledDeliveryLocation: scheduledData.location }
          : order
      ));
      
      setSchedulingOrder(null);
      setScheduledData({ date: '', location: '' });
      alert('Entrega agendada com sucesso!');
    } catch (err) {
      console.error("Erro ao agendar:", err);
      alert("Erro ao agendar entrega.");
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
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((order) => (
                <tr key={order._id} className={order.isDeleted ? 'row-deleted' : ''}>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.customerName}</td>
                  <td>{order.phone}</td>
                  <td>{order.city}</td>
                  <td>
                    {order.product}
                    {order.cancellationReason && (
                      <div className="cancel-reason-admin">Motivo: {order.cancellationReason}</div>
                    )}
                    {(order.scheduledDeliveryDate || order.scheduledDeliveryLocation) && (
                      <div className="scheduled-info-admin">
                        📍 {order.scheduledDeliveryLocation} - {order.scheduledDeliveryDate ? formatDate(order.scheduledDeliveryDate) : 'Data não definida'}
                      </div>
                    )}
                  </td>
                  <td>{order.quantity}</td>
                  <td className="price-col">{formatPrice(order.totalPrice)}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      {order.status !== 'cancelado' && !order.isDeleted && (
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
                      )}
                      
                      {!order.isDeleted && (
                        <button 
                          className="delete-item-btn" 
                          onClick={() => handleDeleteOrder(order._id)}
                          title="Excluir Pedido"
                        >
                          🗑️
                        </button>
                      )}

                      {!order.isDeleted && (
                        <button 
                          className="schedule-btn" 
                          onClick={() => {
                            setSchedulingOrder(order);
                            setScheduledData({
                              date: order.scheduledDeliveryDate ? new Date(order.scheduledDeliveryDate).toISOString().split('T')[0] : '',
                              location: order.scheduledDeliveryLocation || ''
                            });
                          }}
                          title="Agendar Entrega"
                        >
                          📅
                        </button>
                      )}
                      
                      {order.isDeleted && <span className="deleted-tag">EXCLUÍDO</span>}
                    </div>
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
        <div className="admin-container header-content">
          <h1>Painel de Pedidos</h1>
          <div className="header-right">
            <nav className="admin-tabs">
              <button 
                className={`tab-btn ${activeTab === 'ativos' ? 'active' : ''}`}
                onClick={() => setActiveTab('ativos')}
              >
                Ativos
              </button>
              <button 
                className={`tab-btn ${activeTab === 'cancelados' ? 'active' : ''}`}
                onClick={() => setActiveTab('cancelados')}
              >
                Cancelados / Lixeira
              </button>
            </nav>
            <button onClick={handleLogout} className="admin-logout-btn">Sair</button>
          </div>
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
              <div className="empty-state">Nenhum pedido encontrado nesta categoria.</div>
            ) : (
              <div className="tables-container">
                {activeTab === 'ativos' ? (
                  <>
                    {renderOrderTable(newOrders, "Pedidos Recebidos (Novos)", "Não há novos pedidos no momento.")}
                    {renderOrderTable(productionOrders, "Pedidos em Produção", "Nenhum pedido em produção.")}
                    {renderOrderTable(readyOrders, "Pronto para Entrega/Retirada", "Nenhum pedido aguardando retirada/entrega.")}
                    {renderOrderTable(deliveredOrders, "Pedidos Entregues", "Nenhum pedido finalizado ainda.")}
                  </>
                ) : (
                  renderOrderTable(orders, "Relatório de Cancelados e Excluídos", "Nenhum registro encontrado.")
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL DE AGENDAMENTO */}
      {schedulingOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Agendar Entrega</h3>
            <p>Defina a data e o local da entrega programada para <strong>{schedulingOrder.customerName}</strong>.</p>
            
            <form onSubmit={handleScheduleSubmit}>
              <div className="form-group">
                <label>Data de Entrega:</label>
                <input 
                  type="date" 
                  value={scheduledData.date}
                  onChange={(e) => setScheduledData({ ...scheduledData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Local de Entrega (Ponto de Encontro):</label>
                <input 
                  type="text" 
                  placeholder="Ex: Praça Central, Posto X..."
                  value={scheduledData.location}
                  onChange={(e) => setScheduledData({ ...scheduledData, location: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setSchedulingOrder(null)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-save">Salvar Agendamento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
