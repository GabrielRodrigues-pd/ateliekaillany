import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  Eye, EyeOff, Rocket, ChefHat, Package, CheckCircle, 
  LayoutDashboard, ShoppingBag, Trash2, BarChart3, 
  Wrench, Bell, LogOut, Search, Settings, Shield, HelpCircle,
  Menu, X, Edit, Calendar
} from 'lucide-react';
import api from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('ativos'); // 'ativos', 'cancelados', 'produtos', 'relatorios', 'producao'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const lastProcessedOrderIdRef = useRef(null);
  const [browserPermission, setBrowserPermission] = useState('Notification' in window ? Notification.permission : 'default');

  const [showRevenue, setShowRevenue] = useState(() => {
    const saved = localStorage.getItem('adminShowRevenue');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('adminNotificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    localStorage.setItem('adminShowRevenue', JSON.stringify(showRevenue));
  }, [showRevenue]);

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
    } else if (activeTab === 'producao') {
      fetchOrders();
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

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90; // Topbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      // Close sidebar if on mobile
      setIsSidebarOpen(false);
    }
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
    const productDataMap = {};
    
    validOrders.forEach(o => {
      const p = o.product ? o.product.trim() : 'Outros';
      if (!productDataMap[p]) {
        productDataMap[p] = { quantidade: 0, faturamento: 0 };
      }
      productDataMap[p].quantidade += (o.quantity || 1);
      productDataMap[p].faturamento += (o.totalPrice || 0);
    });
    
    const data = Object.keys(productDataMap).map(key => ({
      name: key,
      quantidade: productDataMap[key].quantidade,
      faturamento: productDataMap[key].faturamento
    }));
    
    return data.sort((a, b) => b.quantidade - a.quantidade);
  };
  
  const reportData = generateReportData();
  
  const calculateProductionData = () => {
    // Filtrar apenas pedidos ativos que precisam ser produzidos (novos e em_producao)
    const validOrders = orders.filter(o => !o.isDeleted && (o.status === 'novo' || o.status === 'em_producao'));
    
    // Aplicar filtro de data se houver um selecionado
    let filteredByDate = validOrders;
    if (appliedFilters.date) {
      filteredByDate = validOrders.filter(order => {
        if (!order.scheduledDeliveryDate) return false;
        const orderDate = new Date(order.scheduledDeliveryDate).toISOString().split('T')[0];
        return orderDate === appliedFilters.date;
      });
    }

    const production = {};

    filteredByDate.forEach(order => {
      // O campo order.product pode conter múltiplos itens: "1x Ovo Ferrero - 350g, 2x Ovo Ninho"
      const items = (order.product || "").split(', ');
      
      items.forEach(itemStr => {
        // Extrair quantidade e título do produto (ex: "1x Ovo Ferrero - 350g")
        const match = itemStr.match(/^(\d+)x\s+(.+)$/);
        if (!match) return;

        const quantity = parseInt(match[1]);
        const fullTitle = match[2].trim();
        
        // Tentar extrair o peso se houver um hífen (ex: "Ovo Ferrero - 350g")
        let title = fullTitle;
        let weight = "";
        
        if (fullTitle.includes(' - ')) {
          const parts = fullTitle.split(' - ');
          weight = parts.pop().trim();
          title = parts.join(' - ').trim();
        }

        // Tentar encontrar o produto no catálogo para pegar a categoria real
        const product = products.find(p => p.title.trim() === title.trim() || p.title.trim() === fullTitle.trim());
        const category = product ? product.category : "Diversos";
        
        // Se o peso não foi extraído do título, tentar pegar o peso padrão do produto
        if (!weight && product) {
          weight = product.weight || "N/A";
        }

        // Regras de contagem de cascas baseadas nas ressalvas do usuário
        let shellsPerUnit = 1;
        let shellWeight = weight;
        const catLower = category.toLowerCase();
        
        if (catLower.includes('colher')) {
          shellsPerUnit = 1;
          // Os pesos já vêm do pedido (50g, 150g, 250g, 350g)
        } else if (catLower.includes('trufado')) {
          shellsPerUnit = 2;
          // Pesos: 150g e 250g
        } else if (catLower.includes('tradicional')) {
          shellsPerUnit = 2;
          // Pesos: 50g, 150g, 250g, 350g
        } else if (catLower.includes('trio')) {
          shellsPerUnit = 3;
          shellWeight = "50g"; // Trio de Ovos usa 3 cascas de 50g
        } else if (catLower.includes('degustação') || catLower.includes('degustacao')) {
          shellsPerUnit = 4;
          shellWeight = "50g"; // Kit Degustação usa 4 cascas de 50g
        } else if (catLower.includes('infantil')) {
          shellsPerUnit = 1;
          shellWeight = "150g"; // Infantil usa 1 casca de 150g
        }

        const key = `${category}|${shellWeight}`;
        if (!production[key]) {
          production[key] = {
            category,
            weight: shellWeight,
            totalOrders: 0,
            totalShells: 0,
            details: []
          };
        }

        production[key].totalOrders += quantity;
        production[key].totalShells += (quantity * shellsPerUnit);
        
        const existingDetail = production[key].details.find(d => d.title === title);
        if (existingDetail) {
          existingDetail.qty += quantity;
        } else {
          production[key].details.push({ title, qty: quantity });
        }
      });
    });

    return Object.values(production).sort((a, b) => a.category.localeCompare(b.category));
  };

  const productionData = calculateProductionData();
  const totalShellsNeeded = productionData.reduce((acc, curr) => acc + curr.totalShells, 0);
  
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

  const renderOrderTable = (orderList, title, emptyMessage, id) => (
    <div className="table-section-modern" id={id}>
      <div className="section-header">
        <h2 className="section-title">{title} ({orderList.length})</h2>
      </div>
      
      <div className="table-card shadow-sm">
        {orderList.length === 0 ? (
          <div className="empty-state-modern">
            <Package size={32} opacity={0.2} />
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Info Pedido</th>
                  <th>Cliente / Contato</th>
                  <th>Produto / Entrega</th>
                  <th>Total</th>
                  <th>Pagamento</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map((order) => (
                  <tr key={order._id} className={order.isDeleted ? 'row-deleted' : ''}>
                    <td>
                      <div className="order-id">#{order._id?.substring(0, 6)}</div>
                      <div className="order-date">{formatDate(order.createdAt)}</div>
                    </td>
                    <td>
                      <span className="customer-name">{order.customerName}</span>
                      <div className="customer-sub">
                         {order.phone} | {order.city}
                      </div>
                    </td>
                    <td>
                      <div className="product-item-name">{order.product}</div>
                      {order.cancellationReason && (
                        <div className="cancel-reason-text">Motivo: {order.cancellationReason}</div>
                      )}
                      {(order.scheduledDeliveryDate || order.scheduledDeliveryLocation) && (
                        <div className="scheduled-badge">
                          {order.scheduledDeliveryLocation && order.scheduledDeliveryDate ? (
                            <>📍 {order.scheduledDeliveryLocation} - {formatJustDate(order.scheduledDeliveryDate)}</>
                          ) : order.scheduledDeliveryLocation ? (
                            <>📍 {order.scheduledDeliveryLocation}</>
                          ) : (
                            <>🗓️ {formatJustDate(order.scheduledDeliveryDate)}</>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="qty-label">{order.quantity}x</div>
                      <div className="price-col">{formatPrice(order.totalPrice)}</div>
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
                      <span className={`status-badge-modern status-${order.status}`}>
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
                            <option value="em_producao">Produção</option>
                            <option value="pronto">Pronto</option>
                            <option value="entregue">Entrega</option>
                          </select>
                        )}
                        
                        {!order.isDeleted && (
                          <>
                            <button className="icon-action-btn" onClick={() => handleEditClick(order)} title="Editar"><Edit size={16} /></button>
                            <button className="icon-action-btn" onClick={() => {
                              setSchedulingOrder(order);
                              setScheduledData({
                                date: order.scheduledDeliveryDate ? new Date(order.scheduledDeliveryDate).toISOString().split('T')[0] : '',
                                location: order.scheduledDeliveryLocation || ''
                              });
                            }} title="Agendar"><Calendar size={16} /></button>
                            <button className="icon-action-btn delete" onClick={() => handleDeleteOrder(order._id)} title="Excluir"><Trash2 size={16} /></button>
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
    </div>
  );

  return (
    <>
      <div className="admin-layout">
        {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
        {/* SIDEBAR */}
        <aside className={`admin-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-logo">
            <Rocket size={32} />
            <h2>Ateliê Controller</h2>
          </div>
          
          <nav className="sidebar-nav">
            <div className="nav-section">
              <span className="section-label">Geral</span>
              <button 
                className={`sidebar-btn ${activeTab === 'ativos' ? 'active' : ''}`}
                onClick={() => setActiveTab('ativos')}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </button>
              <button 
                className={`sidebar-btn ${activeTab === 'relatorios' ? 'active' : ''}`}
                onClick={() => setActiveTab('relatorios')}
              >
                <BarChart3 size={20} />
                Relatórios
              </button>
              <button 
                className={`sidebar-btn ${activeTab === 'producao' ? 'active' : ''}`}
                onClick={() => setActiveTab('producao')}
              >
                <ChefHat size={20} />
                Produção
              </button>
            </div>

            <div className="nav-section">
              <span className="section-label">Ferramentas</span>
              <button 
                className={`sidebar-btn ${activeTab === 'produtos' ? 'active' : ''}`}
                onClick={() => setActiveTab('produtos')}
              >
                <ShoppingBag size={20} />
                Produtos
              </button>
              <button 
                className={`sidebar-btn ${activeTab === 'cancelados' ? 'active' : ''}`}
                onClick={() => setActiveTab('cancelados')}
              >
                <Trash2 size={20} />
                Lixeira
              </button>
            </div>

            <div className="nav-section">
              <span className="section-label">Suporte</span>
              <button 
                className="sidebar-btn" 
                onClick={() => setShowNotificationModal(true)}
              >
                <Bell size={20} />
                Notificações
              </button>
              <button className="sidebar-btn" onClick={() => alert('Configurações em breve')}>
                <Settings size={20} />
                Ajustes
              </button>
            </div>
          </nav>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-button">
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="admin-content-wrapper">
          {/* TOPBAR */}
          <header className="admin-topbar">
            <div className="topbar-left">
              <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
              </button>
            </div>
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                name="product" 
                placeholder="Buscar produtos, clientes ou pedidos..." 
                value={filters.product}
                onChange={handleFilterChange}
              />
              {Object.values(filters).some(v => v !== '') && (
                <button className="clear-filter-btn" onClick={clearFilters} title="Limpar Filtros">
                  <X size={14} />
                  Limpar
                </button>
              )}
            </div>
            
            <div className="topbar-actions">
              <div className="user-profile">
                <div className="user-info">
                  <span className="user-name">Kaillany Souza</span>
                  <span className="user-role">Administradora</span>
                </div>
                <div className="user-avatar">KS</div>
              </div>
            </div>
          </header>

          <main className="admin-main-content">
            {isLoading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Carregando...</p>
              </div>
            ) : error ? (
              <div className="error-state">{error}</div>
            ) : (
              <div className="dashboard-content animate-in">
                {activeTab === 'produtos' ? (
                  <div className="table-section-modern">
                    <div className="section-header">
                      <h2 className="section-title">Gerenciar Estoque ({filteredProductsList.length})</h2>
                      <button className="add-product-btn-modern" onClick={() => {
                        setIsAddingProduct(true);
                        setEditingProduct(null);
                        setProductFormData({
                          title: '', description: '', price: 0, category: 'Ovos de Colher',
                          filling: '', weight: '', imageUrl: '', isAvailable: true, isLowStock: false, prices: {}
                        });
                      }}>
                        + Novo Ovo
                      </button>
                    </div>
                    
                    <div className="table-card shadow-sm">
                      <div className="table-wrapper">
                        <table className="modern-table">
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
                                  <div className="product-table-info">
                                    <img src={p.imageUrl} alt={p.title} className="modern-prod-thumb" />
                                    <strong>{p.title}</strong>
                                  </div>
                                </td>
                                <td>
                                  <span className="customer-name">{p.category}</span>
                                  <div className="customer-sub">{p.weight} | {p.filling}</div>
                                </td>
                                <td className="price-col">{formatPrice(p.price)}</td>
                                <td>
                                  <div className="stock-controls">
                                    <button 
                                      className={`stock-badge-modern ${p.isAvailable ? 'available' : 'unavailable'}`}
                                      onClick={() => handleToggleAvailability(p)}
                                    >
                                      {p.isAvailable ? 'DISPONÍVEL' : 'ESGOTADO'}
                                    </button>
                                  </div>
                                </td>
                                <td>
                                  <div className="actions-cell">
                                    <button className="icon-action-btn" onClick={() => handleEditProductClick(p)} title="Editar">✏️</button>
                                    <button className="icon-action-btn delete" onClick={() => handleDeleteProduct(p._id)} title="Excluir">🗑️</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'relatorios' ? (
                  <div className="reports-section-modern">
                    <h2 className="section-title">Relatório de Vendas (Histórico T. / Ativos)</h2>
                    
                    <div className="reports-grid">
                      <div className="ranking-card shadow-sm">
                        <div className="card-header">
                          <h3>Ranking de Produtos</h3>
                        </div>
                        <div className="ranking-list">
                          {reportData.map((item, index) => (
                            <div key={item.name} className="ranking-item">
                              <span className="ranking-pos">{index + 1}</span>
                              <span className="ranking-name">{item.name}</span>
                              <span className="ranking-qtd">{item.quantidade} un.</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="chart-card shadow-sm">
                        <h3>Gráfico de Vendas (Top 10)</h3>
                        <div className="chart-wrapper">
                          <ResponsiveContainer>
                            <BarChart data={reportData.slice(0, 10)} margin={{ top: 20, right: 30, left: 10, bottom: 80 }}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                              <XAxis 
                                dataKey="name" 
                                angle={-45} 
                                textAnchor="end" 
                                interval={0} 
                                tick={{ fill: '#64748b', fontSize: 11 }} 
                                tickFormatter={(value) => value.length > 20 ? value.substring(0, 20) + '...' : value}
                              />
                              <YAxis allowDecimals={false} tick={{ fill: '#64748b' }} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                cursor={{ fill: 'rgba(217, 106, 117, 0.05)' }}
                              />
                              <Bar dataKey="quantidade" fill="var(--primary)" radius={[6, 6, 0, 0]} name="Qtd. Vendida" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="finance-table-card shadow-sm">
                      <div className="card-header-flex">
                        <h3 className="card-subtitle">Detalhamento Financeiro</h3>
                        <div className="total-badge-modern">
                          <div className="total-info">
                            <span>FATURAMENTO TOTAL</span>
                            <strong>{showRevenue ? formatPrice(revenue) : 'R$ •••••'}</strong>
                          </div>
                          <button onClick={() => setShowRevenue(!showRevenue)} className="toggle-view-btn">
                            {showRevenue ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="table-wrapper">
                        <table className="modern-table">
                          <thead>
                            <tr>
                              <th>Produto</th>
                              <th style={{ textAlign: 'center' }}>Qtd. Vendida</th>
                              <th style={{ textAlign: 'right' }}>Faturamento (R$)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.map((item) => (
                              <tr key={item.name}>
                                <td><strong>{item.name}</strong></td>
                                <td style={{ textAlign: 'center' }}>{item.quantidade} un.</td>
                                <td style={{ textAlign: 'right' }} className="price-col">
                                  {showRevenue ? formatPrice(item.faturamento) : 'R$ •••••'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'producao' ? (
                  <div className="production-section-modern">
                    <div className="section-header">
                      <h2 className="section-title">Controle de Produção de Cascas</h2>
                      <div className="total-shells-pill">
                        Meta Global: <strong>{totalShellsNeeded}</strong> cascas
                      </div>
                    </div>

                    <div className="filters-row shadow-sm">
                      <div className="filter-item">
                        <label>Data de Entrega</label>
                        <input 
                          type="date" 
                          name="date" 
                          value={filters.date}
                          onChange={handleFilterChange}
                          className="modern-input"
                        />
                      </div>
                      <button className="clear-filter-btn" onClick={clearFilters}>
                        <X size={14} />
                        Ver Tudo
                      </button>
                      <span className="filter-description">
                        {appliedFilters.date 
                          ? `Produção para entrega em ${formatJustDate(appliedFilters.date)}.`
                          : "Mostrando todos os pedidos novos e em produção."}
                      </span>
                    </div>

                    <div className="production-card shadow-sm">
                      <div className="table-wrapper">
                        <table className="modern-table production-table">
                          <thead>
                            <tr>
                              <th>Categoria / Tipo</th>
                              <th>Peso da Casca</th>
                              <th>Qtd. Pedidos</th>
                              <th>Total de Cascas</th>
                              <th>Detalhes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productionData.map((item, idx) => (
                              <tr key={idx}>
                                <td><strong>{item.category}</strong></td>
                                <td><span className="modern-weight-badge">{item.weight}</span></td>
                                <td>{item.totalOrders} un.</td>
                                <td>
                                  <span className="shell-count-number">{item.totalShells}</span>
                                </td>
                                <td className="production-details-cell">
                                  {item.details.map((d, i) => (
                                    <div key={i} className="prod-detail-item">
                                      {d.qty}x {d.title}
                                    </div>
                                  ))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Summary Cards */}
                    <div className="metric-cards-grid">
                      <div className="metric-card metric-novo clickable" onClick={() => scrollToSection('secao-novo')}>
                        <div className="metric-icon"><Rocket size={24} /></div>
                        <div className="metric-info">
                          <h3>Pedidos Novos</h3>
                          <p className="metric-value">{counts.novo}</p>
                          <span className="metric-status">Aguardando início</span>
                        </div>
                      </div>
                      
                      <div className="metric-card metric-producao clickable" onClick={() => scrollToSection('secao-producao')}>
                        <div className="metric-icon"><ChefHat size={24} /></div>
                        <div className="metric-info">
                          <h3>Em Produção</h3>
                          <p className="metric-value">{counts.em_producao}</p>
                          <span className="metric-status">Cozinha ativa</span>
                        </div>
                      </div>

                      <div className="metric-card metric-pronto clickable" onClick={() => scrollToSection('secao-pronto')}>
                        <div className="metric-icon"><Package size={24} /></div>
                        <div className="metric-info">
                          <h3>Prontos</h3>
                          <p className="metric-value">{counts.pronto}</p>
                          <span className="metric-status">Pronto p/ entrega</span>
                        </div>
                      </div>

                      <div className="metric-card metric-entregue clickable" onClick={() => scrollToSection('secao-entregue')}>
                        <div className="metric-icon"><CheckCircle size={24} /></div>
                        <div className="metric-info">
                          <h3>Entregues</h3>
                          <p className="metric-value">{counts.entregue}</p>
                          <span className="metric-status">Meta atingida</span>
                        </div>
                      </div>
                    </div>

                    <div className="filters-bar-modern shadow-sm">
                      <div className="filter-group">
                        <label>Cliente</label>
                        <input 
                          type="text" 
                          name="customer" 
                          placeholder="Nome..." 
                          value={filters.customer}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div className="filter-group">
                        <label>Telefone</label>
                        <input 
                          type="text" 
                          name="phone" 
                          placeholder="Filtro..." 
                          value={filters.phone}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div className="filter-group">
                        <label>Cidade</label>
                        <input 
                          type="text" 
                          name="city" 
                          placeholder="Filtro..." 
                          value={filters.city}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div className="filter-group">
                        <label>Entrega</label>
                        <input 
                          type="date" 
                          name="date" 
                          value={filters.date}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <button className="clear-filter-btn" onClick={clearFilters}>Limpar</button>
                    </div>

                    {orders.length === 0 ? (
                      <div className="empty-state-modern">
                        <Package size={48} opacity={0.2} />
                        <p>Nenhum pedido encontrado nesta categoria.</p>
                      </div>
                    ) : (
                      <div className="tables-container-modern">
                        {activeTab === 'ativos' ? (
                          <>
                            {renderOrderTable(filteredNewOrders, "Pedidos Recebidos (Novos)", "Não há novos pedidos no momento.", "secao-novo")}
                            {renderOrderTable(filteredProductionOrders, "Pedidos em Produção", "Nenhum pedido em produção.", "secao-producao")}
                            {renderOrderTable(filteredReadyOrders, "Pronto para Entrega/Retirada", "Nenhum pedido aguardando retirada/entrega.", "secao-pronto")}
                            {renderOrderTable(filteredDeliveredOrders, "Pedidos Entregues", "Nenhum pedido finalizado ainda.", "secao-entregue")}
                          </>
                        ) : (
                          renderOrderTable(filteredRecycleBin, "Relatório de Cancelados e Excluídos", "Nenhum registro encontrado.")
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

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
                <label>Ponto de Encontro:</label>
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
            <h3>Editar Detalhes</h3>
            <p>Alterar informações do pedido de <strong>{editingOrder.customerName}</strong>.</p>
            
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
              <div className="grid-form">
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
              </div>
              <div className="form-group">
                <label>Produto(s):</label>
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
                <button type="submit" className="btn-save">Confirmar Alterações</button>
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
                    {Object.entries(productFormData.prices).sort().map(([weight, price], index) => (
                      <div key={index} className="price-row">
                        <input 
                          type="text" 
                          placeholder="Ex: 250g" 
                          value={weight} 
                          onChange={(e) => handlePriceRowChange(weight, e.target.value, price)}
                        />
                        <div className="price-input-wrapper" style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>R$</span>
                          <input 
                            type="number" 
                            placeholder="0,00" 
                            value={price} 
                            step="0.01"
                            style={{ paddingLeft: '32px' }}
                            onChange={(e) => handlePriceRowChange(weight, weight, Number(e.target.value))}
                          />
                        </div>
                        <button type="button" className="remove-price-btn" onClick={() => removePriceRow(weight)} title="Remover">✕</button>
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
            <h3>Notificações</h3>
            <p>Configure os alertas do sistema para não perder novos pedidos.</p>
            
            <div className="notification-settings-content">
              <div className="form-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.enabled} 
                    onChange={(e) => setNotificationSettings({...notificationSettings, enabled: e.target.checked})}
                  />
                  Ativar Sistema de Alertas
                </label>
              </div>
              
              <div className={`form-group checkbox-group ${!notificationSettings.enabled ? 'disabled-setting' : ''}`}>
                <label>
                  <input 
                    type="checkbox" 
                    disabled={!notificationSettings.enabled}
                    checked={notificationSettings.soundEnabled} 
                    onChange={(e) => setNotificationSettings({...notificationSettings, soundEnabled: e.target.checked})}
                  />
                  Alerta Sonoro (MP3)
                </label>
              </div>

              <div className="form-group">
                <label>Link do MP3:</label>
                <div className="price-row">
                  <input 
                    type="text" 
                    disabled={!notificationSettings.enabled || !notificationSettings.soundEnabled}
                    value={notificationSettings.soundUrl}
                    onChange={(e) => setNotificationSettings({...notificationSettings, soundUrl: e.target.value})}
                    placeholder="https://exemplo.com/som.mp3"
                  />
                  <button 
                    type="button"
                    className="icon-action-btn"
                    onClick={() => {
                      const audio = new Audio(notificationSettings.soundUrl);
                      audio.play().catch(() => alert("Erro ao tocar som. Verifique o link."));
                    }}
                    disabled={!notificationSettings.enabled || !notificationSettings.soundEnabled}
                  >
                    ▶️
                  </button>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    disabled={!notificationSettings.enabled}
                    checked={notificationSettings.browserEnabled} 
                    onChange={(e) => setNotificationSettings({...notificationSettings, browserEnabled: e.target.checked})}
                  />
                  Desktop Push Notifications
                </label>
                
                <div className="permission-status" style={{ paddingLeft: '40px', marginTop: '-5px' }}>
                  <small>Status: <strong style={{ color: browserPermission === 'granted' ? '#22c55e' : '#ef4444' }}>
                    {browserPermission === 'granted' ? 'Autorizado' : (browserPermission === 'denied' ? 'Bloqueado' : 'Aguardando')}
                  </strong></small>
                  
                  {browserPermission !== 'granted' && (
                    <button 
                      type="button"
                      onClick={handleRequestPermission}
                      style={{ marginLeft: '10px', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '6px', background: '#e2e8f0', border: 'none', cursor: 'pointer' }}
                    >
                      Solicitar Permissão
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowNotificationModal(false)} className="btn-save">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ativos' && !isLoading && (
        <div className="floating-nav-panel">
          <button onClick={() => scrollToSection('secao-novo')} title="Pedidos Novos">
            <Rocket size={18} />
            <span>Novos</span>
          </button>
          <button onClick={() => scrollToSection('secao-producao')} title="Pedidos em Produção">
            <ChefHat size={18} />
            <span>Produção</span>
          </button>
          <button onClick={() => scrollToSection('secao-pronto')} title="Pedidos Prontos">
            <Package size={18} />
            <span>Prontos</span>
          </button>
          <button onClick={() => scrollToSection('secao-entregue')} title="Pedidos Entregues">
            <CheckCircle size={18} />
            <span>Entregue</span>
          </button>
          <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Voltar ao Topo">
            ↑
          </button>
        </div>
      )}
    </>
  );
}
