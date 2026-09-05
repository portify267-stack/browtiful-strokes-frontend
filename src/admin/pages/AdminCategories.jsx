import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  Upload,
  X,
  RefreshCw,
  AlertCircle,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  getAdminCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from '../services/adminApi';
import ConfirmationModal from '../components/ConfirmationModal';
import { useToast } from '../../context/ToastContext';
import {
  CATEGORY_IMAGE_PRESETS,
  getCategoryLocalImage,
  resolveCategoryImageUrl,
} from '../../utils/categoryImageHelper';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for Add / Edit
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation State
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminCategoriesApi();
      setCategories(data);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to fetch categories', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetFormFields = () => {
    setName('');
    setDescription('');
    setSelectedPreset(null);
    setImageFile(null);
    setImagePreview(null);
    setNameError('');
  };

  const openAddModal = () => {
    setEditingCategory(null);
    resetFormFields();
    setIsFormModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setDescription(cat.description || '');
    setImageFile(null);

    const resolved = resolveCategoryImageUrl(cat.image, cat.name);
    setImagePreview(resolved);

    // Check if the current image matches any of our presets
    const matchingPreset = CATEGORY_IMAGE_PRESETS.find(
      (p) => p.path === cat.image || resolved.endsWith(p.path)
    );
    setSelectedPreset(matchingPreset ? matchingPreset.path : null);

    setNameError('');
    setIsFormModalOpen(true);
  };

  // When user types category name in Add mode, auto-suggest the matching preset if user hasn't uploaded a file
  const handleNameChange = (val) => {
    setName(val);
    if (nameError) setNameError('');

    if (!editingCategory && !imageFile && !selectedPreset) {
      const autoPreset = getCategoryLocalImage(val);
      if (autoPreset) {
        setImagePreview(autoPreset);
      }
    }
  };

  const handleSelectPreset = (presetPath) => {
    setSelectedPreset(presetPath);
    setImageFile(null);
    setImagePreview(presetPath);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setSelectedPreset(null);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setSelectedPreset(null);
    const fallback = getCategoryLocalImage(name) || '/images/fallback.svg';
    setImagePreview(fallback);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setNameError('');

    if (!name.trim()) {
      setNameError('Category name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());

      if (imageFile) {
        // Custom uploaded file takes highest priority
        formData.append('image', imageFile);
      } else if (selectedPreset) {
        // Selected preset asset path
        formData.append('image', selectedPreset);
      } else if (!editingCategory) {
        // Auto-assign default preset image if matching name
        const defaultPreset = getCategoryLocalImage(name.trim());
        if (defaultPreset) {
          formData.append('image', defaultPreset);
        }
      }

      if (editingCategory) {
        await updateCategoryApi(editingCategory._id, formData);
        showToast(`Category '${name.trim()}' updated successfully!`, 'success');
      } else {
        await createCategoryApi(formData);
        showToast(`Category '${name.trim()}' created successfully!`, 'success');
      }

      // Reset form fields and close modal on success
      resetFormFields();
      setIsFormModalOpen(false);
      fetchCategories();
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || '';

      if (status === 409 || msg.toLowerCase().includes('already exists')) {
        const userFriendlyMsg = 'Category already exists. Please use a different name.';
        setNameError(userFriendlyMsg);
        showToast(userFriendlyMsg, 'error');
      } else {
        showToast(msg || 'Failed to save category', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCategoryApi(categoryToDelete._id);
      showToast(`Category '${categoryToDelete.name}' deleted successfully!`, 'success');
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to delete category.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-charcoal">
            Category Management
          </h1>
          <p className="text-xs md:text-sm text-charcoal/70 mt-1">
            Manage product categories and cover images shown on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="p-2.5 bg-cream border border-beige/80 hover:bg-beige/40 rounded-xl text-charcoal cursor-pointer disabled:opacity-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-dark text-cream font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Grid view of Categories */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 bg-beige/30 rounded-2xl animate-pulse border border-beige/40"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center bg-cream border border-beige/80 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-beige/40 flex items-center justify-center text-charcoal/40 mx-auto mb-3">
            <FolderTree className="w-6 h-6" />
          </div>
          <h3 className="text-base font-serif font-bold text-charcoal">No Categories Available</h3>
          <p className="text-xs text-charcoal/60 mt-1 max-w-sm mx-auto">
            Click "Add Category" above to create your first product category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const imageUrl = resolveCategoryImageUrl(cat.image, cat.name);
            return (
              <div
                key={cat._id}
                className="bg-cream border border-beige/80 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                {/* Category Cover Area with the exact website circular styling */}
                <div className="w-full pt-6 pb-4 px-4 bg-gradient-to-b from-beige/20 to-cream border-b border-beige/50 flex flex-col items-center justify-center">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-beige/80 group-hover:border-forest shadow-md group-hover:shadow-xl transition-all duration-300 relative bg-[#fdfbf7] shrink-0 aspect-square">
                    <img
                      src={imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 block"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/fallback.svg';
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-charcoal/40 uppercase tracking-wider mt-2.5">
                    Cover Image
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-serif font-bold text-charcoal group-hover:text-forest transition-colors">
                        {cat.name}
                      </h3>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-90 shrink-0">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-forest hover:bg-forest/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCategoryToDelete(cat)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-charcoal/70 line-clamp-3 leading-relaxed">
                      {cat.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-cream border border-beige rounded-2xl shadow-2xl max-w-lg w-full p-6 relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormModalOpen(false)}
              disabled={isSubmitting}
              className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal p-1 rounded-lg hover:bg-beige/40 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-serif font-bold text-charcoal mb-1">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <p className="text-xs text-charcoal/60 mb-5">
              {editingCategory
                ? 'Update category name, description, and cover image.'
                : 'Create a new category for grouping your products.'}
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Henna Cones"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs text-charcoal transition-colors ${
                    nameError
                      ? 'bg-red-50/60 border-2 border-red-500 focus:border-red-600 focus:outline-none'
                      : 'bg-cream border border-beige focus:border-gold'
                  }`}
                />
                {nameError && (
                  <p className="text-xs font-semibold text-red-600 mt-1.5 flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{nameError}</span>
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of this category..."
                  className="w-full px-3.5 py-2.5 bg-cream border border-beige focus:border-gold rounded-xl text-xs text-charcoal"
                />
              </div>

              {/* Cover Image Section */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Category Cover Image
                </label>

                {/* Live Circular Preview (Website visual style) */}
                <div className="flex items-center gap-4 p-3 bg-beige/20 rounded-xl border border-beige/60">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-forest shadow-md aspect-square bg-[#fdfbf7] shrink-0 relative">
                    <img
                      src={imagePreview || resolveCategoryImageUrl(null, name)}
                      alt="Category Preview"
                      className="w-full h-full object-cover object-center block"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/fallback.svg';
                      }}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-serif font-bold text-charcoal truncate">
                      {name || 'New Category'}
                    </p>
                    <p className="text-[11px] text-charcoal/60 mt-0.5">
                      {imageFile
                        ? `Custom file: ${imageFile.name}`
                        : selectedPreset
                        ? `Selected preset asset`
                        : 'Default category cover'}
                    </p>
                    {(imageFile || selectedPreset) && (
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="text-[11px] font-semibold text-red-600 hover:text-red-700 underline mt-1 cursor-pointer block"
                      >
                        Reset to default
                      </button>
                    )}
                  </div>
                </div>

                {/* Option 1: Select Website Cover Preset */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    <span className="text-[11px] font-semibold text-charcoal/80 uppercase tracking-wider">
                      Choose Website Cover Preset:
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORY_IMAGE_PRESETS.map((preset) => {
                      const isSelected =
                        selectedPreset === preset.path ||
                        (!imageFile && !selectedPreset && imagePreview === preset.path);
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset.path)}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-forest bg-forest/10 ring-1 ring-forest'
                              : 'border-beige/80 bg-cream hover:bg-beige/30'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-beige shrink-0 aspect-square bg-[#fdfbf7]">
                            <img
                              src={preset.path}
                              alt={preset.name}
                              className="w-full h-full object-cover object-center"
                            />
                          </div>
                          <div className="min-w-0 flex-grow">
                            <span className="block text-[11px] font-bold text-charcoal truncate">
                              {preset.name}
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-forest shrink-0 mr-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Option 2: Upload Custom Image File */}
                <div>
                  <span className="block text-[11px] font-semibold text-charcoal/80 uppercase tracking-wider mb-1.5">
                    Or Upload Custom Image:
                  </span>
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-beige hover:border-gold rounded-xl cursor-pointer bg-beige/10 hover:bg-beige/30 transition-colors text-xs font-semibold text-charcoal/70">
                    <Upload className="w-4 h-4 text-forest" />
                    <span>{imageFile ? 'Replace Uploaded Image' : 'Upload Image File (JPG, PNG, WEBP)'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-beige/60">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-charcoal/80 bg-beige/30 hover:bg-beige/60 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-forest hover:bg-forest-dark text-cream font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                      <span>{editingCategory ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!categoryToDelete}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"? Make sure no products are currently linked to it.`}
        confirmText="Delete Category"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setCategoryToDelete(null)}
      />
    </div>
  );
};

export default AdminCategories;
