import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Edit2, Trash2, X, LayoutDashboard, Layers, LogOut, Plus, Eye, List, Package, Box, UploadCloud, FileText, Star, Award, Zap, Flame, Search
} from 'lucide-react';
import { getNavbars, createNavbar, updateNavbar, deleteNavbar } from '../services/navbarService';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';
import { getProducts, createProduct, updateProduct, toggleSpecial, toggleTrending, toggleBestSeller, toggleFeaturedProducts, toggleNewArrivalProducts, deleteProduct, getProductSeo, updateProductSeo } from '../services/productService';
import { getNutritions, createNutrition, updateNutrition, deleteNutrition } from '../services/nutritionService';
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

const NutritionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nutritions, setNutritions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nutrition_name: '',
    nutrition_parent: '',
    parent_id: ''
  });

  useEffect(() => {
    fetchNutritions();
  }, []);

  const fetchNutritions = async () => {
    try {
      const res = await getNutritions();
      setNutritions(res.data);
    } catch (err) {
      console.error('Error fetching nutritions', err);
    }
  };

  const handleSave = async () => {
    if (!formData.nutrition_name.trim()) return alert("Nutrition name is required");
    try {
      const selectedParent = (nutritions || []).find(n => n.nutrition_name === formData.nutrition_parent);
      const computedParentId = selectedParent ? selectedParent.id : null;

      const payload = {
        nutrition_name: formData.nutrition_name,
        nutrition_parent: formData.nutrition_parent,
        parent_id: computedParentId
      };

      if (editingId) {
        await updateNutrition(editingId, payload);
      } else {
        await createNutrition(payload);
      }

      handleCloseModal();
      fetchNutritions();
    } catch (err) {
      console.error('Error saving nutrition', err);
      alert(err.response?.data?.message || err.message || 'Error saving nutrition');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ nutrition_name: '', nutrition_parent: '', parent_id: '' });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      nutrition_name: item.nutrition_name || '',
      nutrition_parent: item.nutrition_parent || '',
      parent_id: item.parent_id || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this nutrition item?')) {
      try {
        await deleteNutrition(id);
        fetchNutritions();
      } catch (err) {
        console.error('Error deleting', err);
      }
    }
  };

  return (
    <div className="master-page">
      <div className="master-header">
        <div>
          <h1>Nutrition Management</h1>
          <p className="subtitle">Configure dynamic product nutritional guidelines</p>
        </div>
        <button className="add-master-btn" onClick={() => {
          setEditingId(null);
          setFormData({ nutrition_name: '', nutrition_parent: '', parent_id: '' });
          setIsModalOpen(true);
        }}>
          <Plus size={16} /> ADD NUTRITION ENTRY
        </button>
      </div>

      <div className="master-table-container">
        <table className="master-table">
          <thead>
            <tr>
              <th>NUTRITION NAME</th>
              <th>PARENT TYPE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {(nutritions || []).map(item => (
              <tr key={item.id}>
                <td className="module-name-col">{item.nutrition_name}</td>
                <td className="parent-col">{item.nutrition_parent || 'None'}</td>
                <td className="actions-col">
                  <button className="icon-btn edit" onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                  <button className="icon-btn delete" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {(!nutritions || nutritions.length === 0) && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No nutrition records found. Create one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Nutrition Entry' : 'Create Nutrition Entry'}</h2>
              <button className="close-btn" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group-light">
                <label>Nutrition Name <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Vitamin C"
                  value={formData.nutrition_name}
                  onChange={e => setFormData({ ...formData, nutrition_name: e.target.value })}
                />
              </div>
              <div className="form-group-light">
                <label>Nutrition Parent (Category/Type)</label>
                <select
                  value={formData.nutrition_parent}
                  onChange={e => setFormData({ ...formData, nutrition_parent: e.target.value })}
                >
                  <option value="">Select Nutrition Parent...</option>
                  {(nutritions || []).map(item => (
                    <option key={item.id} value={item.nutrition_name}>
                      {item.nutrition_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="btn-save" onClick={handleSave}>Save Entry</button>
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
                    <img 
                      src={cat.category_image.startsWith('data:image') ? cat.category_image : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${cat.category_image}`} 
                      alt={cat.category_name} 
                      style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} 
                    />
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
                      <img 
                        src={formData.category_image.startsWith('data:image') ? formData.category_image : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${formData.category_image}`} 
                        alt="Preview" 
                      />
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
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [currentSeoProduct, setCurrentSeoProduct] = useState(null);
  const [nutritions, setNutritions] = useState([]);
  const [formData, setFormData] = useState({
    name: '', description: '', category_id: '', image: '',
    description_facts: '', weight: '', packing_details: '',
    packing_options: [{ product: '', packing: '', container: '', file: null }],
    type_options: [{ name: '', description: '', file: null }],
    nutrition_options: [{ name: '', amount: '', dv: '' }],
    spec_file: null,
    nutrition_file: null,
    special: ''
  });

  const [seoData, setSeoData] = useState({
    id: '', focus_keyphrase: '', slug_text: '', seo_title: '', meta_description: ''
  });

  useEffect(() => { fetchProducts(); fetchCategories(); fetchNutritionsList(); }, []);
  const fetchProducts = async () => { try { const res = await getProducts(); setProducts(res.data); } catch (err) { console.error(err); } };
  const fetchCategories = async () => { try { const res = await getCategories(); setCategories(res.data); } catch (err) { console.error(err); } };
  const fetchNutritionsList = async () => {
    try {
      const res = await getNutritions();
      setNutritions(res.data);
      if (res.data && res.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          nutrition_options: res.data.map(item => ({ name: item.nutrition_name, amount: '', dv: '', display: true, order: 0 }))
        }));
      }
    } catch (err) {
      console.error("Error fetching nutritions:", err);
    }
  };

  const getFilePreview = (file) => {
    if (!file) return null;
    if (typeof file === 'string') {
      if (file.startsWith('data:') || file.startsWith('blob:')) return file;
      return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${file.startsWith('/') ? '' : '/'}${file}`;
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
        } else if (key === 'nutrition_options') {
          data.append(key, JSON.stringify(formData.nutrition_options || []));
        } else if (formData[key] instanceof File) {
          data.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      if (editingId) await updateProduct(editingId, data);
      else await createProduct(data);

      handleCloseModal();
      window.location.reload();
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
      nutrition_options: (nutritions && nutritions.length > 0)
        ? nutritions.map(item => ({ name: item.nutrition_name, amount: '', dv: '', display: true, order: 0 }))
        : [{ name: '', amount: '', dv: '', display: true, order: 0 }],
      spec_file: null,
      nutrition_file: null,
      special: ''
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
      special: prod.special || '',
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
      nutrition_options: (nutritions && nutritions.length > 0)
        ? nutritions.map(item => {
            const existing = (prod.nutrition_options || []).find(n => n.name === item.nutrition_name);
            return {
              name: item.nutrition_name,
              amount: existing ? existing.amount || '' : '',
              dv: existing ? existing.dv || '' : '',
              display: existing ? existing.display !== false : true,
              order: existing ? existing.order || 0 : 0
            };
          })
        : [{ name: '', amount: '', dv: '', display: true, order: 0 }],
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

  const handleToggleSpecial = async (prod) => {
    try {
      let currentSpecial = prod.special === 1 ? 0 : 1;
      if (prod.special === null || prod.special === undefined) {
        currentSpecial = 1;
      }

      await toggleSpecial(prod.id, currentSpecial);
      fetchProducts();
    } catch (err) {
      console.error("Toggle special failed", err);
    }
  };

  const handleToggleTrending = async (prod) => {
    try {
      let currentTrending = prod.trending === 1 ? 0 : 1;
      if (prod.trending === null || prod.trending === undefined) {
        currentTrending = 1;
      }

      await toggleTrending(prod.id, currentTrending);
      fetchProducts();
    } catch (err) {
      console.error("Toggle trending failed", err);
    }
  };

  const handleToggleBestSeller = async (prod) => {
    try {
      let currentBS = prod.best_seller === 1 ? 0 : 1;
      if (prod.best_seller === null || prod.best_seller === undefined) {
        currentBS = 1;
      }

      await toggleBestSeller(prod.id, currentBS);
      fetchProducts();
    } catch (err) {
      console.error("Toggle best seller failed", err);
    }
  };

  const handleToggleFeatured = async (prod) => {
    try {
      let currentFeatured = prod.featured_products === 1 ? 0 : 1;
      if (prod.featured_products === null || prod.featured_products === undefined) {
        currentFeatured = 1;
      }
      await toggleFeaturedProducts(prod.id, currentFeatured);
      fetchProducts();
    } catch (err) {
      console.error("Toggle featured failed", err);
    }
  };

  const handleToggleNewArrival = async (prod) => {
    try {
      let currentNew = prod.new_arrival_products === 1 ? 0 : 1;
      if (prod.new_arrival_products === null || prod.new_arrival_products === undefined) {
        currentNew = 1;
      }
      await toggleNewArrivalProducts(prod.id, currentNew);
      fetchProducts();
    } catch (err) {
      console.error("Toggle new arrival failed", err);
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

  const addNutritionRow = () => {
    setFormData({
      ...formData,
      nutrition_options: [...(formData.nutrition_options || []), { name: '', amount: '', dv: '' }]
    });
  };

  const removeNutritionRow = (index) => {
    const newOptions = (formData.nutrition_options || []).filter((_, i) => i !== index);
    setFormData({ ...formData, nutrition_options: newOptions });
  };

  const updateNutritionRow = (index, field, value) => {
    const newOptions = (formData.nutrition_options || []).map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, nutrition_options: newOptions });
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
                  <button
                    className={`icon-btn ${prod.special === 1 ? 'active-special' : ''}`}
                    onClick={() => handleToggleSpecial(prod)}
                    title={prod.special === 1 ? "Remove from Special Offers" : "Mark as Special Offer"}
                    style={{ color: prod.special === 1 ? '#faa300' : '#9ca3af', marginRight: '8px' }}
                  >
                    <Star size={16} fill={prod.special === 1 ? '#faa300' : 'none'} />
                  </button>
                  <button
                    className={`icon-btn ${prod.trending === 1 ? 'active-trending' : ''}`}
                    onClick={() => handleToggleTrending(prod)}
                    title={prod.trending === 1 ? "Remove from Trending" : "Mark as Trending"}
                    style={{ color: prod.trending === 1 ? '#0ea5e9' : '#9ca3af', marginRight: '8px' }}
                  >
                    <Eye size={16} fill={prod.trending === 1 ? '#0ea5e9' : 'none'} />
                  </button>
                  <button
                    className={`icon-btn ${prod.best_seller === 1 ? 'active-bestseller' : ''}`}
                    onClick={() => handleToggleBestSeller(prod)}
                    title={prod.best_seller === 1 ? "Remove from Best Sellers" : "Mark as Best Seller"}
                    style={{ color: prod.best_seller === 1 ? '#15803d' : '#9ca3af', marginRight: '8px' }}
                  >
                    <Award size={16} fill={prod.best_seller === 1 ? '#15803d' : 'none'} />
                  </button>
                  <button
                    className={`icon-btn ${prod.featured_products === 1 ? 'active-featured-prod' : ''}`}
                    onClick={() => handleToggleFeatured(prod)}
                    title={prod.featured_products === 1 ? "Remove from Featured Products" : "Mark as Featured Product"}
                    style={{ color: prod.featured_products === 1 ? '#a855f7' : '#9ca3af', marginRight: '8px' }}
                  >
                    <Zap size={16} fill={prod.featured_products === 1 ? '#a855f7' : 'none'} />
                  </button>
                  <button
                    className={`icon-btn ${prod.new_arrival_products === 1 ? 'active-new-arrival-prod' : ''}`}
                    onClick={() => handleToggleNewArrival(prod)}
                    title={prod.new_arrival_products === 1 ? "Remove from New Arrivals" : "Mark as New Arrival"}
                    style={{ color: prod.new_arrival_products === 1 ? '#ec4899' : '#9ca3af', marginRight: '8px' }}
                  >
                    <Flame size={16} fill={prod.new_arrival_products === 1 ? '#ec4899' : 'none'} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={async () => {
                      setCurrentSeoProduct(prod);
                      setIsSeoModalOpen(true);
                      try {
                        const res = await getProductSeo(prod.id);
                        const data = res.data;
                        setSeoData({
                          id: prod.id,
                          focus_keyphrase: data.focus_keyphrase || '',
                          slug_text: data.slug_text || '',
                          seo_title: data.seo_title || '',
                          meta_description: data.meta_description || ''
                        });
                      } catch (err) {
                        console.error("Error fetching SEO data:", err);
                        // Fallback to empty if product not found yet in SEO terms
                        setSeoData({ id: prod.id, focus_keyphrase: '', slug_text: '', seo_title: '', meta_description: '' });
                      }
                    }}
                    title="Product SEO Settings"
                    style={{ color: '#3943c7', marginRight: '8px' }}
                  >
                    <Search size={16} />
                  </button>
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
                      <label>Special Integer</label>
                      <input type="number" value={formData.special || ''} onChange={e => setFormData({ ...formData, special: e.target.value })} />
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
                <div className="tab-pane nutrition-facts-designer">
                  <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                    <div style={{ padding: '15px 20px', borderBottom: '2px solid #000' }}>
                      <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>Nutrition Facts</h2>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nutrient Section</th>
                            <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', width: '25%' }}>Amount</th>
                            <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', width: '20%' }}>% DV</th>
                            <th style={{ padding: '6px 12px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', width: '10%' }}>Display</th>
                            <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', width: '15%' }}>Order</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(formData.nutrition_options || []).map((opt, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                              <td style={{ padding: '4px 12px' }}>
                                <input
                                  type="text"
                                  value={opt.name || ''}
                                  readOnly
                                  title={opt.name || ''}
                                  style={{ width: '100%', border: 'none', background: 'transparent', fontWeight: '500', color: '#374151', fontSize: '13px', outline: 'none', cursor: 'default' }}
                                />
                              </td>
                              <td style={{ padding: '4px 12px' }}>
                                <input
                                  type="text"
                                  placeholder="e.g. 10g"
                                  value={opt.amount || ''}
                                  onChange={e => updateNutritionRow(index, 'amount', e.target.value)}
                                  style={{ width: '100%', padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: '2px', backgroundColor: '#f9fafb', fontSize: '13px', transition: 'border-color 0.15s ease' }}
                                />
                              </td>
                              <td style={{ padding: '4px 12px' }}>
                                <input
                                  type="text"
                                  placeholder="e.g. 5"
                                  value={opt.dv || ''}
                                  onChange={e => updateNutritionRow(index, 'dv', e.target.value)}
                                  style={{ width: '100%', padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: '2px', backgroundColor: '#f9fafb', fontSize: '13px', transition: 'border-color 0.15s ease' }}
                                />
                              </td>
                              <td style={{ padding: '4px 12px', textAlign: 'center', verticalAlign: 'middle' }}>
                                <input
                                  type="checkbox"
                                  checked={opt.display !== false}
                                  onChange={e => updateNutritionRow(index, 'display', e.target.checked)}
                                  style={{ cursor: 'pointer', width: '14px', height: '14px', margin: '0' }}
                                />
                              </td>
                              <td style={{ padding: '4px 12px' }}>
                                <input
                                  type="number"
                                  value={opt.order || 0}
                                  onChange={e => updateNutritionRow(index, 'order', parseInt(e.target.value) || 0)}
                                  style={{ width: '100%', padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: '2px', backgroundColor: '#f9fafb', fontSize: '13px', transition: 'border-color 0.15s ease' }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

      {isSeoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>SEO Settings for {currentSeoProduct?.name}</h2>
              <button className="close-btn" onClick={() => setIsSeoModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              <div className="form-group-light">
                <label>Focus Keyphrase</label>
                <input
                  type="text"
                  placeholder="e.g. organic farming"
                  value={seoData.focus_keyphrase}
                  onChange={e => setSeoData({ ...seoData, focus_keyphrase: e.target.value })}
                />
              </div>
              <div className="form-group-light">
                <label>Slug Text</label>
                <input
                  type="text"
                  placeholder="e.g. /about-us"
                  value={seoData.slug_text}
                  onChange={e => setSeoData({ ...seoData, slug_text: e.target.value })}
                />
              </div>
              <div className="form-group-light">
                <label>SEO Title</label>
                <input
                  type="text"
                  placeholder="e.g. Top Agricultural Products"
                  value={seoData.seo_title}
                  onChange={e => setSeoData({ ...seoData, seo_title: e.target.value })}
                />
              </div>
              <div className="form-group-light" style={{ marginTop: '20px' }}>
                <label>Meta Description</label>
                <textarea
                  rows="4"
                  placeholder="Write a brief description for search engines..."
                  value={seoData.meta_description}
                  onChange={e => setSeoData({ ...seoData, meta_description: e.target.value })}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setIsSeoModalOpen(false)}>Cancel</button>
              <button type="button" className="btn-save" onClick={async () => {
                try {
                  await updateProductSeo(currentSeoProduct.id, seoData);
                  alert("SEO saved for product!");
                  setIsSeoModalOpen(false);
                  window.location.reload();
                } catch (err) {
                  console.error("Error saving product SEO:", err);
                  alert("Failed to save SEO.");
                }
              }}>Save SEO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { getBanners, updateBanner, createBanner, deleteBanner } from '../services/bannerService';

const BannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', subtitle: '', link: '', image: null, type: 'tall' });

  const fetchBanners = async () => {
    try {
      const { data } = await getBanners();
      setBanners(data.data || []);
    } catch (err) {
      console.error('Error fetching banners', err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ title: '', subtitle: '', link: '', image: null, type: 'tall' });
    setIsModalOpen(true);
  };

  const handleEdit = (banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      link: banner.link || '',
      image: banner.image || null,
      type: banner.type || 'tall'
    });
    setIsModalOpen(true);
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteBanner(id);
        fetchBanners();
      } catch (err) {
        console.error('Error deleting banner', err);
      }
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('link', formData.link);
      data.append('type', formData.type);

      if (formData.image instanceof File) {
        data.append('image', formData.image);
      } else if (formData.image && typeof formData.image === 'string') {
        data.append('image', formData.image);
      }

      if (editingId) {
        await updateBanner(editingId, data);
      } else {
        await createBanner(data);
      }

      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      console.error('Error saving banner', err);
    }
  };

  return (
    <div className="master-page">
      <div className="master-header">
        <div>
          <h1>Banners</h1>
          <p className="subtitle">Manage site promotional banners</p>
        </div>
        <button className="add-master-btn" onClick={handleAdd}>
          <Plus size={16} /> ADD BANNER
        </button>
      </div>

      <div className="master-table-container">
        <table className="master-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>TITLE</th>
              <th>SUBTITLE</th>
              <th>TYPE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(banner => (
              <tr key={banner.id}>
                <td>
                  <img
                    src={banner.image && banner.image.startsWith('/uploads')
                      ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${banner.image}`
                      : 'https://via.placeholder.com/150'
                  }
                  alt={banner.title}
                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                </td>
                <td style={{ fontWeight: '700' }}>{banner.title}</td>
                <td>{banner.subtitle}</td>
                <td>{banner.type}</td>
                <td className="actions-col">
                  <button className="icon-btn edit" onClick={() => handleEdit(banner)}><Edit2 size={16} /></button>
                  <button className="icon-btn delete" onClick={() => handleDeleteBanner(banner.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Promotional Banner' : 'Add Promotional Banner'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              <div className="form-group-light">
                <label>Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="form-group-light">
                <label>Subtitle / Tagline</label>
                <input type="text" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
              </div>
              <div className="form-group-light">
                <label>Banner Placement Type</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option value="tall">Promo Grid (Tall Banner)</option>
                  <option value="hero">Homepage Hero (Top Slider)</option>
                </select>
              </div>
              <div className="form-group-light">
                <label>Promo Graphic</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button type="button" className="btn-save" onClick={handleSave}>Save Banner</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { Image } from 'lucide-react';

import { getSeos, createSeo, updateSeo } from '../services/seoService';

const SeoPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    focus_keyphrase: '',
    slug_text: '',
    seo_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchSeoData();
  }, []);

  const fetchSeoData = async () => {
    try {
      const res = await getSeos();
      if (res.data.data && res.data.data.length > 0) {
        setFormData(res.data.data[0]); // Load the first global SEO record for now
      }
    } catch (err) {
      console.error('Error fetching SEO', err);
    }
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await updateSeo(formData.id, formData);
        alert("SEO settings updated successfully!");
      } else {
        const res = await createSeo(formData);
        setFormData(res.data.data);
        alert("SEO settings created successfully!");
      }
    } catch (err) {
      console.error("Error saving SEO Data:", err);
      alert("Error saving SEO settings.");
    }
  };

  return (
    <div className="master-page">
      <div className="master-header">
        <div>
          <h1>SEO Management</h1>
          <p className="subtitle">Manage search engine optimization settings</p>
        </div>
        <button className="btn-save" style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#3943c7', color: 'white', cursor: 'pointer', fontWeight: '500' }} onClick={handleSave}>
          SAVE SETTINGS
        </button>
      </div>
      <div className="master-table-container" style={{ padding: '30px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

        <div className="form-grid">
          <div className="form-group-light">
            <label>ID</label>
            <input
              type="number"
              placeholder="e.g. 1"
              value={formData.id}
              onChange={e => setFormData({ ...formData, id: e.target.value })}
            />
          </div>
          <div className="form-group-light">
            <label>Focus Keyphrase</label>
            <input
              type="text"
              placeholder="e.g. organic farming"
              value={formData.focus_keyphrase}
              onChange={e => setFormData({ ...formData, focus_keyphrase: e.target.value })}
            />
          </div>
          <div className="form-group-light">
            <label>Slug Text</label>
            <input
              type="text"
              placeholder="e.g. /about-us"
              value={formData.slug_text}
              onChange={e => setFormData({ ...formData, slug_text: e.target.value })}
            />
          </div>
          <div className="form-group-light">
            <label>SEO Title</label>
            <input
              type="text"
              placeholder="e.g. Top Agricultural Products"
              value={formData.seo_title}
              onChange={e => setFormData({ ...formData, seo_title: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group-light" style={{ marginTop: '20px' }}>
          <label>Meta Description</label>
          <textarea
            rows="4"
            placeholder="Write a brief description for search engines..."
            value={formData.meta_description}
            onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
          ></textarea>
        </div>

      </div>
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
          <button className={`nav-btn ${location.pathname === '/admin/nutrition' ? 'active' : ''}`} onClick={() => navigate('/admin/nutrition')}><Zap size={20} /> Nutrition</button>
          <button className={`nav-btn ${location.pathname === '/admin/product' ? 'active' : ''}`} onClick={() => navigate('/admin/product')}><Box size={20} /> Products</button>
          <button className={`nav-btn ${location.pathname === '/admin/banners' ? 'active' : ''}`} onClick={() => navigate('/admin/banners')}><Image size={20} /> Banners</button>
          <button className={`nav-btn ${location.pathname === '/admin/seo' ? 'active' : ''}`} onClick={() => navigate('/admin/seo')}><Search size={20} /> SEO</button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-btn logout-btn" onClick={handleLogout}><LogOut size={20} /> Logout</button>
        </div>
      </aside>

      <main className="admin-main light-main">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="master" element={<MasterPage />} />
          <Route path="category" element={<CategoryPage />} />
          <Route path="nutrition" element={<NutritionPage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="banners" element={<BannerPage />} />
          <Route path="seo" element={<SeoPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default CMS;
