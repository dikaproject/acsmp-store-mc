import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link as LinkIcon, Type, FileText, Palette, Hash, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { getIconComponent, availableIcons } from "../../lib/iconResolver";

const gradientPresets = [
  { label: "Purple", value: "from-purple-500 to-violet-600", from: "#a855f7", to: "#7c3aed" },
  { label: "Blue", value: "from-blue-500 to-cyan-500", from: "#3b82f6", to: "#06b6d4" },
  { label: "Emerald", value: "from-emerald-500 to-teal-500", from: "#10b981", to: "#14b8a6" },
  { label: "Orange", value: "from-orange-500 to-amber-500", from: "#f97316", to: "#f59e0b" },
  { label: "Rose", value: "from-rose-500 to-pink-500", from: "#f43f5e", to: "#ec4899" },
  { label: "Indigo", value: "from-indigo-500 to-blue-500", from: "#6366f1", to: "#3b82f6" },
  { label: "Fuchsia", value: "from-fuchsia-500 to-purple-500", from: "#d946ef", to: "#a855f7" },
  { label: "Cyan", value: "from-cyan-500 to-blue-500", from: "#06b6d4", to: "#3b82f6" },
  { label: "Amber", value: "from-amber-500 to-yellow-500", from: "#f59e0b", to: "#eab308" },
  { label: "Red", value: "from-red-500 to-rose-500", from: "#ef4444", to: "#f43f5e" },
];

