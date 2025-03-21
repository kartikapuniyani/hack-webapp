import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.colors.background};
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  background-color: white;
  width: ${(props) => (props.$isOpen ? "240px" : "64px")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  height: 100vh;
  z-index: 10;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
`;

const SidebarHeader = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const Logo = styled.div<{ $isOpen: boolean }>`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  transform: translateX(${(props) => (props.$isOpen ? "0" : "-20px")});
  transition: all 0.3s ease;
  white-space: nowrap;
  margin-left: ${(props) => (props.$isOpen ? "12px" : "0")};
`;

const MenuToggle = styled.button`
  background: none;
  border: none;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  border-radius: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }
`;

const NavMenu = styled.nav`
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const NavItem = styled(Link)<{ $active: boolean; $isOpen: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  color: ${(props) => (props.$active ? props.theme.colors.primary : "#666")};
  text-decoration: none;
  transition: all 0.2s ease;
  background-color: ${(props) =>
    props.$active
      ? `rgba(${props.theme.colors.primaryRgb}, 0.1)`
      : "transparent"};

  &:hover {
    background-color: ${(props) =>
      props.$active
        ? `rgba(${props.theme.colors.primaryRgb}, 0.15)`
        : "rgba(0, 0, 0, 0.05)"};
  }

  .icon {
    min-width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    color: ${(props) => (props.$active ? props.theme.colors.primary : "#666")};
  }
`;

const NavText = styled.span<{ $isOpen: boolean }>`
  margin-left: 12px;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  transform: translateX(${(props) => (props.$isOpen ? "0" : "-10px")});
  transition: all 0.3s ease;
  white-space: nowrap;
`;

const MainContent = styled.main<{ $isOpen: boolean }>`
  flex: 1;
  margin-left: ${(props) => (props.$isOpen ? "240px" : "64px")};
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: calc(100vw - 240px);
`;

const Navbar = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 5;
  width: 100%;
`;

const PageTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NotificationBell = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: #666;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: ${(props) => props.theme.colors.accent};
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.9rem;
`;

const ContentArea = styled.div`
  padding: 24px;
  flex: 1;
`;

// SVG Icons for the sidebar
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);

const MapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3l-6-3m6-3l6-3m6 3v7.382a1 1 0 01-.553.894L15 20m0-13V7m0 13V7m0 0L9 4"
    />
  </svg>
);

const TableIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Determine the current page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Map View";
      case "/table":
        return "Table View";
      case "/notifications":
        return "Notifications";
      default:
        return "Road Issues Tracker";
    }
  };

  return (
    <LayoutContainer>
      <Sidebar $isOpen={isSidebarOpen}>
        <SidebarHeader>
          <MenuToggle onClick={toggleSidebar}>
            <MenuIcon />
          </MenuToggle>
          <Logo $isOpen={isSidebarOpen}>RoadSense</Logo>
        </SidebarHeader>

        <NavMenu>
          <NavItem
            to="/"
            $active={location.pathname === "/"}
            $isOpen={isSidebarOpen}
          >
            <div className="icon">
              <MapIcon />
            </div>
            <NavText $isOpen={isSidebarOpen}>Map View</NavText>
          </NavItem>

          <NavItem
            to="/table"
            $active={location.pathname === "/table"}
            $isOpen={isSidebarOpen}
          >
            <div className="icon">
              <TableIcon />
            </div>
            <NavText $isOpen={isSidebarOpen}>Table View</NavText>
          </NavItem>

          <NavItem
            to="/notifications"
            $active={location.pathname === "/notifications"}
            $isOpen={isSidebarOpen}
          >
            <div className="icon">
              <BellIcon />
            </div>
            <NavText $isOpen={isSidebarOpen}>Notifications</NavText>
          </NavItem>
        </NavMenu>
      </Sidebar>

      <MainContent $isOpen={isSidebarOpen}>
        <Navbar>
          <PageTitle>{getPageTitle()}</PageTitle>

          <UserSection>
            <NotificationBell>
              <BellIcon />
              <NotificationBadge>3</NotificationBadge>
            </NotificationBell>

            <UserAvatar>U</UserAvatar>
          </UserSection>
        </Navbar>

        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
