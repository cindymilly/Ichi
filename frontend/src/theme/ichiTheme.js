import { createTheme } from '@mui/material/styles';

const ichiTheme = createTheme({
  palette: {
    primary: {
      main: '#3E2723', // Nâu đậm chuẩn sang trọng
    },
    secondary: {
      main: '#8D6E63', // Nâu nhạt thân thiện
    },
    background: {
      default: '#FDF8F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: "'Lora', serif",
    h1: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h2: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h3: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h4: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h5: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h6: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: "'Lora', serif",
    }
  },
  shape: {
    borderRadius: 16, // Bo góc lớn để tạo sự mềm mại, thân thiện của app đồ ăn
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
        },
        containedPrimary: {
          backgroundColor: '#3E2723',
          '&:hover': {
            backgroundColor: '#2b1b18',
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 8px 24px rgba(62, 39, 35, 0.08)',
          border: '1px solid #f0e6e1'
        }
      }
    }
  }
});

export default ichiTheme;
