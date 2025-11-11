"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { supabase, type Enquiry } from "@/lib/supabase";
import { Check, Clock, MapPin, Phone, Search, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EnquiriesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "attended" | "pending"
  >("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    fetchEnquiries();
    autoExpireEnquiries();

    // Set up real-time subscription
    const subscription = supabase
      .channel("enquiries_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enquiries" },
        payload => {
          console.log("Change received!", payload);
          fetchEnquiries();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, router]);

  useEffect(() => {
    filterEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enquiries, searchTerm, dateFilter, statusFilter]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEnquiries(data || []);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  const autoExpireEnquiries = async () => {
    try {
      await fetch("/api/enquiries/auto-expire", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error auto-expiring enquiries:", error);
    }
  };

  const filterEnquiries = () => {
    let filtered = [...enquiries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        enquiry =>
          enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.phone.includes(searchTerm) ||
          enquiry.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(enquiry => {
        const enquiryDate = new Date(enquiry.created_at);
        const diffTime = Math.abs(now.getTime() - enquiryDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case "today":
            return diffDays <= 1;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(enquiry =>
        statusFilter === "attended" ? enquiry.attended : !enquiry.attended
      );
    }

    setFilteredEnquiries(filtered);
  };

  const toggleAttended = async (enquiry: Enquiry) => {
    try {
      const { error } = await supabase
        .from("enquiries")
        .update({ attended: !enquiry.attended })
        .eq("id", enquiry.id);

      if (error) throw error;

      toast.success(
        enquiry.attended ? "Marked as pending" : "Marked as attended"
      );
      fetchEnquiries();
    } catch (error) {
      console.error("Error updating enquiry:", error);
      toast.error("Failed to update enquiry status");
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    try {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);

      if (error) throw error;

      toast.success("Enquiry deleted successfully");
      fetchEnquiries();
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      toast.error("Failed to delete enquiry");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysOld = (dateString: string) => {
    const now = new Date();
    const enquiryDate = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - enquiryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isExpired = (enquiry: Enquiry) => {
    return !enquiry.attended && getDaysOld(enquiry.created_at) > 2;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Customer Enquiries
          </h1>
          <p className="text-gray-600 text-sm">
            Manage and track all customer enquiries
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, phone, place..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="attended">Attended</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="text-xs text-gray-600 mb-0.5">Total</div>
            <div className="text-xl font-bold text-gray-900">
              {enquiries.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="text-xs text-gray-600 mb-0.5">Pending</div>
            <div className="text-xl font-bold text-orange-600">
              {enquiries.filter(e => !e.attended).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="text-xs text-gray-600 mb-0.5">Attended</div>
            <div className="text-xl font-bold text-green-600">
              {enquiries.filter(e => e.attended).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="text-xs text-gray-600 mb-0.5">Expired</div>
            <div className="text-xl font-bold text-red-600">
              {enquiries.filter(e => isExpired(e)).length}
            </div>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <p className="mt-3 text-gray-600 text-sm">Loading enquiries...</p>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 text-sm">No enquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Requirements
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEnquiries.map(enquiry => (
                    <tr
                      key={enquiry.id}
                      className={`${
                        isExpired(enquiry) ? "bg-red-50" : ""
                      } hover:bg-gray-50 transition-colors`}
                    >
                      {/* Customer Details */}
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {enquiry.name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {enquiry.place}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-xs text-gray-900">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <a
                            href={`tel:${enquiry.phone}`}
                            className="hover:text-primary-600"
                          >
                            {enquiry.phone}
                          </a>
                        </div>
                      </td>

                      {/* Requirements - Hidden on mobile */}
                      <td className="px-4 py-2 hidden lg:table-cell">
                        <div className="text-xs text-gray-900 max-w-xs truncate">
                          {enquiry.description}
                        </div>
                      </td>

                      {/* Date - Hidden on small screens */}
                      <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">
                        <div className="text-xs text-gray-900">
                          {formatDate(enquiry.created_at)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {getDaysOld(enquiry.created_at)}d ago
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {enquiry.attended ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap w-fit">
                              Attended
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 whitespace-nowrap w-fit">
                              Pending
                            </span>
                          )}
                          {isExpired(enquiry) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 whitespace-nowrap w-fit">
                              Expired
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleAttended(enquiry)}
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors ${
                              enquiry.attended
                                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                            title={
                              enquiry.attended
                                ? "Mark as Pending"
                                : "Mark as Attended"
                            }
                          >
                            {enquiry.attended ? (
                              <X className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteEnquiry(enquiry.id)}
                            className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
