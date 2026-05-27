import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  Loader2,
  Plus,
  Trash2,
  Globe,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Youtube,
  Instagram,
  Music,
  Link as LinkIcon,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import toast from "react-hot-toast";
import axios from "axios";

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    discord: '',
    location: '',
    whatsapp: '',
    youtube: '',
    instagram: '',
    email: '',
    tiktok: '',
    voteLinks: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/settings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const data = response.data.data;
      
      setSettings({
        discord: data.discord || '',
        location: data.location || '',
        whatsapp: data.whatsapp || '',
        youtube: data.youtube || '',
        instagram: data.instagram || '',
        email: data.email || '',
        tiktok: data.tiktok || '',
        voteLinks: data.voteLinks ? JSON.parse(data.voteLinks) : []
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Gagal memuat settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      const settingsData = {
        settings: {
          discord: settings.discord,
          location: settings.location,
          whatsapp: settings.whatsapp,
          youtube: settings.youtube,
          instagram: settings.instagram,
          email: settings.email,
          tiktok: settings.tiktok,
          voteLinks: JSON.stringify(settings.voteLinks)
        }
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/settings/bulk`,
        settingsData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Settings berhasil disimpan");
      fetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan settings");
    } finally {
      setSaving(false);
    }
  };

  const addVoteLink = () => {
    setSettings({
      ...settings,
      voteLinks: [...settings.voteLinks, { name: '', url: '' }]
    });
  };

  const updateVoteLink = (index, field, value) => {
    const newVoteLinks = [...settings.voteLinks];
    newVoteLinks[index][field] = value;
    setSettings({ ...settings, voteLinks: newVoteLinks });
  };

  const removeVoteLink = (index) => {
    const newVoteLinks = settings.voteLinks.filter((_, i) => i !== index);
    setSettings({ ...settings, voteLinks: newVoteLinks });
  };

  const isValidUrl = (url) => {
    if (!url) return true; // Empty is valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getFieldIcon = (field) => {
    const icons = {
      discord: MessageCircle,
      location: MapPin,
      whatsapp: Phone,
      youtube: Youtube,
      instagram: Instagram,
      email: Mail,
      tiktok: Music,
    };
    return icons[field] || Globe;
  };

  const getFieldColor = (field) => {
    const colors = {
      discord: 'from-indigo-400 to-blue-400',
      location: 'from-red-400 to-pink-400',
      whatsapp: 'from-green-400 to-emerald-400',
      youtube: 'from-red-500 to-red-600',
      instagram: 'from-purple-400 to-pink-400',
      email: 'from-blue-400 to-cyan-400',
      tiktok: 'from-gray-800 to-gray-900',
    };
    return colors[field] || 'from-gray-400 to-gray-600';
  };

  const socialFields = [
    { key: 'discord', label: 'Discord Server', placeholder: 'https://discord.gg/yourserver', type: 'url' },
    { key: 'location', label: 'Server Location', placeholder: 'e.g., Singapore, Jakarta', type: 'text' },
    { key: 'whatsapp', label: 'WhatsApp Number', placeholder: '+6281234567890', type: 'tel' },
    { key: 'youtube', label: 'YouTube Channel', placeholder: 'https://youtube.com/@yourchannel', type: 'url' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/youraccount', type: 'url' },
    { key: 'email', label: 'Contact Email', placeholder: 'contact@yourserver.com', type: 'email' },
    { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@youraccount', type: 'url' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-400">Memuat settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-gray-400 ml-13">
            Manage server information and social media links
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Info Banner */}
      <Card className="border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">
                Global Settings
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Settings ini akan ditampilkan di website public. Pastikan semua link valid dan aktif. Perubahan akan langsung terlihat setelah disimpan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Social Media & Contact */}
        <div className="space-y-6">
          <Card className="border-white/\[0.06\] bg-[#111318]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Social Media & Contact</h2>
                  <p className="text-xs text-gray-400">Links to your social media accounts</p>
                </div>
              </div>

              <div className="space-y-4">
                {socialFields.map((field, index) => {
                  const Icon = getFieldIcon(field.key);
                  const isUrl = field.type === 'url';
                  const value = settings[field.key];
                  const isValid = !isUrl || isValidUrl(value);

                  return (
                    <motion.div
                      key={field.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${getFieldColor(field.key)} flex items-center justify-center`}>
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                        {field.label}
                      </label>
                      <div className="relative">
                        <Input
                          type={field.type}
                          value={value}
                          onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className={`bg-[#1a1d24] border-gray-700 rounded-xl focus:border-blue-500 ${
                            value && !isValid ? 'border-red-500/50' : ''
                          }`}
                        />
                        {value && isUrl && isValid && (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {value && !isValid && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      {value && !isValid && (
                        <p className="text-xs text-red-400 mt-1">Invalid URL format</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vote Links */}
        <div className="space-y-6">
          <Card className="border-white/\[0.06\] bg-[#111318]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <LinkIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Vote Links</h2>
                    <p className="text-xs text-gray-400">Server voting websites</p>
                  </div>
                </div>
                <Button
                  onClick={addVoteLink}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-3">
                {settings.voteLinks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                      <LinkIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-400 mb-4">Belum ada vote links</p>
                    <Button
                      onClick={addVoteLink}
                      size="sm"
                      variant="outline"
                      className="border-gray-700 hover:bg-white/\[0.07\]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Vote Link
                    </Button>
                  </div>
                ) : (
                  settings.voteLinks.map((link, index) => {
                    const isValidLink = isValidUrl(link.url);
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 bg-white/\[0.03\] rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 space-y-3">
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">
                                Site Name
                              </label>
                              <Input
                                type="text"
                                value={link.name}
                                onChange={(e) => updateVoteLink(index, 'name', e.target.value)}
                                placeholder="e.g., Minecraft-Server-List"
                                className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-purple-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">
                                Vote URL
                              </label>
                              <div className="relative">
                                <Input
                                  type="url"
                                  value={link.url}
                                  onChange={(e) => updateVoteLink(index, 'url', e.target.value)}
                                  placeholder="https://vote-site.com/yourserver"
                                  className={`bg-[#1a1d24] border-gray-700 rounded-xl focus:border-purple-500 text-sm ${
                                    link.url && !isValidLink ? 'border-red-500/50' : ''
                                  }`}
                                />
                                {link.url && isValidLink && (
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                              {link.url && !isValidLink && (
                                <p className="text-xs text-red-400 mt-1">Invalid URL format</p>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => removeVoteLink(index)}
                            size="sm"
                            variant="outline"
                            className="border-gray-700 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 mt-6"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {settings.voteLinks.length > 0 && (
                <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400">
                      Vote links akan ditampilkan di homepage untuk mendorong players vote server Anda
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-white/\[0.06\] bg-[#111318]">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Configuration Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/\[0.03\] rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <p className="text-xs text-gray-400">Social Links</p>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {socialFields.filter(f => settings[f.key]).length}/{socialFields.length}
                  </p>
                </div>
                <div className="p-3 bg-white/\[0.03\] rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <LinkIcon className="w-4 h-4 text-purple-400" />
                    <p className="text-xs text-gray-400">Vote Sites</p>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {settings.voteLinks.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button Bottom */}
      <Card className="border-white/\[0.06\] bg-[#111318]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Ready to save changes?</p>
                <p className="text-xs text-gray-400">All changes will be applied immediately</p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save All Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;





