"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Filter, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Sale {
  id: string;
  date: string;
  customer_name: string;
  customer_place: string;
  customer_phone: string;
  total_amount: number;
  amount_paid: number;
  balance: number;
  material_types: string[];
  notes: string;
}

interface Payment {
  id: string;
  sale_id: string;
  amount: number;
  payment_date: string;
  comments: string;
}

export default function PendingSalesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [pendingSales, setPendingSales] = useState<Sale[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [filterText, setFilterText] = useState("");
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    payment_date: new Date().toISOString().split("T")[0],
    comments: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    fetchPendingSales();
  }, [isAuthenticated, router]);

  const fetchPendingSales = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .gt("balance", 0)
        .order("date", { ascending: false });

      if (error) throw error;
      setPendingSales(data || []);
    } catch (error) {
      console.error("Error fetching pending sales:", error);
      toast.error("Failed to fetch pending sales");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayments = async (saleId: string) => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("sale_id", saleId)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payment history");
    }
  };

  const handleAddPayment = (sale: Sale) => {
    setSelectedSale(sale);
    setPaymentData({
      amount: 0,
      payment_date: new Date().toISOString().split("T")[0],
      comments: "",
    });
    fetchPayments(sale.id);
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSale) return;

    if (paymentData.amount <= 0) {
      toast.error("Payment amount must be greater than 0");
      return;
    }

    if (paymentData.amount > selectedSale.balance) {
      toast.error("Payment amount cannot exceed balance");
      return;
    }

    try {
      const { error } = await supabase.from("payments").insert([
        {
          sale_id: selectedSale.id,
          amount: paymentData.amount,
          payment_date: paymentData.payment_date,
          comments: paymentData.comments,
        },
      ]);

      if (error) throw error;

      toast.success("Payment recorded successfully!");
      setShowPaymentModal(false);
      fetchPendingSales();
    } catch (error: any) {
      console.error("Error adding payment:", error);
      toast.error(error.message || "Failed to record payment");
    }
  };

  const filteredSales = pendingSales.filter(
    sale =>
      sale.customer_name.toLowerCase().includes(filterText.toLowerCase()) ||
      sale.customer_place?.toLowerCase().includes(filterText.toLowerCase()) ||
      sale.customer_phone?.includes(filterText)
  );

  const totalOutstanding = filteredSales.reduce(
    (sum, sale) => sum + sale.balance,
    0
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Pending Sales
            </h1>
            <p className="text-gray-600 mt-1">
              Sales with outstanding payments
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Outstanding</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">
              ₹{totalOutstanding.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, place, or phone..."
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Pending Sales Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Materials
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-gray-500 text-sm"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredSales.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-gray-500 text-sm"
                    >
                      No pending sales found! All payments are up to date. 🎉
                    </td>
                  </tr>
                ) : (
                  filteredSales.map(sale => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-xs text-gray-900">
                          {new Date(sale.date).toLocaleDateString("en-IN")}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm font-medium text-gray-900">
                          {sale.customer_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {sale.customer_place} • {sale.customer_phone}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-1">
                          {sale.material_types?.slice(0, 2).map((mat, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full whitespace-nowrap"
                            >
                              {mat}
                            </span>
                          ))}
                          {sale.material_types?.length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
                              +{sale.material_types.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{sale.total_amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-sm text-green-600">
                          ₹{sale.amount_paid.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {(
                            (sale.amount_paid / sale.total_amount) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-sm font-bold text-red-600">
                          ₹{sale.balance.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleAddPayment(sale)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Payment</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Fixed Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900">Add Payment</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {selectedSale.customer_name}
              </p>

              {/* Sale Summary - Compact */}
              <div className="grid grid-cols-3 gap-3 mt-3 bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="text-xs text-gray-600">Total Amount</p>
                  <p className="text-base font-semibold text-gray-900">
                    ₹{selectedSale.total_amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Already Paid</p>
                  <p className="text-base font-semibold text-green-600">
                    ₹{selectedSale.amount_paid.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Pending Balance</p>
                  <p className="text-base font-semibold text-red-600">
                    ₹{selectedSale.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-4 space-y-3">
              {/* Payment History */}
              {payments.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Payment History
                  </h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {payments.map(payment => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            ₹{payment.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            {payment.comments}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(payment.payment_date).toLocaleDateString(
                            "en-IN"
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Form */}
              <form
                id="paymentForm"
                onSubmit={handleSubmitPayment}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Amount *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedSale.balance}
                      step="0.01"
                      value={paymentData.amount}
                      onChange={e =>
                        setPaymentData({
                          ...paymentData,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max: ₹{selectedSale.balance.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Date *
                    </label>
                    <input
                      type="date"
                      value={paymentData.payment_date}
                      onChange={e =>
                        setPaymentData({
                          ...paymentData,
                          payment_date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comments
                  </label>
                  <textarea
                    value={paymentData.comments}
                    onChange={e =>
                      setPaymentData({
                        ...paymentData,
                        comments: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={2}
                    placeholder="Payment method, reference number, etc."
                  />
                </div>
              </form>
            </div>

            {/* Fixed Footer */}
            <div className="flex space-x-3 p-4 border-t border-gray-200 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="paymentForm"
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                <span>Record Payment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
