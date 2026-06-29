import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/App.css';
import './css/Mobile.css';
import Home from './components/home/Home';
import Biomineral from './components/products/Biomineral';
import Botanical from './components/products/Botanical';
import Merch from './components/products/Merch';
import Bundle from './components/products/Bundle';
import ShoppingCart from './components/shoppingCart/ShoppingCart';
import CheckoutSuccess from './components/shoppingCart/CheckoutSuccess';
import About from './components/about/About';
import Blog from './components/blog/Blog';
import BlogPost from './components/blog/BlogPost';
import Login from './components/Login';
import AdminProducts from './components/admin/AdminProducts';
import AdminCategories from './components/admin/AdminCategories';
import AdminBlog from './components/admin/AdminBlog';
import AdminSections from './components/admin/AdminSections';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ourstory" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog-post/:id" element={<BlogPost />} />
        <Route path="/biomineral" element={<Biomineral />} />
        <Route path="/botanical" element={<Botanical />} />
        <Route path="/merchandise" element={<Merch />} />
        <Route path="/bundle-packages" element={<Bundle />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/sections" element={<AdminSections />} />
      </Routes>
    </Router>
  );
}

export default App;
