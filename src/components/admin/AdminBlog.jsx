import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIdToken, isAdmin } from '../../auth/cognito';
import Nav from '../Nav';
import Footer from '../Footer';
import AdminNav from './AdminNav';
import RevisionHistory from './RevisionHistory';
import '../../css/Admin.css';
import '../../css/App.css';

const EMPTY = { header: '', description: '', body: '', img: '' };

function AdminBlog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPost, setNewPost] = useState({ ...EMPTY });
  const [addSaving, setAddSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ ...EMPTY });
  const [editSaving, setEditSaving] = useState(false);

  const [historyItem, setHistoryItem] = useState(null);

  useEffect(() => {
    isAdmin().then((a) => { if (!a) navigate('/login'); }).catch(() => navigate('/login'));
  }, [navigate]);

  const authHeaders = useCallback(async () => {
    const token = await getIdToken();
    if (!token) { navigate('/login'); return null; }
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  }, [navigate]);

  const fetchPosts = useCallback(async () => {
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch('/api/admin/blog', { headers });
      if (!res.ok) throw new Error('Failed to load blog posts');
      setPosts(await res.json());
    } catch (err) { setError(err.message); }
  }, [authHeaders]);

  useEffect(() => {
    fetchPosts().finally(() => setLoading(false));
  }, [fetchPosts]);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };
  const flashError = (msg) => { setError(msg); setTimeout(() => setError(''), 5000); };

  const handleAdd = async () => {
    if (!newPost.header.trim()) { flashError('Title is required'); return; }
    setAddSaving(true);
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch('/api/admin/blog', {
        method: 'POST', headers,
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error('Failed to create post');
      setNewPost({ ...EMPTY });
      setShowAddForm(false);
      await fetchPosts();
      flash('Blog post created');
    } catch (err) { flashError(err.message); } finally { setAddSaving(false); }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditData({
      header: p.header || '',
      description: p.description || '',
      body: p.body || '',
      img: p.img || '',
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditData({ ...EMPTY }); };

  const handleSaveEdit = async () => {
    if (!editData.header.trim()) { flashError('Title is required'); return; }
    setEditSaving(true);
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch(`/api/admin/blog/${editingId}`, {
        method: 'PUT', headers,
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Failed to update post');
      cancelEdit();
      await fetchPosts();
      flash('Blog post updated');
    } catch (err) { flashError(err.message); } finally { setEditSaving(false); }
  };

  const toggleActive = async (p) => {
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch(`/api/admin/blog/${p.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ is_active: !p.is_active }),
      });
      if (!res.ok) throw new Error('Failed to update post');
      await fetchPosts();
      flash(p.is_active ? 'Post deactivated' : 'Post reactivated');
    } catch (err) { flashError(err.message); }
  };

  const renderViewRow = (p) => (
    <tr key={p.id} className={!p.is_active ? 'inactive-row' : ''}>
      <td data-label="Title">{p.header}</td>
      <td data-label="Preview">{p.description?.substring(0, 80)}{p.description?.length > 80 ? '...' : ''}</td>
      <td data-label="Has Body">
        <span className={`featured-badge ${p.body ? 'featured-yes' : 'featured-no'}`}>
          {p.body ? 'Yes' : 'No'}
        </span>
      </td>
      <td data-label="Status">
        <span className={`featured-badge ${p.is_active ? 'featured-yes' : 'featured-no'}`}>
          {p.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td data-label="Actions" className="actions-cell">
        <button className="admin-btn admin-btn-edit" onClick={() => startEdit(p)}>Edit</button>
        <button className="admin-btn admin-btn-cancel" onClick={() => setHistoryItem(p)}>History</button>
        <button
          className={`admin-btn ${p.is_active ? 'admin-btn-delete' : 'admin-btn-save'}`}
          onClick={() => toggleActive(p)}
        >
          {p.is_active ? 'Deactivate' : 'Reactivate'}
        </button>
      </td>
    </tr>
  );

  const renderEditRow = (p) => (
    <tr key={p.id}>
      <td data-label="Title">
        <input type="text" value={editData.header}
          onChange={(e) => setEditData({ ...editData, header: e.target.value })} />
      </td>
      <td data-label="Preview">
        <textarea value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
      </td>
      <td data-label="Body" colSpan="2">
        <textarea value={editData.body} className="admin-blog-body-input"
          onChange={(e) => setEditData({ ...editData, body: e.target.value })} />
      </td>
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
      <td data-label="Title">
        <input type="text" placeholder="Post title" value={newPost.header}
          onChange={(e) => setNewPost({ ...newPost, header: e.target.value })} />
      </td>
      <td data-label="Preview">
        <textarea placeholder="Short description" value={newPost.description}
          onChange={(e) => setNewPost({ ...newPost, description: e.target.value })} />
      </td>
      <td data-label="Body" colSpan="2">
        <textarea placeholder="Full post body" value={newPost.body} className="admin-blog-body-input"
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })} />
      </td>
      <td data-label="Actions" className="actions-cell">
        <button className="admin-btn admin-btn-save" onClick={handleAdd} disabled={addSaving}>
          {addSaving ? 'Saving...' : 'Save'}
        </button>
        <button className="admin-btn admin-btn-cancel"
          onClick={() => { setShowAddForm(false); setNewPost({ ...EMPTY }); }} disabled={addSaving}>
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
          <h1>Manage Blog Posts</h1>
          {!showAddForm && (
            <button className="admin-btn admin-btn-primary" onClick={() => setShowAddForm(true)}>
              + Add Post
            </button>
          )}
        </div>

        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        {loading ? (
          <div className="admin-loading">Loading blog posts...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Preview</th>
                <th>Has Body</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {showAddForm && renderAddRow()}
              {posts.length === 0 && !showAddForm ? (
                <tr><td colSpan="5" className="admin-empty">No blog posts found.</td></tr>
              ) : (
                posts.map((p) => editingId === p.id ? renderEditRow(p) : renderViewRow(p))
              )}
            </tbody>
          </table>
        )}
      </div>
      {historyItem && (
        <RevisionHistory
          resource="blog"
          rowId={historyItem.id}
          itemLabel={historyItem.header}
          authHeaders={authHeaders}
          onRestored={() => { fetchPosts(); flash('Previous version restored'); }}
          onClose={() => setHistoryItem(null)}
        />
      )}
      <Footer />
    </div>
  );
}

export default AdminBlog;
