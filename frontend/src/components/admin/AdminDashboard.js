import React from 'react';
import { Container, Typography, Card, CardContent, Grid, Box } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h3" mb={1}>Ichi Headquarters</Typography>
      <Typography variant="body1" color="secondary" mb={4}>Bảng Điều Hành Trung Tâm</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ bgcolor: '#3E2723', color: 'white', borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ opacity: 0.8, mb: 1 }}>Tổng Doanh Thu Hợp Đồng Web3</Typography>
              <Typography variant="h2" sx={{ fontFamily: 'Playfair Display' }}>12.5 ETH</Typography>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">~ $35,000</Typography>
                <i className="fa-brands fa-ethereum" style={{ fontSize: '1.5rem' }}></i>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ bgcolor: '#f9f5f3', borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" color="secondary" mb={1}>Tài xế Online (Real-time)</Typography>
              <Typography variant="h2" color="primary" sx={{ fontFamily: 'Playfair Display' }}>142</Typography>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', color: '#2e7d32' }}>
                <Typography variant="body2">+12% so với hôm qua</Typography>
                <i className="fa-solid fa-motorcycle" style={{ fontSize: '1.5rem' }}></i>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ bgcolor: '#f9f5f3', borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" color="secondary" mb={1}>Đơn hàng chờ xử lý</Typography>
              <Typography variant="h2" color="primary" sx={{ fontFamily: 'Playfair Display' }}>28</Typography>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', color: '#ed6c02' }}>
                <Typography variant="body2">Cần điều phối gấp</Typography>
                <i className="fa-solid fa-bell" style={{ fontSize: '1.5rem' }}></i>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
