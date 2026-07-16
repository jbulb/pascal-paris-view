import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getIdToken, isAdmin } from '../../auth/cognito';
import Nav from '../Nav';
import Footer from '../Footer';
import AdminNav from './AdminNav';
import RevisionHistory from './RevisionHistory';
import '../../css/Admin.css';
import '../../css/App.css';

const SECTION_TYPES = [
  { key: 'carousel', label: 'Carousel' },
  { key: 'ingredient', label: 'Ingredients' },
  { key: 'around_the_world', label: 'Around The World' },
  { key: 'about%', label: 'About Page', addTypes: ['about_image', 'about_text', 'about_text_dark'] },
];

const EMPTY = { title: '', body: '', img: '', sort_order: 0, section_type: '' };

function AdminSections() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'carousel';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ ...EMPTY });
  const [addSaving, setAddSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ ...EMPTY });
  const [editSaving, setEditSaving] = useState(false);

  const [historyItem, setHistoryItem] = useState(null);

  const currentType = SECTION_TYPES.find((t) => t.key === activeTab) || SECTION_TYPES[0];

  useEffect(() => {
    isAdmin().then((a) => { if (!a) navigate('/login'); }).catch(() => navigate('/login'));
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

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch(`/api/admin/sections?section_type=${encodeURIComponent(activeTab)}`, { headers });
      if (!res.ok) throw new Error('Failed to load sections');
      setItems(await res.json());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [authHeaders, activeTab]);

  useEffect(() => {
    fetchItems();
    setEditingId(null);
    setShowAddForm(false);
  }, [fetchItems]);

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

  const ImageField = ({ value, onChange }) => {
    const handleFileChange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const url = await uploadImage(file);
        if (url) onChange(url);
      } catch (err) { flashError(err.message); }
    };
    const isUrl = value && (value.startsWith('/') || value.startsWith('http'));
    return (
      <div className="admin-image-field">
        {isUrl && <img src={value} alt="" className="admin-image-thumb" />}
        <label className="admin-btn admin-btn-edit admin-upload-btn">
          {value ? 'Change' : 'Upload'}
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
        {value && <span className="admin-image-filename">{value.split('/').pop()}</span>}
      </div>
    );
  };

  const handleAdd = async () => {
    setAddSaving(true);
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const sectionType = newItem.section_type || (currentType.addTypes ? currentType.addTypes[0] : activeTab);
      const res = await fetch('/api/admin/sections', {
        method: 'POST', headers,
        body: JSON.stringify({
          section_type: sectionType,
          title: newItem.title || null,
          body: newItem.body || null,
          img: newItem.img || null,
          sort_order: Number(newItem.sort_order) || 0,
        }),
      });
      if (!res.ok) throw new Error('Failed to create section');
      setNewItem({ ...EMPTY });
      setShowAddForm(false);
      await fetchItems();
      flash('Section created');
    } catch (err) { flashError(err.message); } finally { setAddSaving(false); }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({
      title: item.title || '',
      body: item.body || '',
      img: item.img || '',
      sort_order: item.sort_order ?? 0,
      section_type: item.section_type || '',
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditData({ ...EMPTY }); };

  const handleSaveEdit = async () => {
    setEditSaving(true);
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch(`/api/admin/sections/${editingId}`, {
        method: 'PUT', headers,
        body: JSON.stringify({
          title: editData.title || null,
          body: editData.body || null,
          img: editData.img || null,
          sort_order: Number(editData.sort_order) || 0,
        }),
      });
      if (!res.ok) throw new Error('Failed to update section');
      cancelEdit();
      await fetchItems();
      flash('Section updated');
    } catch (err) { flashError(err.message); } finally { setEditSaving(false); }
  };

  const toggleActive = async (item) => {
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch(`/api/admin/sections/${item.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (!res.ok) throw new Error('Failed to update section');
      await fetchItems();
      flash(item.is_active ? 'Section deactivated' : 'Section reactivated');
    } catch (err) { flashError(err.message); }
  };

  const renderViewRow = (item) => (
    <tr key={item.id} className={!item.is_active ? 'inactive-row' : ''}>
      <td data-label="Image">
        {item.img && (item.img.startsWith('/') || item.img.startsWith('http'))
          ? <img src={item.img} alt="" className="admin-image-thumb" />
          : null}
      </td>
      <td data-label="Type">{item.section_type}</td>
      <td data-label="Title">{item.title || '—'}</td>
      <td data-label="Content">{item.body ? item.body.substring(0, 60) + (item.body.length > 60 ? '...' : '') : '—'}</td>
      <td data-label="Sort">{item.sort_order}</td>
      <td data-label="Status">
        <span className={`featured-badge ${item.is_active ? 'featured-yes' : 'featured-no'}`}>
          {item.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td data-label="Actions" className="actions-cell">
        <button className="admin-btn admin-btn-edit" onClick={() => startEdit(item)}>Edit</button>
        <button className="admin-btn admin-btn-cancel" onClick={() => setHistoryItem(item)}>History</button>
        <button
          className={`admin-btn ${item.is_active ? 'admin-btn-delete' : 'admin-btn-save'}`}
          onClick={() => toggleActive(item)}
        >
          {item.is_active ? 'Deactivate' : 'Reactivate'}
        </button>
      </td>
    </tr>
  );

  const renderEditRow = (item) => (
    <tr key={item.id}>
      <td data-label="Image">
        <ImageField value={editData.img} onChange={(v) => setEditData({ ...editData, img: v })} />
      </td>
      <td data-label="Type">{item.section_type}</td>
      <td data-label="Title">
        <input type="text" value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
      </td>
      <td data-label="Content">
        <textarea value={editData.body} className="admin-blog-body-input"
          onChange={(e) => setEditData({ ...editData, body: e.target.value })} />
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
      <td data-label="Image">
        <ImageField value={newItem.img} onChange={(v) => setNewItem({ ...newItem, img: v })} />
      </td>
      <td data-label="Type">
        {currentType.addTypes ? (
          <select value={newItem.section_type}
            onChange={(e) => setNewItem({ ...newItem, section_type: e.target.value })}>
            <option value="">-- Select --</option>
            {currentType.addTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        ) : (
          <span>{activeTab}</span>
        )}
      </td>
      <td data-label="Title">
        <input type="text" placeholder="Title (optional)" value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
      </td>
      <td data-label="Content">
        <textarea placeholder="Body text (optional)" value={newItem.body} className="admin-blog-body-input"
          onChange={(e) => setNewItem({ ...newItem, body: e.target.value })} />
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
          <h1>Page Sections</h1>
          {!showAddForm && (
            <button className="admin-btn admin-btn-primary" onClick={() => setShowAddForm(true)}>
              + Add Section
            </button>
          )}
        </div>

        <div className="admin-section-tabs">
          {SECTION_TYPES.map((t) => (
            <button
              key={t.key}
              className={`admin-btn ${activeTab === t.key ? 'admin-btn-primary' : 'admin-btn-cancel'}`}
              onClick={() => setSearchParams({ tab: t.key })}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Type</th>
                <th>Title</th>
                <th>Content</th>
                <th>Sort</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {showAddForm && renderAddRow()}
              {items.length === 0 && !showAddForm ? (
                <tr><td colSpan="7" className="admin-empty">No sections found.</td></tr>
              ) : (
                items.map((item) => editingId === item.id ? renderEditRow(item) : renderViewRow(item))
              )}
            </tbody>
          </table>
        )}
      </div>
      {historyItem && (
        <RevisionHistory
          resource="sections"
          rowId={historyItem.id}
          itemLabel={historyItem.title || historyItem.section_type}
          authHeaders={authHeaders}
          onRestored={() => { fetchItems(); flash('Previous version restored'); }}
          onClose={() => setHistoryItem(null)}
        />
      )}
      <Footer />
    </div>
  );
}

export default AdminSections;
