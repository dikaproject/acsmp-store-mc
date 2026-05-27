import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Shield,
  Loader2
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useAuthStore } from "../../store/useAuthStore";
import { authAPI } from "../../lib/api";
import toast from "react-hot-toast";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Email dan password harus diisi");
      return;
    }

    setLoading(true);

    try {
      // ✅ Send with 'email' field
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        
        if (user.role !== 'ADMIN') {
          toast.error("Akses ditolak. Admin only.");
          setLoading(false);
          return;
        }

        // Call login from store
        login(user, token);
        
        toast.success("Login berhasil!");
        
        // Navigate after a small delay to ensure state is updated
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 100);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // ✅ Better error handling
      if (error.response?.data?.errors) {
        // Validation errors
        const validationErrors = error.response.data.errors
          .map(err => err.msg)
          .join(', ');
        toast.error(validationErrors);
      } else {
        toast.error(error.response?.data?.message || "Login gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0b0f]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(116,80,163,0.08),transparent_60%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-arcane/15 border border-arcane/30 flex items-center justify-center">
              <Shield className="w-7 h-7 text-arcane" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm">
              Masuk untuk mengelola server
            </p>
          </div>

          {/* Login Card */}
          <Card className="border-border/50 shadow-2xl">
            <CardHeader>
              <Badge className="w-fit mb-2 bg-arcane/10 text-arcane border-arcane/20">
                <Lock className="w-3 h-3 mr-1" />
                Admin Access
              </Badge>
              <CardTitle>Login Admin</CardTitle>
              <CardDescription>
                Gunakan kredensial admin untuk masuk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      name="email"
                      placeholder="admin@minecraft.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-arcane hover:bg-arcane-glow text-bone transition-colors"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Masuk
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground hover:text-arcane transition-colors"
            >
              ← Kembali ke Homepage
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;





