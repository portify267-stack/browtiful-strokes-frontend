import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Sparkles, Layers } from 'lucide-react';
import {
  getProductByIdApi,
  createProductApi,
  updateProductApi,
  getAdminCategoriesApi,
  getImageUrl,
} from '../services/adminApi';
import { useToast } from '../../context/ToastContext';

const AdminProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [categoryId, setCategoryId] = useState('');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isCombo, setIsCombo] = useState(false);
  const [weight, setWeight] = useState('');

  // Images state
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getAdminCategoriesApi();
        setCategories(cats);
        if (!isEditMode && cats.length > 0) {
          setCategoryId(cats[0]._id);
        }
      } catch {
        showToast('Failed to load categories', 'error');
      }
    };

    const loadProductData = async () => {
      if (!isEditMode) return;
      setIsFetching(true);
      try {
        const product = await getProductByIdApi(id);
        if (product) {
          setName(product.name || '');
          setDescription(product.description || '');
          setPrice(product.price !== undefined ? String(product.price) : '');
          setStock(product.stock !== undefined ? String(product.stock) : '0');
          setCategoryId(
            typeof product.categoryId === 'object'
              ? product.categoryId?._id
              : product.categoryId || ''
          );
          setIsBestSeller(Boolean(product.isBestSeller));
          setIsCombo(Boolean(product.isCombo));
          setWeight(product.weight !== undefined ? String(product.weight) : '');
          setExistingImages(product.images || []);
        }
      } catch (err) {
        showToast(err?.response?.data?.message || 'Failed to load product details', 'error');
        navigate('/admin/products');
      } finally {
        setIsFetching(false);
      }
    };

    loadCategories();
    loadProductData();
  }, [id, isEditMode, navigate, showToast]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (existingImages.length + newImageFiles.length + files.length > 5) {
      showToast('Maximum 5 images allowed per product.', 'error');
      return;
    }

    const updatedFiles = [...newImageFiles, ...files];
    setNewImageFiles(updatedFiles);

    // Create object URLs for preview
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeNewImage = (indexToRemove) => {
    setNewImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Product description is required', 'error');
      return;
    }
    if (!price || Number(price) < 0) {
      showToast('Valid price in INR is required', 'error');
      return;
    }
    if (!stock || Number(stock) < 0) {
      showToast('Valid stock quantity is required', 'error');
      return;
    }
    if (!weight || Number(weight) < 0) {
      showToast('Valid weight in grams is required', 'error');
      return;
    }
    if (!categoryId) {
      showToast('Please select a category', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('price', String(price));
      formData.append('stock', String(stock));
      formData.append('weight', String(weight));
      formData.append('categoryId', categoryId);
      formData.append('isBestSeller', String(isBestSeller));
      formData.append('isCombo', String(isCombo));

      // Append existing image paths as stringified array or individual fields if needed
      existingImages.forEach((img) => {
        formData.append('existingImages', img);
      });

      // Append new image binary files
      newImageFiles.forEach((file) => {
        formData.append('images', file);
      });

      if (isEditMode) {
        await updateProductApi(id, formData);
        showToast('Product updated successfully!', 'success');
      } else {
        await createProductApi(formData);
        showToast('Product created successfully!', 'success');
      }

      navigate('/admin/products');
    } catch (err) {
      showToast(
        err?.response?.data?.message || err?.message || 'Failed to save product.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-charcoal/60 mt-3">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 rounded-xl bg-beige/30 hover:bg-beige/60 border border-beige/80 text-charcoal transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-charcoal">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xs text-charcoal/70">
              {isEditMode ? 'Update product information and inventory' : 'Create a new catalog item'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-cream border border-beige/80 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Name & Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bridal Henna Cone"
              className="w-full px-4 py-2.5 bg-cream border border-beige focus:border-gold rounded-xl text-xs text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
              Category *
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 bg-cream border border-beige focus:border-gold rounded-xl text-xs text-charcoal cursor-pointer"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
            Description *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the product, ingredients, usage..."
            className="w-full px-4 py-2.5 bg-cream border border-beige focus:border-gold rounded-xl text-xs text-charcoal"
          />
        </div>

        {/* Price, Stock & Weight Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
              Price (₹ INR) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 150"
              className="w-full px-4 py-2.5 bg-cream border border-beige focus:border-gold rounded-xl text-xs text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              required
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-4 py-2.5 bg-cream border border-beige focus:border-gold rounded-xl text-xs text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
              Weight (grams) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 250"
              className="w-full px-4 py-2.5 bg-cream border border-beige focus:border-gold rounded-xl text-xs text-charcoal"
            />
          </div>
        </div>

        {/* Status Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-3 p-3.5 bg-beige/20 border border-beige/60 rounded-xl cursor-pointer hover:bg-beige/40 transition-colors">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="w-4 h-4 text-forest rounded focus:ring-gold"
            />
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-dark" />
              <span className="text-xs font-semibold text-charcoal">Best Seller Product</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 bg-beige/20 border border-beige/60 rounded-xl cursor-pointer hover:bg-beige/40 transition-colors">
            <input
              type="checkbox"
              checked={isCombo}
              onChange={(e) => setIsCombo(e.target.checked)}
              className="w-4 h-4 text-forest rounded focus:ring-gold"
            />
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-700" />
              <span className="text-xs font-semibold text-charcoal">Combo Offer Product</span>
            </div>
          </label>
        </div>

        {/* Image Upload Area */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
            Product Images (Max 5)
          </label>

          {/* Existing & New Image Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
            {/* Existing Images */}
            {existingImages.map((imgPath, idx) => (
              <div key={`exist-${idx}`} className="relative group rounded-xl overflow-hidden border border-beige aspect-square bg-beige/20">
                <img
                  src={getImageUrl(imgPath)}
                  alt="Existing"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* New Upload Previews */}
            {imagePreviews.map((previewUrl, idx) => (
              <div key={`new-${idx}`} className="relative group rounded-xl overflow-hidden border border-gold aspect-square bg-gold/10">
                <img
                  src={previewUrl}
                  alt="New preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            {existingImages.length + newImageFiles.length < 5 && (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-beige hover:border-gold rounded-xl cursor-pointer bg-beige/20 hover:bg-beige/40 transition-colors aspect-square text-center">
                <Upload className="w-5 h-5 text-charcoal/50 mb-1" />
                <span className="text-[10px] font-bold text-charcoal/70">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-[11px] text-charcoal/50">
            Allowed formats: JPG, PNG, WEBP. First image will be used as primary thumbnail.
          </p>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-beige/60">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            disabled={isLoading}
            className="px-5 py-2.5 text-xs font-semibold text-charcoal/80 bg-beige/30 hover:bg-beige/60 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-forest hover:bg-forest-dark text-cream font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'Update Product' : 'Create Product'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
