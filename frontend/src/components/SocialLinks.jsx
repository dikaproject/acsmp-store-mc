import { useState, useEffect } from "react";
import { 
  MessageCircle, 
  Youtube, 
  Instagram, 
  Music,
  ExternalLink 
} from "lucide-react";
import axios from "axios";

const SocialLinks = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/settings`
      );
      setSettings(response.data.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  const socialLinks = [
    { 
      key: 'discord', 
      icon: MessageCircle, 
      label: 'Discord',
      color: 'hover:text-indigo-400'
    },
    { 
      key: 'youtube', 
      icon: Youtube, 
      label: 'YouTube',
      color: 'hover:text-red-400'
    },
    { 
      key: 'instagram', 
      icon: Instagram, 
      label: 'Instagram',
      color: 'hover:text-pink-400'
    },
    { 
      key: 'tiktok', 
      icon: Music, 
      label: 'TikTok',
      color: 'hover:text-gray-400'
    },
  ];

  return (
    <div className="flex items-center gap-4">
      {socialLinks.map(({ key, icon: Icon, label, color }) => {
        if (!settings[key]) return null;
        
        return (
          <a
            key={key}
            href={settings[key]}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-gray-400 ${color} transition-colors`}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;