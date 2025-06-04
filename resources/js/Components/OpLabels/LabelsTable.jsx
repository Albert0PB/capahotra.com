import React, { useState, useMemo } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function LabelsTable({ labels, onDelete, onSuccess }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const filteredLabels = useMemo(() => {
    if (!searchTerm) return labels;
    return labels.filter(label =>
      label.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [labels, searchTerm]);

  const totalPages = Math.ceil(filteredLabels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLabels = filteredLabels.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEditClick = (label) => {
    setEditingId(label.id);
    setEditName(label.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleConfirmEdit = async () => {
    try {
      await axios.put(`/api/labels/${editingId}`, { name: editName });
      setEditingId(null);
      onSuccess?.();
    } catch (error) {
      console.error("Error updating label", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-[var(--color-neutral-dark)] rounded-lg">
      {/* Search Bar */}
      <div className="p-4 border-b border-[var(--color-neutral-dark-3)]">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60" />
          <input
            type="text"
            placeholder="Search labels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-[var(--color-neutral-dark-2)]">
            <tr>
              <th className="px-3 sm:px-4 py-3 text-left text-[var(--color-neutral-bright)] text-sm sm:text-base font-semibold">
                ID
              </th>
              <th className="px-3 sm:px-4 py-3 text-left text-[var(--color-neutral-bright)] text-sm sm:text-base font-semibold">
                Name
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-4 py-3 text-left text-[var(--color-neutral-bright)] text-sm sm:text-base font-semibold">
                Created
              </th>
              <th className="px-3 sm:px-4 py-3 text-center text-[var(--color-neutral-bright)] text-sm sm:text-base font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedLabels.map((label) => (
              <tr 
                key={label.id} 
                className="border-b border-[var(--color-neutral-dark-3)] hover:bg-[var(--color-neutral-dark-3)] transition-colors duration-200"
              >
                <td className="px-3 sm:px-4 py-3 text-[var(--color-neutral-bright)] text-sm sm:text-base">
                  {label.id}
                </td>
                <td className="px-3 sm:px-4 py-3">
                  {editingId === label.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleConfirmEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium text-[var(--color-neutral-bright)] text-sm sm:text-base">
                      {label.name}
                    </span>
                  )}
                </td>
                <td className="hidden sm:table-cell px-3 sm:px-4 py-3 text-sm text-[var(--color-neutral-bright)]/70">
                  {new Date(label.created_at).toLocaleDateString()}
                </td>
                <td className="px-3 sm:px-4 py-3">
                  <div className="flex justify-center gap-2">
                    {editingId === label.id ? (
                      <>
                        <button
                          onClick={handleConfirmEdit}
                          className="text-[var(--color-success)] hover:text-[var(--color-success)]/80 p-1 transition-colors duration-200"
                          title="Confirm"
                        >
                          <FaCheck size={14} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-[var(--color-error)] hover:text-[var(--color-error)]/80 p-1 transition-colors duration-200"
                          title="Cancel"
                        >
                          <FaTimes size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(label)}
                          className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] p-1 transition-colors duration-200"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(label)}
                          className="text-[var(--color-error)] hover:text-[var(--color-error)]/80 p-1 transition-colors duration-200"
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
            {/* Info */}
            <div className="text-sm text-[var(--color-neutral-bright)]/70">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLabels.length)} of {filteredLabels.length} labels
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
              >
                First
              </button>
              
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
              >
                Prev
              </button>

              {generatePageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === '...'}
                  className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                    page === currentPage
                      ? 'bg-[var(--color-primary)] text-[var(--color-neutral-bright)]'
                      : page === '...'
                      ? 'bg-transparent text-[var(--color-neutral-bright)]/50 cursor-default'
                      : 'bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] hover:bg-[var(--color-neutral-dark-2)]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
              >
                Next
              </button>
              
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No results message */}
      {filteredLabels.length === 0 && (
        <div className="p-8 text-center text-[var(--color-neutral-bright)]/70">
          {searchTerm ? `No labels found matching "${searchTerm}"` : "No labels found"}
        </div>
      )}
    </div>
  );
}