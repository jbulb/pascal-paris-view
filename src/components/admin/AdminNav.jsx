import { NavLink } from 'react-router-dom';

function AdminNav() {
  return (
    <div className="admin-sub-nav">
      <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'admin-sub-nav-link active' : 'admin-sub-nav-link'}>
        Products
      </NavLink>
      <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'admin-sub-nav-link active' : 'admin-sub-nav-link'}>
        Categories
      </NavLink>
      <NavLink to="/admin/blog" className={({ isActive }) => isActive ? 'admin-sub-nav-link active' : 'admin-sub-nav-link'}>
        Blog
      </NavLink>
      <NavLink to="/admin/sections" className={({ isActive }) => isActive ? 'admin-sub-nav-link active' : 'admin-sub-nav-link'}>
        Page Content
      </NavLink>
    </div>
  );
}

export default AdminNav;
