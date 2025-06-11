import React, { useState, useEffect, useMemo } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaFilter, FaSort, FaSortUp, FaSortDown, FaChartBar, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function MonthlyForecastsTable({ 
  forecasts, 
  userLabels, 
  loading, 
  onEdit, 
  onDelete, 
  onSuccess 
}) {
  const [summaryData, setSummaryData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'desc' });
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get("/api/monthly-forecasts-summary");
        setSummaryData(data);
      } catch (error) {
        console.error("Error fetching forecast summary", error);
      }
    };
    fetchSummary();
  }, [forecasts]);

  const enrichedData = useMemo(() => {
    return forecasts.map(forecast => {
      const summaryItem = summaryData.find(item => 
        item.label_id === forecast.label_id &&
        item.year === forecast.year &&
        item.month === forecast.month
      );
      
      const labelName = userLabels.find(label => label.id === forecast.label_id)?.name || 'Unknown';
      
      return {
        ...forecast,
        label_name: labelName,
        executed_amount: summaryItem?.executed_amount || 0,
        completion: summaryItem?.completion || 0,
      };
    });
  }, [forecasts, summaryData, userLabels]);

  const filteredData = useMemo(() => {
    let filtered = enrichedData;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.label_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.comment && item.comment.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterYear) {
      filtered = filtered.filter(item => item.year.toString() === filterYear);
    }

    if (filterMonth !== "") {
      filtered = filtered.filter(item => item.month.toString() === filterMonth);
    }

    return filtered;
  }, [enrichedData, searchTerm, filterYear, filterMonth]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'label_name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterYear, filterMonth]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field) => {
    if (sortConfig.key !== field) return <FaSort className="text-[var(--color-neutral-bright)]/30" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="text-[var(--color-primary)]" />
      : <FaSortDown className="text-[var(--color-primary)]" />;
  };

  const handleEditStart = (forecast) => {
    setEditingId(forecast.id);
    setEditFormData({
      label_id: forecast.label_id,
      year: forecast.year,
      month: forecast.month,
      amount: forecast.amount,
      comment: forecast.comment || "",
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleEditConfirm = async () => {
    try {
      await axios.put(`/api/monthly-forecasts/${editingId}`, editFormData);
      setEditingId(null);
      setEditFormData({});
      onSuccess?.();
    } catch (error) {
      console.error("Error updating forecast", error);
    }
  };

  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: field === 'label_id' || field === 'year' || field === 'month' 
        ? parseInt(value) || ""
        : value
    }));
  };

  const getCompletionColor = (completion) => {
    if (completion >= 90) return "text-[var(--color-success)]";
    if (completion >= 60) return "text-[var(--color-warning)]";
    return "text-[var(--color-error)]";
  };

  const getCompletionBgColor = (completion) => {
    if (completion >= 90) return "bg-[var(--color-success)]/20";
    if (completion >= 60) return "bg-[var(--color-warning)]/20";
    return "bg-[var(--color-error)]/20";
  };

  const availableYears = useMemo(() => {
    const years = [...new Set(enrichedData.map(item => item.year))].sort((a, b) => b - a);
    return years;
  }, [enrichedData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-[var(--color-neutral-dark)] rounded-lg">
        <div className="flex items-center gap-3 text-[var(--color-neutral-bright)]">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-primary)]"></div>
          Loading forecasts...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-neutral-dark)] rounded-lg overflow-hidden">
      
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-[var(--color-neutral-dark-3)] space-y-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60" />
          <input
            type="text"
            placeholder="Search by category or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
              <FaCalendarAlt className="text-[var(--color-primary)]" />
              Filter by Year
            </label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="cursor-pointer w-full p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
              <FaFilter className="text-[var(--color-secondary)]" />
              Filter by Month
            </label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="cursor-pointer w-full p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">All Months</option>
              {MONTHS.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-[var(--color-neutral-dark-2)]">
            <tr>
              <th 
                className="cursor-pointer px-3 py-3 text-left text-[var(--color-neutral-bright)] text-sm font-semibold hover:bg-[var(--color-neutral-dark-3)] transition-colors"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-2">
                  ID
                  {getSortIcon('id')}
                </div>
              </th>
              <th 
                className="cursor-pointer px-3 py-3 text-left text-[var(--color-neutral-bright)] text-sm font-semibold hover:bg-[var(--color-neutral-dark-3)] transition-colors"
                onClick={() => handleSort('label_name')}
              >
                <div className="flex items-center gap-2">
                  Category
                  {getSortIcon('label_name')}
                </div>
              </th>
              <th 
                className="cursor-pointer px-3 py-3 text-center text-[var(--color-neutral-bright)] text-sm font-semibold hover:bg-[var(--color-neutral-dark-3)] transition-colors"
                onClick={() => handleSort('year')}
              >
                <div className="flex items-center justify-center gap-2">
                  Year
                  {getSortIcon('year')}
                </div>
              </th>
              <th 
                className="cursor-pointer px-3 py-3 text-center text-[var(--color-neutral-bright)] text-sm font-semibold hover:bg-[var(--color-neutral-dark-3)] transition-colors"
                onClick={() => handleSort('month')}
              >
                <div className="flex items-center justify-center gap-2">
                  Month
                  {getSortIcon('month')}
                </div>
              </th>
              <th 
                className="cursor-pointer px-3 py-3 text-right text-[var(--color-neutral-bright)] text-sm font-semibold hover:bg-[var(--color-neutral-dark-3)] transition-colors"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end gap-2">
                  Forecasted
                  {getSortIcon('amount')}
                </div>
              </th>
              <th 
                className="cursor-pointer px-3 py-3 text-right text-[var(--color-neutral-bright)] text-sm font-semibold hover:bg-[var(--color-neutral-dark-3)] transition-colors"
                onClick={() => handleSort('executed_amount')}
              >
                <div className="flex items-center justify-end gap-2">
                  Executed
                  {getSortIcon('executed_amount')}
                </div>
              </th>
              <th 
                className="cursor-pointer px-3 py-3 text-center text-[var(--color-neutral-bright)] text-sm font-semibold hover:bg-[var(--color-neutral-dark-3)] transition-colors"
                onClick={() => handleSort('completion')}
              >
                <div className="flex items-center justify-center gap-2">
                  <FaChartBar className="text-[var(--color-primary)]" />
                  Progress
                  {getSortIcon('completion')}
                </div>
              </th>
              <th className="hidden lg:table-cell px-3 py-3 text-left text-[var(--color-neutral-bright)] text-sm font-semibold">
                Notes
              </th>
              <th className="px-3 py-3 text-center text-[var(--color-neutral-bright)] text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((forecast) => (
              <tr 
                key={forecast.id}
                className="border-b border-[var(--color-neutral-dark-3)] hover:bg-[var(--color-neutral-dark-3)] transition-colors duration-200"
              >
                <td className="px-3 py-3 text-[var(--color-neutral-bright)] text-sm">
                  <span className="bg-[var(--color-neutral-dark-3)] px-2 py-1 rounded text-xs">
                    {forecast.id}
                  </span>
                </td>
                <td className="px-3 py-3">
                  {editingId === forecast.id ? (
                    <select
                      value={editFormData.label_id}
                      onChange={(e) => handleEditChange('label_id', e.target.value)}
                      className="cursor-pointer w-full p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm"
                    >
                      {userLabels.map((label) => (
                        <option key={label.id} value={label.id}>
                          {label.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-[var(--color-neutral-bright)] text-sm font-medium">
                      {forecast.label_name}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  {editingId === forecast.id ? (
                    <input
                      type="number"
                      min="2020"
                      max="2030"
                      value={editFormData.year}
                      onChange={(e) => handleEditChange('year', e.target.value)}
                      className="w-full p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm text-center"
                    />
                  ) : (
                    <span className="text-[var(--color-neutral-bright)] text-sm">
                      {forecast.year}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  {editingId === forecast.id ? (
                    <select
                      value={editFormData.month}
                      onChange={(e) => handleEditChange('month', e.target.value)}
                      className="cursor-pointer w-full p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm"
                    >
                      {MONTHS.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-[var(--color-neutral-bright)] text-sm">
                      {MONTHS[forecast.month]}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-right">
                  {editingId === forecast.id ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editFormData.amount}
                      onChange={(e) => handleEditChange('amount', e.target.value)}
                      className="w-full p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm text-right"
                    />
                  ) : (
                    <span className="text-[var(--color-neutral-bright)] text-sm font-medium">
                      €{parseFloat(forecast.amount).toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="text-[var(--color-success)] text-sm font-medium">
                    €{forecast.executed_amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getCompletionBgColor(forecast.completion)} ${getCompletionColor(forecast.completion)}`}>
                    {forecast.completion.toFixed(1)}%
                  </div>
                </td>
                <td className="hidden lg:table-cell px-3 py-3">
                  {editingId === forecast.id ? (
                    <input
                      type="text"
                      value={editFormData.comment}
                      onChange={(e) => handleEditChange('comment', e.target.value)}
                      className="w-full p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm"
                      placeholder="Notes..."
                    />
                  ) : (
                    <span className="text-[var(--color-neutral-bright)]/80 text-sm">
                      {forecast.comment || '-'}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-center gap-2">
                    {editingId === forecast.id ? (
                      <>
                        <button
                          onClick={handleEditConfirm}
                          className="cursor-pointer text-[var(--color-success)] hover:text-[var(--color-success)]/80 p-2 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
                          title="Confirm"
                        >
                          <FaCheck size={14} />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="cursor-pointer text-[var(--color-error)] hover:text-[var(--color-error)]/80 p-2 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
                          title="Cancel"
                        >
                          <FaTimes size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(forecast)}
                          className="cursor-pointer text-[var(--color-primary)] hover:text-[var(--color-secondary)] p-2 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(forecast)}
                          className="cursor-pointer text-[var(--color-error)] hover:text-[var(--color-error)]/80 p-2 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[var(--color-neutral-dark-3)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-[var(--color-neutral-bright)]/70">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} forecasts
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="cursor-pointer px-3 py-1 text-sm bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
              >
                First
              </button>
              
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="cursor-pointer px-3 py-1 text-sm bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
             >
               Prev
             </button>

             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
               let pageNumber;
               if (totalPages <= 5) {
                 pageNumber = i + 1;
               } else if (currentPage <= 3) {
                 pageNumber = i + 1;
               } else if (currentPage >= totalPages - 2) {
                 pageNumber = totalPages - 4 + i;
               } else {
                 pageNumber = currentPage - 2 + i;
               }

               return (
                 <button
                   key={pageNumber}
                   onClick={() => setCurrentPage(pageNumber)}
                   className={`cursor-pointer px-3 py-1 text-sm rounded transition-colors duration-200 ${
                     pageNumber === currentPage
                       ? 'bg-[var(--color-primary)] text-[var(--color-neutral-bright)]'
                       : 'bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] hover:bg-[var(--color-neutral-dark-2)]'
                   }`}
                 >
                   {pageNumber}
                 </button>
               );
             })}

             <button
               onClick={() => setCurrentPage(currentPage + 1)}
               disabled={currentPage === totalPages}
               className="cursor-pointer px-3 py-1 text-sm bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
             >
               Next
             </button>
             
             <button
               onClick={() => setCurrentPage(totalPages)}
               disabled={currentPage === totalPages}
               className="cursor-pointer px-3 py-1 text-sm bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
             >
               Last
             </button>
           </div>
         </div>
       </div>
     )}

     {/* Empty State */}
     {sortedData.length === 0 && (
       <div className="p-8 text-center text-[var(--color-neutral-bright)]/70">
         {searchTerm || filterYear || filterMonth !== "" 
           ? "No forecasts found matching the current filters" 
           : "No forecasts found"}
       </div>
     )}
   </div>
 );
}