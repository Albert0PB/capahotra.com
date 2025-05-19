import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "@inertiajs/react";
import {
  FaBars,
  FaHome,
  FaChartPie,
  FaCalculator,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const NavSidebar = () => {
  const [visible, setVisible] = useState(false);

  const toggleSidebar = () => setVisible((prev) => !prev);

  return (
    <>
      <button
        onClick={toggleSidebar}
        style={{
          background: "none",
          border: "none",
          color: "#f8fafc",
          fontSize: "1.5rem",
          zIndex: 1001,
          cursor: "pointer",
        }}
      >
        <FaBars />
      </button>

      {visible && (
        <div
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        />
      )}

      <div
        style={{
          position: "fixed",
          top: 0,
          right: visible ? 0 : "-250px",
          height: "100vh",
          width: "250px",
          backgroundColor: "var(--color-neutral-dark)",
          transition: "right 0.3s ease-in-out",
          zIndex: 1002,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Sidebar
          backgroundColor="var(--color-neutral-dark)"
          rootStyles={{
            height: "100%",
            border: "none",
            "--ps-menu-root-background": "var(--color-neutral-dark)",
            "--ps-menuitem-root-background": "var(--color-neutral-dark)",
            "--ps-submenu-background": "var(--color-neutral-dark)",
            "--ps-menuitem-active-background": "#475569",
            "--ps-menuitem-hover-background": "#334155",
            "--ps-menuitem-root-text-color": "#f8fafc",
            "--ps-submenu-root-text-color": "#f8fafc",
            "--ps-menu-icon-color": "#f8fafc",
            "--ps-menuitem-icon-color": "#f8fafc",
            "--ps-submenu-expand-icon-color": "#f8fafc",
            "--ps-submenu-content-background": "var(--color-neutral-dark)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Menu style={{ flexGrow: 1 }} iconShape="circle">
              <MenuItem
                icon={<FaHome />}
                component={<Link href="/dashboard" />}
              >
                Dashboard
              </MenuItem>

              <SubMenu label="Operations" icon={<FaChartPie />}>
                <MenuItem component={<Link href="/operative-panel" />}>
                  Operative Panel
                </MenuItem>
                <MenuItem component={<Link href="/operations/movements" />}>
                  Movements
                </MenuItem>
                <MenuItem component={<Link href="/operations/monthly-forecasts" />}>
                  Forecasts
                </MenuItem>
                <MenuItem component={<Link href="/operations/labels" />}>
                  Labels
                </MenuItem>
              </SubMenu>

              <SubMenu label="Financial Tools" icon={<FaCalculator />}>
                <MenuItem component={<Link href="/financial-panel" />}>
                  Financial Panel
                </MenuItem>
                <MenuItem component={<Link href="/salary-calculator" />}>
                  Salary Calculator
                </MenuItem>
                <MenuItem component={<Link href="/investments-visualizer" />}>
                  Investments Visualizer
                </MenuItem>
                <MenuItem component={<Link href="/savings-planner" />}>
                  Savings Planner
                </MenuItem>
              </SubMenu>
            </Menu>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem 2rem",
                borderTop: "1px solid var(--color-neutral-dark-3)",
              }}
            >
              <Link
                href="/settings"
                style={{ color: "var(--color-neutral-bright)" }}
              >
                <FaCog size={20} />
              </Link>

              <Link
                href="/logout"
                method="post"
                style={{ color: "var(--color-error)", cursor: "pointer" }}
              >
                <FaSignOutAlt size={20} />
              </Link>
            </div>
          </div>
        </Sidebar>
      </div>
    </>
  );
};

export default NavSidebar;