const LinktreeModal = ({ isOpen, onClose, onSubmit, link = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    icon: "",
    description: "",
    backgroundColor: "",
    order: 0,
    isActive: true,
  });
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  useEffect(() => {
    if (link) {
      setFormData({
        title: link.title || "",
        url: link.url || "",
        icon: link.icon || "",
        description: link.description || "",
        backgroundColor: link.backgroundColor || "",
        order: link.order || 0,
        isActive: link.isActive !== undefined ? link.isActive : true,
      });
    } else {
      setFormData({
        title: "",
        url: "",
        icon: "",
        description: "",
        backgroundColor: "",
        order: 0,
        isActive: true,
      });
    }
    setShowIconPicker(false);
    setIconSearch("");
  }, [link, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      order: parseInt(formData.order) || 0,
    });
  };

  const filteredIcons = iconSearch
    ? availableIcons.filter((name) =>
        name.toLowerCase().includes(iconSearch.toLowerCase())
      )
    : availableIcons;

  const SelectedIcon = getIconComponent(formData.icon);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#13151a] border border-white/\[0.06\] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#13151a]/95 backdrop-blur-xl border-b border-white/\[0.06\] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-arcane/15 border border-arcane/30 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {link ? "Edit Link" : "Add New Link"}
                </h2>
                <p className="text-xs text-gray-400">
                  {link ? "Update link details" : "Create a new linktree link"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/\[0.05\] hover:bg-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Type className="w-4 h-4 text-arcane" /> <span className="text-red-400">*</span>
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="My Website"
                required
                className="bg-[#1a1d24] border-gray-700/50 rounded-xl placeholder:text-gray-500 focus:border-arcane/50"
              />
            </div>

            {/* URL */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <ExternalLink className="w-4 h-4 text-arcane" />
                URL <span className="text-red-400">*</span>
              </label>
              <Input
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com"
                required
                className="bg-[#1a1d24] border-gray-700/50 rounded-xl placeholder:text-gray-500 focus:border-arcane/50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <FileText className="w-4 h-4 text-arcane" />
              </label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description (optional)"
                className="bg-[#1a1d24] border-gray-700/50 rounded-xl placeholder:text-gray-500 focus:border-arcane/50"
              />
            </div>

            {/* Icon Picker */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Palette className="w-4 h-4 text-arcane" />
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/\[0.05\] border border-gray-700/50 text-gray-300 hover:border-arcane/20 hover:text-white transition-all"
                >
                  <SelectedIcon className="w-5 h-5" />
                  <span className="text-sm">{formData.icon || "Select Icon"}</span>
                </button>
                {formData.icon && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, icon: "" }))}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Icon Grid */}
              <AnimatePresence>
                {showIconPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-3 rounded-xl bg-white/\[0.03\] border border-gray-700/30">
                      <Input
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                        placeholder="Search icons..."
                        className="mb-3 bg-[#1a1d24] border-gray-700/50 rounded-xl text-sm placeholder:text-gray-500"
                      />
                      <div className="grid grid-cols-6 gap-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {filteredIcons.map((iconName) => {
                          const Icon = getIconComponent(iconName);
                          const isSelected = formData.icon === iconName;
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, icon: iconName }));
                                setShowIconPicker(false);
                              }}
                              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                                isSelected
                                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                                  : "hover:bg-gray-700/50 text-gray-400 hover:text-white border border-transparent"
                              }`}
                              title={iconName}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-[9px] truncate w-full text-center">{iconName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Background Color / Gradient */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Palette className="w-4 h-4 text-emerald-400" />
                Background Style
              </label>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {/* No background option */}
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, backgroundColor: "" }))}
                  className={`relative h-10 rounded-xl border-2 transition-all flex items-center justify-center ${
                    !formData.backgroundColor
                      ? "border-emerald-400 border border-arcane/30"
                      : "border-gray-700/50 hover:border-gray-600"
                  } bg-[#0f1015]`}
                >
                  <span className="text-[10px] text-gray-400">None</span>
                  {!formData.backgroundColor && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full" />
                  )}
                </button>

                {gradientPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        backgroundColor: preset.value,
                      }))
                    }
                    className={`relative h-10 rounded-xl border-2 transition-all ${
                      formData.backgroundColor === preset.value
                        ? "border-emerald-400 border border-arcane/30 scale-105"
                        : "border-transparent hover:border-gray-600"
                    }`}
                    style={{
                      background: `linear-gradient(to right, ${preset.from}, ${preset.to})`,
                    }}
                    title={preset.label}
                  >
                    {formData.backgroundColor === preset.value && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Order & Active row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Hash className="w-4 h-4 text-emerald-400" />
                  Order
                </label>
                <Input
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  className="bg-[#1a1d24] border-gray-700/50 rounded-xl focus:border-arcane/50"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  {formData.isActive ? (
                    <Eye className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                  Status
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
                  }
                  className={`w-full h-10 rounded-lg border text-sm font-medium transition-all ${
                    formData.isActive
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-white/\[0.05\] border-gray-700/50 text-gray-400"
                  }`}
                >
                  {formData.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            </div>

            {/* Preview */}
            {formData.title && (
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Preview</label>
                <div
                  className={`rounded-2xl px-5 py-4 flex items-center gap-4 ${
                    formData.backgroundColor
                      ? `bg-gradient-to-r ${formData.backgroundColor} text-white`
                      : "bg-[#0f1015] border border-white/[0.06] text-white"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      formData.backgroundColor
                        ? "bg-white/20"
                        : "bg-purple-500/10 border border-purple-500/20"
                    }`}
                  >
                    <SelectedIcon
                      className={`w-5 h-5 ${
                        formData.backgroundColor ? "text-white" : "text-purple-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[15px] truncate">{formData.title}</h3>
                    {formData.description && (
                      <p
                        className={`text-xs truncate mt-0.5 ${
                          formData.backgroundColor ? "text-white/70" : "text-gray-500"
                        }`}
                      >
                        {formData.description}
                      </p>
                    )}
                  </div>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      formData.backgroundColor ? "bg-white/10" : "bg-white/[0.03]"
                    }`}
                  >
                    <ExternalLink className="w-4 h-4 text-white/60" />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 text-gray-400 hover:text-white hover:bg-white/\[0.07\]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r bg-arcane hover:bg-arcane-glow text-white border-0"
              >
                {link ? "Update Link" : "Create Link"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LinktreeModal;






