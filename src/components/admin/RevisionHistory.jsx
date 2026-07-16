import { useState, useEffect, useCallback } from 'react';

const FIELD_LABELS = {
  title: 'Title',
  description: 'Description',
  price: 'Price',
  img: 'Image',
  collection_id: 'Category',
  is_featured: 'Featured',
  is_active: 'Active',
  name: 'Name',
  display_name: 'Display Name',
  header_img: 'Header Image',
  sort_order: 'Sort',
  header: 'Header',
  body: 'Body',
};

const ACTION_LABELS = {
  update: 'Before an edit',
  deactivate: 'Before a delete',
  restore: 'Before a restore',
};

const formatValue = (field, value) => {
  if (value === null || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (field === 'price') return `$${Number(value).toFixed(2)}`;
  const str = String(value);
  if (field === 'img' || field === 'header_img') return str.split('/').pop();
  return str.length > 80 ? `${str.substring(0, 80)}...` : str;
};

function RevisionHistory({ resource, rowId, itemLabel, authHeaders, onRestored, onClose }) {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [restoringId, setRestoringId] = useState(null);

  const fetchRevisions = useCallback(async () => {
    setLoading(true);
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch(`/api/admin/${resource}/${rowId}/revisions`, { headers });
      if (!res.ok) throw new Error('Failed to load history');
      setRevisions(await res.json());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [authHeaders, resource, rowId]);

  useEffect(() => { fetchRevisions(); }, [fetchRevisions]);

  const handleRestore = async (revisionId) => {
    setRestoringId(revisionId);
    setError('');
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetch(
        `/api/admin/${resource}/${rowId}/revisions/${revisionId}/restore`,
        { method: 'POST', headers },
      );
      if (!res.ok) throw new Error('Failed to restore this version');
      onRestored();
      onClose();
    } catch (err) { setError(err.message); }
    finally { setRestoringId(null); }
  };

  return (
    <div className="revision-overlay" onClick={onClose}>
      <div className="revision-modal" onClick={(e) => e.stopPropagation()}>
        <div className="revision-modal-header">
          <h2>History{itemLabel ? ` — ${itemLabel}` : ''}</h2>
          <button className="revision-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading history...</div>
        ) : revisions.length === 0 ? (
          <div className="admin-empty">
            No previous versions yet. A version is saved automatically every time this item is edited.
          </div>
        ) : (
          <ul className="revision-list">
            {revisions.map((rev) => (
              <li key={rev.id} className="revision-item">
                <div className="revision-meta">
                  <span className="revision-date">{rev.created_at}</span>
                  <span className="revision-action">{ACTION_LABELS[rev.action] || rev.action}</span>
                  {rev.edited_by && <span className="revision-author">by {rev.edited_by}</span>}
                </div>
                <dl className="revision-values">
                  {Object.entries(rev.old_values).map(([field, value]) => (
                    <div key={field} className="revision-value-row">
                      <dt>{FIELD_LABELS[field] || field}</dt>
                      <dd>{formatValue(field, value)}</dd>
                    </div>
                  ))}
                </dl>
                <button
                  className="admin-btn admin-btn-save"
                  onClick={() => handleRestore(rev.id)}
                  disabled={restoringId !== null}
                >
                  {restoringId === rev.id ? 'Restoring...' : 'Restore this version'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RevisionHistory;
