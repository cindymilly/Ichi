import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Button, Chip, Box, Avatar } from '@mui/material';
import api from '../../services/apiService';

const DriverDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setAvailableOrders(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  const acceptOrder = async (id) => {
    try {
      await api.put(`/orders/${id}/accept`);
      alert("Chốt đơn thành công! Vui lòng tới điểm đón.");
    } catch (err) {
      alert("Rất tiếc, đơn này đã có người khác nhận.");
    }
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3">Trạm Tài Xế</Typography>
          <Typography variant="body1" color="secondary">Sẵn sàng nhận cuốc mới chưa?</Typography>
        </Box>
        <Button variant="outlined" color="primary" sx={{ borderRadius: 8, border: '2px solid' }}>
          <i className="fa-brands fa-ethereum" style={{ marginRight: '8px' }}></i> Liên kết ví MetaMask
        </Button>
      </Box>
      
      <Typography variant="h5" mb={3}><i className="fa-solid fa-radar"></i> Radar Đơn Hàng</Typography>
      <Grid container spacing={3}>
        {availableOrders.length === 0 ? (
          <Grid item xs={12}>
            <Card elevation={0} sx={{ bgcolor: '#f9f5f3', textAlign: 'center', p: 8 }}>
              <i className="fa-solid fa-mug-hot" style={{ fontSize: '4rem', color: '#D7CCC8', marginBottom: '20px' }}></i>
              <Typography variant="h6" color="secondary">Hiện tại khu vực của bạn đang vắng khách.</Typography>
              <Typography color="secondary">Hãy làm một ly cafe và chờ chút nhé.</Typography>
            </Card>
          </Grid>
        ) : (
          availableOrders.map(o => (
            <Grid item xs={12} md={6} key={o._id}>
              <Card elevation={1} sx={{ transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#3E2723' }}><i className="fa-solid fa-burger"></i></Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">Đơn Đồ Ăn</Typography>
                        <Typography variant="body2" color="secondary">Cách bạn 1.2km</Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" color="primary" fontWeight="bold">35.000đ</Typography>
                  </Box>
                  
                  <Box sx={{ bgcolor: '#f9f5f3', p: 2, borderRadius: 2, mb: 3 }}>
                    <Typography variant="body2" mb={1}><strong>Lấy tại:</strong> Nhà hàng Ichi Gourmet</Typography>
                    <Typography variant="body2"><strong>Giao đến:</strong> {o.dropoff?.address || "Đang cập nhật..."}</Typography>
                  </Box>
                  
                  <Button variant="contained" color="primary" fullWidth size="large" onClick={() => acceptOrder(o._id)} sx={{ borderRadius: 3 }}>
                    Nhận Cuốc Ngay
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default DriverDashboard;
