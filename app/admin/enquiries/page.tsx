"use client";

import { supabase, type Enquiry } from "@/lib/supabase";
import { Check, Clock, MapPin, Phone, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EnquiriesPage() {
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
  }, []);

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

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Enquiries
          </h1>
          <p className="text-gray-600">
            Manage and track all customer enquiries
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Total Enquiries</div>
            <div className="text-2xl font-bold text-gray-900">
              {enquiries.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-2xl font-bold text-orange-600">
              {enquiries.filter(e => !e.attended).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Attended</div>
            <div className="text-2xl font-bold text-green-600">
              {enquiries.filter(e => e.attended).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Expired (2+ days)</div>
            <div className="text-2xl font-bold text-red-600">
              {enquiries.filter(e => isExpired(e)).length}
            </div>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading enquiries...</p>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No enquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Requirements
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {enquiry.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {enquiry.place}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a
                            href={`tel:${enquiry.phone}`}
                            className="hover:text-primary-600"
                          >
                            {enquiry.phone}
                          </a>
                        </div>
                      </td>

                      {/* Requirements - Hidden on mobile */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {enquiry.description}
                        </div>
                      </td>

                      {/* Date - Hidden on small screens */}
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900">
                          {formatDate(enquiry.created_at)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {getDaysOld(enquiry.created_at)} day(s) ago
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {enquiry.attended ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                              Attended
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 w-fit">
                              Pending
                            </span>
                          )}
                          {isExpired(enquiry) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
                              Expired
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleAttended(enquiry)}
                            className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
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
                              <X className="w-3.5 h-3.5" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            <span className="ml-1 hidden xl:inline">
                              {enquiry.attended ? "Pending" : "Attended"}
                            </span>
                          </button>
                          <button
                            onClick={() => deleteEnquiry(enquiry.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <X className="w-3.5 h-3.5" />
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
