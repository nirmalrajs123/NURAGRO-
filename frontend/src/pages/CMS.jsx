import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Edit2, Trash2, X, LayoutDashboard, Layers, LogOut, Plus, Eye, List, Package, Box, UploadCloud, FileText
} from 'lucide-react';
import { getNavbars, createNavbar, updateNavbar, deleteNavbar } from '../services/navbarService';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import './CMS.css';

const MasterPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [navbars, setNavbars] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nav_menu_name: '',
    parent_id: '',
    is_active: 1,
    path: ''
  });

  useEffect(() => {
    fetchNavbars();
  }, []);

  const fetchNavbars = async () => {
    try {
      const res = await getNavbars();
      setNavbars(res.data);
    } catch (err) {
      console.error('Error fetching navbars', err);
    }
  };

  const handleSave = async () => {
    if (!formData.nav_menu_name.trim()) return alert("Nav menu name is required");
    try {
      const payload = {
        nav_menu_name: formData.nav_menu_name,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
        is_active: formData.is_active,
        path: formData.path
      };

      if (editingId) {
        await updateNavbar(editingId, payload);
      } else {
        await createNavbar(payload);
      }

      handleCloseModal();
      fetchNavbars();
    } catch (err) {
      console.error('Error saving navbar', err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ nav_menu_name: '', parent_id: '', is_active: 1, path: '' });
  };

  const handleEdit = (mod) => {
    setEditingId(mod.id);
    setFormData({
      nav_menu_name: mod.nav_menu_name,
      parent_id: mod.parent_id || '',
      is_active: mod.is_active,
      path: mod.path || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this menu item?')) {
      try {
        await deleteNavbar(id);
        fetchNavbars();
      } catch (err) {
        console.error('Error deleting', err);
      }
    }
  };

  const getParentName = (parentId) => {
    if (!parentId) return 'None';
    const parent = navbars.find(n => n.id === parentId);
    return parent ? parent.nav_menu_name : 'Unknown';
  };

  return (
    <div className="master-page">
      <div className="master-header">
        <div>
          <h1>Master</h1>
          <p className="subtitle">The global module catalog for the platform</p>
        </div>
        <button className="add-master-btn" onClick={() => {
          setEditingId(null);
          setFormData({ nav_menu_name: '', parent_id: '', is_active: 1, path: '' });
          setIsModalOpen(true);
        }}>
          <Plus size={16} /> ADD MASTER MODULE
        </button>
      </div>

      <div className="master-table-container">
        <table className="master-table">
          <thead>
            <tr>
              <th>MODULE NAME</th>
              <th>PARENT</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {(navbars || []).map(mod => (
              <tr key={mod.id}>
                <td className="module-name-col">{mod.nav_menu_name}</td>
                <td className="parent-col">{getParentName(mod.parent_id)}</td>
                <td>
                  <span className={`status-badge ${mod.is_active ? 'active' : 'inactive'}`}>
                    <span className="dot" style={{ backgroundColor: mod.is_active ? '#059669' : '#9ca3af' }}></span>
                    {mod.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions-col">

                  <button className="icon-btn edit" onClick={() => handleEdit(mod)}><Edit2 size={16} /></button>
                  <button className="icon-btn delete" onClick={() => handleDelete(mod.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {(!navbars || navbars.length === 0) && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No navbars found. Create one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Nav Bar' : 'Nav Bar'}</h2>
              <button className="close-btn" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group-light">
                <label>Nav menu name<span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Inventory Management"
                  value={formData.nav_menu_name}
                  onChange={e => setFormData({ ...formData, nav_menu_name: e.target.value })}
                />
              </div>
              <div className="form-group-light">
                <label>Path</label>
                <input
                  type="text"
                  placeholder="e.g. /inventory"
                  value={formData.path}
                  onChange={e => setFormData({ ...formData, path: e.target.value })}
                />
              </div>
              <div className="form-group-light">
                <label>Parent menu</label>
                <select
                  value={formData.parent_id}
                  onChange={e => setFormData({ ...formData, parent_id: e.target.value })}
                >
                  <option value="">None</option>
                  {(navbars || []).map(nav => (
                    <option key={nav.id} value={nav.id}>{nav.nav_menu_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group-light toggle-group">
                <div className="toggle-text">
                  <label>Menu status</label>
                  <p className="help-text">Enable or disable this menu link globally</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.is_active === 1}
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="btn-save" onClick={handleSave}>Save Module</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardHome = () => (
  <div className="dashboard-home">
    <header className="cms-header">
      <h1>Dashboard</h1>
    </header>
    <div className="dashboard-welcome">
      <h2>Welcome to the Admin Panel</h2>
      <p>Select an option from the sidebar to manage your content.</p>
    </div>
  </div>
);

const CategoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category_name: '',
    category_image: '',
    parent_id_cat: '',
    is_active: true
  });

  const buildCategoryTree = (cats, parentId = null) => {
    return cats
      .filter(cat => cat.parent_id_cat === parentId)
      .map(cat => ({
        ...cat,
        children: buildCategoryTree(cats, cat.id)
      }));
  };

  const renderCategoryOptions = (cats, level = 0) => {
    return cats.map(cat => (
      <React.Fragment key={cat.id}>
        <option value={cat.id} disabled={editingId === cat.id}>
          {'\u00A0'.repeat(level * 4)}{level > 0 ? '↳ ' : ''}{cat.category_name}
        </option>
        {cat.children && cat.children.length > 0 && renderCategoryOptions(cat.children, level + 1)}
      </React.Fragment>
    ));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, category_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.category_name.trim()) return alert("Category name is required");
    try {
      const payload = {
        category_name: formData.category_name,
        category_image: formData.category_image,
        parent_id_cat: formData.parent_id_cat ? parseInt(formData.parent_id_cat) : null,
        is_active: formData.is_active
      };

      if (editingId) {
        await updateCategory(editingId, payload);
      } else {
        await createCategory(payload);
      }

      handleCloseModal();
      fetchCategories();
    } catch (err) {
      console.error('Error saving category', err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ category_name: '', category_image: '', parent_id_cat: '', is_active: true });
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({
      category_name: cat.category_name,
      category_image: cat.category_image || '',
      parent_id_cat: cat.parent_id_cat || '',
      is_active: cat.is_active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error('Error deleting category', err);
      }
    }
  };

  const getParentName = (parentId) => {
    if (!parentId) return 'None';
    const parent = categories.find(c => c.id === parentId);
    return parent ? parent.category_name : 'Unknown';
  };

  return (
    <div className="master-page">
      <div className="master-header">
        <div>
          <h1>Category</h1>
          <p className="subtitle">Manage your product categories</p>
        </div>
        <button className="add-master-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> ADD CATEGORY
        </button>
      </div>

      <div className="master-table-container">
        <table className="master-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>CATEGORY NAME</th>
              <th>PARENT</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {(categories || []).map(cat => (
              <tr key={cat.id}>
                <td>
                  {cat.category_image ? (
                    <img src={cat.category_image} alt={cat.category_name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <List size={20} style={{ color: '#9ca3af' }} />
                    </div>
                  )}
                </td>
                <td className="module-name-col">{cat.category_name}</td>
                <td className="parent-col">{getParentName(cat.parent_id_cat)}</td>
                <td>
                  <span className={`status-badge ${cat.is_active ? 'active' : 'inactive'}`}>
                    <span className="dot" style={{ backgroundColor: cat.is_active ? '#059669' : '#9ca3af' }}></span>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions-col">
                  <button className="icon-btn edit" onClick={() => handleEdit(cat)}><Edit2 size={16} /></button>
                  <button className="icon-btn delete" onClick={() => handleDelete(cat.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {(!categories || categories.length === 0) && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button className="close-btn" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group-light">
                <label>Category name<span className="required">*</span></label>
                <input type="text" value={formData.category_name || ''} onChange={e => setFormData({ ...formData, category_name: e.target.value })} />
              </div>
              <div className="form-group-light">
                <label>Parent Category</label>
                <select value={formData.parent_id_cat || ''} onChange={e => setFormData({ ...formData, parent_id_cat: e.target.value })}>
                  <option value="">None (Top Level)</option>
                  {renderCategoryOptions(buildCategoryTree(categories.filter(c => c.id !== editingId)))}
                </select>
              </div>
              <div className="form-group-light">
                <label>Category Image</label>
                <div className="upload-zone" onClick={() => document.getElementById('cat-image-upload').click()}>
                  {formData.category_image ? (
                    <div className="image-preview-container">
                      <img src={formData.category_image} alt="Preview" />
                      <div className="upload-overlay"><UploadCloud size={20} /> Change</div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <UploadCloud size={24} />
                      <span>Upload Image</span>
                    </div>
                  )}
                  <input id="cat-image-upload" type="file" hidden onChange={handleFileChange} accept="image/*" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="btn-save" onClick={handleSave}>Save Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const buildCategoryTree = (cats, parentId = null) => {
    return cats
      .filter(cat => cat.parent_id_cat === parentId)
      .map(cat => ({
        ...cat,
        children: buildCategoryTree(cats, cat.id)
      }));
  };

  const renderCategoryOptions = (cats, level = 0) => {
    return cats.map(cat => (
      <React.Fragment key={cat.id}>
        <option value={cat.id}>
          {'\u00A0'.repeat(level * 4)}{level > 0 ? '↳ ' : ''}{cat.category_name}
        </option>
        {cat.children && cat.children.length > 0 && renderCategoryOptions(cat.children, level + 1)}
      </React.Fragment>
    ));
  };
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: '', description: '', category_id: '', image: '',
    description_facts: '', weight: '', packing_details: '',
    packing_options: [{ product: '', packing: '', container: '', file: null }],
    type_options: [{ name: '', description: '', file: null }],
    spec_file: null,
    nutrition_file: null
  });

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);
  const fetchProducts = async () => { try { const res = await getProducts(); setProducts(res.data); } catch (err) { console.error(err); } };
  const fetchCategories = async () => { try { const res = await getCategories(); setCategories(res.data); } catch (err) { console.error(err); } };

  const getFilePreview = (file) => {
    if (!file) return null;
    if (typeof file === 'string') {
      if (file.startsWith('data:') || file.startsWith('blob:')) return file;
      return `http://localhost:5000${file.startsWith('/') ? '' : '/'}${file}`;
    }
    return URL.createObjectURL(file);
  };

  const isImage = (file) => {
    if (!file) return false;
    if (typeof file === 'string') {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(file.split('?')[0]) || file.startsWith('data:image/');
    }
    return file.type && file.type.startsWith('image/');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return alert("Product name is required");
    try {
      const data = new FormData();

      // We need to extract files from the arrays because FormData doesn't handle nested files in JSON
      const processedTypeOptions = (formData.type_options || []).map((opt, i) => {
        if (opt.file instanceof File) {
          data.append(`type_file_${i}`, opt.file);
          return { ...opt, file: `__TYPE_FILE_${i}__` };
        }
        return opt;
      });

      const processedPackingOptions = (formData.packing_options || []).map((opt, i) => {
        if (opt.file instanceof File) {
          data.append(`packing_file_${i}`, opt.file);
          return { ...opt, file: `__PACKING_FILE_${i}__` };
        }
        return opt;
      });

      // Append top-level fields
      Object.keys(formData).forEach(key => {
        if (key === 'type_options') {
          data.append(key, JSON.stringify(processedTypeOptions));
        } else if (key === 'packing_options') {
          data.append(key, JSON.stringify(processedPackingOptions));
        } else if (formData[key] instanceof File) {
          data.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      if (editingId) await updateProduct(editingId, data);
      else await createProduct(data);

      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error saving product: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); setEditingId(null); setActiveTab('general');
    setFormData({
      name: '', description: '', category_id: '', image: '',
      description_facts: '', weight: '', packing_details: '',
      packing_options: [{ product: '', packing: '', container: '', file: null }],
      type_options: [{ name: '', description: '', file: null }],
      spec_file: null,
      nutrition_file: null
    });
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);

    // Remap DB column names → frontend form field names
    const mappedPackingOptions = (prod.packing_options || []).map(row => ({
      product: row.packing_product || row.product || '',
      packing: row.packing_packing || row.packing || '',
      container: row.packing_container || row.container || '',
      file: row.image_path || row.file || null
    }));

    const mappedTypeOptions = (prod.type_options || []).map(row => ({
      name: row.variation_name || row.name || '',
      description: row.description || '',
      file: row.image_path || row.file || null
    }));

    setFormData({
      ...prod,
      category_id: prod.category_id || '',
      image: prod.image || '',
      description_facts: prod.description_facts || '',
      weight: prod.weight || '',
      packing_details: prod.packing_details || '',
      health_benefits: prod.health_benefits || '',
      facts: prod.facts || '',
      packing_options: mappedPackingOptions.length > 0
        ? mappedPackingOptions
        : [{ product: '', packing: '', container: '', file: null }],
      type_options: mappedTypeOptions.length > 0
        ? mappedTypeOptions
        : [{ name: '', description: '', file: null }],
      spec_file: prod.spec_file || null,
      nutrition_file: prod.nutrition_file || null
    });
    setIsModalOpen(true);
  };


  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try { await deleteProduct(id); fetchProducts(); } catch (err) { console.error(err); }
    }
  };

  const addPackingRow = () => {
    setFormData({
      ...formData,
      packing_options: [...formData.packing_options, { product: '', packing: '', container: '', file: null }]
    });
  };

  const removePackingRow = (index) => {
    const newOptions = formData.packing_options.filter((_, i) => i !== index);
    setFormData({ ...formData, packing_options: newOptions });
  };

  const updatePackingRow = (index, field, value) => {
    const newOptions = formData.packing_options.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, packing_options: newOptions });
  };

  const addTypeRow = () => {
    setFormData({
      ...formData,
      type_options: [...formData.type_options, { name: '', description: '', file: null }]
    });
  };

  const removeTypeRow = (index) => {
    const newOptions = formData.type_options.filter((_, i) => i !== index);
    setFormData({ ...formData, type_options: newOptions });
  };

  const updateTypeRow = (index, field, value) => {
    const newOptions = formData.type_options.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, type_options: newOptions });
  };

  return (
    <div className="master-page">
      <div className="master-header">
        <div>
          <h1>Products</h1>
          <p className="subtitle">Manage agricultural products and specifications</p>
        </div>
        <button className="add-master-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> ADD PRODUCT
        </button>
      </div>

      <div className="master-table-container">
        <table className="master-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>PRODUCT NAME</th>
              <th>CATEGORY</th>

              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map(prod => (
              <tr key={prod.id}>
                <td>
                  {prod.image ? <img src={getFilePreview(prod.image)} alt={prod.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} /> : <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Box size={20} style={{ color: '#9ca3af' }} /></div>}
                </td>
                <td className="module-name-col">
                  <div style={{ fontWeight: 600 }}>{prod.name}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>{prod.grade}</div>
                </td>
                <td className="parent-col">{prod.category_name || 'Uncategorized'}</td>

                <td>
                  <span className={`status-badge ${prod.is_active ? 'active' : 'inactive'}`}>
                    <span className="dot" style={{ backgroundColor: prod.is_active ? '#059669' : '#9ca3af' }}></span>
                    {prod.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions-col">
                  <button className="icon-btn edit" onClick={() => handleEdit(prod)}><Edit2 size={16} /></button>
                  <button className="icon-btn delete" onClick={() => handleDelete(prod.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>No products found. Add your first product!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-btn" onClick={handleCloseModal}><X size={20} /></button>
            </div>

            <div className="modal-tabs">
              <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General</button>
              <button className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>Specifications</button>
              <button className={`tab-btn ${activeTab === 'type' ? 'active' : ''}`} onClick={() => setActiveTab('type')}>Type</button>
              <button className={`tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`} onClick={() => setActiveTab('nutrition')}>Nutrition</button>
              <button className={`tab-btn ${activeTab === 'packing' ? 'active' : ''}`} onClick={() => setActiveTab('packing')}>Packing</button>
              <button className={`tab-btn ${activeTab === 'facts' ? 'active' : ''}`} onClick={() => setActiveTab('facts')}>Facts</button>
            </div>

            <div className="modal-body custom-scrollbar">
              {activeTab === 'general' && (
                <div className="tab-pane">
                  <div className="form-grid">
                    <div className="form-group-light"><label>Product name*</label><input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                    <div className="form-group-light"><label>Category</label>
                      <select value={formData.category_id || ''} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                        <option value="">Select Category</option>
                        {renderCategoryOptions(buildCategoryTree(categories || []))}
                      </select>
                    </div>
                    <div className="form-group-light">
                      <label>Product Image</label>
                      <div className="upload-zone" onClick={() => document.getElementById('prod-image-upload').click()}>
                        {formData.image ? (
                          <div className="image-preview-container">
                            <img src={getFilePreview(formData.image)} alt="Preview" />
                            <div className="upload-overlay"><UploadCloud size={24} /> Change Image</div>
                          </div>
                        ) : (
                          <div className="upload-placeholder">
                            <UploadCloud size={32} />
                            <span>Click to upload product image</span>
                            <p>PNG, JPG up to 5MB</p>
                          </div>
                        )}
                        <input id="prod-image-upload" type="file" hidden onChange={handleFileChange} accept="image/*" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group-light" style={{ marginTop: '20px' }}><label>Description</label><textarea rows="3" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea></div>
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="tab-pane">
                  <div className="form-group-light">
                    <label>Specifications Document (PDF/Image)</label>
                    <div className="upload-zone spec-zone" onClick={() => document.getElementById('spec-upload').click()}>
                      {formData.spec_file ? (
                        isImage(formData.spec_file) ? (
                          <div style={{ position: 'relative', width: '100%' }}>
                            <img src={getFilePreview(formData.spec_file)} alt="Spec Preview" style={{ width: '100%', maxHeight: '280px', borderRadius: '8px', objectFit: 'contain', display: 'block' }} />
                            <button type="button" className="icon-btn delete" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, spec_file: null }); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', padding: '4px' }}><X size={16} /></button>
                          </div>
                        ) : (
                          <div className="file-info">
                            <FileText size={24} color="#3943c7" style={{ marginRight: '15px' }} />
                            <div className="file-details">
                              <span>Specifications File Attached</span>
                              <p>{typeof formData.spec_file === 'string' ? 'File in DB' : formData.spec_file.name}</p>
                            </div>
                            <button type="button" className="icon-btn delete" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, spec_file: null }); }}><X size={16} /></button>
                          </div>
                        )
                      ) : (
                        <div className="upload-placeholder">
                          <UploadCloud size={32} />
                          <span>Click to upload Specifications</span>
                          <p>PDF, DOCX or Image up to 10MB</p>
                        </div>
                      )}
                      <input id="spec-upload" type="file" hidden onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) setFormData({ ...formData, spec_file: file });
                      }} />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'type' && (
                <div className="tab-pane">
                  {(formData.type_options || []).map((opt, index) => (
                    <div key={index} className="packing-row-group" style={{ marginBottom: '25px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px', position: 'relative' }}>
                      {(formData.type_options || []).length > 1 && (
                        <button
                          type="button"
                          className="remove-row-btn"
                          onClick={() => removeTypeRow(index)}
                          style={{ position: 'absolute', top: '10px', right: '10px', color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <div className="form-group-light">
                        <label>Variation Name</label>
                        <input type="text" placeholder="e.g. Organic, Roasted..." value={opt.name || ''} onChange={e => updateTypeRow(index, 'name', e.target.value)} />
                      </div>
                      <div className="form-group-light" style={{ marginTop: '10px' }}>
                        <label>Description</label>
                        <textarea rows="2" placeholder="Brief description of this variation..." value={opt.description || ''} onChange={e => updateTypeRow(index, 'description', e.target.value)}></textarea>
                      </div>

                      <div className="form-group-light" style={{ marginTop: '10px' }}>
                        <label>Variation Specific Document / Image</label>
                        <div className="upload-zone row-upload-zone" onClick={() => document.getElementById(`type-file-${index}`).click()}>
                          {opt.file ? (
                            isImage(opt.file) ? (
                              <div style={{ position: 'relative', width: '100%' }}>
                                <img src={getFilePreview(opt.file)} alt="Type Preview" style={{ width: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain', display: 'block' }} />
                                <button type="button" className="icon-btn delete" onClick={(e) => { e.stopPropagation(); updateTypeRow(index, 'file', null); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', padding: '4px' }}><X size={14} /></button>
                              </div>
                            ) : (
                              <div className="file-info compact">
                                <FileText size={18} color="#3943c7" style={{ marginRight: '10px' }} />
                                <div className="file-details"><span style={{ fontSize: '13px' }}>Variation File Attached</span></div>
                                <button type="button" className="icon-btn delete" onClick={(e) => { e.stopPropagation(); updateTypeRow(index, 'file', null); }}><X size={14} /></button>
                              </div>
                            )
                          ) : (
                            <div className="upload-placeholder compact">
                              <UploadCloud size={20} />
                              <span>Upload Variation File</span>
                            </div>
                          )}
                          <input id={`type-file-${index}`} type="file" hidden onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) updateTypeRow(index, 'file', file);
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="add-master-btn" onClick={addTypeRow} style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                    <Plus size={16} /> ADD ANOTHER TYPE / VARIATION
                  </button>
                </div>
              )}
              {activeTab === 'nutrition' && (
                <div className="tab-pane">
                  <div className="form-group-light">
                    <label>Nutrition Sheet / Label (Image or PDF)</label>
                    <div className="upload-zone" onClick={() => document.getElementById('nutrition-upload').click()}>
                      {formData.nutrition_file ? (
                        isImage(formData.nutrition_file) ? (
                          <div style={{ position: 'relative', width: '100%' }}>
                            <img src={getFilePreview(formData.nutrition_file)} alt="Nutrition Preview" style={{ width: '100%', maxHeight: '280px', borderRadius: '8px', objectFit: 'contain', display: 'block' }} />
                            <button type="button" className="icon-btn delete" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, nutrition_file: null }); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', padding: '4px' }}><X size={16} /></button>
                          </div>
                        ) : (
                          <div className="file-info">
                            <FileText size={32} color="#3943c7" style={{ marginRight: '15px' }} />
                            <div className="file-details">
                              <span>Nutrition Document Attached</span>
                              <p>{typeof formData.nutrition_file === 'string' ? 'File in DB' : formData.nutrition_file.name}</p>
                            </div>
                            <button type="button" className="icon-btn delete" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, nutrition_file: null }); }}><X size={16} /></button>
                          </div>
                        )
                      ) : (
                        <div className="upload-placeholder">
                          <UploadCloud size={32} />
                          <span>Click to upload Nutrition Label / Sheet</span>
                          <p>PNG, JPG, PDF up to 10MB</p>
                        </div>
                      )}
                      <input id="nutrition-upload" type="file" hidden onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) setFormData({ ...formData, nutrition_file: file });
                      }} accept="image/*,.pdf" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'packing' && (
                <div className="tab-pane">
                  {(formData.packing_options || []).map((opt, index) => (
                    <div key={index} className="packing-row-group" style={{ marginBottom: '25px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px', position: 'relative' }}>
                      {(formData.packing_options || []).length > 1 && (
                        <button
                          type="button"
                          className="remove-row-btn"
                          onClick={() => removePackingRow(index)}
                          style={{ position: 'absolute', top: '10px', right: '10px', color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <div className="form-grid">
                        <div className="form-group-light">
                          <label>Product</label>
                          <textarea rows="2" placeholder="e.g. Cashews W320" value={opt.product || ''} onChange={e => updatePackingRow(index, 'product', e.target.value)}></textarea>
                        </div>
                        <div className="form-group-light">
                          <label>Packing</label>
                          <textarea rows="2" placeholder="e.g. 2 x 25 lbs vacuum bags" value={opt.packing || ''} onChange={e => updatePackingRow(index, 'packing', e.target.value)}></textarea>
                        </div>
                      </div>
                      <div className="form-group-light" style={{ marginTop: '15px' }}>
                        <label>Container</label>
                        <textarea rows="2" placeholder="e.g. 15.876 MT per 20' FCL" value={opt.container || ''} onChange={e => updatePackingRow(index, 'container', e.target.value)}></textarea>
                      </div>

                      <div className="form-group-light" style={{ marginTop: '15px' }}>
                        <label>Packing Spec / Document</label>
                        <div className="upload-zone row-upload-zone" onClick={() => document.getElementById(`row-file-${index}`).click()}>
                          {opt.file ? (
                            isImage(opt.file) ? (
                              <div style={{ position: 'relative', width: '100%' }}>
                                <img src={getFilePreview(opt.file)} alt="Packing Preview" style={{ width: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain', display: 'block' }} />
                                <button type="button" className="icon-btn delete" onClick={(e) => { e.stopPropagation(); updatePackingRow(index, 'file', null); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', padding: '4px' }}><X size={14} /></button>
                              </div>
                            ) : (
                              <div className="file-info compact">
                                <FileText size={18} color="#3943c7" style={{ marginRight: '10px' }} />
                                <div className="file-details">
                                  <span>Document Attached</span>
                                </div>
                                <button type="button" className="icon-btn delete" onClick={(e) => { e.stopPropagation(); updatePackingRow(index, 'file', null); }}><X size={14} /></button>
                              </div>
                            )
                          ) : (
                            <div className="upload-placeholder compact">
                              <UploadCloud size={20} />
                              <span>Upload Row Document</span>
                            </div>
                          )}
                          <input id={`row-file-${index}`} type="file" hidden onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) updatePackingRow(index, 'file', file);
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="add-master-btn" onClick={addPackingRow} style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                    <Plus size={16} /> ADD ANOTHER PACKING OPTION
                  </button>
                </div>
              )}

              {activeTab === 'facts' && (
                <div className="tab-pane">
                  <div className="form-group-light">
                    <label>Product Fact Details</label>
                    <textarea rows="6" placeholder="Enter more detailed product facts, stories, or unique selling points..." value={formData.description_facts || ''} onChange={e => setFormData({ ...formData, description_facts: e.target.value })}></textarea>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
              <button type="button" className="btn-save" onClick={handleSave}>Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CMS = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="admin-layout light-theme-override">
      <aside className="admin-sidebar light-sidebar">
        <div className="sidebar-brand">
          <h2>NURAGRO</h2>
          <span className="sidebar-badge">Admin</span>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-btn ${location.pathname === '/admin' ? 'active' : ''}`} onClick={() => navigate('/admin')}><LayoutDashboard size={20} /> Dashboard</button>
          <button className={`nav-btn ${location.pathname === '/admin/master' ? 'active' : ''}`} onClick={() => navigate('/admin/master')}><Layers size={20} /> Master</button>
          <button className={`nav-btn ${location.pathname === '/admin/category' ? 'active' : ''}`} onClick={() => navigate('/admin/category')}><List size={20} /> Category</button>
          <button className={`nav-btn ${location.pathname === '/admin/product' ? 'active' : ''}`} onClick={() => navigate('/admin/product')}><Box size={20} /> Products</button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-btn logout-btn" onClick={handleLogout}><LogOut size={20} /> Logout</button>
        </div>
      </aside>

      <main className="admin-main light-main">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/master" element={<MasterPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/product" element={<ProductPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default CMS;
