import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { AuthContext } from '../../AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#FDF8F5', borderBottom: '1px solid #D7CCC8' }}>
      <Toolbar>
        {/* Logo */}
        <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#3E2723', display: 'flex', alignItems: 'center', gap: 1 }}>
          <i className="fa-solid fa-mug-hot"></i> ICHI
        </Typography>
        
        {/* User Menu */}
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: '#8D6E63', width: 35, height: 35 }}>{user.fullName.charAt(0)}</Avatar>
              <Box>
                <Typography variant="body1" sx={{ color: '#3E2723', fontWeight: 600, lineHeight: 1.2 }}>
                  {user.fullName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#8D6E63', textTransform: 'uppercase' }}>
                  {user.role}
                </Typography>
              </Box>
            </Box>
            <Button variant="outlined" color="primary" onClick={logout} sx={{ borderRadius: 8 }}>
              Đăng xuất
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
