import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { 
  Package, Plus, Search, RefreshCw, 
  Edit3, Trash2, ChevronDown, 
  AlertCircle, CheckCircle2, Inbox, Sun, Moon,
  LayoutDashboard, ShoppingBag
} from "lucide-react";
import "./App.css";

const api = axios.create({ baseURL: "http://localhost:8000" });

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="skeleton-row">
        <td><div className="skeleton skeleton-text" style={{ width: '30px' }}></div></td>
        <td><div className="skeleton skeleton-text" style={{ width: '120px' }}></div></td>
        <td><div className="skeleton skeleton-text" style={{ width: '180px' }}></div></td>
        <td><div className="skeleton skeleton-text" style={{ width: '60px' }}></div></td>
        <td><div className="skeleton skeleton-badge"></div></td>
        <td style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <div className="skeleton skeleton-button"></div>
            <div className="skeleton skeleton-button"></div>
          </div>
        </td>
      </tr>
    ))}
  </>
);

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", description: "", price: "", quantity: "" });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products/");
      setProducts(res.data);
    } catch (err) {
      setError("Sync failed. Check backend connection.");
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, id: Number(form.id), price: Number(form.price), quantity: Number(form.quantity) };
      if (editId) {
        await api.put(`/products/${editId}`, payload);
        setMessage("Stock updated successfully");
      } else {
        await api.post("/products/", payload);
        setMessage("New product added to catalog");
      }
      setForm({ id: "", name: "", description: "", price: "", quantity: "" });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Operation failed");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent delete?")) return;
    setLoading(true);
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError("Delete failed");
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => 
      String(p.id).includes(filter.toLowerCase()) || 
      p.name?.toLowerCase().includes(filter.toLowerCase())
    );
    return result.sort((a, b) => {
      let aV = a[sortField], bV = b[sortField];
      return sortDirection === "asc" ? (aV > bV ? 1 : -1) : (aV < bV ? 1 : -1);
    });
  }, [products, filter, sortField, sortDirection]);

  return (
    <div className="app-layout">
      {/* Top Header */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="nav-left">
            <div className="brand">
              <Package className="brand-icon" size={24} />
              <span>InventoryPro</span>
            </div>
            <nav className="nav-links">
              <a href="#" className="active"><LayoutDashboard size={18}/> Dashboard</a>
              <a href="#"><ShoppingBag size={18}/> Catalog</a>
            </nav>
          </div>

          <div className="nav-right">
            <div className="search-box">
              <Search size={16} />
              <input 
                placeholder="Search items..." 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            
            <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="sync-btn" onClick={fetchProducts} disabled={loading}>
              <RefreshCw size={16} className={loading ? "spin" : ""} />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="main-content">
        <div className="content-container">
          <div className="dashboard-grid">
            
            {/* Quick Actions (Form) */}
            <aside className="form-column">
              <div className="glass-card">
                <div className="card-header">
                  <h3>{editId ? "Update Product" : "New Product"}</h3>
                  <p>Fill in the item details below</p>
                </div>
                <form onSubmit={handleSubmit} className="modern-form">
                  <div className="input-field">
                    <label>Product ID</label>
                    <input type="number" value={form.id} onChange={(e)=>setForm({...form, id: e.target.value})} required disabled={!!editId} placeholder="e.g. 101"/>
                  </div>
                  <div className="input-field">
                    <label>Item Name</label>
                    <input type="text" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required placeholder="e.g. Wireless Mouse"/>
                  </div>
                  <div className="input-field">
                    <label>Description</label>
                    <textarea rows="2" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} required placeholder="Specifications..."/>
                  </div>
                  <div className="input-row">
                    <div className="input-field">
                      <label>Price</label>
                      <input type="number" value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} required placeholder="0.00"/>
                    </div>
                    <div className="input-field">
                      <label>Stock</label>
                      <input type="number" value={form.quantity} onChange={(e)=>setForm({...form, quantity: e.target.value})} required placeholder="0"/>
                    </div>
                  </div>
                  <button type="submit" className="primary-btn">
                    {editId ? <CheckCircle2 size={18}/> : <Plus size={18}/>}
                    {editId ? "Update Item" : "Create Item"}
                  </button>
                  {editId && <button type="button" className="ghost-btn" onClick={() => {setEditId(null); setForm({id:"",name:"",description:"",price:"",quantity:""})}}>Cancel</button>}
                </form>
                {message && <div className="inline-msg success">{message}</div>}
                {error && <div className="inline-msg error">{error}</div>}
              </div>
            </aside>

            {/* Main Table */}
            <section className="table-column">
              <div className="glass-card">
                <div className="card-header flex-header">
                  <div className="header-titles">
                    <h3>Stock Inventory</h3>
                    <p>Current catalog status and pricing</p>
                  </div>
                  <span className="count-tag">{filteredProducts.length} Products</span>
                </div>
                <div className="table-wrapper">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th onClick={() => setSortField('id')}>ID</th>
                        <th onClick={() => setSortField('name')}>Product</th>
                        <th>Details</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? <TableSkeleton /> : filteredProducts.map(p => (
                        <tr key={p.id}>
                          <td className="mono">#{p.id}</td>
                          <td className="bold">{p.name}</td>
                          <td className="muted-text">{p.description}</td>
                          <td className="accent-text">${Number(p.price).toFixed(2)}</td>
                          <td>
                            <span className={`badge ${p.quantity < 5 ? 'danger' : 'success'}`}>
                              {p.quantity} Units
                            </span>
                          </td>
                          <td className="actions">
                            <button className="icon-action edit" onClick={() => { setForm(p); setEditId(p.id); }}><Edit3 size={14}/></button>
                            <button className="icon-action delete" onClick={() => handleDelete(p.id)}><Trash2 size={14}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!loading && filteredProducts.length === 0 && (
                    <div className="empty-view">
                      <Inbox size={32} />
                      <p>Inventory is empty</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;