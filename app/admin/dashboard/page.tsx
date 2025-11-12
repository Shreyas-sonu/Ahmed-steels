"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
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

interface Sale {
  id: string;
  date: string;
  customer_name: string;
  total_amount: number;
  amount_paid: number;
  balance: number;
}

export default function AdminDashboard() {
  const { isAuthenticated, username } = useAuth();
  const router = useRouter();
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"month" | "year">("month");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [loading, setLoading] = useState(true);
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

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all sales from Supabase
      const { data: sales, error } = await supabase
        .from("sales")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;

      setAllSales(sales || []);

      // Calculate stats
      const totalSales = sales?.length || 0;
      const totalRevenue =
        sales?.reduce(
          (sum: number, sale: Sale) => sum + sale.total_amount,
          0
        ) || 0;
      const pendingAmount =
        sales?.reduce((sum: number, sale: Sale) => sum + sale.balance, 0) || 0;
      const uniqueCustomers = new Set(
        sales?.map((sale: Sale) => sale.customer_name)
      ).size;

      setStats({
        totalSales,
        totalRevenue,
        pendingAmount,
        totalCustomers: uniqueCustomers,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processDailyData = (sales: Sale[], month: number, year: number) => {
    // Get number of days in the selected month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Initialize all days with 0
    const dailyTotals = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      sales: 0,
      count: 0,
    }));

    // Aggregate sales by day
    sales.forEach((sale: Sale) => {
      const saleDate = new Date(sale.date);
      if (saleDate.getMonth() === month && saleDate.getFullYear() === year) {
        const dayIndex = saleDate.getDate() - 1;
        if (dayIndex >= 0 && dayIndex < daysInMonth) {
          dailyTotals[dayIndex].sales += sale.total_amount;
          dailyTotals[dayIndex].count += 1;
        }
      }
    });

    return dailyTotals;
  };

  const processMonthlyData = (sales: Sale[], year: number) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize all months with 0
    const monthlyTotals = monthNames.map((name, index) => ({
      month: name,
      monthIndex: index,
      sales: 0,
      count: 0,
    }));

    // Aggregate sales by month
    sales.forEach((sale: Sale) => {
      const saleDate = new Date(sale.date);
      if (saleDate.getFullYear() === year) {
        const monthIndex = saleDate.getMonth();
        monthlyTotals[monthIndex].sales += sale.total_amount;
        monthlyTotals[monthIndex].count += 1;
      }
    });

    return monthlyTotals;
  };

  useEffect(() => {
    if (allSales.length > 0) {
      if (viewMode === "month") {
        // Show day-wise data for selected month
        const data = processDailyData(allSales, selectedMonth, selectedYear);
        setChartData(data);
      } else {
        // Show month-wise data for selected year
        const data = processMonthlyData(allSales, selectedYear);
        setChartData(data);
      }
    }
  }, [allSales, viewMode, selectedMonth, selectedYear]);

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
                  {loading ? "..." : stats.totalSales}
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
                  {loading ? "..." : `₹${stats.totalRevenue.toLocaleString()}`}
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
                  {loading ? "..." : `₹${stats.pendingAmount.toLocaleString()}`}
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
                  {loading ? "..." : stats.totalCustomers}
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
          <div className="flex flex-col gap-4 mb-6">
            {/* Header and View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Sales Overview
              </h2>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setViewMode("month")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === "month"
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Month (Days)
                </button>
                <button
                  onClick={() => setViewMode("year")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === "year"
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Year (Months)
                </button>
              </div>
            </div>

            {/* Date Selector */}
            <div className="flex flex-wrap items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />

              {viewMode === "month" ? (
                <>
                  {/* Month Selector */}
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(Number(e.target.value))}
                    className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={0}>January</option>
                    <option value={1}>February</option>
                    <option value={2}>March</option>
                    <option value={3}>April</option>
                    <option value={4}>May</option>
                    <option value={5}>June</option>
                    <option value={6}>July</option>
                    <option value={7}>August</option>
                    <option value={8}>September</option>
                    <option value={9}>October</option>
                    <option value={10}>November</option>
                    <option value={11}>December</option>
                  </select>

                  {/* Year Selector for Month View */}
                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(Number(e.target.value))}
                    className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>

                  <span className="text-sm text-gray-600">
                    (Day-wise sales)
                  </span>
                </>
              ) : (
                <>
                  {/* Year Selector */}
                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(Number(e.target.value))}
                    className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>

                  <span className="text-sm text-gray-600">
                    (Month-wise sales)
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px]">
              {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={viewMode === "month" ? "day" : "month"}
                      label={
                        viewMode === "month"
                          ? {
                              value: "Day",
                              position: "insideBottom",
                              offset: -5,
                            }
                          : undefined
                      }
                    />
                    <YAxis />
                    <Tooltip
                      formatter={value => `₹${Number(value).toLocaleString()}`}
                      labelFormatter={label =>
                        viewMode === "month" ? `Day ${label}` : label
                      }
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="sales"
                      fill="#0284c7"
                      name="Total Sales (₹)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
