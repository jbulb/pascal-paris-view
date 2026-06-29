import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIdToken, isAdmin } from '../../auth/cognito';
import Nav from '../Nav';
import Footer from '../Footer';
import AdminNav from './AdminNav';
import '../../css/Admin.css';
import '../../css/App.css';
import '../../css/Featured.css';

const EMPTY_PRODUCT = {
  title: '',
  description: '',
  price: '',
  collection_id: '',
  is_featured: false,
  img: '',
};

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ ...EMPTY_PRODUCT });
  const [addSaving, setAddSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ ...EMPTY_PRODUCT });
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    isAdmin().then((admin) => { if (!admin) navigate('/login'); }).catch(() => navigate('/login'));
  }, [navigate]);

  const authHeaders = useCallback(async () => {
    const token = await getIdToken();
    if (!token) { navigate('/login'); return null; }
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  }, [navigate]);

  const authHeadersRaw = useCallback(async () => {
    const token = await getIdToken();
    if (!token) { navigate('/login'); return null; }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  const fetchProducts = useCallback(async () => {
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch('/api/admin/products', { headers });
      if (!res.ok) throw new Error('Failed to load products');
      setProducts(await res.json());
    } catch (err) { setError(err.message); }
  }, [authHeaders]);

  const fetchCollections = useCallback(async () => {
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch('/api/admin/collections', { headers });
      if (!res.ok) throw new Error('Failed to load collections');
      setCollections(await res.json());
    } catch (err) { console.error('Could not load collections', err); }
  }, [authHeaders]);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCollections()]).finally(() => setLoading(false));
  }, [fetchProducts, fetchCollections]);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };
  const flashError = (msg) => { setError(msg); setTimeout(() => setError(''), 5000); };

  const uploadImage = async (file) => {
    const headers = await authHeadersRaw();
    if (!headers) return null;
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', headers, body: form });
    if (!res.ok) throw new Error('Image upload failed');
    const data = await res.json();
    return data.url;
  };

  // ---------- Add product ----------
  const handleAdd = async () => {
    if (!newProduct.title.trim()) { flashError('Title is required'); return; }
    setAddSaving(true);
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch('/api/admin/products', {
        method: 'POST', headers,
        body: JSON.stringify({
          title: newProduct.title,
          description: newProduct.description || null,
          price: newProduct.price !== '' ? Number(newProduct.price) : 0,
          img: newProduct.img || null,
          collection_id: newProduct.collection_id ? Number(newProduct.collection_id) : null,
          is_featured: newProduct.is_featured,
        }),
      });
      if (!res.ok) throw new Error('Failed to create product');
      setNewProduct({ ...EMPTY_PRODUCT });
      setShowAddForm(false);
      await fetchProducts();
      flash('Product created');
    } catch (err) { flashError(err.message); } finally { setAddSaving(false); }
  };

  // ---------- Edit product ----------
  const startEdit = (p) => {
    setEditingId(p.id);
    setEditData({
      title: p.title || '',
      description: p.description || '',
      price: p.price != null ? p.price : '',
      collection_id: p.collection_id != null ? String(p.collection_id) : '',
      is_featured: !!p.is_featured,
      img: p.img || '',
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditData({ ...EMPTY_PRODUCT }); };

  const handleSaveEdit = async () => {
    if (!editData.title.trim()) { flashError('Title is required'); return; }
    setEditSaving(true);
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch(`/api/admin/products/${editingId}`, {
        method: 'PUT', headers,
        body: JSON.stringify({
          title: editData.title,
          description: editData.description || null,
          price: editData.price !== '' ? Number(editData.price) : 0,
          img: editData.img || null,
          collection_id: editData.collection_id ? Number(editData.collection_id) : null,
          is_featured: editData.is_featured,
        }),
      });
      if (!res.ok) throw new Error('Failed to update product');
      cancelEdit();
      await fetchProducts();
      flash('Product updated');
    } catch (err) { flashError(err.message); } finally { setEditSaving(false); }
  };

  // ---------- Toggle active ----------
  const toggleActive = async (p) => {
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ is_active: !p.is_active }),
      });
      if (!res.ok) throw new Error('Failed to update product');
      await fetchProducts();
      flash(p.is_active ? 'Product deactivated' : 'Product reactivated');
    } catch (err) { flashError(err.message); }
  };

  // ---------- Image helpers ----------
  const isImageUrl = (v) => v && (v.startsWith('/') || v.startsWith('http'));

  const ImageThumb = ({ value }) => {
    if (!value) return null;
    if (isImageUrl(value)) return <img src={value} alt="" className="admin-image-thumb" />;
    return <div className={`admin-image-thumb-css ${value}`} />;
  };

  const ImageField = ({ value, onChange }) => {
    const handleFileChange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const url = await uploadImage(file);
        if (url) onChange(url);
      } catch (err) { flashError(err.message); }
    };

    return (
      <div className="admin-image-field">
        <ImageThumb value={value} />
        <label className="admin-btn admin-btn-edit admin-upload-btn">
          {value ? 'Change' : 'Upload'}
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
        {value && <span className="admin-image-filename">{value.split('/').pop()}</span>}
      </div>
    );
  };

  // ---------- Collection select options ----------
  const collectionOptions = collections.map((c) => (
    <option key={c.id} value={c.id}>{c.display_name || c.name}</option>
  ));

  // ---------- Render rows ----------
  const renderViewRow = (product) => (
    <tr key={product.id} className={!product.is_active ? 'inactive-row' : ''}>
      <td data-label="Image">
        <ImageThumb value={product.img} />
      </td>
      <td data-label="Title">{product.title}</td>
      <td data-label="Description">{product.description}</td>
      <td data-label="Price">${product.price != null ? Number(product.price).toFixed(2) : '0.00'}</td>
      <td data-label="Category">{collections.find((c) => c.id === product.collection_id)?.display_name || product.collection_name || '—'}</td>
      <td data-label="Featured">
        <span className={`featured-badge ${product.is_featured ? 'featured-yes' : 'featured-no'}`}>
          {product.is_featured ? 'Yes' : 'No'}
        </span>
      </td>
      <td data-label="Status">
        <span className={`featured-badge ${product.is_active ? 'featured-yes' : 'featured-no'}`}>
          {product.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td data-label="Actions" className="actions-cell">
        <button className="admin-btn admin-btn-edit" onClick={() => startEdit(product)}>Edit</button>
        <button
          className={`admin-btn ${product.is_active ? 'admin-btn-delete' : 'admin-btn-save'}`}
          onClick={() => toggleActive(product)}
        >
          {product.is_active ? 'Deactivate' : 'Reactivate'}
        </button>
      </td>
    </tr>
  );

  const renderEditRow = (product) => (
    <tr key={product.id}>
      <td data-label="Image">
        <ImageField value={editData.img} onChange={(v) => setEditData({ ...editData, img: v })} />
      </td>
      <td data-label="Title">
        <input type="text" value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
      </td>
      <td data-label="Description">
        <textarea value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
      </td>
      <td data-label="Price">
        <input type="number" value={editData.price} min="0" step="0.01"
          onChange={(e) => setEditData({ ...editData, price: e.target.value })} />
      </td>
      <td data-label="Category">
        <select value={editData.collection_id}
          onChange={(e) => setEditData({ ...editData, collection_id: e.target.value })}>
          <option value="">-- Select --</option>
          {collectionOptions}
        </select>
      </td>
      <td data-label="Featured">
        <input type="checkbox" checked={editData.is_featured}
          onChange={(e) => setEditData({ ...editData, is_featured: e.target.checked })} />
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
      <td data-label="Image">
        <ImageField value={newProduct.img} onChange={(v) => setNewProduct({ ...newProduct, img: v })} />
      </td>
      <td data-label="Title">
        <input type="text" placeholder="Product title" value={newProduct.title}
          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
      </td>
      <td data-label="Description">
        <textarea placeholder="Description" value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
      </td>
      <td data-label="Price">
        <input type="number" placeholder="0.00" value={newProduct.price} min="0" step="0.01"
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
      </td>
      <td data-label="Category">
        <select value={newProduct.collection_id}
          onChange={(e) => setNewProduct({ ...newProduct, collection_id: e.target.value })}>
          <option value="">-- Select --</option>
          {collectionOptions}
        </select>
      </td>
      <td data-label="Featured">
        <input type="checkbox" checked={newProduct.is_featured}
          onChange={(e) => setNewProduct({ ...newProduct, is_featured: e.target.checked })} />
      </td>
      <td />
      <td data-label="Actions" className="actions-cell">
        <button className="admin-btn admin-btn-save" onClick={handleAdd} disabled={addSaving}>
          {addSaving ? 'Saving...' : 'Save'}
        </button>
        <button className="admin-btn admin-btn-cancel"
          onClick={() => { setShowAddForm(false); setNewProduct({ ...EMPTY_PRODUCT }); }} disabled={addSaving}>
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
          <h1>Manage Products</h1>
          {!showAddForm && (
            <button className="admin-btn admin-btn-primary" onClick={() => setShowAddForm(true)}>
              + Add Product
            </button>
          )}
        </div>

        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        {loading ? (
          <div className="admin-loading">Loading products...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {showAddForm && renderAddRow()}
              {products.length === 0 && !showAddForm ? (
                <tr><td colSpan="8" className="admin-empty">No products found. Click "Add Product" to create one.</td></tr>
              ) : (
                products.map((p) => editingId === p.id ? renderEditRow(p) : renderViewRow(p))
              )}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AdminProducts;
