import React, { useState, useMemo } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaSort, FaSortUp, FaSortDown, FaEye } from "react-icons/fa";
import axios from "axios";

export default function LabelsTable({ labels, onDelete, onSuccess }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const itemsPerPage = 8;

  const filteredAndSortedLabels = useMemo(() => {
    let filtered = labels;
    
    // Filter by search term
    if (searchTerm) {
      filtered = labels.filter(label =>
        label.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [labels, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedLabels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLabels = filteredAndSortedLabels.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-[var(--color-neutral-bright)]/30" />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="text-[var(--color-primary)]" />
      : <FaSortDown className="text-[var(--color-primary)]" />;
  };

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

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {paginatedLabels.map((label) => (
        <div key={label.id} className="bg-[var(--color-neutral-dark-3)] p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              {editingId === label.id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirmEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                />
              ) : (
                <h3 className="font-semibold text-[var(--color-neutral-bright)] text-lg truncate" title={label.name}>
                  {label.name}
                </h3>
              )}
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-neutral-bright)]/70">ID:</span>
              <span className="text-[var(--color-neutral-bright)]">{label.id}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-neutral-bright)]/70">Creada:</span>
              <span className="text-[var(--color-neutral-bright)]/70">{new Date(label.created_at).toLocaleDateString('es-ES')}</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-neutral-dark)]">
            {editingId === label.id ? (
              <>
                <button
                  onClick={handleConfirmEdit}
                  className="cursor-pointer text-[var(--color-success)] hover:text-[var(--color-success)]/80 p-2 transition-colors duration-200"
                  title="Confirmar"
                >
                  <FaCheck size={14} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="cursor-pointer text-[var(--color-error)] hover:text-[var(--color-error)]/80 p-2 transition-colors duration-200"
                  title="Cancelar"
                >
                  <FaTimes size={14} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEditClick(label)}
                  className="cursor-pointer text-[var(--color-primary)] hover:text-[var(--color-secondary)] p-2 transition-colors duration-200"
                  title="Editar"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={() => onDelete(label)}
                  className="cursor-pointer text-[var(--color-error)] hover:text-[var(--color-error)]/80 p-2 transition-colors duration-200"
                  title="Eliminar"
                >
                  <FaTrash size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[var(--color-neutral-dark)] rounded-lg overflow-hidden">
      
      {/* Header with Search and View Toggle */}
      <div className="p-4 border-b border-[var(--color-neutral-dark-3)]">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60" />
            <input
              type="text"
              placeholder="Buscar etiquetas..."
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
              Tabla
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
              Cuadrícula
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {viewMode === 'grid' ? (
          <GridView />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-[var(--color-neutral-dark-2)]">
                <tr>
                  <th 
                    className="cursor-pointer px-3 sm:px-4 py-3 text-left text-[var(--color-neutral-bright)] text-sm sm:text-base font-semibold hover:bg-[var(--color-neutral-dark-3)] transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-2">
                      ID
                      {getSortIcon('id')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer px-3 sm:px-4 py-3 text-left text-[var(--color-neutral-bright)] text-sm sm:text-base font-semibold hover:bg-[var(--color-neutral-dark-3)] transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Nombre
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer hidden md:table-cell px-3 sm:px-4 py-3 text-left text-[var(--color-neutral-bright)] text-sm sm:text-base font-semibold hover:bg-[var(--color-neutral-dark-3)] transition-colors"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-2">
                      Creada
                      {getSortIcon('created_at')}
                    </div>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center text-[var(--color-neutral-bright)] text-sm sm:text-base font-semibold">
                    Acciones
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
                      <span className="bg-[var(--color-neutral-dark-3)] px-2 py-1 rounded text-xs">
                        {label.id}
                      </span>
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
                    <td className="hidden md:table-cell px-3 sm:px-4 py-3 text-sm text-[var(--color-neutral-bright)]/70">
                      {new Date(label.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {editingId === label.id ? (
                          <>
                            <button
                              onClick={handleConfirmEdit}
                              className="cursor-pointer text-[var(--color-success)] hover:text-[var(--color-success)]/80 p-2 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
                              title="Confirmar"
                            >
                              <FaCheck size={14} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="cursor-pointer text-[var(--color-error)] hover:text-[var(--color-error)]/80 p-2 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
                              title="Cancelar"
                            >
                              <FaTimes size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(label)}
                              className="cursor-pointer text-[var(--color-primary)] hover:text-[var(--color-secondary)] p-2 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
                              title="Editar"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => onDelete(label)}
                              className="cursor-pointer text-[var(--color-error)] hover:text-[var(--color-error)]/80 p-2 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
                              title="Eliminar"
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
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredAndSortedLabels.length)} de {filteredAndSortedLabels.length} etiquetas
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="cursor-pointer px-3 py-1 text-sm bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
              >
                Primera
              </button>
              
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="cursor-pointer px-3 py-1 text-sm bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
              >
                Anterior
              </button>

              {generatePageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === '...'}
                  className={`cursor-pointer px-3 py-1 text-sm rounded transition-colors duration-200 ${
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
                className="cursor-pointer px-3 py-1 text-sm bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
              >
                Siguiente
              </button>
              
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="cursor-pointer px-3 py-1 text-sm bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200"
              >
                Última
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedLabels.length === 0 && (
        <div className="p-8 text-center text-[var(--color-neutral-bright)]/70">
          {searchTerm ? `No se encontraron etiquetas que coincidan con "${searchTerm}"` : "No se encontraron etiquetas"}
        </div>
      )}
    </div>
  );
}