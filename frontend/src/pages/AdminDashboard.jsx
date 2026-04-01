import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('ativos'); // 'ativos', 'cancelados', 'produtos', 'relatorios'
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
    isAvailable: true,
    isLowStock: false,
    prices: {}
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const [filters, setFilters] = useState({
    customer: '',
    phone: '',
    city: '',
    product: '',
    date: ''
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  // Notification System State
  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('adminNotificationSettings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      soundEnabled: true,
      browserEnabled: true,
      soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2256/2256-preview.mp3'
    };
  });
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const lastProcessedOrderIdRef = useRef(null);
  const [browserPermission, setBrowserPermission] = useState('Notification' in window ? Notification.permission : 'default');

  useEffect(() => {
    localStorage.setItem('adminNotificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    if (notificationSettings.browserEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(e => console.error(e));
    }
  }, [notificationSettings.browserEnabled]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedFilters(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'produtos') {
      fetchProducts();
    } else {
      fetchOrders();
    }

    // Polling for new orders every 30 seconds
    const pollInterval = setInterval(() => {
      if (activeTab === 'ativos') {
        checkForNewOrders();
      }
    }, 30000);

    return () => clearInterval(pollInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function checkForNewOrders() {
    if (!notificationSettings.enabled) return;
    console.log("Checking for new orders... Last ID:", lastProcessedOrderIdRef.current);

    try {
      const response = await api.get('/orders/admin/all');
      const latestOrders = response.data.filter(o => !o.isDeleted && o.status !== 'cancelado');
      
      if (latestOrders.length > 0) {
        const mostRecentOrder = latestOrders[0];
        
        // If we haven't set a last processed ID yet, initialize it
        if (!lastProcessedOrderIdRef.current) {
          console.log("Initializing lastOrderIdRef:", mostRecentOrder._id);
          lastProcessedOrderIdRef.current = mostRecentOrder._id;
          return;
        }

        // Check if there's a newer order
        if (mostRecentOrder._id !== lastProcessedOrderIdRef.current) {
          console.log("NEW ORDER DETECTED!", mostRecentOrder._id);
          triggerNotification(mostRecentOrder);
          lastProcessedOrderIdRef.current = mostRecentOrder._id;
          // Refresh the list to show the new order
          setOrders(latestOrders);
        } else {
          console.log("No new orders.");
        }
      }
    } catch (err) {
      console.error("Erro ao verificar novos pedidos:", err);
    }
  };

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      alert("Seu navegador não suporta notificações.");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      if (permission === 'granted') {
        alert("Notificações autorizadas com sucesso!");
      } else {
        alert("Permissão de notificação: " + permission);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerNotification = (order) => {
    console.log("Triggering notification for order:", order._id);
    if (notificationSettings.soundEnabled) {
      const audio = new Audio(notificationSettings.soundUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir som:", e));
    }

    if (notificationSettings.browserEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Novo Pedido Recebido! 🚀', {
          body: `Cliente: ${order.customerName}\nProduto: ${order.product}`,
          icon: '/favicon.ico'
        });
      } catch (e) {
        console.error("Erro ao disparar notificação do navegador:", e);
      }
    } else {
      console.log("Browser notifications disabled or permission not granted.");
    }
  };

  async function fetchOrders() {
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
      if (data.length > 0 && activeTab === 'ativos') {
        lastProcessedOrderIdRef.current = data[0]._id;
      }
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

  const formatJustDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
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

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/admin/payment/${orderId}`, { paymentStatus: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, paymentStatus: newStatus } : order
      ));
    } catch (err) {
      console.error("Erro ao atualizar status de pagamento:", err);
      alert("Não foi possível atualizar o status de pagamento. Tente novamente.");
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

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
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
      isLowStock: product.isLowStock || false,
      prices: product.prices || {}
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validation: ensure prices Map doesn't have empty keys if hasMultiplePrices
      const cleanedPrices = {};
      Object.entries(productFormData.prices || {}).forEach(([w, p]) => {
        if (w.trim() && p > 0) {
          cleanedPrices[w.trim()] = p;
        }
      });

      const finalData = { ...productFormData, prices: cleanedPrices };

      if (editingProduct) {
        // Update
        const response = await api.put(`/products/admin/${editingProduct._id}`, finalData);
        setProducts(products.map(p => p._id === editingProduct._id ? response.data : p));
        alert('Produto atualizado!');
      } else {
        // Create
        const response = await api.post('/products/admin/', finalData);
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
      const response = await api.put(`/products/admin/${product._id}`, { isAvailable: newStatus });
      setProducts(products.map(p => p._id === product._id ? response.data : p));
    } catch (err) {
      console.error(err);
      alert('Erro ao mudar disponibilidade.');
    }
  };

  const handleToggleLowStock = async (product) => {
    try {
      const newStatus = !product.isLowStock;
      const response = await api.put(`/products/admin/${product._id}`, { isLowStock: newStatus });
      setProducts(products.map(p => p._id === product._id ? response.data : p));
    } catch (err) {
      console.error(err);
      alert('Erro ao mudar status de estoque baixo.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Excluir este produto permanentemente?')) return;
    try {
      await api.delete(`/products/admin/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      console.error(err);
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
    // Faturamento de todos os pedidos ativos
    const ativos = orders.filter((o) => o.status !== 'cancelado' && !o.isDeleted);
    return ativos.reduce((total, order) => total + (order.totalPrice || 0), 0);
  };

  const counts = getStatusCounts();
  const revenue = getRevenue();
  
  const generateReportData = () => {
    // Extra filter just for safety, but data comes already clean
    const validOrders = orders.filter(o => !o.isDeleted && o.status !== 'cancelado');
    const productCounts = {};
    validOrders.forEach(o => {
      const p = o.product ? o.product.trim() : 'Outros';
      productCounts[p] = (productCounts[p] || 0) + (o.quantity || 1);
    });
    
    const data = Object.keys(productCounts).map(key => ({
      name: key,
      quantidade: productCounts[key]
    }));
    
    return data.sort((a, b) => b.quantidade - a.quantidade);
  };
  
  const reportData = generateReportData();
  
  // Filtering logic for orders
  const filterOrders = (orderList) => {
    return orderList.filter(order => {
      const matchCustomer = order.customerName?.toLowerCase().includes(appliedFilters.customer.toLowerCase());
      const matchPhone = order.phone?.toLowerCase().includes(appliedFilters.phone.toLowerCase());
      const matchCity = order.city?.toLowerCase().includes(appliedFilters.city.toLowerCase());
      const matchProduct = order.product?.toLowerCase().includes(appliedFilters.product.toLowerCase());
      
      let matchDate = true;
      if (appliedFilters.date) {
        if (!order.scheduledDeliveryDate) {
          matchDate = false;
        } else {
          const orderDate = new Date(order.scheduledDeliveryDate).toISOString().split('T')[0];
          matchDate = orderDate === appliedFilters.date;
        }
      }

      return matchCustomer && matchPhone && matchCity && matchProduct && matchDate;
    });
  };

  // Filtering logic for products
  const filterProducts = (productList) => {
    return productList.filter(p => {
      const matchProduct = p.title?.toLowerCase().includes(appliedFilters.product.toLowerCase());
      const matchCategory = p.category?.toLowerCase().includes(appliedFilters.product.toLowerCase()); // Searching in category too
      return matchProduct || matchCategory;
    });
  };

  const filteredNewOrders = filterOrders(orders.filter((o) => o.status === 'novo'));
  const filteredProductionOrders = filterOrders(orders.filter((o) => o.status === 'em_producao'));
  const filteredReadyOrders = filterOrders(orders.filter((o) => o.status === 'pronto'));
  const filteredDeliveredOrders = filterOrders(orders.filter((o) => o.status === 'entregue'));
  const filteredRecycleBin = filterOrders(orders);

  const filteredProductsList = filterProducts(products);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    const emptyFilters = {
      customer: '',
      phone: '',
      city: '',
      product: '',
      date: ''
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

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
                <th>Cliente / Contato</th>
                <th>Produto</th>
                <th>Qtd / Total</th>
                <th>Pagamento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((order) => (
                <tr key={order._id} className={order.isDeleted ? 'row-deleted' : ''}>
                  <td style={{ fontSize: '12px' }}>{formatDate(order.createdAt)}</td>
                  <td>
                    <div style={{ fontWeight: '700' }}>{order.customerName}</div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                      📞 {order.phone} | 📍 {order.city}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{order.product}</div>
                    {order.cancellationReason && (
                      <div className="cancel-reason-admin">Motivo: {order.cancellationReason}</div>
                    )}
                    {(order.scheduledDeliveryDate || order.scheduledDeliveryLocation) && (
                      <div className="scheduled-info-admin">
                        {order.scheduledDeliveryLocation && order.scheduledDeliveryDate ? (
                          <>📍 {order.scheduledDeliveryLocation} - {formatJustDate(order.scheduledDeliveryDate)}</>
                        ) : order.scheduledDeliveryLocation ? (
                          <>📍 {order.scheduledDeliveryLocation}</>
                        ) : (
                          <>🗓️ Entrega: {formatJustDate(order.scheduledDeliveryDate)}</>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: '#666' }}>{order.quantity}x</div>
                    <div className="price-col" style={{ fontSize: '14px' }}>{formatPrice(order.totalPrice)}</div>
                  </td>
                  <td>
                    <select 
                      className={`payment-select payment-${order.paymentStatus || 'pendente'}`}
                      value={order.paymentStatus || 'pendente'}
                      onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                      disabled={order.isDeleted || order.status === 'cancelado'}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="pago">Pago</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
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
              <button 
                className={`tab-btn ${activeTab === 'relatorios' ? 'active' : ''}`}
                onClick={() => setActiveTab('relatorios')}
              >
                Relatórios
              </button>
            </nav>
            {activeTab === 'produtos' && (
              <button className="add-product-btn" onClick={() => {
                setIsAddingProduct(true);
                setEditingProduct(null);
                setProductFormData({
                  title: '', description: '', price: 0, category: 'Ovos de Colher',
                  filling: '', weight: '', imageUrl: '', isAvailable: true, isLowStock: false, prices: {}
                });
              }}>
                + Novo Ovo
              </button>
            )}
            <button 
              className="notification-settings-trigger" 
              onClick={() => setShowNotificationModal(true)}
              title="Configurações de Notificação"
            >
              🔔
            </button>
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
                <h2 className="table-title">Gerenciar Estoque ({filteredProductsList.length})</h2>
                
                <div className="filters-bar">
                  <div className="filter-group">
                    <label>Produto / Categoria</label>
                    <input 
                      type="text" 
                      name="product" 
                      placeholder="Buscar por nome ou categoria..." 
                      value={filters.product}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <button className="clear-filters-btn" onClick={clearFilters} title="Limpar Filtros">
                    Limpar
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Categoria / Info</th>
                        <th>Preço</th>
                        <th>Disponibilidade</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProductsList.map(p => (
                        <tr key={p._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img src={p.imageUrl} alt={p.title} className="admin-prod-thumb" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                              <strong>{p.title}</strong>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: '600', fontSize: '12px' }}>{p.category}</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>{p.weight} | {p.filling}</div>
                          </td>
                          <td className="price-col">{formatPrice(p.price)}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <button 
                                className={`stock-badge ${p.isAvailable ? 'in-stock' : 'out-of-stock'}`}
                                onClick={() => handleToggleAvailability(p)}
                                style={{ padding: '2px 6px', fontSize: '10px' }}
                              >
                                {p.isAvailable ? 'DISPONÍVEL' : 'ESGOTADO'}
                              </button>
                              <button 
                                className={`stock-badge ${p.isLowStock ? 'low-stock-active' : 'low-stock-inactive'}`}
                                onClick={() => handleToggleLowStock(p)}
                                title="Indicar que está quase esgotando"
                                style={{ padding: '2px 6px', fontSize: '10px' }}
                              >
                                {p.isLowStock ? 'QUASE ESGOTADO' : 'NORMAL'}
                              </button>
                            </div>
                          </td>
                          <td>
                            <div className="actions-cell">
                              <button className="edit-order-btn" onClick={() => handleEditProductClick(p)} title="Editar">✏️</button>
                              <button className="delete-item-btn" onClick={() => handleDeleteProduct(p._id)} title="Excluir">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === 'relatorios' ? (
              <div className="reports-section">
                <h2 className="table-title">Relatório de Vendas (Histórico T. / Ativos)</h2>
                
                <div className="reports-dashboard">
                  <div className="reports-counters">
                     <h3>Ranking de Produtos</h3>
                     <div className="ranking-list">
                       {reportData.map((item, index) => (
                         <div key={item.name} className="ranking-item">
                           <span className="ranking-pos">#{index + 1}</span>
                           <span className="ranking-name">{item.name}</span>
                           <span className="ranking-qtd">{item.quantidade} un.</span>
                         </div>
                       ))}
                     </div>
                  </div>
                  
                  <div className="reports-chart">
                    <h3>Gráfico de Vendas (Top 10)</h3>
                    <div className="chart-wrapper" style={{ width: '100%', height: '420px', overflowX: 'auto', overflowY: 'hidden' }}>
                      <div style={{ minWidth: '500px', height: '100%' }}>
                        <ResponsiveContainer>
                          <BarChart data={reportData.slice(0, 10)} margin={{ top: 20, right: 30, left: 10, bottom: 100 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              angle={-45} 
                              textAnchor="end" 
                              interval={0} 
                              tick={{ fill: 'var(--text-color)', fontSize: 11 }} 
                              tickFormatter={(value) => value.length > 25 ? value.substring(0, 25) + '...' : value}
                            />
                            <YAxis allowDecimals={false} tick={{ fill: 'var(--text-color)' }} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'var(--bg-glass)', borderColor: 'var(--accent-gold)', borderRadius: '12px' }}
                              itemStyle={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}
                              cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
                            />
                            <Bar dataKey="quantidade" fill="var(--accent-gold)" radius={[4, 4, 0, 0]} name="Qtd. Vendida" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
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
                      <h3>Faturamento Total</h3>
                      <p className="card-value revenue-text">{formatPrice(revenue)}</p>
                    </div>
                    <div className="card-icon">💰</div>
                  </div>
                </div>

                <div className="filters-bar">
                  <div className="filter-group">
                    <label>Cliente</label>
                    <input 
                      type="text" 
                      name="customer" 
                      placeholder="Filtrar por nome..." 
                      value={filters.customer}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="filter-group">
                    <label>Telefone</label>
                    <input 
                      type="text" 
                      name="phone" 
                      placeholder="Filtrar por telefone..." 
                      value={filters.phone}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="filter-group">
                    <label>Cidade</label>
                    <input 
                      type="text" 
                      name="city" 
                      placeholder="Filtrar por cidade..." 
                      value={filters.city}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="filter-group">
                    <label>Produto</label>
                    <input 
                      type="text" 
                      name="product" 
                      placeholder="Filtrar por produto..." 
                      value={filters.product}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="filter-group">
                    <label>Data de Entrega</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={filters.date}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <button className="clear-filters-btn" onClick={clearFilters} title="Limpar Filtros">
                    Limpar
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="empty-state">Nenhum pedido encontrado nesta categoria.</div>
                ) : (
                  <div className="tables-container">
                    {activeTab === 'ativos' ? (
                      <>
                        {renderOrderTable(filteredNewOrders, "Pedidos Recebidos (Novos)", "Não há novos pedidos no momento.")}
                        {renderOrderTable(filteredProductionOrders, "Pedidos em Produção", "Nenhum pedido em produção.")}
                        {renderOrderTable(filteredReadyOrders, "Pronto para Entrega/Retirada", "Nenhum pedido aguardando retirada/entrega.")}
                        {renderOrderTable(filteredDeliveredOrders, "Pedidos Entregues", "Nenhum pedido finalizado ainda.")}
                      </>
                    ) : (
                      renderOrderTable(filteredRecycleBin, "Relatório de Cancelados e Excluídos", "Nenhum registro encontrado.")
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
                    <option value="Kit Degustação">Kit Degustação</option>
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
                <div className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" name="isLowStock" checked={productFormData.isLowStock} onChange={handleProductChange} />
                    Quase Esgotado (Aviso no Front)
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

      {showNotificationModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Configurações de Notificação</h3>
            <div className="notification-settings-content">
              <div className="setting-row" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600' }}>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.enabled} 
                    onChange={(e) => setNotificationSettings({...notificationSettings, enabled: e.target.checked})}
                    style={{ width: 'auto' }}
                  />
                  Ativar Sistema de Notificações
                </label>
              </div>
              
              <div className="setting-row" style={{ marginLeft: '20px', marginBottom: '15px', opacity: notificationSettings.enabled ? 1 : 0.5 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    disabled={!notificationSettings.enabled}
                    checked={notificationSettings.soundEnabled} 
                    onChange={(e) => setNotificationSettings({...notificationSettings, soundEnabled: e.target.checked})}
                    style={{ width: 'auto' }}
                  />
                  Alerta Sonoro
                </label>
              </div>

              <div className="setting-row" style={{ marginLeft: '20px', marginBottom: '15px', opacity: (notificationSettings.enabled && notificationSettings.soundEnabled) ? 1 : 0.5 }}>
                <label style={{ marginBottom: '5px', display: 'block', fontSize: '14px' }}>URL do Som MP3:</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    disabled={!notificationSettings.enabled || !notificationSettings.soundEnabled}
                    value={notificationSettings.soundUrl}
                    onChange={(e) => setNotificationSettings({...notificationSettings, soundUrl: e.target.value})}
                    placeholder="Link do arquivo MP3..."
                    style={{ flex: 1, padding: '8px' }}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const audio = new Audio(notificationSettings.soundUrl);
                      audio.play().catch(() => alert("Erro ao tocar som. Verifique o link."));
                    }}
                    disabled={!notificationSettings.enabled || !notificationSettings.soundEnabled}
                    style={{ padding: '8px 12px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    ▶️
                  </button>
                </div>
              </div>

              <div className="setting-row" style={{ marginLeft: '20px', marginBottom: '15px', opacity: notificationSettings.enabled ? 1 : 0.5 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    disabled={!notificationSettings.enabled}
                    checked={notificationSettings.browserEnabled} 
                    onChange={(e) => setNotificationSettings({...notificationSettings, browserEnabled: e.target.checked})}
                    style={{ width: 'auto' }}
                  />
                  Notificações do Navegador
                </label>
                
                <div style={{ marginLeft: '25px', marginTop: '5px', fontSize: '13px' }}>
                  Permissão: 
                  <span style={{ 
                    fontWeight: 'bold', 
                    marginLeft: '5px',
                    color: browserPermission === 'granted' ? '#2e7d32' : (browserPermission === 'denied' ? '#c62828' : '#f57c00')
                  }}>
                    {browserPermission === 'granted' ? 'Autorizado' : (browserPermission === 'denied' ? 'Bloqueado' : 'Não Solicitado')}
                  </span>
                  
                  {browserPermission !== 'granted' && (
                    <button 
                      type="button"
                      onClick={handleRequestPermission}
                      style={{ 
                        marginLeft: '10px', 
                        padding: '4px 8px', 
                        fontSize: '11px', 
                        background: '#128C7E', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Autorizar no Chrome
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button onClick={() => setShowNotificationModal(false)} className="btn-save">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
