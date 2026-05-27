import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Editor } from '@tinymce/tinymce-react';
import { 
  X, 
  Upload, 
  Loader2, 
  Image as ImageIcon, 
  CheckCircle2,
  Globe,
  Lock,
  Hash,
  FileText
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import toast from "react-hot-toast";
import axios from "axios";
import { getImageUrl } from "../../lib/utils";

const GuideModal = ({ isOpen, onClose, mode, guide, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    order: '0',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (guide && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: guide.title || '',
        slug: guide.slug || '',
        content: guide.content || '',
        order: guide.order?.toString() || '0',
        isActive: guide.isActive ?? true
      });
      if (guide.imageUrl) {
        setImagePreview(getImageUrl(guide.imageUrl));
      }
    } else {
      setFormData({
        title: '',
        slug: '',
        content: '',
        order: '0',
        isActive: true
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [guide, mode, isOpen]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData({ 
      ...formData, 
      title: newTitle,
      slug: generateSlug(newTitle)
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('order', formData.order);
      formDataToSend.append('isActive', formData.isActive);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (mode === 'create') {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/guides`,
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
        toast.success("Guide berhasil ditambahkan");
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/guides/${guide.id}`,
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
        toast.success("Guide berhasil diupdate");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving guide:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto"
        >
          <Card className="border-white/\[0.06\] bg-[#13151a] shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-[#13151a] border-b border-white/\[0.06\] p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {mode === 'create' ? 'Tambah Guide' : mode === 'edit' ? 'Edit Guide' : 'Detail Guide'}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {mode === 'create' ? 'Buat guide tutorial baru' : mode === 'edit' ? 'Update informasi guide' : 'Lihat detail guide'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/\[0.07\] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Image & Meta */}
                <div className="space-y-6">
                  {/* Featured Image */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Featured Image
                    </label>
                    <div className="space-y-3">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white/\[0.05\] border-2 border-dashed border-gray-700 hover:border-indigo-500/50 transition-colors">
                        {imagePreview ? (
                          <>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            {!isViewMode && (
                              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white text-sm">Click to change</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="w-12 h-12 mb-2" />
                            <p className="text-sm">No image uploaded</p>
                          </div>
                        )}
                      </div>

                      {!isViewMode && (
                        <label className="cursor-pointer block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isViewMode}
                          />
                          <div className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-white transition-colors flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Image
                          </div>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Order */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      Order
                    </label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      placeholder="0"
                      className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-indigo-500"
                      disabled={isViewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Publication Status
                    </label>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => !isViewMode && setFormData({ ...formData, isActive: true })}
                        disabled={isViewMode}
                        className={`w-full p-4 rounded-lg border-2 transition-all ${
                          formData.isActive
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-gray-700 bg-white/\[0.03\] hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-emerald-400" />
                          <div className="text-left">
                            <p className="font-medium text-white">Published</p>
                            <p className="text-xs text-gray-400">Visible to public</p>
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => !isViewMode && setFormData({ ...formData, isActive: false })}
                        disabled={isViewMode}
                        className={`w-full p-4 rounded-lg border-2 transition-all ${
                          !formData.isActive
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-gray-700 bg-white/\[0.03\] hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-yellow-400" />
                          <div className="text-left">
                            <p className="font-medium text-white">Draft</p>
                            <p className="text-xs text-gray-400">Not visible</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* View Mode Info */}
                  {isViewMode && guide && (
                    <div className="p-4 bg-white/\[0.03\] rounded-lg border border-gray-700/50">
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">Created</p>
                          <p className="text-white">
                            {new Date(guide.createdAt).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Last Updated</p>
                          <p className="text-white">
                            {new Date(guide.updatedAt).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      Guide Title <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="e.g., How to Install Mods"
                      className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-indigo-500 text-lg font-medium"
                      required
                      disabled={isViewMode}
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      URL Slug <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">/guides/</span>
                      <Input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="how-to-install-mods"
                        className="flex-1 bg-[#1a1d24] border-gray-700 rounded-xl focus:border-indigo-500 font-mono text-sm"
                        required
                        disabled={isViewMode}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Lowercase letters, numbers, and dashes only
                    </p>
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Content <span className="text-red-400">*</span>
                    </label>
                    
                    {isViewMode ? (
                      <div 
                        className="prose prose-invert max-w-none p-6 bg-white/\[0.03\] rounded-lg border border-gray-700/50"
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                      />
                    ) : (
                      <div className="border border-gray-700/50 rounded-lg overflow-hidden">
                        <Editor
                          apiKey="5l5sk271ik73xutlxks4pt0clfmn2c2i0p7dy1rtxu88q2gf" 
                          onInit={(evt, editor) => editorRef.current = editor}
                          value={formData.content}
                          onEditorChange={(content) => setFormData({ ...formData, content })}
                          init={{
                            height: 500,
                            menubar: true,
                            skin: 'oxide-dark',
                            content_css: 'dark',
                            plugins: [
                              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                              'bold italic forecolor | alignleft aligncenter ' +
                              'alignright alignjustify | bullist numlist outdent indent | ' +
                              'removeformat | image media link | code | help',
                            content_style: `
                              body { 
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                                font-size: 14px;
                                color: #fff;
                                background: #1a1c24;
                              }
                              img { max-width: 100%; height: auto; }
                              a { color: #6366f1; }
                            `,
                            images_upload_handler: async (blobInfo, progress) => {
                              // Handle image upload
                              const formData = new FormData();
                              formData.append('image', blobInfo.blob(), blobInfo.filename());
                              
                              try {
                                const token = localStorage.getItem('token');
                                const response = await axios.post(
                                  `${import.meta.env.VITE_API_URL}/guides/upload-image`,
                                  formData,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                      'Content-Type': 'multipart/form-data'
                                    }
                                  }
                                );
                                return getImageUrl(response.data.url);
                              } catch (error) {
                                throw new Error('Image upload failed');
                              }
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-800">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-gray-700 hover:bg-white/\[0.07\]"
                >
                  {isViewMode ? 'Tutup' : 'Batal'}
                </Button>
                {!isViewMode && (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {mode === 'create' ? 'Publish Guide' : 'Update Guide'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GuideModal;





