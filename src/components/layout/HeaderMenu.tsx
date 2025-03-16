import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HelpIcon from "@mui/icons-material/Help";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";

interface HeaderMenuProps {
  pages: string[];
}

export const HeaderMenu = ({ pages }: HeaderMenuProps) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  // 햄버거 메뉴 아이템 정의
  const menuItems = [
    { name: "Shop", icon: <StorefrontIcon />, path: "/shop" },
    { name: "Manual", icon: <MenuBookIcon />, path: "/manual" },
    { name: "Help", icon: <HelpIcon />, path: "/help" },
    { name: "Contact Us", icon: <EmailIcon />, path: "/contact" },
  ];

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
  };

  return (
    <>
      {/* 모바일 메뉴 */}
      <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
          sx={{
            "&:focus": {
              outline: "none",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.name}
              onClick={() => handleMenuItemClick(item.path)}
              sx={{
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                  {item.icon}
                </Box>
                <Typography>{item.name}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* 데스크톱 메뉴 */}
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        {pages.map((page) => (
          <Button
            key={page}
            onClick={handleCloseNavMenu}
            sx={{
              my: 2,
              color: "white",
              display: "block",
              "&:focus": {
                outline: "none",
              },
            }}
          >
            {page}
          </Button>
        ))}
      </Box>
    </>
  );
};
