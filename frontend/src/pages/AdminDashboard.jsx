import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('ativos'); // 'ativos', 'cancelados', 'produtos'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals for Orders
  const [schedulingOrder, setSchedulingOrder] = useState(null);
  const [scheduledData, setScheduledData] = useState({ date: '', location: '' });
  const [editingOrder, setEditingOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Modals for Products
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'Ovos de Colher',
    filling: '',
    weight: '',
    imageUrl: '',
    isAvailable: true
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'produtos') {
      fetchProducts();
    } else {
      fetchOrders();
    }
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

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setEditFormData({
      customerName: order.customerName,
      phone: order.phone,
      city: order.city,
      product: order.product,
      quantity: order.quantity,
      totalPrice: order.totalPrice
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/orders/admin/update/${editingOrder._id}`, editFormData);
      
      setOrders(orders.map(order => 
        order._id === editingOrder._id ? response.data : order
      ));
      
      setEditingOrder(null);
      alert('Pedido atualizado com sucesso!');
    } catch (err) {
      console.error("Erro ao atualizar pedido:", err);
      alert("Erro ao atualizar os detalhes do pedido.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'totalPrice' ? Number(value) : value
    }));
  };

  // --- PRODUCT MANAGEMENT LOGIC ---

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Falha ao carregar os produtos.');
      setIsLoading(false);
    }
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setProductFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category || 'Ovos de Colher',
      filling: product.filling || '',
      weight: product.weight || '',
      imageUrl: product.imageUrl || '',
      isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
      prices: product.prices || {}
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validation: ensure prices Map doesn't have empty keys if hasMultiplePrices
      const cleanedPrices = {};
      Object.entries(productFormData.prices).forEach(([w, p]) => {
        if (w.trim() && p > 0) {
          cleanedPrices[w.trim()] = p;
        }
      });

      const finalData = { ...productFormData, prices: cleanedPrices };

      if (editingProduct) {
        // Update
        const response = await api.put(`/products/${editingProduct._id}`, finalData);
        setProducts(products.map(p => p._id === editingProduct._id ? response.data : p));
        alert('Produto atualizado!');
      } else {
        // Create
        const response = await api.post('/products', finalData);
        setProducts([response.data, ...products]);
        alert('Produto criado com sucesso!');
      }
      setEditingProduct(null);
      setIsAddingProduct(false);
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      alert('Erro ao salvar produto.');
    }
  };

  const handlePriceRowChange = (oldWeight, newWeight, newPrice) => {
    setProductFormData(prev => {
      const newPrices = { ...prev.prices };
      if (oldWeight !== newWeight) {
        delete newPrices[oldWeight];
      }
      newPrices[newWeight] = newPrice;
      return { ...prev, prices: newPrices };
    });
  };

  const addPriceRow = () => {
    setProductFormData(prev => ({
      ...prev,
      prices: { ...prev.prices, "": 0 }
    }));
  };

  const removePriceRow = (weight) => {
    setProductFormData(prev => {
      const newPrices = { ...prev.prices };
      delete newPrices[weight];
      return { ...prev, prices: newPrices };
    });
  };

  const handleToggleAvailability = async (product) => {
    try {
      const newStatus = !product.isAvailable;
      const response = await api.put(`/products/${product._id}`, { isAvailable: newStatus });
      setProducts(products.map(p => p._id === product._id ? response.data : p));
    } catch (err) {
      alert('Erro ao mudar disponibilidade.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Excluir este produto permanentemente?')) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      alert('Erro ao excluir produto.');
    }
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? Number(value) : value)
    }));
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
                        <>
                          <button 
                            className="delete-item-btn" 
                            onClick={() => handleDeleteOrder(order._id)}
                            title="Excluir Pedido"
                          >
                            🗑️
                          </button>

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

                          <button 
                            className="edit-order-btn" 
                            onClick={() => handleEditClick(order)}
                            title="Editar Detalhes"
                          >
                            ✏️
                          </button>
                        </>
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
                className={`tab-btn ${activeTab === 'produtos' ? 'active' : ''}`}
                onClick={() => setActiveTab('produtos')}
              >
                Produtos
              </button>
              <button 
                className={`tab-btn ${activeTab === 'cancelados' ? 'active' : ''}`}
                onClick={() => setActiveTab('cancelados')}
              >
                Lixeira
              </button>
            </nav>
            {activeTab === 'produtos' && (
              <button className="add-product-btn" onClick={() => {
                setIsAddingProduct(true);
                setEditingProduct(null);
                setProductFormData({
                  title: '', description: '', price: 0, category: 'Ovos de Colher',
                  filling: '', weight: '', imageUrl: '', isAvailable: true
                });
              }}>
                + Novo Ovo
              </button>
            )}
            <button onClick={handleLogout} className="admin-logout-btn">Sair</button>
          </div>
        </div>
      </header>

      <main className="admin-main admin-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Carregando...</p>
          </div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : (
          <>
            {activeTab === 'produtos' ? (
              <div className="table-section">
                <h2 className="table-title">Gerenciar Estoque ({products.length})</h2>
                <div className="table-wrapper">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Imagem</th>
                        <th>Ovo / Produto</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id}>
                          <td>
                            <img src={p.imageUrl} alt={p.title} className="admin-prod-thumb" />
                          </td>
                          <td>
                            <strong>{p.title}</strong>
                            <div className="admin-prod-meta">{p.weight} | {p.filling}</div>
                          </td>
                          <td>{p.category}</td>
                          <td className="price-col">{formatPrice(p.price)}</td>
                          <td>
                            <button 
                              className={`stock-badge ${p.isAvailable ? 'in-stock' : 'out-of-stock'}`}
                              onClick={() => handleToggleAvailability(p)}
                            >
                              {p.isAvailable ? 'DISPONÍVEL' : 'ESGOTADO'}
                            </button>
                          </td>
                          <td>
                            <div className="actions-cell">
                              <button className="edit-order-btn" onClick={() => handleEditProductClick(p)}>✏️</button>
                              <button className="delete-item-btn" onClick={() => handleDeleteProduct(p._id)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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

      {/* MODAL DE EDIÇÃO DE PEDIDO */}
      {editingOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Editar Pedido</h3>
            <p>Alterar detalhes do pedido de <strong>{editingOrder.customerName}</strong>.</p>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Nome do Cliente:</label>
                <input 
                  type="text" 
                  name="customerName"
                  value={editFormData.customerName || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Telefone:</label>
                <input 
                  type="text" 
                  name="phone"
                  value={editFormData.phone || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>Cidade:</label>
                <input 
                  type="text" 
                  name="city"
                  value={editFormData.city || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>Produto:</label>
                <input 
                  type="text" 
                  name="product"
                  value={editFormData.product || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="grid-form">
                <div className="form-group">
                  <label>Quantidade:</label>
                  <input 
                    type="number" 
                    name="quantity"
                    value={editFormData.quantity || 0}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Valor Total (R$):</label>
                  <input 
                    type="number" 
                    step="0.01"
                    name="totalPrice"
                    value={editFormData.totalPrice || 0}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setEditingOrder(null)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-save">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO/CRIAÇÃO DE PRODUTO */}
      {(editingProduct || isAddingProduct) && (
        <div className="admin-modal-overlay">
          <div className="admin-modal wide-modal">
            <h3>{editingProduct ? 'Editar Ovo' : 'Novo Ovo / Produto'}</h3>
            <p>Preencha as informações que aparecerão no site.</p>
            
            <form onSubmit={handleProductSubmit}>
              <div className="grid-form">
                <div className="form-group">
                  <label>Título:</label>
                  <input type="text" name="title" value={productFormData.title} onChange={handleProductChange} required />
                </div>
                <div className="form-group">
                  <label>Preço (R$):</label>
                  <input type="number" step="0.01" name="price" value={productFormData.price} onChange={handleProductChange} required />
                </div>
                <div className="form-group">
                  <label>Categoria:</label>
                  <select name="category" value={productFormData.category} onChange={handleProductChange}>
                    <option value="Ovos de Colher">Ovos de Colher</option>
                    <option value="Trufados">Trufados</option>
                    <option value="Colher 50g">Colher 50g</option>
                    <option value="Trio de Ovos">Trio de Ovos</option>
                    <option value="Infantil">Infantil</option>
                    <option value="Diversos">Diversos</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Peso (ex: 250g):</label>
                  <input type="text" name="weight" value={productFormData.weight} onChange={handleProductChange} />
                </div>
                <div className="form-group full-width">
                  <label>Descrição:</label>
                  <textarea name="description" value={productFormData.description} onChange={handleProductChange} required></textarea>
                </div>
                <div className="form-group">
                  <label>Recheio:</label>
                  <input type="text" name="filling" value={productFormData.filling} onChange={handleProductChange} />
                </div>
                <div className="form-group">
                  <label>URL da Imagem:</label>
                  <input type="text" name="imageUrl" value={productFormData.imageUrl} onChange={handleProductChange} placeholder="Ex: /uploads/ovo.jpg" />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" name="isAvailable" checked={productFormData.isAvailable} onChange={handleProductChange} />
                    Disponível para venda
                  </label>
                </div>

                <div className="form-group full-width prices-management">
                  <label>Variações de Peso e Preço:</label>
                  <p className="form-help">Utilize esta seção para ovos que possuem tamanhos diferentes (Ex: 250g, 350g).</p>
                  
                  <div className="prices-list">
                    {Object.entries(productFormData.prices).map(([weight, price], index) => (
                      <div key={index} className="price-row">
                        <input 
                          type="text" 
                          placeholder="Peso (ex: 250g)" 
                          value={weight} 
                          onChange={(e) => handlePriceRowChange(weight, e.target.value, price)}
                        />
                        <input 
                          type="number" 
                          placeholder="Preço (R$)" 
                          value={price} 
                          step="0.01"
                          onChange={(e) => handlePriceRowChange(weight, weight, Number(e.target.value))}
                        />
                        <button type="button" className="remove-price-btn" onClick={() => removePriceRow(weight)}>✕</button>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="add-price-row-btn" onClick={addPriceRow}>
                    + Adicionar Variação de Peso
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-save">Salvar Produto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
