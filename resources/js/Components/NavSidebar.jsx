import React, { useState, useEffect } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import {
  FaBars,
  FaHome,
  FaChartPie,
  FaCalculator,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

const NavSidebar = () => {
  const [visible, setVisible] = useState(false);
  const [operationsOpen, setOperationsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { auth } = usePage().props;
  const { post } = useForm();

  const toggleSidebar = () => setVisible((prev) => !prev);
  const closeSidebar = () => setVisible(false);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  const username = auth?.user?.email ? auth.user.email.split('@')[0] : 'User';

  const handleLogout = (e) => {
    e.preventDefault();
    post('/logout');
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="bg-transparent border-none text-[var(--color-neutral-bright)] text-xl sm:text-2xl z-[1001] cursor-pointer hover:text-[var(--color-primary)] transition-colors duration-200"
        aria-label="Toggle navigation menu"
      >
        <FaBars />
      </button>

      {visible && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-[var(--color-neutral-dark)] transition-transform duration-300 ease-in-out z-[1002] flex flex-col shadow-xl ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        
        <div className="p-6 border-b border-[var(--color-neutral-dark-3)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[var(--color-neutral-bright)] font-semibold text-lg">
              Navigation
            </h3>
            <button
              onClick={closeSidebar}
              className="text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-neutral-bright)] transition-colors duration-200 lg:hidden"
            >
              <FaTimes size={18} />
            </button>
          </div>
          
          <Link
            href="/settings"
            onClick={closeSidebar}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center group-hover:bg-[var(--color-secondary)] transition-colors duration-200">
              <FaUser className="text-[var(--color-neutral-bright)] text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-[var(--color-neutral-bright)] font-medium text-sm">
                {username}
              </p>
              <p className="text-[var(--color-neutral-bright)]/60 text-xs">
                View profile
              </p>
            </div>
            <FaCog className="text-[var(--color-neutral-bright)]/40 group-hover:text-[var(--color-neutral-bright)]/60 transition-colors duration-200" size={14} />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          
          <Link
            href="/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-3 p-3 rounded-lg text-[var(--color-neutral-bright)] hover:bg-[var(--color-neutral-dark-2)] hover:text-[var(--color-primary)] transition-all duration-200 group"
          >
            <FaHome className="text-lg group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <div>
            <button
              onClick={() => setOperationsOpen(!operationsOpen)}
              className="w-full flex items-center justify-between gap-3 p-3 rounded-lg text-[var(--color-neutral-bright)] hover:bg-[var(--color-neutral-dark-2)] hover:text-[var(--color-primary)] transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <FaChartPie className="text-lg group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Operations</span>
              </div>
              {operationsOpen ? (
                <FaChevronDown className="text-sm transition-transform duration-200" />
              ) : (
                <FaChevronRight className="text-sm transition-transform duration-200" />
              )}
            </button>
            
            {operationsOpen && (
              <div className="mt-2 ml-6 space-y-1">
                <Link
                  href="/operations/"
                  onClick={closeSidebar}
                  className="block p-2 pl-4 rounded text-[var(--color-neutral-bright)]/80 hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-dark-2)] transition-all duration-200 text-sm border-l-2 border-[var(--color-neutral-dark-3)] hover:border-[var(--color-primary)]"
                >
                  Operative Panel
                </Link>
                <Link
                  href="/operations/movements"
                  onClick={closeSidebar}
                  className="block p-2 pl-4 rounded text-[var(--color-neutral-bright)]/80 hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-dark-2)] transition-all duration-200 text-sm border-l-2 border-[var(--color-neutral-dark-3)] hover:border-[var(--color-primary)]"
                >
                  Movements
                </Link>
                <Link
                  href="/operations/monthly-forecasts"
                  onClick={closeSidebar}
                  className="block p-2 pl-4 rounded text-[var(--color-neutral-bright)]/80 hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-dark-2)] transition-all duration-200 text-sm border-l-2 border-[var(--color-neutral-dark-3)] hover:border-[var(--color-primary)]"
                >
                  Forecasts
                </Link>
                <Link
                  href="/operations/labels"
                  onClick={closeSidebar}
                  className="block p-2 pl-4 rounded text-[var(--color-neutral-bright)]/80 hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-dark-2)] transition-all duration-200 text-sm border-l-2 border-[var(--color-neutral-dark-3)] hover:border-[var(--color-primary)]"
                >
                  Labels
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className="w-full flex items-center justify-between gap-3 p-3 rounded-lg text-[var(--color-neutral-bright)] hover:bg-[var(--color-neutral-dark-2)] hover:text-[var(--color-primary)] transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <FaCalculator className="text-lg group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Financial Tools</span>
              </div>
              {toolsOpen ? (
                <FaChevronDown className="text-sm transition-transform duration-200" />
              ) : (
                <FaChevronRight className="text-sm transition-transform duration-200" />
              )}
            </button>
            
            {toolsOpen && (
              <div className="mt-2 ml-6 space-y-1">
                <Link
                  href="/financial-panel"
                  onClick={closeSidebar}
                  className="block p-2 pl-4 rounded text-[var(--color-neutral-bright)]/80 hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-dark-2)] transition-all duration-200 text-sm border-l-2 border-[var(--color-neutral-dark-3)] hover:border-[var(--color-primary)]"
                >
                  Financial Panel
                </Link>
                <Link
                  href="/salary-calculator"
                  onClick={closeSidebar}
                  className="block p-2 pl-4 rounded text-[var(--color-neutral-bright)]/80 hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-dark-2)] transition-all duration-200 text-sm border-l-2 border-[var(--color-neutral-dark-3)] hover:border-[var(--color-primary)]"
                >
                  Salary Calculator
                </Link>
                <Link
                  href="/investments-visualizer"
                  onClick={closeSidebar}
                  className="block p-2 pl-4 rounded text-[var(--color-neutral-bright)]/80 hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-dark-2)] transition-all duration-200 text-sm border-l-2 border-[var(--color-neutral-dark-3)] hover:border-[var(--color-primary)]"
                >
                  Investments Visualizer
                </Link>
                <Link
                  href="/savings-planner"
                  onClick={closeSidebar}
                  className="block p-2 pl-4 rounded text-[var(--color-neutral-bright)]/80 hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-dark-2)] transition-all duration-200 text-sm border-l-2 border-[var(--color-neutral-dark-3)] hover:border-[var(--color-primary)]"
                >
                  Savings Planner
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-[var(--color-neutral-dark-3)]">
          <div className="flex items-center justify-end gap-4">
            
            <button
              onClick={handleLogout}
              className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--color-error)]/20 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-[var(--color-neutral-bright)] transition-all duration-200"
              title="Logout"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavSidebar;