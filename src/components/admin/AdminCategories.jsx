import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIdToken, isAdmin } from '../../auth/cognito';
import Nav from '../Nav';
import Footer from '../Footer';
import AdminNav from './AdminNav';
import '../../css/Admin.css';
import '../../css/App.css';

const EMPTY = { name: '', display_name: '', description: '', sort_order: 0 };

function AdminCategories() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ ...EMPTY });
  const [addSaving, setAddSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ ...EMPTY });
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    isAdmin().then((a) => { if (!a) navigate('/login'); }).catch(() => navigate('/login'));
  }, [navigate]);

  const authHeaders = useCallback(async () => {
    const token = await getIdToken();
    if (!token) { navigate('/login'); return null; }
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  }, [navigate]);

  const fetchCollections = useCallback(async () => {
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch('/api/admin/collections', { headers });
      if (!res.ok) throw new Error('Failed to load categories');
      setCollections(await res.json());
    } catch (err) { setError(err.message); }
  }, [authHeaders]);

  useEffect(() => {
    fetchCollections().finally(() => setLoading(false));
  }, [fetchCollections]);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };
  const flashError = (msg) => { setError(msg); setTimeout(() => setError(''), 5000); };

  const handleAdd = async () => {
    if (!newItem.name.trim()) { flashError('URL slug is required'); return; }
    setAddSaving(true);
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch('/api/admin/collections', {
        method: 'POST', headers,
        body: JSON.stringify({ ...newItem, sort_order: Number(newItem.sort_order) || 0 }),
      });
      if (!res.ok) throw new Error('Failed to create category');
      setNewItem({ ...EMPTY });
      setShowAddForm(false);
      await fetchCollections();
      flash('Category created');
    } catch (err) { flashError(err.message); } finally { setAddSaving(false); }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditData({
      name: c.name || '',
      display_name: c.display_name || '',
      description: c.description || '',
      sort_order: c.sort_order ?? 0,
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditData({ ...EMPTY }); };

  const handleSaveEdit = async () => {
    if (!editData.name.trim()) { flashError('URL slug is required'); return; }
    setEditSaving(true);
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch(`/api/admin/collections/${editingId}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ ...editData, sort_order: Number(editData.sort_order) || 0 }),
      });
      if (!res.ok) throw new Error('Failed to update category');
      cancelEdit();
      await fetchCollections();
      flash('Category updated');
    } catch (err) { flashError(err.message); } finally { setEditSaving(false); }
  };

  const toggleActive = async (c) => {
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch(`/api/admin/collections/${c.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ is_active: !c.is_active }),
      });
      if (!res.ok) throw new Error('Failed to update category');
      await fetchCollections();
      flash(c.is_active ? 'Category deactivated' : 'Category reactivated');
    } catch (err) { flashError(err.message); }
  };

  const renderViewRow = (c) => (
    <tr key={c.id} className={!c.is_active ? 'inactive-row' : ''}>
      <td data-label="URL Slug">{c.name}</td>
      <td data-label="Display Name">{c.display_name}</td>
      <td data-label="Description">{c.description}</td>
      <td data-label="Sort">{c.sort_order}</td>
      <td data-label="Status">
        <span className={`featured-badge ${c.is_active ? 'featured-yes' : 'featured-no'}`}>
          {c.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td data-label="Actions" className="actions-cell">
        <button className="admin-btn admin-btn-edit" onClick={() => startEdit(c)}>Edit</button>
        <button
          className={`admin-btn ${c.is_active ? 'admin-btn-delete' : 'admin-btn-save'}`}
          onClick={() => toggleActive(c)}
        >
          {c.is_active ? 'Deactivate' : 'Reactivate'}
        </button>
      </td>
    </tr>
  );

  const renderEditRow = (c) => (
    <tr key={c.id}>
      <td data-label="URL Slug">
        <input type="text" value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
      </td>
      <td data-label="Display Name">
        <input type="text" value={editData.display_name}
          onChange={(e) => setEditData({ ...editData, display_name: e.target.value })} />
      </td>
      <td data-label="Description">
        <textarea value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
      </td>
      <td data-label="Sort">
        <input type="number" value={editData.sort_order}
          onChange={(e) => setEditData({ ...editData, sort_order: e.target.value })} />
      </td>
      <td />
      <td data-label="Actions" className="actions-cell">
        <button className="admin-btn admin-btn-save" onClick={handleSaveEdit} disabled={editSaving}>
          {editSaving ? 'Saving...' : 'Save'}
        </button>
        <button className="admin-btn admin-btn-cancel" onClick={cancelEdit} disabled={editSaving}>
          Cancel
        </button>
      </td>
    </tr>
  );

  const renderAddRow = () => (
    <tr className="add-row">
      <td data-label="URL Slug">
        <input type="text" placeholder="url-slug" value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
      </td>
      <td data-label="Display Name">
        <input type="text" placeholder="Display Name" value={newItem.display_name}
          onChange={(e) => setNewItem({ ...newItem, display_name: e.target.value })} />
      </td>
      <td data-label="Description">
        <textarea placeholder="Description" value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
      </td>
      <td data-label="Sort">
        <input type="number" value={newItem.sort_order}
          onChange={(e) => setNewItem({ ...newItem, sort_order: e.target.value })} />
      </td>
      <td />
      <td data-label="Actions" className="actions-cell">
        <button className="admin-btn admin-btn-save" onClick={handleAdd} disabled={addSaving}>
          {addSaving ? 'Saving...' : 'Save'}
        </button>
        <button className="admin-btn admin-btn-cancel"
          onClick={() => { setShowAddForm(false); setNewItem({ ...EMPTY }); }} disabled={addSaving}>
          Cancel
        </button>
      </td>
    </tr>
  );

  return (
    <div className="App admin-page">
      <Nav />
      <div className="admin-container">
        <AdminNav />
        <div className="admin-top-bar">
          <h1>Manage Categories</h1>
          {!showAddForm && (
            <button className="admin-btn admin-btn-primary" onClick={() => setShowAddForm(true)}>
              + Add Category
            </button>
          )}
        </div>

        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        {loading ? (
          <div className="admin-loading">Loading categories...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>URL Slug</th>
                <th>Display Name</th>
                <th>Description</th>
                <th>Sort</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {showAddForm && renderAddRow()}
              {collections.length === 0 && !showAddForm ? (
                <tr><td colSpan="6" className="admin-empty">No categories found.</td></tr>
              ) : (
                collections.map((c) => editingId === c.id ? renderEditRow(c) : renderViewRow(c))
              )}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AdminCategories;
