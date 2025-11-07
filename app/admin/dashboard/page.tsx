"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  const { isAuthenticated, username } = useAuth();
  const router = useRouter();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    pendingAmount: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    // Fetch sales data (mock data for now - will connect to Supabase)
    fetchDashboardData();
  }, [isAuthenticated, router]);

  const fetchDashboardData = async () => {
    // Mock data - Replace with actual Supabase queries
    const mockSalesData = [
      { month: "Jan", sales: 45000 },
      { month: "Feb", sales: 52000 },
      { month: "Mar", sales: 48000 },
      { month: "Apr", sales: 61000 },
      { month: "May", sales: 55000 },
      { month: "Jun", sales: 67000 },
      { month: "Jul", sales: 72000 },
      { month: "Aug", sales: 68000 },
      { month: "Sep", sales: 75000 },
      { month: "Oct", sales: 80000 },
      { month: "Nov", sales: 78000 },
      { month: "Dec", sales: 85000 },
    ];

    setSalesData(mockSalesData);
    setFilteredData(mockSalesData);
    setStats({
      totalSales: 156,
      totalRevenue: 786000,
      pendingAmount: 45000,
      totalCustomers: 89,
    });
  };

  useEffect(() => {
    // Filter data based on selected month or date range
    if (selectedMonth === "all") {
      setFilteredData(salesData);
    } else {
      const filtered = salesData.filter(item => item.month === selectedMonth);
      setFilteredData(filtered);
    }
  }, [selectedMonth, salesData]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back, {username}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 mb-1">Total Sales</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats.totalSales}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 mb-1">Pending Amount</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600">
                  ₹{stats.pendingAmount.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats.totalCustomers}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Monthly Sales Overview
            </h2>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Months</option>
                <option value="Jan">January</option>
                <option value="Feb">February</option>
                <option value="Mar">March</option>
                <option value="Apr">April</option>
                <option value="May">May</option>
                <option value="Jun">June</option>
                <option value="Jul">July</option>
                <option value="Aug">August</option>
                <option value="Sep">September</option>
                <option value="Oct">October</option>
                <option value="Nov">November</option>
                <option value="Dec">December</option>
              </select>
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px]">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={value => `₹${Number(value).toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#0284c7" name="Total Sales (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
