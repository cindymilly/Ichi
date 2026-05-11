import React, { useState, useContext } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Link } from '@mui/material';
import api from '../services/apiService';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateInput = () => {
    // SĐT VN: Bắt đầu bằng 03, 05, 07, 08, 09 và đủ 10 số
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMsg('Vui lòng nhập đúng định dạng số điện thoại Việt Nam (10 số).');
      return false;
    }

    // Pass: 6-12 kí tự, không dấu (chữ cái không dấu và số)
    const passRegex = /^[a-zA-Z0-9]{6,12}$/;
    if (!passRegex.test(password)) {
      setErrorMsg('Mật khẩu từ 6-12 ký tự, chỉ gồm chữ cái không dấu và số.');
      return false;
    }

    if (!isLogin && fullName.trim().length < 2) {
      setErrorMsg('Vui lòng nhập họ tên hợp lệ.');
      return false;
    }

    setErrorMsg('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    try {
      if (isLogin) {
        // Gọi API Đăng nhập
        const res = await api.post('/auth/login', { phoneNumber: phone, passwordHash: password });
        if (res.data.success) {
          login(res.data.user, res.data.token);
          navigate('/');
        }
      } else {
        // Gọi API Đăng ký 
        const res = await api.post('/auth/register', { 
          fullName, 
          phoneNumber: phone, 
          passwordHash: password,
          role: 'CUSTOMER' 
        });
        if (res.data.success) {
          // Thông báo thành công và KHÔNG tự đăng nhập, bắt user phải đăng nhập lại
          alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập lại để trải nghiệm Ichi.');
          setIsLogin(true);
          setPassword(''); // Xóa password để người dùng tự gõ lại
        }
      }
    } catch (error) {
      const serverMsg = error.response?.data?.message || 'Kết nối thất bại. Hãy chắc chắn Terminal Backend đang chạy (Port 5000).';
      setErrorMsg(serverMsg);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #FDF8F5 0%, #D7CCC8 100%)' }}>
      <Container maxWidth="xs">
        <Paper elevation={4} sx={{ p: 5, borderRadius: 4, textAlign: 'center', bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
          <Box sx={{ color: '#3E2723', fontSize: '3rem', mb: 1 }}>
            <i className="fa-solid fa-burger"></i>
          </Box>
          <Typography variant="h3" gutterBottom color="primary">ICHI</Typography>
          <Typography variant="body1" color="secondary" mb={3}>
            {isLogin ? 'Đẳng cấp ẩm thực giao tận nơi.' : 'Tạo tài khoản để trải nghiệm ngay.'}
          </Typography>
          
          {errorMsg && (
            <Typography variant="body2" color="error" sx={{ mb: 2, bgcolor: '#ffebee', p: 1.5, borderRadius: 2, fontWeight: 'bold' }}>
              {errorMsg}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField 
                fullWidth label="Họ và Tên" variant="outlined" margin="normal"
                value={fullName} onChange={(e) => setFullName(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            )}
            <TextField 
              fullWidth label="Số điện thoại" variant="outlined" margin="normal"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="VD: 0905866419"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField 
              fullWidth label="Mật khẩu" type="password" variant="outlined" margin="normal"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="6-12 ký tự (chữ hoặc số)"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3, mb: 3, py: 1.5, borderRadius: 3, fontSize: '1.1rem' }}>
              {isLogin ? 'Vào bếp ngay' : 'Đăng ký tài khoản'}
            </Button>
            
            <Link 
              component="button" 
              type="button"
              variant="body1" 
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
              sx={{ color: '#8D6E63', textDecoration: 'none', fontWeight: 'bold' }}
            >
              {isLogin ? 'Chưa có tài khoản? Đăng ký ngay!' : 'Đã có tài khoản? Đăng nhập'}
            </Link>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
