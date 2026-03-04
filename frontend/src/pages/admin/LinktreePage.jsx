import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  Globe,
  BarChart3,
  CheckCircle2,
  XCircle,
  Sparkles,
  GripVertical,
  Paintbrush,
  ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import LinktreeModal from "../../components/admin/LinktreeModal";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";
import { getIconComponent } from "../../lib/iconResolver";
import { getImageUrl } from "../../lib/utils";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const AdminLinktreePage = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [deleteLink, setDeleteLink] = useState(null);
  const [saving, setSaving] = useState(false);

  // Linktree profile settings
  const [profileSettings, setProfileSettings] = useState({
    linktreeTitle: "",
    linktreeBio: "",
    linktreeAvatar: "",
    linktreeBgColor: "",
    linktreeBgImage: "",
  });
  const [uploadingBg, setUploadingBg] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLinks();
    fetchSettings();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axios.get(`${API_URL}/linktree/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLinks(res.data.data || []);
    } catch (error) {
      console.error("Error fetching links:", error);
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data || {};
      setProfileSettings({
        linktreeTitle: data.linktreeTitle || "",
        linktreeBio: data.linktreeBio || "",
        linktreeAvatar: data.linktreeAvatar || "",
        linktreeBgColor: data.linktreeBgColor || "",
        linktreeBgImage: data.linktreeBgImage || "",
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const { linktreeBgImage, ...settingsToSave } = profileSettings;
      await axios.post(
        `${API_URL}/settings/bulk`,
        { settings: settingsToSave },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile settings saved!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadBgImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBg(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(`${API_URL}/linktree/upload-bg`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfileSettings((prev) => ({
        ...prev,
        linktreeBgImage: res.data.data.imageUrl,
      }));
      toast.success("Background image uploaded!");
    } catch (error) {
      console.error("Error uploading background:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingBg(false);
    }
  };

  const handleDeleteBgImage = async () => {
    try {
      await axios.delete(`${API_URL}/linktree/delete-bg`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileSettings((prev) => ({
        ...prev,
        linktreeBgImage: "",
      }));
      toast.success("Background image removed!");
    } catch (error) {
      console.error("Error deleting background:", error);
      toast.error("Failed to remove image");
    }
  };

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editingLink) {
        await axios.put(`${API_URL}/linktree/${editingLink.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Link updated successfully!");
      } else {
        await axios.post(`${API_URL}/linktree`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Link created successfully!");
      }
      setShowModal(false);
      setEditingLink(null);
      fetchLinks();
    } catch (error) {
      console.error("Error saving link:", error);
      toast.error(error.response?.data?.message || "Failed to save link");
    }
  };

  const handleDelete = async () => {
    if (!deleteLink) return;
    try {
      await axios.delete(`${API_URL}/linktree/${deleteLink.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Link deleted successfully!");
      setDeleteLink(null);
      fetchLinks();
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link");
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const newLinks = [...links];
    [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
    const reorderData = newLinks.map((link, i) => ({ id: link.id, order: i }));
    setLinks(newLinks);
    try {
      await axios.put(
        `${API_URL}/linktree/reorder`,
        { links: reorderData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("Failed to reorder");
      fetchLinks();
    }
  };

  const handleMoveDown = async (index) => {
    if (index === links.length - 1) return;
    const newLinks = [...links];
    [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    const reorderData = newLinks.map((link, i) => ({ id: link.id, order: i }));
    setLinks(newLinks);
    try {
      await axios.put(
        `${API_URL}/linktree/reorder`,
        { links: reorderData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("Failed to reorder");
      fetchLinks();
    }
  };

  const handleToggleActive = async (link) => {
    try {
      await axios.put(
        `${API_URL}/linktree/${link.id}`,
        { isActive: !link.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Link ${link.isActive ? "deactivated" : "activated"}!`);
      fetchLinks();
    } catch (error) {
      console.error("Error toggling active:", error);
      toast.error("Failed to update link");
    }
  };

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = links.filter((l) => l.isActive).length;
  const inactiveCount = links.filter((l) => !l.isActive).length;

  const stats = [
    {
      label: "Total Links",
      value: links.length,
      icon: Link2,
      gradient: "from-purple-500 to-violet-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Active",
      value: activeCount,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Inactive",
      value: inactiveCount,
      icon: XCircle,
      gradient: "from-orange-500 to-amber-500",
      bg: "bg-orange-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div
            className="relative w-16 h-16 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full" />
          </motion.div>
          <p className="text-gray-400">Loading linktree...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Link2 className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0a0b0f] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Linktree Manager</h1>
            <p className="text-gray-400 text-sm">Manage your link page and profile</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("/linktree", "_blank")}
            className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingLink(null);
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-[#13151a] to-[#0a0b0f] border-gray-800/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
                  >
                    <stat.icon
                      className={`w-6 h-6 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                      style={{ color: stat.gradient.includes("emerald") ? "#10b981" : stat.gradient.includes("purple") ? "#a855f7" : "#f97316" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Profile Settings */}
      <Card className="bg-gradient-to-br from-[#13151a] to-[#0a0b0f] border-gray-800/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Page Profile</h2>
                <p className="text-sm text-gray-400">Customize your linktree page appearance</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Display Name
              </label>
              <Input
                value={profileSettings.linktreeTitle}
                onChange={(e) =>
                  setProfileSettings((prev) => ({
                    ...prev,
                    linktreeTitle: e.target.value,
                  }))
                }
                placeholder="Your Name / Server Name"
                className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Bio
              </label>
              <Input
                value={profileSettings.linktreeBio}
                onChange={(e) =>
                  setProfileSettings((prev) => ({
                    ...prev,
                    linktreeBio: e.target.value,
                  }))
                }
                placeholder="Short bio or tagline"
                className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Avatar URL
              </label>
              <Input
                value={profileSettings.linktreeAvatar}
                onChange={(e) =>
                  setProfileSettings((prev) => ({
                    ...prev,
                    linktreeAvatar: e.target.value,
                  }))
                }
                placeholder="https://example.com/avatar.png"
                className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background Customization */}
      <Card className="bg-gradient-to-br from-[#13151a] to-[#0a0b0f] border-gray-800/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
                <Paintbrush className="w-5 h-5 text-fuchsia-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Page Background</h2>
                <p className="text-sm text-gray-400">Custom color or background image</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Background Color */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">
                Background Color
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={profileSettings.linktreeBgColor || "#050507"}
                      onChange={(e) =>
                        setProfileSettings((prev) => ({
                          ...prev,
                          linktreeBgColor: e.target.value,
                        }))
                      }
                      className="w-12 h-12 rounded-xl border-2 border-gray-700 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={profileSettings.linktreeBgColor}
                      onChange={(e) =>
                        setProfileSettings((prev) => ({
                          ...prev,
                          linktreeBgColor: e.target.value,
                        }))
                      }
                      placeholder="#050507 or any CSS color"
                      className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 font-mono text-sm"
                    />
                  </div>
                  {profileSettings.linktreeBgColor && (
                    <button
                      onClick={() =>
                        setProfileSettings((prev) => ({
                          ...prev,
                          linktreeBgColor: "",
                        }))
                      }
                      className="w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-red-500/10 text-gray-500 hover:text-red-400 flex items-center justify-center transition-all"
                      title="Reset to default"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {/* Quick color presets */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { color: "#050507", label: "Default" },
                    { color: "#0a0a0a", label: "Black" },
                    { color: "#0f172a", label: "Slate" },
                    { color: "#1a1a2e", label: "Navy" },
                    { color: "#0d1117", label: "GitHub" },
                    { color: "#1e1b4b", label: "Indigo" },
                    { color: "#14532d", label: "Forest" },
                    { color: "#450a0a", label: "Dark Red" },
                    { color: "#2d1b69", label: "Purple" },
                    { color: "#1c1917", label: "Stone" },
                  ].map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() =>
                        setProfileSettings((prev) => ({
                          ...prev,
                          linktreeBgColor: preset.color,
                        }))
                      }
                      className={`group relative w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                        profileSettings.linktreeBgColor === preset.color
                          ? "border-emerald-400 shadow-lg shadow-emerald-500/20"
                          : "border-gray-700 hover:border-gray-500"
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.label}
                    >
                      {profileSettings.linktreeBgColor === preset.color && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Background Image */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">
                Background Image
              </label>
              {profileSettings.linktreeBgImage ? (
                <div className="relative group rounded-xl overflow-hidden border border-gray-700/50">
                  <img
                    src={getImageUrl(profileSettings.linktreeBgImage)}
                    alt="Background"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadBgImage}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={handleDeleteBgImage}
                      className="w-10 h-10 rounded-lg bg-red-500/30 hover:bg-red-500/50 flex items-center justify-center text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div
                    className={`border-2 border-dashed border-gray-700 hover:border-fuchsia-500/40 rounded-xl h-36 flex flex-col items-center justify-center gap-2 transition-all hover:bg-fuchsia-500/5 ${
                      uploadingBg ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {uploadingBg ? (
                      <>
                        <motion.div
                          className="w-8 h-8 border-2 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="text-xs text-gray-400">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-600" />
                        <span className="text-sm text-gray-400">Click to upload background</span>
                        <span className="text-xs text-gray-600">JPEG, PNG, GIF, WEBP (max 5MB)</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadBgImage}
                    className="hidden"
                    disabled={uploadingBg}
                  />
                </label>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Image will overlay on top of the background color
              </p>
            </div>
          </div>

          {/* Live Preview */}
          {(profileSettings.linktreeBgColor || profileSettings.linktreeBgImage) && (
            <div className="mt-5">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Preview</label>
              <div
                className="relative rounded-xl h-24 overflow-hidden border border-gray-700/50"
                style={{
                  backgroundColor: profileSettings.linktreeBgColor || "#050507",
                }}
              >
                {profileSettings.linktreeBgImage && (
                  <img
                    src={getImageUrl(profileSettings.linktreeBgImage)}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/60 text-sm font-medium">Background Preview</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <Card className="bg-gradient-to-br from-[#13151a] to-[#0a0b0f] border-gray-800/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search links..."
              className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Links List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredLinks.map((link, index) => {
            const IconComponent = getIconComponent(link.icon);
            return (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-gradient-to-br from-[#13151a] to-[#0a0b0f] border-gray-800/50 hover:border-gray-700/50 transition-all group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Drag handle & Order */}
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="w-7 h-7 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs text-gray-600 font-mono">{index + 1}</span>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === links.length - 1}
                          className="w-7 h-7 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          link.backgroundColor
                            ? `bg-gradient-to-r ${link.backgroundColor}`
                            : "bg-purple-500/10 border border-purple-500/20"
                        }`}
                      >
                        <IconComponent
                          className={`w-5 h-5 ${
                            link.backgroundColor ? "text-white" : "text-purple-400"
                          }`}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white truncate">{link.title}</h3>
                          <Badge
                            variant={link.isActive ? "success" : "secondary"}
                            className="text-[10px]"
                          >
                            {link.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-0.5">{link.url}</p>
                        {link.description && (
                          <p className="text-xs text-gray-600 truncate mt-0.5">{link.description}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleActive(link)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                            link.isActive
                              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-gray-800/50 text-gray-500 hover:bg-gray-700/50 hover:text-white"
                          }`}
                          title={link.isActive ? "Deactivate" : "Activate"}
                        >
                          {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingLink(link);
                            setShowModal(true);
                          }}
                          className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteLink(link)}
                          className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {filteredLinks.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {searchQuery ? "No links found" : "No links yet"}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first link to get started"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => {
                  setEditingLink(null);
                  setShowModal(true);
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Link
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <LinktreeModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingLink(null);
        }}
        onSubmit={handleCreateOrUpdate}
        link={editingLink}
      />

      <DeleteConfirmModal
        isOpen={!!deleteLink}
        onClose={() => setDeleteLink(null)}
        onConfirm={handleDelete}
        title="Delete Link"
        message={`Are you sure you want to delete "${deleteLink?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminLinktreePage;
