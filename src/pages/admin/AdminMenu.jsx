import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { menuApi } from '../../api';
import { useToast } from '../../context/ToastContext';

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    image: '',
    preparationTime: 15,
    available: true,
    isFeatured: false,
    isPopular: false,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsRes, catsRes] = await Promise.all([
        menuApi.getMenuItems(),
        menuApi.getCategories(),
      ]);
      if (itemsRes.data) setItems(itemsRes.data);
      if (catsRes.data) setCategories(catsRes.data);
    } catch {
      toast.error('Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      categoryId: categories[0]?.id || '',
      price: '',
      image: '',
      preparationTime: 15,
      available: true,
      isFeatured: false,
      isPopular: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      categoryId: item.categoryId || (categories.find((c) => c.name === item.category)?.id || ''),
      price: item.price,
      image: item.image || '',
      preparationTime: item.preparationTime || 15,
      available: item.available,
      isFeatured: item.isFeatured || false,
      isPopular: item.isPopular || false,
    });
    setModalOpen(true);
  };

  const handleToggleAvailability = async (item) => {
    try {
      const updated = await menuApi.updateMenuItem(item.id, {
        available: !item.available,
      });
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, available: updated.data.available } : it))
      );
      toast.success(`"${item.name}" is now ${updated.data.available ? 'Available' : 'Unavailable'}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update availability.');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    try {
      await menuApi.deleteMenuItem(item.id);
      setItems((prev) => prev.filter((it) => it.id !== item.id));
      toast.success(`"${item.name}" deleted successfully.`);
    } catch (err) {
      toast.error(err.message || 'Failed to delete menu item.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: parseInt(formData.preparationTime, 10),
      };

      if (editingItem) {
        const res = await menuApi.updateMenuItem(editingItem.id, payload);
        setItems((prev) => prev.map((it) => (it.id === editingItem.id ? res.data : it)));
        toast.success(`Updated "${payload.name}" successfully.`);
      } else {
        const res = await menuApi.createMenuItem(payload);
        setItems((prev) => [res.data, ...prev]);
        toast.success(`Created "${payload.name}" successfully.`);
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save menu item.');
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((it) => {
    const matchesSearch =
      it.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (it.description && it.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat =
      activeCategory === 'All' ||
      it.category === activeCategory ||
      it.categoryRel?.name === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            Menu Dish Catalog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Add, update recipes, adjust pricing, and toggle dish availability.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px', height: '40px' }}
          />
        </div>

        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="form-input"
          style={{ width: 'auto', height: '40px', padding: '0 0.85rem' }}
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dishes Table */}
      <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--primary)' }}>
            <RefreshCw size={28} className="pulse-subtle" style={{ margin: '0 auto 1rem auto' }} />
            <div>Loading menu catalog...</div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No menu items found.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem' }}>Dish</th>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>Price</th>
                <th style={{ padding: '0.75rem' }}>Prep Time</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80'}
                        alt={item.name}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '700', color: '#fff' }}>{item.name}</div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                          {item.isFeatured && <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Featured</span>}
                          {item.isPopular && <span className="badge badge-gold" style={{ fontSize: '0.65rem', background: 'rgba(249, 115, 22, 0.2)', color: '#fb923c' }}>Popular</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>
                    {item.categoryRel?.name || item.category}
                  </td>
                  <td style={{ padding: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
                    ${Number(item.price).toFixed(2)}
                  </td>
                  <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>
                    {item.preparationTime || 15} mins
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        fontWeight: '600',
                        color: item.available ? 'var(--accent-green)' : '#f87171',
                      }}
                    >
                      {item.available ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      <span>{item.available ? 'Available' : 'Unavailable'}</span>
                    </button>
                  </td>
                  <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="Edit Dish"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="Delete Dish"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Dish Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '560px', padding: '2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
                {editingItem ? 'Edit Culinary Dish' : 'Add New Culinary Dish'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-dim)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Dish Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="form-input"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prep Time (mins) *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="form-input"
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', margin: '1.25rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#fff', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  />
                  <span>Available for ordering</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#fff', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Chef Featured</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {saving ? 'Saving Dish...' : editingItem ? 'Update Dish' : 'Create Dish'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
