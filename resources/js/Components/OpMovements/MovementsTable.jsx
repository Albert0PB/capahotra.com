import React, { useState, useMemo, useEffect } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaFilter, FaSort, FaSortUp, FaSortDown, FaCalendarAlt, FaTags, FaEye } from "react-icons/fa";
import axios from "axios";

const MOVEMENT_TYPES = {
  1: { name: 'Income', color: 'text-[var(--color-success)]', bgColor: 'bg-[var(--color-success)]/20', badge: 'IN' },
  2: { name: 'Expense', color: 'text-[var(--color-error)]', bgColor: 'bg-[var(--color-error)]/20', badge: 'OUT' },
  3: { name: 'Correction', color: 'text-[var(--color-warning)]', bgColor: 'bg-[var(--color-warning)]/20', badge: 'COR' },
};

export default function MovementsTable({ 
  movements = [], 
  userLabels = [], 
  banks = [],
  loading = false, 
  onEdit, 
  onDelete, 
  onSuccess 
}) {
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterLabel, setFilterLabel] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'transaction_date', direction: 'desc' });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const itemsPerPage = 15;

  const safeNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const enrichedData = useMemo(() => {
    return movements.map(movement => {
      const label = userLabels.find(l => l.id === movement.label_id);
      const bank = banks.find(b => b.id === movement.bank_id);
      
      return {
        ...movement,
        amount: safeNumber(movement.amount),
        balance: safeNumber(movement.balance),
        label_name: label?.name || 'Unknown',
        bank_name: bank?.name || 'Unknown',
        type_info: MOVEMENT_TYPES[movement.movement_type_id] || { name: 'Unknown', color: 'text-gray-500', bgColor: 'bg-gray-500/20', badge: '?' }
      };
    });
  }, [movements, userLabels, banks]);

  const filteredData = useMemo(() => {
    let filtered = enrichedData;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.label_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.comment && item.comment.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.bank_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter(item => item.movement_type_id.toString() === filterType);
    }

    if (filterLabel) {
      filtered = filtered.filter(item => item.label_id.toString() === filterLabel);
    }

    if (filterDateFrom) {
      filtered = filtered.filter(item => item.transaction_date >= filterDateFrom);
    }

    if (filterDateTo) {
      filtered = filtered.filter(item => item.transaction_date <= filterDateTo);
    }

    return filtered;
  }, [enrichedData, searchTerm, filterType, filterLabel, filterDateFrom, filterDateTo]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'label_name' || sortConfig.key === 'bank_name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortConfig.key === 'transaction_date' || sortConfig.key === 'value_date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortConfig.key === 'amount' || sortConfig.key === 'balance') {
        aValue = safeNumber(aValue);
        bValue = safeNumber(bValue);
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
  }, [searchTerm, filterType, filterLabel, filterDateFrom, filterDateTo]);

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

  const handleEditStart = (movement) => {
    setEditingId(movement.id);
    setEditFormData({
      movement_type_id: movement.movement_type_id,
      label_id: movement.label_id,
      bank_id: movement.bank_id,
      transaction_date: movement.transaction_date,
      value_date: movement.value_date,
      amount: Math.abs(movement.amount),
      balance: movement.balance,
      comment: movement.comment || "",
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleEditConfirm = async () => {
    try {
      await axios.put(`/api/movements/${editingId}`, editFormData);
      setEditingId(null);
      setEditFormData({});
      onSuccess?.();
    } catch (error) {
      console.error("Error updating movement", error);
      alert("Error updating movement. Please try again.");
    }
  };

  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: ['movement_type_id', 'label_id', 'bank_id'].includes(field)
        ? parseInt(value) || ""
        : value
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterLabel("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const GridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {paginatedData.map((movement) => (
        <div key={movement.id} className="bg-[var(--color-neutral-dark-3)] p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded font-medium ${movement.type_info.bgColor} ${movement.type_info.color}`}>
                {movement.type_info.badge}
              </span>
              <span className="text-xs text-[var(--color-neutral-bright)]/50">#{movement.id}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleEditStart(movement)}
                className="cursor-pointer text-[var(--color-primary)] hover:text-[var(--color-secondary)] p-1 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
                title="Edit"
              >
                <FaEdit size={12} />
              </button>
              <button
                onClick={() => onDelete && onDelete(movement)}
                className="cursor-pointer text-[var(--color-error)] hover:text-[var(--color-error)]/80 p-1 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
                title="Delete"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-[var(--color-neutral-bright)]">{movement.label_name}</p>
              <p className="text-xs text-[var(--color-neutral-bright)]/70">{movement.bank_name}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-lg font-bold ${movement.type_info.color}`}>
                €{Math.abs(movement.amount).toFixed(2)}
              </span>
              <span className="text-sm text-[var(--color-neutral-bright)]/70">
                Balance: €{movement.balance.toFixed(2)}
              </span>
            </div>
            
            <div className="text-xs text-[var(--color-neutral-bright)]/60">
              {new Date(movement.transaction_date).toLocaleDateString()}
            </div>
            
            {movement.comment && (
              <div className="text-xs text-[var(--color-neutral-bright)]/70 italic border-t border-[var(--color-neutral-dark)] pt-2">
                "{movement.comment}"
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-[var(--color-neutral-dark)] rounded-lg">
        <div className="flex items-center gap-3 text-[var(--color-neutral-bright)]">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-primary)]"></div>
          Loading movements...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-neutral-dark)] rounded-lg overflow-hidden">
      
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-[var(--color-neutral-dark-3)] space-y-4">
        
        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60" />
            <input
              type="text"
              placeholder="Search by category, comment, or bank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>
          
          <div className="flex bg-[var(--color-neutral-dark-3)] rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`cursor-pointer px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                viewMode === 'table'
                  ? 'bg-[var(--color-primary)] text-[var(--color-neutral-bright)]'
                  : 'text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-neutral-bright)]'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`cursor-pointer px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-[var(--color-primary)] text-[var(--color-neutral-bright)]'
                  : 'text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-neutral-bright)]'
              }`}
            >
              <FaEye className="inline mr-1" />
              Cards
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-1">
              <FaFilter className="text-[var(--color-primary)]" />
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="cursor-pointer w-full p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">All Types</option>
              <option value="1">Income</option>
              <option value="2">Expense</option>
              <option value="3">Correction</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-1">
              <FaTags className="text-[var(--color-secondary)]" />
              Category
            </label>
            <select
              value={filterLabel}
              onChange={(e) => setFilterLabel(e.target.value)}
              className="cursor-pointer w-full p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">All Categories</option>
              {userLabels.map(label => (
                <option key={label.id} value={label.id}>{label.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-1">
              <FaCalendarAlt className="text-[var(--color-warning)]" />
              From Date
            </label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-1">
              <FaCalendarAlt className="text-[var(--color-warning)]" />
              To Date
            </label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-2 flex items-end gap-2">
            <button
              onClick={clearFilters}
              className="cursor-pointer flex-1 p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {viewMode === 'grid' ? (
          <GridView />
        ) : (
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
                    onClick={() => handleSort('transaction_date')}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {getSortIcon('transaction_date')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-[var(--color-neutral-bright)] text-sm font-semibold">
                    Type
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
                    className="cursor-pointer px-3 py-3 text-right text-[var(--color-neutral-bright)] text-sm font-semibold hover:bg-[var(--color-neutral-dark-3)] transition-colors"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Amount
                      {getSortIcon('amount')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer px-3 py-3 text-right text-[var(--color-neutral-bright)] text-sm font-semibold hover:bg-[var(--color-neutral-dark-3)] transition-colors"
                    onClick={() => handleSort('balance')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Balance
                      {getSortIcon('balance')}
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
                {paginatedData.map((movement) => (
                  <tr 
                    key={movement.id}
                    className="border-b border-[var(--color-neutral-dark-3)] hover:bg-[var(--color-neutral-dark-3)] transition-colors duration-200"
                  >
                    <td className="px-3 py-3 text-[var(--color-neutral-bright)] text-sm">
                      <span className="bg-[var(--color-neutral-dark-3)] px-2 py-1 rounded text-xs">
                        {movement.id}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {editingId === movement.id ? (
                        <input
                          type="date"
                          value={editFormData.transaction_date}
                          onChange={(e) => handleEditChange('transaction_date', e.target.value)}
                          className="w-full p-1 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm"
                        />
                      ) : (
                        <span className="text-[var(--color-neutral-bright)] text-sm">
                          {new Date(movement.transaction_date).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {editingId === movement.id ? (
                        <select
                          value={editFormData.movement_type_id}
                          onChange={(e) => handleEditChange('movement_type_id', e.target.value)}
                          className="w-full p-1 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm"
                        >
                          <option value={1}>Income</option>
                          <option value={2}>Expense</option>
                          <option value={3}>Correction</option>
                        </select>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded font-medium ${movement.type_info.bgColor} ${movement.type_info.color}`}>
                          {movement.type_info.name}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {editingId === movement.id ? (
                        <select
                          value={editFormData.label_id}
                          onChange={(e) => handleEditChange('label_id', e.target.value)}
                          className="w-full p-1 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm"
                        >
                          {userLabels.map((label) => (
                            <option key={label.id} value={label.id}>
                              {label.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-[var(--color-neutral-bright)] text-sm font-medium">
                          {movement.label_name}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {editingId === movement.id ? (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editFormData.amount}
                          onChange={(e) => handleEditChange('amount', e.target.value)}
                          className="w-full p-1 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm text-right"
                        />
                      ) : (
                        <span className={`text-sm font-medium ${movement.type_info.color}`}>
                          €{Math.abs(movement.amount).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {editingId === movement.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editFormData.balance}
                          onChange={(e) => handleEditChange('balance', e.target.value)}
                          className="w-full p-1 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm text-right"
                        />
                      ) : (
                        <span className="text-[var(--color-neutral-bright)] text-sm font-medium">
                          €{movement.balance.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-3 py-3">
                      {editingId === movement.id ? (
                        <input
                          type="text"
                          value={editFormData.comment}
                          onChange={(e) => handleEditChange('comment', e.target.value)}
                          className="w-full p-1 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm"
                          placeholder="Notes..."
                        />
                      ) : (
                        <span className="text-[var(--color-neutral-bright)]/80 text-sm">
                          {movement.comment || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center gap-2">
                        {editingId === movement.id ? (
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
                              onClick={() => handleEditStart(movement)}
                              className="cursor-pointer text-[var(--color-primary)] hover:text-[var(--color-secondary)] p-2 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
                              title="Edit"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => onDelete && onDelete(movement)}
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
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[var(--color-neutral-dark-3)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-[var(--color-neutral-bright)]/70">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} movements
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
          {searchTerm || filterType || filterLabel || filterDateFrom || filterDateTo
            ? "No movements found matching the current filters" 
            : "No movements found"}
        </div>
      )}
    </div>
  );
}