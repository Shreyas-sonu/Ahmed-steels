"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { Category, supabase } from "@/lib/supabase";
import { Edit2, Filter, Plus, Save, Trash2, X } from "lucide-react";
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
  created_at: string;
}

export default function SalesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [filterText, setFilterText] = useState("");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    customer_name: "",
    customer_place: "",
    customer_phone: "",
    total_amount: 0,
    amount_paid: 0,
    material_types: [] as string[],
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    fetchCategories();
    fetchSales();
  }, [isAuthenticated, router]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to fetch sales");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSale(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      customer_name: "",
      customer_place: "",
      customer_phone: "",
      total_amount: 0,
      amount_paid: 0,
      material_types: [],
      notes: "",
    });
    setShowModal(true);
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      date: sale.date,
      customer_name: sale.customer_name,
      customer_place: sale.customer_place || "",
      customer_phone: sale.customer_phone || "",
      total_amount: sale.total_amount,
      amount_paid: sale.amount_paid,
      material_types: sale.material_types || [],
      notes: sale.notes || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string, customerName: string) => {
    if (!confirm(`Are you sure you want to delete sale for "${customerName}"?`))
      return;

    try {
      const { error } = await supabase.from("sales").delete().eq("id", id);

      if (error) throw error;
      toast.success("Sale deleted successfully!");
      fetchSales();
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("Failed to delete sale");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.material_types.length === 0) {
      toast.error("Please select at least one material type");
      return;
    }

    try {
      if (editingSale) {
        // Update
        const { error } = await supabase
          .from("sales")
          .update(formData)
          .eq("id", editingSale.id);

        if (error) throw error;
        toast.success("Sale updated successfully!");
      } else {
        // Insert
        const { error } = await supabase.from("sales").insert([formData]);

        if (error) throw error;
        toast.success("Sale added successfully!");
      }

      setShowModal(false);
      fetchSales();
    } catch (error: any) {
      console.error("Error saving sale:", error);
      toast.error(error.message || "Failed to save sale");
    }
  };

  const toggleMaterialType = (categoryName: string) => {
    setFormData(prev => ({
      ...prev,
      material_types: prev.material_types.includes(categoryName)
        ? prev.material_types.filter(m => m !== categoryName)
        : [...prev.material_types, categoryName],
    }));
  };

  const filteredSales = sales.filter(
    sale =>
      sale.customer_name.toLowerCase().includes(filterText.toLowerCase()) ||
      sale.customer_place?.toLowerCase().includes(filterText.toLowerCase()) ||
      sale.customer_phone?.includes(filterText)
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
              All Sales
            </h1>
            <p className="text-gray-600 mt-1">
              Manage customer sales and orders
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-lg whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Add Sale</span>
          </button>
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

        {/* Sales Table */}
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
                    Total
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                      No sales found. Add your first sale!
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
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div
                          className={`text-sm font-semibold ${
                            sale.balance > 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          ₹{sale.balance.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(sale)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(sale.id, sale.customer_name)
                          }
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 inline" />
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSale ? "Edit Sale" : "Add New Sale"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="overflow-y-auto flex-1 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          customer_name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Place
                    </label>
                    <input
                      type="text"
                      value={formData.customer_place}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          customer_place: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.customer_phone}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          customer_phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Amount *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.total_amount}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          total_amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount Paid
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount_paid}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          amount_paid: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material Types * (Select multiple)
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-3 border border-gray-300 rounded-lg bg-gray-50">
                    {categories.map(category => (
                      <label
                        key={category.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-white p-1.5 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={formData.material_types.includes(
                            category.name
                          )}
                          onChange={() => toggleMaterialType(category.name)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-xs text-gray-700">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="flex space-x-3 p-4 border-t border-gray-200 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSale ? "Update" : "Add"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
