import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Package,
  Activity,
  ArrowUp,
  ArrowDown,
  Sparkles,
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/Chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../../lib/utils";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/Button";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/stats?period=${period}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to test RCON connection
  const testRconConnection = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/test-rcon`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(
          <div>
            <p className="font-semibold">RCON Connected!</p>
            <p className="text-xs text-gray-400 mt-1">{response.data.data.output}</p>
          </div>
        );
      } else {
        toast.error(`RCON Failed: ${response.data.data.error}`);
      }
    } catch (error) {
      toast.error('Failed to test RCON connection');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-400">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.overview.totalRevenue || 0),
      icon: DollarSign,
      gradient: "from-emerald-400 to-teal-400",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      shadowColor: "shadow-emerald-500/20",
      trend: "+12.5%",
      trendUp: true
    },
    {
      title: "Total Orders",
      value: stats?.overview.totalOrders || 0,
      icon: ShoppingCart,
      gradient: "from-blue-400 to-cyan-400",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      shadowColor: "shadow-blue-500/20",
      trend: "+8.2%",
      trendUp: true
    },
    {
      title: "Recent Orders",
      value: stats?.overview.recentOrders || 0,
      icon: Package,
      gradient: "from-purple-400 to-pink-400",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      shadowColor: "shadow-purple-500/20",
      trend: `Last ${period} days`,
      trendUp: null
    },
    {
      title: "Pending Orders",
      value: stats?.overview.ordersByStatus?.PENDING || 0,
      icon: Activity,
      gradient: "from-amber-400 to-orange-400",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      shadowColor: "shadow-amber-500/20",
      trend: "Needs attention",
      trendUp: false
    }
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#10b981",
    },
    orders: {
      label: "Orders",
      color: "#3b82f6",
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          </div>
          <p className="text-gray-400 ml-13">
            Welcome back! Here's what's happening with your server.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2"
        >
          {['7', '30', '90'].map((days) => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                period === days
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-800 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              {days} Days
            </button>
          ))}
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-gray-700 transition-all group">
              {/* Gradient Background Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {stat.trendUp !== null && (
                    <Badge 
                      variant="outline" 
                      className={`${
                        stat.trendUp 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                          : "bg-red-500/10 text-red-400 border-red-500/30"
                      } font-medium`}
                    >
                      {stat.trendUp ? (
                        <ArrowUp className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 mr-1" />
                      )}
                      {stat.trend}
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-sm text-gray-400 mb-2">{stat.title}</h3>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                
                {stat.trendUp === null && (
                  <p className="text-xs text-gray-500 mt-2">{stat.trend}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] overflow-hidden">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Revenue & Orders Trend
                </CardTitle>
                <CardDescription className="text-gray-400 mt-1">
                  Showing revenue and order trends for the last {period} days
                </CardDescription>
              </div>
              <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30 w-fit">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending up by 12.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {/* Fix: Remove aspect-video class and set explicit height */}
            <div className="w-full h-[400px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <AreaChart
                  data={stats?.revenueTrend || []}
                  margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                >
                  <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    stroke="#6b7280"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    stroke="#6b7280"
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <ChartTooltip
                    cursor={{ stroke: '#374151', strokeWidth: 2, strokeDasharray: '5 5' }}
                    content={
                      <ChartTooltipContent
                        className="bg-[#13151a] border-gray-800"
                        indicator="dot"
                        formatter={(value, name) => (
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">
                              {name === "revenue" ? formatCurrency(value) : value}
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Area
                    dataKey="revenue"
                    type="monotone"
                    fill="url(#fillRevenue)"
                    fillOpacity={1}
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Area
                    dataKey="orders"
                    type="monotone"
                    fill="url(#fillOrders)"
                    fillOpacity={1}
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                Top Products
              </CardTitle>
              <CardDescription className="text-gray-400">
                Best selling products this period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.topProducts?.slice(0, 5).map((product, index) => (
                  <div 
                    key={product.id} 
                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      #{index + 1}
                    </div>
                    {product.imageUrl && (
                      <img
                        src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.imageUrl}`}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover ring-2 ring-gray-700 group-hover:ring-emerald-500/50 transition-all"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{product.name}</p>
                      <p className="text-sm text-gray-400">
                        {product.serverType?.name} • {product.totalSold} sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">{formatCurrency(product.totalRevenue)}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Server Type Sales */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Server Type Performance
              </CardTitle>
              <CardDescription className="text-gray-400">
                Revenue breakdown by server type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.serverTypeSales?.map((server, index) => {
                  const total = stats.serverTypeSales.reduce((sum, s) => sum + s.revenue, 0);
                  const percentage = ((server.revenue / total) * 100).toFixed(1);
                  
                  const gradients = [
                    'from-emerald-400 to-teal-400',
                    'from-blue-400 to-cyan-400',
                    'from-purple-400 to-pink-400',
                  ];
                  
                  return (
                    <div key={index} className="space-y-3 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradients[index % gradients.length]} shadow-lg`} />
                          <span className="font-medium text-white">{server.name}</span>
                        </div>
                        <span className="text-sm font-medium text-emerald-400">{percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-emerald-400 font-medium">{formatCurrency(server.revenue)}</span>
                        <span className="text-gray-400">{server.orders} orders</span>
                      </div>
                      <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.7 + (index * 0.1) }}
                          className={`h-full bg-gradient-to-r ${gradients[index % gradients.length]} rounded-full shadow-lg`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Test RCON Connection Button */}
      <div className="mt-8">
        <Button onClick={testRconConnection}>
          Test RCON Connection
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;