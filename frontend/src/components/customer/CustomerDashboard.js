import React, { useState, useContext, useEffect, useRef } from 'react';
import { Container, Typography, Card, CardContent, Grid, Button, TextField, Box, Divider, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogContent, Badge, Fade, Slide, Zoom, Chip, Stepper, Step, StepLabel, StepContent, Autocomplete, InputAdornment } from '@mui/material';
import { AuthContext } from '../../AuthContext';

// --- DATA GIẢ LẬP SIÊU CHUẨN ---
const CATEGORIES = [
  { id: 'c1', name: 'Hải Sản Tươi Sống', bg: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80', desc: 'Thưởng thức hương vị biển cả' },
  { id: 'c2', name: 'Trà Sữa & Đồ Ngọt', bg: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Bubble_tea_served_in_light_bulb_glass.jpg', desc: 'Giải nhiệt ngày hè' },
  { id: 'c3', name: 'Món Nước & Bún Phở', bg: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Pho-Beef-Noodles-2008.jpg', desc: 'Đậm đà hương vị truyền thống' },
];

const RESTAURANTS = {
  'c1': [
    { id: 'r1', name: 'Nhà Hàng Hải Sản Đại Dương', rating: 4.8, address: '76 Lê Lai, Phường Bến Thành, Q.1', lat: 10.7728, lng: 106.6981 },
    { id: 'r4', name: 'Ốc Đào Sài Gòn', rating: 4.5, address: '212B Nguyễn Trãi, Q.1', lat: 10.7634, lng: 106.6853 },
  ],
  'c2': [
    { id: 'r2', name: 'Quán Trà Sữa Mây Trắng', rating: 4.9, address: '72 Nguyễn Huệ, Phường Bến Nghé, Q.1', lat: 10.7776, lng: 106.7030 },
    { id: 'r5', name: 'Trà Sữa BobaPop', rating: 4.6, address: '245 Lê Văn Sỹ, Q.3', lat: 10.7853, lng: 106.6805 },
    { id: 'r6', name: 'Gong Cha Premium', rating: 4.8, address: '83 Hồ Tùng Mậu, Q.1', lat: 10.7725, lng: 106.7052 },
  ],
  'c3': [
    { id: 'r3', name: 'Bún Riêu Cô Ba', rating: 4.7, address: '5 Đinh Tiên Hoàng, Phường Đa Kao, Q.1', lat: 10.7788, lng: 106.7014 },
    { id: 'r7', name: 'Phở Lệ', rating: 4.9, address: '413 Nguyễn Trãi, Q.5', lat: 10.7582, lng: 106.6738 },
    { id: 'r8', name: 'Bún Bò Huế Hạnh', rating: 4.5, address: '135 Bành Văn Trân, Tân Bình', lat: 10.7877, lng: 106.6542 },
  ]
};

const MENUS = {
  'r1': [
    { id: 'm1', name: 'Ốc hương rang muối', price: 85000, bestSeller: true, icon: '🐌' },
    { id: 'm2', name: 'Mì xào hải sản', price: 65000, bestSeller: false, icon: '🍝' },
    { id: 'm3', name: 'Nghêu hấp xả', price: 50000, bestSeller: false, icon: '🦪' },
  ],
  'r4': [
    { id: 'm11', name: 'Ốc len xào dừa', price: 70000, bestSeller: true, icon: '🥥' },
    { id: 'm12', name: 'Hàu nướng phô mai', price: 90000, bestSeller: true, icon: '🦪' },
  ],
  'r2': [
    { id: 'm4', name: 'Trà sữa gạo rang', price: 35000, bestSeller: true, icon: '🥤' },
    { id: 'm5', name: 'Trà sữa Matcha', price: 40000, bestSeller: false, icon: '🍵' },
    { id: 'm6', name: 'Trà sữa Chocolate', price: 40000, bestSeller: false, icon: '🍫' },
    { id: 'm7', name: 'Trà sữa Bạc hà', price: 38000, bestSeller: false, icon: '🌿' },
  ],
  'r5': [
    { id: 'm13', name: 'Trà sữa trân châu đen', price: 45000, bestSeller: true, icon: '🧋' },
    { id: 'm14', name: 'Hồng trà kem cheese', price: 50000, bestSeller: false, icon: '🧀' },
  ],
  'r6': [
    { id: 'm15', name: 'Oolong sữa trân châu', price: 55000, bestSeller: true, icon: '🍂' },
    { id: 'm16', name: 'Trà Alisan trái cây', price: 60000, bestSeller: false, icon: '🍎' },
  ],
  'r3': [
    { id: 'm8', name: 'Bún riêu cua', price: 40000, bestSeller: false, icon: '🦀' },
    { id: 'm9', name: 'Bún riêu ốc', price: 45000, bestSeller: false, icon: '🐌' },
    { id: 'm10', name: 'Bún riêu đặc biệt', price: 55000, bestSeller: true, icon: '🍲' },
  ],
  'r7': [
    { id: 'm17', name: 'Phở bò tái nạm', price: 65000, bestSeller: true, icon: '🍜' },
    { id: 'm18', name: 'Phở đặc biệt tủy, gân', price: 85000, bestSeller: true, icon: '🍖' },
  ],
  'r8': [
    { id: 'm19', name: 'Bún bò bắp giò', price: 55000, bestSeller: true, icon: '🥩' },
    { id: 'm20', name: 'Bún bò chả cua', price: 60000, bestSeller: false, icon: '🍲' },
  ]
};

const BANNERS = [
  { id: 1, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80', title: 'Siêu Hội Ẩm Thực', desc: 'Giảm giá cực sốc lên đến 50% cho tất cả đơn hàng hôm nay!' },
  { id: 2, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', title: 'Freeship Muôn Nơi', desc: 'Nhập mã ICHI50 để được giảm 50%, mã ICHI70 giảm 70% phí vận chuyển.' },
  { id: 3, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80', title: 'Giờ Vàng Giá Sốc', desc: 'Săn deal đồng giá 1K vào khung giờ 12:00 - 14:00 hàng ngày.' },
  { id: 4, img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80', title: 'Trà Sữa Mua 1 Tặng 1', desc: 'Áp dụng cho chuỗi Quán Trà Sữa Mây Trắng.' },
];

const VALID_VOUCHERS = {
  'ICHI50': 0.5,
  'ICHI70': 0.7
};

const FIRST_NAMES = ["Trần", "Nguyễn", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
const MIDDLE_NAMES = ["Hữu", "Văn", "Thị", "Thanh", "Minh", "Thu", "Ngọc", "Gia", "Đức", "Thảo", "Hải"];
const LAST_NAMES = ["Khang", "Huy", "Linh", "Hùng", "Tâm", "Anh", "Trang", "Lan", "Sơn", "Khoa", "Đạt", "Bình", "Tuấn", "Thành", "Thịnh", "Phong", "My", "Trâm"];

const generateRandomShipper = () => {
  const name = `${FIRST_NAMES[Math.floor(Math.random()*FIRST_NAMES.length)]} ${MIDDLE_NAMES[Math.floor(Math.random()*MIDDLE_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random()*LAST_NAMES.length)]}`;
  const age = Math.floor(Math.random() * 25) + 20;
  const rating = (Math.random() * 0.8 + 4.2).toFixed(1);
  return { name, age, rating, avatar: "fa-motorcycle" };
};

const HOLIDAYS = [
  { id: 'NORMAL', bg: '', name: 'Bình Thường' },
  { id: 'TET', bg: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=600&q=80', name: 'Tết Nguyên Đán' },
  { id: 'SUMMER', bg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', name: 'Mùa Hè Sôi Động' },
  { id: 'VALENTINE', bg: 'https://images.unsplash.com/photo-1518199266791-5375a83164ba?auto=format&fit=crop&w=600&q=80', name: 'Valentine' },
  { id: 'WOMENS_DAY', bg: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80', name: 'Quốc Tế Phụ Nữ' },
  { id: 'HALLOWEEN', bg: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&w=600&q=80', name: 'Halloween' },
  { id: 'TEACHERS_DAY', bg: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80', name: 'Ngày Nhà Giáo VN' },
  { id: 'CHRISTMAS', bg: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=600&q=80', name: 'Giáng Sinh' }
];

const INITIAL_REVIEWS = {
   'r1': [
      { user: 'Bảo Anh', rating: 5, comment: 'Hải sản rất tươi, giao hàng cẩn thận không bị đổ.', tags: ['Tươi ngon', 'Nóng hổi'] },
      { user: 'Minh Tuấn', rating: 4, comment: 'Nghêu hơi nhỏ nhưng vị rất đậm đà.', tags: ['Đậm vị'] }
   ],
   'r2': [
      { user: 'Lan Trúc', rating: 5, comment: 'Trà sữa đậm vị, trân châu dai ngon', tags: ['Ngon miệng', 'Giá hợp lý'] }
   ]
};

// STORE_LATLNG được lấy động từ quán được chọn (xem activeOrder.storeLatlng)

const CustomerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [screen, setScreen] = useState('CATEGORIES'); // CATEGORIES, MENU, CART, TRACKING, HISTORY

  const smartSuggestions = React.useMemo(() => {
    let allBestSellers = [];
    Object.keys(MENUS).forEach(resId => {
       const resName = Object.values(RESTAURANTS).flat().find(r => r.id === resId)?.name || 'Quán ăn';
       const bestSellers = MENUS[resId].filter(m => m.bestSeller);
       bestSellers.forEach(item => {
           allBestSellers.push({
               ...item,
               restaurantId: resId,
               restaurantName: resName,
               reason: `Bán chạy nhất tại ${resName}`,
               icon: item.icon || '🔥'
           });
       });
    });
    return allBestSellers.sort(() => 0.5 - Math.random()).slice(0, 2);
  }, []);
  
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedRes, setSelectedRes] = useState(null);

  const [cart, setCart] = useState([]);
  
  // Trạng thái Bản đồ và Địa chỉ
  const [addressQuery, setAddressQuery] = useState('');
  const [addressOptions, setAddressOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const searchTimeoutRef = useRef(null);

  const [activeOrder, setActiveOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [trackingStep, setTrackingStep] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showCallUI, setShowCallUI] = useState(false);
  const [predictedTime, setPredictedTime] = useState(0);
  const [phoneInput, setPhoneInput] = useState(user?.phoneNumber || '');
  const [cartRestaurantId, setCartRestaurantId] = useState(null); // Khóa giỏ hàng theo quán
  const [isRaining, setIsRaining] = useState(false);             // Trạng thái thời tiết mưa
  const [isStorming, setIsStorming] = useState(false);           // Trạng thái bão sấm chớp
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [currentHoliday, setCurrentHoliday] = useState(HOLIDAYS[0]);
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState({ restRating: 5, restComment: '', shipperRating: 5, shipperTags: [] });

  const [currentBanner, setCurrentBanner] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [web3Account, setWeb3Account] = useState('');

  useEffect(() => {
    if (selectedLocation && cartRestaurantId) {
      let res = null;
      for (let cat in RESTAURANTS) {
        const found = RESTAURANTS[cat].find(r => r.id === cartRestaurantId);
        if (found) { res = found; break; }
      }
      if (res) {
        fetch(`https://router.project-osrm.org/route/v1/driving/${res.lng},${res.lat};${selectedLocation[1]},${selectedLocation[0]}?overview=false`)
          .then(r => r.json())
          .then(data => {
            if(data.routes && data.routes.length > 0) {
              setCurrentDistance(parseFloat((data.routes[0].distance / 1000).toFixed(2)));
            }
          }).catch(e => console.error(e));
      }
    } else {
      setCurrentDistance(0);
    }
  }, [selectedLocation, cartRestaurantId]);

  useEffect(() => {
    if (selectedLocation) {
        const fetchWeather = async () => {
            try {
                // DEMO THEO YÊU CẦU: Ép Quận 1 (Tọa độ HCM trung tâm) là Bão, nơi khác là Nắng
                const isDistrict1 = selectedLocation[0] >= 10.76 && selectedLocation[0] <= 10.80 && 
                                    selectedLocation[1] >= 106.68 && selectedLocation[1] <= 106.72;
                
                if (isDistrict1) {
                    setIsRaining(true);
                    setIsStorming(true);
                    return; // Dừng lại không gọi API để test Demo Bão Quận 1
                } else {
                    setIsRaining(false);
                    setIsStorming(false);
                    return; // Test Demo Nắng các Quận khác
                }
                
                /* MÃ GỐC TOMORROW.IO (Tạm ẩn để test Demo Quận 1 bão)
                const TOMORROW_API_KEY = "YOUR_TOMORROW_API_KEY";
                const tomorrowRes = await fetch(
                    `https://api.tomorrow.io/v4/weather/realtime?location=${selectedLocation[0]},${selectedLocation[1]}&apikey=${TOMORROW_API_KEY}&units=metric`,
                    { headers: { 'Accept': 'application/json' } }
                );
                const tomorrowData = await tomorrowRes.json();
                const weatherCode = tomorrowData?.data?.values?.weatherCode;
                const precipProb = tomorrowData?.data?.values?.precipitationProbability || 0;
                
                if ([8000, 4201, 4001, 4200].includes(weatherCode) || precipProb > 60) {
                    setIsRaining(true);
                    setIsStorming(weatherCode === 8000);
                } else {
                    setIsRaining(false);
                    setIsStorming(false);
                }
                */
            } catch (e) {
                console.warn("⚠️ Lỗi fetch Tomorrow.io", e);
            }
        };
        fetchWeather();
    }
  }, [selectedLocation]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentHoliday(HOLIDAYS[Math.floor(Math.random() * (HOLIDAYS.length - 1)) + 1]);
  }, []);

  // === BẢN ĐỒ LEAFLET ===
  const [leafletReady, setLeafletReady] = useState(false);
  
  const pickerMapRef = useRef(null);
  const pickerMarkerRef = useRef(null);

  const trackingMapRef = useRef(null);
  const trackingDriverRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLeafletReady(true);
      document.head.appendChild(script);
    } else {
      if (window.L) setLeafletReady(true);
    }
  }, []);

  // ================= 1. BẢN ĐỒ CHỌN ĐỊA CHỈ (PICKER MAP) =================
  useEffect(() => {
    if ((screen === 'CATEGORIES' || screen === 'RESTAURANTS' || screen === 'MENU') && leafletReady) {
      if (!pickerMapRef.current) {
        const container = document.getElementById('picker-map');
        if (!container) return;

        const L = window.L;
        const map = L.map('picker-map', { zoomControl: true }).setView([10.7769, 106.7009], 13); // TP.HCM
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

        const icon = L.divIcon({ html: '<i class="fa-solid fa-location-dot" style="font-size:36px; color:#e53935; text-shadow: 0 2px 5px rgba(0,0,0,0.5);"></i>', className: 'custom-icon', iconSize: [36, 36], iconAnchor: [18, 36] });

        // Cho phép click vào bản đồ để lấy tọa độ thật
        map.on('click', async (e) => {
           const { lat, lng } = e.latlng;
           setSelectedLocation([lat, lng]);
           
           if (pickerMarkerRef.current) map.removeLayer(pickerMarkerRef.current);
           pickerMarkerRef.current = L.marker([lat, lng], { icon }).addTo(map);
           map.panTo([lat, lng]);

           // Dịch ngược Tọa độ ra Số nhà, Tên đường (Reverse Geocoding)
           try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
              const data = await res.json();
              if(data && data.display_name) {
                 setAddressQuery(data.display_name);
              }
           } catch(err) {}
        });

        pickerMapRef.current = map;
      }
    }
    return () => {
      if (screen === 'TRACKING' || screen === 'HISTORY') {
         if (pickerMapRef.current) {
             pickerMapRef.current.remove();
             pickerMapRef.current = null;
         }
      }
    };
  }, [screen, leafletReady]);

  const handleSearchAddress = (text) => {
    setAddressQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if(text.length < 5) return;
    
    // Gợi ý địa chỉ (Autocomplete) giới hạn ở TP.HCM
    searchTimeoutRef.current = setTimeout(async () => {
       try {
           const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}, Hồ Chí Minh, Việt Nam&format=json&limit=5`);
           const data = await res.json();
           setAddressOptions(data);
       } catch(e) {}
    }, 600);
  };

  // ================= 2. BẢN ĐỒ TRACKING TÀI XẾ (TRACKING MAP) =================
  const lerp = (start, end, t) => start * (1 - t) + end * t;

  useEffect(() => {
    if (screen === 'TRACKING' && leafletReady && activeOrder) {
      const L = window.L;
      const homeLatLng = activeOrder.userLatLng;
      const routePath = activeOrder.path;

      if (!trackingMapRef.current) {
        const container = document.getElementById('tracking-map-container');
        if (!container) return;
        
        const map = L.map('tracking-map-container', { zoomControl: false }).setView(activeOrder.storeLatlng, 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

        const storeIcon = L.divIcon({ html: '<i class="fa-solid fa-store" style="font-size:24px; color:#ff9800; background:white; padding:4px; border-radius:50%; border: 2px solid #ff9800;"></i>', className: 'custom-icon', iconSize: [36, 36], iconAnchor: [18, 18] });
        const homeIcon = L.divIcon({ html: '<i class="fa-solid fa-house-chimney" style="font-size:24px; color:#4caf50; background:white; padding:4px; border-radius:50%; border: 2px solid #4caf50;"></i>', className: 'custom-icon', iconSize: [36, 36], iconAnchor: [18, 18] });
        const driverIcon = L.divIcon({ html: '<i class="fa-solid fa-motorcycle" style="font-size:30px; color:#f44336; background:white; padding:6px; border-radius:50%; box-shadow:0 0 10px rgba(244,67,54,0.8); border: 2px solid #f44336;"></i>', className: 'custom-icon', iconSize: [44, 44], iconAnchor: [22, 22] });

        L.marker(activeOrder.storeLatlng, {icon: storeIcon}).addTo(map).bindPopup(activeOrder.restaurantName || 'Nhà hàng').openPopup();
        L.marker(homeLatLng, {icon: homeIcon}).addTo(map).bindPopup('Địa chỉ của bạn');

        // Vẽ đường phố thật bằng dữ liệu OSRM
        L.polyline(routePath, {color: '#2196f3', weight: 6, opacity: 0.7}).addTo(map);

        const driver = L.marker(activeOrder.storeLatlng, {icon: driverIcon}).addTo(map); // Điểm bắt đầu
        
        // Căn chỉnh camera vừa vặn cả quán và nhà
        map.fitBounds([activeOrder.storeLatlng, homeLatLng], { padding: [50, 50] });

        trackingMapRef.current = map;
        trackingDriverRef.current = driver;
      }

      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      if (trackingStep === 1) { 
         trackingDriverRef.current.setLatLng(activeOrder.storeLatlng);
      } else if (trackingStep === 2 || trackingStep === 3) { 
         trackingDriverRef.current.setLatLng(activeOrder.storeLatlng);
      } else if (trackingStep === 4) { 
         // CHẠY ANIMATION CHUẨN TRÊN TUYẾN ĐƯỜNG OSRM (15 giây)
         let startTime = Date.now();
         const duration = 15000; 

         const animateDriver = () => {
             let elapsed = Date.now() - startTime;
             let progress = Math.min(elapsed / duration, 1.0);
             
             const totalSegments = routePath.length - 1;
             const scaledProgress = progress * totalSegments;
             const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
             const segmentProgress = scaledProgress - segmentIndex;
             
             const p1 = routePath[segmentIndex];
             const p2 = routePath[segmentIndex + 1];
             
             if(p1 && p2) {
                 const currentLat = lerp(p1[0], p2[0], segmentProgress);
                 const currentLng = lerp(p1[1], p2[1], segmentProgress);
                 
                 if (trackingDriverRef.current) {
                     trackingDriverRef.current.setLatLng([currentLat, currentLng]);
                     // Tự động xoay camera chạy theo xe
                     trackingMapRef.current.panTo([currentLat, currentLng], { animate: true, duration: 0.1 });
                 }
             }
             
             if (progress < 1.0) {
                 animationRef.current = requestAnimationFrame(animateDriver);
             }
         };
         animateDriver();
      } else if (trackingStep === 5) { 
         trackingDriverRef.current.setLatLng(homeLatLng);
         trackingMapRef.current.setView(homeLatLng, 17);
      }
    }
    
    return () => {
      if (screen !== 'TRACKING' && trackingMapRef.current) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        trackingMapRef.current.remove();
        trackingMapRef.current = null;
      }
    };
  }, [screen, leafletReady, trackingStep, activeOrder]);

  // ================= 3. LOGIC GIỎ HÀNG VÀ THANH TOÁN =================

  const addToCart = (item) => {
    // Kiểm tra khóa quán: chỉ cho phép 1 quán trong 1 đơn
    const itemRestId = item.restaurantId || null;
    if (itemRestId && cartRestaurantId && itemRestId !== cartRestaurantId) {
      alert('Bạn chỉ có thể đặt món từ 1 quán trong mỗi đơn hàng!\nVui lòng xóa giỏ hàng hiện tại rồi chọn quán khác.');
      return;
    }
    if (itemRestId && !cartRestaurantId) setCartRestaurantId(itemRestId);
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      const next = existing.qty > 1 ? prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i) : prev.filter(i => i.id !== id);
      if (next.length === 0) setCartRestaurantId(null);
      return next;
    });
  };

  const itemsTotal = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const willRain = isRaining; // Lấy dữ liệu Mưa trực tiếp từ API Tomorrow.io thay vì quy luật giả lập
  
  // Tính phí ship theo khoảng cách
  let dynamicShippingFee = 10000; // < 2km
  if (currentDistance > 2 && currentDistance <= 5) dynamicShippingFee = 15000;
  else if (currentDistance > 5) dynamicShippingFee = 20000;

  const baseShippingFee = dynamicShippingFee + (willRain ? 10000 : 0);
  const shippingDiscount = appliedVoucher ? baseShippingFee * appliedVoucher.discount : 0;
  const shippingFee = baseShippingFee - shippingDiscount;
  const totalPrice = itemsTotal + shippingFee;

  const handleApplyVoucher = () => {
     const code = voucherCode.toUpperCase().trim();
     if (!code) return;
     if (VALID_VOUCHERS[code]) {
        setAppliedVoucher({ code, discount: VALID_VOUCHERS[code] });
        alert(`🎉 Áp dụng thành công mã ${code}: Giảm ${VALID_VOUCHERS[code] * 100}% phí ship!`);
     } else {
        alert("❌ Mã voucher không hợp lệ hoặc đã hết hạn!");
        setAppliedVoucher(null);
     }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Vui lòng chọn món!");
    if (!selectedLocation || !addressQuery.trim()) return alert("Vui lòng gõ địa chỉ hoặc chọn trực tiếp trên Bản Đồ để có Tọa độ chính xác!");
    if (!phoneInput.trim()) return alert("Vui lòng nhập số điện thoại để tài xế liên hệ!");

    // Tọa độ thật của quán đã chọn
    const storeLatlng = selectedRes ? [selectedRes.lat, selectedRes.lng] : [10.7766, 106.7031];

    // TÍNH TOÁN QUÃNG ĐƯỜNG BẰNG OSRM ROUTING API (ĐƯỜNG GIAO THÔNG THẬT)
    let pathCoords = [storeLatlng, selectedLocation];
    let distanceKm = currentDistance || 5;
    let trafficMultiplier = 1.0;

    // 1. TÍCH HỢP DỮ LIỆU TỪ GOOGLE MAPS API (Khoảng cách & Hệ số kẹt xe)
    try {
        const GOOGLE_MAPS_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Cần điền key thật
        const gmapRes = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${storeLatlng[0]},${storeLatlng[1]}&destination=${selectedLocation[0]},${selectedLocation[1]}&departure_time=now&key=${GOOGLE_MAPS_KEY}`);
        const gmapData = await gmapRes.json();
        if (gmapData.routes && gmapData.routes.length > 0) {
            const leg = gmapData.routes[0].legs[0];
            distanceKm = parseFloat((leg.distance.value / 1000).toFixed(2));
            const durNormal = leg.duration.value;
            const durTraffic = leg.duration_in_traffic ? leg.duration_in_traffic.value : durNormal;
            trafficMultiplier = parseFloat((durTraffic / durNormal).toFixed(2));
        } else {
            throw new Error("Không có route Google Maps");
        }
    } catch(err) {
        console.warn("⚠️ Không lấy được data Google Maps, fallback dùng OSRM.");
        try {
            const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${storeLatlng[1]},${storeLatlng[0]};${selectedLocation[1]},${selectedLocation[0]}?overview=full&geometries=geojson`);
            const data = await res.json();
            if(data.routes && data.routes.length > 0) {
                pathCoords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                distanceKm = parseFloat((data.routes[0].distance / 1000).toFixed(2));
            }
        } catch(e) {}
    }

    if (distanceKm > 7) {
        return alert(`Xin lỗi, khoảng cách giao hàng là ${distanceKm}km (vượt quá giới hạn 7km). Vui lòng chọn quán khác gần hơn!`);
    }

    // 2. TÍCH HỢP DỮ LIỆU NASA API (Lấy lượng mưa từ vệ tinh)
    let nasaRain = false;
    try {
        const d = new Date();
        const dateStr = d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
        const nasaRes = await fetch(`https://power.larc.nasa.gov/api/temporal/hourly/point?parameters=PRECTOTCORR&community=RE&longitude=${selectedLocation[1]}&latitude=${selectedLocation[0]}&start=${dateStr}&end=${dateStr}&format=JSON`);
        const nasaData = await nasaRes.json();
        if (nasaData?.properties?.parameter?.PRECTOTCORR) {
            const rainData = nasaData.properties.parameter.PRECTOTCORR[`${dateStr}${String(d.getHours()).padStart(2,'0')}`];
            if (rainData > 0.5) nasaRain = true;
        }
    } catch(e) {
        console.warn("⚠️ Không kết nối được vệ tinh NASA.");
    }

    // 3. XÁC ĐỊNH THỜI TIẾT (Đã lấy realtime từ API Tomorrow.io ở useEffect)
    let weatherStr = isRaining ? 'heavy_rain' : 'sunny';
    if (nasaRain && !isRaining) weatherStr = 'light_rain'; // Fallback nếu NASA báo mưa mà Tomorrow chưa cập nhật kịp

    const rainOrder = isRaining || nasaRain;
    
    // Tính lại phí ship chính xác dựa trên distanceKm thật
    let finalBaseShip = 10000;
    if (distanceKm > 2 && distanceKm <= 5) finalBaseShip = 15000;
    else if (distanceKm > 5) finalBaseShip = 20000;
    
    let finalFee = finalBaseShip + (rainOrder ? 10000 : 0);
    if (appliedVoucher) finalFee -= finalFee * appliedVoucher.discount;
    const currentShipFee = finalFee;

    // 4. GỌI ML SERVICE (AI DỰ ĐOÁN ETA DỰA TRÊN 4 THUỘC TÍNH NÀY)
    let predictedETA = Math.floor(Math.random() * 8) + 12;
    try {
        const hourOfDay = new Date().getHours();
        const mlRes = await fetch('http://localhost:5001/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                distance_km: distanceKm, 
                weather: weatherStr, 
                hour_of_day: hourOfDay,
                traffic_multiplier: trafficMultiplier 
            })
        });
        const mlData = await mlRes.json();
        if (mlData.success && mlData.eta_minutes) {
            predictedETA = mlData.eta_minutes;
        }
    } catch(mlErr) {
        console.warn('⚠️ ML Service offline, dùng ETA ước tính:', predictedETA, 'phút');
    }

    setPredictedTime(predictedETA);

    const orderId = "ICHI-" + Math.floor(1000 + Math.random() * 9000);
    const orderDate = new Date().toLocaleString('vi-VN');

    const orderData = {
      id: orderId, date: orderDate,
      itemsTotal, shippingFee: currentShipFee, total: itemsTotal + currentShipFee,
      address: addressQuery, items: [...cart],
      phone: phoneInput.trim(),
      customerName: user?.fullName || 'Khách hàng', paymentMethod: paymentMethod === 'WEB3' && web3Account ? `Ví Web3 (${web3Account.substring(0,6)}...${web3Account.substring(web3Account.length-4)})` : 'Tiền mặt (COD)',
      eta: predictedETA, status: 'Đang giao', shipper: generateRandomShipper(),
      appliedVoucher: appliedVoucher,
      path: pathCoords, userLatLng: selectedLocation,
      storeLatlng, isRaining: rainOrder, isStorming: isStorming,
      restaurantId: selectedRes?.id || 'r1',
      restaurantName: selectedRes?.name || '', restaurantAddress: selectedRes?.address || ''
    };

    // 🚀 LƯU ĐƠN HÀNG XUỐNG MONGODB THEO JSON SCHEMA
    const dbOrderPayload = {
      orderCode: orderId,
      customerId: user?.id || "GUEST",
      restaurantId: selectedRes?.id || "r1",
      driverId: null,
      status: "FINDING_DRIVER",
      orderItems: cart.map(item => ({
        itemId: item.id,
        name: item.name,
        quantity: item.qty,
        unitPrice: item.price,
        totalPrice: item.price * item.qty,
        specialInstructions: ""
      })),
      locationDetails: {
        pickup: {
          address: selectedRes?.address || "Nhà hàng",
          lat: storeLatlng[0] || 10.776,
          lng: storeLatlng[1] || 106.700
        },
        dropoff: {
          address: addressQuery || "Khách hàng",
          lat: selectedLocation[0],
          lng: selectedLocation[1]
        }
      },
      payment: {
        method: paymentMethod === 'WEB3' ? 'WEB3_CRYPTO' : 'COD',
        subtotal: itemsTotal,
        deliveryFee: currentShipFee,
        discount: appliedVoucher ? (itemsTotal * appliedVoucher.discount) : 0,
        total: itemsTotal + currentShipFee,
        status: "UNPAID",
        web3TxHash: paymentMethod === 'WEB3' ? web3Account : ""
      },
      weatherAtDropoff: {
        condition: weatherStr,
        precipitationProbability: isRaining ? 100 : 0
      },
      etaDetails: {
        predictedMinutes: predictedETA,
        mlConfidence: 0.9,
        distanceKm: distanceKm,
        trafficMultiplier: trafficMultiplier || 1.0
      }
    };

    try {
        const response = await fetch('http://localhost:5000/api/orders/guest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbOrderPayload)
        });
        const resData = await response.json();
        if (resData.success) {
             orderData.mongoId = resData.data._id; // Gắn ID MongoDB vào để lát update status
             console.log("✅ MCP: Đã lưu đơn xuống MongoDB thành công!", resData.data);
        }
    } catch(err) {
        console.error("❌ MCP Lỗi lưu DB:", err);
    }

    setActiveOrder(orderData);
    setCart([]);
    setCartRestaurantId(null);
    setVoucherCode('');
    setAppliedVoucher(null);
    startTrackingSimulation();
  };


  const startTrackingSimulation = () => {
    setScreen('TRACKING');
    setTrackingStep(0);
    setUnreadCount(1);
    setShowCallUI(false);

    setTimeout(() => { setTrackingStep(1); setUnreadCount(2); }, 3000);   
    setTimeout(() => { setTrackingStep(2); setUnreadCount(3); }, 6000);   
    setTimeout(() => { setTrackingStep(3); setUnreadCount(4); }, 9000);   
    setTimeout(() => { setTrackingStep(4); setUnreadCount(5); }, 12000);  
    setTimeout(() => { setTrackingStep(5); setUnreadCount(6); }, 27000);  
    
    // TÀI XẾ ĐỢI 7 GIÂY RỒI MỚI GỌI
    setTimeout(() => { setShowCallUI(true); }, 34000);
  };

  const completeOrder = async (isSuccess) => {
    setShowCallUI(false);
    
    // Cập nhật trạng thái xuống MongoDB
    const newStatus = isSuccess ? 'DELIVERED' : 'FAILED_DELIVERY';
    if (activeOrder?.mongoId) {
        try {
            await fetch(`http://localhost:5000/api/orders/guest/${activeOrder.mongoId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            console.log(`✅ MCP: Cập nhật MongoDB status -> ${newStatus}`);
        } catch(e) {
            console.error("❌ MCP Lỗi cập nhật status DB:", e);
        }
    }

    if (!isSuccess) {
        const finishedOrder = { ...activeOrder, status: 'Chưa nhận được hàng (Khiếu nại)' };
        setOrderHistory([finishedOrder, ...orderHistory]);
        setActiveOrder(null);
        setScreen('HISTORY'); 
        alert("Rất xin lỗi bạn về trải nghiệm không tốt! CSKH Ichi sẽ liên hệ lại ngay để giải quyết khiếu nại.");
        return;
    }
    setShowReview(true);
  };

  const submitReview = () => {
    const newReview = {
       user: user?.fullName || 'Khách hàng',
       rating: reviewData.restRating,
       comment: reviewData.restComment,
       tags: []
    };
    if (reviewData.restComment.trim() !== '') {
       setReviews(prev => ({
          ...prev,
          [activeOrder.restaurantId]: [newReview, ...(prev[activeOrder.restaurantId] || [])]
       }));
    }

    const finishedOrder = { ...activeOrder, status: 'Đã nhận hàng thành công', review: reviewData };
    setOrderHistory([finishedOrder, ...orderHistory]);
    setActiveOrder(null);
    setShowReview(false);
    setReviewData({ restRating: 5, restComment: '', shipperRating: 5, shipperTags: [] });
    setScreen('HISTORY');
    alert("Cảm ơn bạn đã đánh giá!");
  };

  const currentShipper = activeOrder?.shipper || { name: 'Tài xế', age: 25, rating: 5.0 };
  const TRACKING_STEPS = [
    { label: 'Đang tìm tài xế phù hợp', desc: 'Đang quét các tài xế gần bạn để ghép tuyến đường nhanh nhất...' },
    { label: `Tài xế ${currentShipper.name} đã nhận đơn`, desc: `Tài xế xuất sắc: ${currentShipper.name} - ${currentShipper.age} tuổi - Đánh giá: ${currentShipper.rating}⭐` },
    { label: 'Đang lấy đơn', desc: 'Tài xế đang có mặt tại nhà hàng để lấy món.' },
    { label: 'Đã lấy đơn', desc: 'Tài xế đã lấy món thành công và cất vào túi giữ nhiệt.' },
    { label: 'Đang giao hàng đến bạn', desc: `Tài xế đang di chuyển trên hệ thống đường phố GPS. ETA: ${predictedTime} phút!` },
    { label: 'Đã giao hàng thành công', desc: 'Tài xế đã ở trước nhà. Chờ tài xế gọi điện thoại!' }
  ];

  const renderHolidayEffect = () => {
    if (!currentHoliday || currentHoliday.id === 'NORMAL') return null;
    return (
      <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ 
           width: '35vw', height: '100%', 
           backgroundImage: `url(${currentHoliday.bg})`, backgroundSize: 'cover',
           animation: 'panBg 25s linear infinite alternate',
           WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
           opacity: 0.8
        }} />
        <Box sx={{ 
           width: '35vw', height: '100%', 
           backgroundImage: `url(${currentHoliday.bg})`, backgroundSize: 'cover',
           animation: 'panBg 25s linear infinite alternate-reverse',
           WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
           opacity: 0.8
        }} />
      </Box>
    );
  };

  const renderReviewModal = () => (
    <Dialog open={showReview} PaperProps={{ sx: { borderRadius: 4, width: '500px', p: 3, maxWidth: '90vw' } }}>
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>Đánh Giá Đơn Hàng</Typography>
      <Box mb={3}>
         <Typography fontWeight="bold">Đánh giá quán {activeOrder?.restaurantName}</Typography>
         <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
           {[1,2,3,4,5].map(star => <i key={star} onClick={() => setReviewData({...reviewData, restRating: star})} className={`fa-star ${star <= reviewData.restRating ? 'fa-solid' : 'fa-regular'}`} style={{ color: '#ff9800', cursor: 'pointer', fontSize: '24px' }}></i>)}
         </Box>
         <TextField fullWidth multiline rows={2} placeholder="Nhận xét của bạn về quán (khen/chê)..." value={reviewData.restComment} onChange={e => setReviewData({...reviewData, restComment: e.target.value})} />
      </Box>
      <Divider />
      <Box mt={3} mb={3}>
         <Typography fontWeight="bold">Đánh giá tài xế {activeOrder?.shipper?.name}</Typography>
         <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
           {[1,2,3,4,5].map(star => <i key={star} onClick={() => setReviewData({...reviewData, shipperRating: star})} className={`fa-star ${star <= reviewData.shipperRating ? 'fa-solid' : 'fa-regular'}`} style={{ color: '#ff9800', cursor: 'pointer', fontSize: '24px' }}></i>)}
         </Box>
         <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            {['Chuyên nghiệp', 'Thân thiện', 'Nhanh nhẹn', 'Sạch sẽ'].map(tag => (
              <Chip key={tag} label={tag} onClick={() => {
                 const newTags = reviewData.shipperTags.includes(tag) ? reviewData.shipperTags.filter(t => t !== tag) : [...reviewData.shipperTags, tag];
                 setReviewData({...reviewData, shipperTags: newTags});
              }} color={reviewData.shipperTags.includes(tag) ? 'primary' : 'default'} />
            ))}
         </Box>
      </Box>
      <Button variant="contained" fullWidth onClick={submitReview}>Gửi Đánh Giá</Button>
    </Dialog>
  );

  // ====================== RENDER MÀN HÌNH ======================
  const renderCategories = () => (
    <Box>
      <Box mb={4} sx={{ position: 'relative', height: '250px', borderRadius: 4, overflow: 'hidden', boxShadow: 3 }}>
        {BANNERS.map((banner, idx) => (
           <Fade in={currentBanner === idx} timeout={1000} key={banner.id}>
             <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: currentBanner === idx ? 'block' : 'none', backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(${banner.img})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', p: 4 }}>
               <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                 <Typography variant="h3" fontWeight="bold" mb={1} sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{banner.title}</Typography>
                 <Typography variant="h6" sx={{ maxWidth: '60%', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{banner.desc}</Typography>
               </Box>
             </Box>
           </Fade>
        ))}
        <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
          {BANNERS.map((_, idx) => (
             <Box key={idx} sx={{ width: currentBanner === idx ? 20 : 10, height: 10, borderRadius: 5, bgcolor: currentBanner === idx ? '#fff' : 'rgba(255,255,255,0.5)', transition: '0.3s', cursor: 'pointer' }} onClick={() => setCurrentBanner(idx)} />
          ))}
        </Box>
      </Box>

      <Box mb={4}>
        <Typography variant="h5" fontWeight="bold" mb={2} color="#009688">Dành Riêng Cho Bạn Hôm Nay</Typography>
        <Grid container spacing={2}>
          {smartSuggestions.map(item => (
            <Grid item xs={12} sm={6} key={item.id + '_' + item.restaurantId}>
               <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: 0, border: '2px solid #8D6E63', transition: '0.3s', '&:hover': { transform: 'translateY(-3px)' }, boxShadow: 'none' }}>
                 <CardContent>
                   <Typography variant="body1" color="secondary" mb={1}>{item.reason}</Typography>
                   <Typography variant="body1" fontWeight="bold">{item.name}</Typography>
                   <Typography variant="body1" color="#00796b" mt={1}>{item.price.toLocaleString('vi-VN')} VNĐ</Typography>
                   <Button variant="contained" size="small" sx={{ mt: 2, bgcolor: '#00796b', borderRadius: 0, fontSize: '1rem', textTransform: 'none' }} onClick={() => addToCart({ ...item })}>+ Thêm</Button>
                 </CardContent>
               </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography variant="h5" fontWeight="bold" mb={2}>Thư Viện Ẩm Thực</Typography>
      <Grid container spacing={3}>
        {CATEGORIES.map((cat, idx) => (
          <Grid item xs={12} key={cat.id}>
            <Zoom in={true} style={{ transitionDelay: `${idx * 100}ms` }}>
              <Box onClick={() => { setSelectedCat(cat); setScreen('RESTAURANTS'); }} sx={{ height: '180px', backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url(${cat.bg})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 4, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer', color: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', transition: '0.3s', '&:hover': { transform: 'scale(1.02)', boxShadow: '0 12px 24px rgba(0,0,0,0.3)' } }}>
                <Typography variant="h3" fontWeight="bold" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{cat.name}</Typography>
                <Typography variant="h6" sx={{ color: '#eee' }}>{cat.desc}</Typography>
              </Box>
            </Zoom>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderRestaurants = () => (
    <Box>
      <Button onClick={() => setScreen('CATEGORIES')} sx={{ mb: 2, fontWeight: 'bold' }}>&larr; Trở về</Button>
      <Typography variant="h5" mb={3} fontWeight="bold">Kết quả: {selectedCat?.name}</Typography>
      <Grid container spacing={3}>
        {RESTAURANTS[selectedCat?.id].map(res => (
          <Grid item xs={12} key={res.id}>
            <Slide direction="left" in={true}>
              <Card onClick={() => { setSelectedRes(res); setScreen('MENU'); }} sx={{ borderRadius: 4, cursor: 'pointer', border: '1px solid #eee', transition: '0.2s', '&:hover': { boxShadow: 4, borderColor: '#8D6E63' } }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ fontSize: '3rem', mr: 3 }}>{selectedCat?.icon}</Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{res.name}</Typography>
                    <Typography variant="body2" color="secondary">⭐ {res.rating} - Vị trí: {res.address}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderMenu = () => (
    <Box>
      <Button onClick={() => setScreen('RESTAURANTS')} sx={{ mb: 2, fontWeight: 'bold' }}>&larr; Trở về</Button>
      <Typography variant="h4" mb={1} fontWeight="bold" color="#3E2723">{selectedRes?.name}</Typography>
      <Typography variant="body1" color="secondary" mb={3}>Menu được cập nhật mới nhất hôm nay.</Typography>
      
      <List sx={{ bgcolor: 'white', borderRadius: 4, p: 2, boxShadow: 1 }}>
        {MENUS[selectedRes?.id].map((item, idx) => (
          <React.Fragment key={item.id}>
            <ListItem sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '2.5rem', mr: 2 }}>{item.icon}</Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="h6" fontWeight="bold" mr={1}>{item.name}</Typography>
                    {item.bestSeller && <Chip label="Best Seller" color="error" size="small" />}
                  </Box>
                  <Typography variant="h6" color="#8D6E63">{item.price.toLocaleString('vi-VN')} VNĐ</Typography>
                </Box>
                <Button variant="outlined" sx={{ borderRadius: 8, fontWeight: 'bold' }} onClick={() => addToCart({ ...item, restaurantId: selectedRes?.id })}>Thêm</Button>
              </Box>
            </ListItem>
            {idx < MENUS[selectedRes?.id].length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" mb={2}>Đánh giá từ khách hàng</Typography>
        {reviews[selectedRes?.id] ? reviews[selectedRes?.id].map((rev, i) => (
          <Card key={i} sx={{ mb: 2, bgcolor: '#f5f5f5', borderRadius: 3 }} elevation={0}>
            <CardContent>
               <Typography fontWeight="bold">{rev.user}</Typography>
               <Box sx={{ color: '#ff9800', my: 0.5 }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5-rev.rating)}</Box>
               <Typography variant="body2">{rev.comment}</Typography>
               {rev.tags && rev.tags.map(t => <Chip key={t} label={t} size="small" sx={{ mr: 1, mt: 1 }} />)}
            </CardContent>
          </Card>
        )) : <Typography variant="body2" color="secondary">Chưa có đánh giá nào.</Typography>}
      </Box>
    </Box>
  );

  const renderTracking = () => (
    <Fade in={true}>
      <Box sx={{ bgcolor: 'white', borderRadius: 4, p: 4, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="#3E2723">Đơn Hàng: {activeOrder?.id}</Typography>
            <Typography variant="h6" color="#009688" mt={1}>
              <i className="fa-solid fa-clock"></i> Giao tới nơi trong khoảng: <b>{activeOrder?.eta} phút</b>.
            </Typography>
          </Box>
          <Button variant="outlined" sx={{ borderRadius: 6 }} onClick={() => setScreen('CATEGORIES')}>Về trang chủ</Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Stepper activeStep={trackingStep} orientation="vertical" sx={{ '& .MuiStepConnector-line': { minHeight: '25px', borderWidth: '3px' }, '& .MuiStepLabel-label.Mui-active': { fontWeight: 'bold', color: '#ff9800', fontSize: '1.1rem' }, '& .MuiStepLabel-label.Mui-completed': { fontWeight: 'bold', color: '#4caf50' } }}>
              {TRACKING_STEPS.map((step, index) => (
                <Step key={index}>
                  <StepLabel StepIconProps={{ style: { transform: 'scale(1.2)' } }}>{step.label}</StepLabel>
                  <StepContent><Typography sx={{ mb: 1, color: '#666', fontSize: '1rem' }}>{step.desc}</Typography></StepContent>
                </Step>
              ))}
            </Stepper>

            <Card elevation={0} sx={{ bgcolor: '#FDF8F5', border: '1px solid #D7CCC8', borderRadius: 4, mt: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">Chi Tiết Hóa Đơn</Typography>
                <Typography variant="body2" mt={1}><strong>Khách hàng:</strong> {activeOrder?.customerName}</Typography>
                <Typography variant="body2" mt={1}><strong>SĐT:</strong> {activeOrder?.phone}</Typography>
                <Typography variant="body2" mt={1}><strong>Địa chỉ:</strong> {activeOrder?.address}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" color="primary" fontWeight="bold">Tổng: {activeOrder?.total.toLocaleString('vi-VN')} VNĐ</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Typography variant="h6" fontWeight="bold" mb={2}>📍 Bản Đồ Giao Hàng Live</Typography>
            <Box sx={{ position: 'relative', width: '100%', height: '550px', borderRadius: 4, overflow: 'hidden', border: '3px solid #e0e0e0', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}>
              <Box id="tracking-map-container" sx={{ width: '100%', height: '100%' }}>
                {!leafletReady && (
                  <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" color="secondary"><i className="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu vệ tinh GPS...</Typography>
                  </Box>
                )}
              </Box>
              {activeOrder?.isStorming && <Box className="storm-overlay" />}
              {!activeOrder?.isStorming && activeOrder?.isRaining && <Box className="rain-overlay" />}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );

  const renderHistory = () => (
    <Slide direction="up" in={true}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="#3E2723">Lịch Sử Đặt Hàng</Typography>
          <Button variant="contained" sx={{ bgcolor: '#3E2723', borderRadius: 6 }} onClick={() => setScreen('CATEGORIES')}>Trở Về</Button>
        </Box>

        {orderHistory.length === 0 ? (
          <Card sx={{ p: 5, textAlign: 'center', borderRadius: 4, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" color="secondary">Bạn chưa có đơn hàng nào đã hoàn tất.</Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {orderHistory.map((order) => (
              <Grid item xs={12} key={order.id}>
                <Card sx={{ borderRadius: 4, borderLeft: order.status.includes('thành công') ? '6px solid #4caf50' : '6px solid #f44336', boxShadow: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" color="primary">{order.id}</Typography>
                        <Typography variant="body2" color="secondary"><i className="fa-regular fa-clock"></i> {order.date}</Typography>
                      </Box>
                      <Chip label={order.status} color={order.status.includes('thành công') ? "success" : "error"} variant="outlined" />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="secondary">Thông tin giao hàng</Typography>
                        <Typography variant="body1" fontWeight="bold">{order.customerName} - {order.phone}</Typography>
                        <Typography variant="body2">{order.address}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="secondary">Chi tiết món</Typography>
                        {order.items.map(item => <Typography variant="body2" key={item.id}>• {item.name} x {item.qty}</Typography>)}
                        <Typography variant="h6" color="#e53935" fontWeight="bold" mt={1}>Thành tiền: {order.total.toLocaleString('vi-VN')} VNĐ</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Slide>
  );

  return (
    <Container sx={{ mt: 4, mb: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
        <Button variant="text" color="primary" sx={{ fontWeight: 'bold' }} onClick={() => setScreen('HISTORY')}>
          <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '8px' }}></i> Lịch Sử
        </Button>
        {activeOrder && screen !== 'TRACKING' && (
          <Button variant="contained" color="secondary" sx={{ borderRadius: 8, px: 3, py: 1 }} onClick={() => setScreen('TRACKING')}>
            <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2, '& .MuiBadge-badge': { animation: 'pulse 1s infinite' } }}>
              <i className="fa-solid fa-bell"></i>
            </Badge> Xem Đơn Đang Giao
          </Button>
        )}
      </Box>

      {screen === 'TRACKING' && renderTracking()}
      {screen === 'HISTORY' && renderHistory()}
      
      {(screen === 'CATEGORIES' || screen === 'RESTAURANTS' || screen === 'MENU') && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            {screen === 'CATEGORIES' && renderCategories()}
            {screen === 'RESTAURANTS' && renderRestaurants()}
            {screen === 'MENU' && renderMenu()}
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: '20px' }}>
              <Card elevation={4} sx={{ borderRadius: 4, bgcolor: '#ffffff' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" mb={3} textAlign="center"><i className="fa-solid fa-cart-shopping"></i> Giỏ Hàng</Typography>
                  {cart.length === 0 ? (
                    <Typography variant="body2" color="secondary" textAlign="center" sx={{ my: 4 }}>Chưa có món nào. Bụng đang réo gọi kìa!</Typography>
                  ) : (
                    <List>
                      {cart.map((item, index) => (
                        <React.Fragment key={index}>
                          <ListItem disablePadding sx={{ py: 1.5 }}>
                            <ListItemText primary={item.name} secondary={`${item.price.toLocaleString('vi-VN')}đ x ${item.qty}`} primaryTypographyProps={{ fontWeight: 'bold' }} />
                            <ListItemSecondaryAction>
                              <IconButton edge="end" onClick={() => removeFromCart(item.id)}>
                                <i className="fa-solid fa-circle-minus" style={{ fontSize: '20px', color: '#e53935' }}></i>
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                  <Box sx={{ mt: 2, mb: 2, display: 'flex', border: '1px solid #c4c4c4', borderRadius: 1, overflow: 'hidden' }}>
                    <TextField 
                      fullWidth size="small" placeholder="Mã voucher (VD: ICHI50, ICHI70)" 
                      variant="standard" 
                      InputProps={{ disableUnderline: true, sx: { px: 2, py: 1 } }}
                      value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} disabled={cart.length === 0}
                    />
                    <Button variant="contained" color="secondary" disableElevation sx={{ borderRadius: 0, px: 3 }} onClick={handleApplyVoucher} disabled={cart.length === 0}>Áp dụng</Button>
                  </Box>
                  {appliedVoucher && <Typography variant="caption" color="success.main" fontWeight="bold">Đã áp dụng mã: {appliedVoucher.code} (-{appliedVoucher.discount * 100}% phí ship)</Typography>}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="body1">Tạm tính:</Typography>
                    <Typography variant="body1">{itemsTotal.toLocaleString('vi-VN')}đ</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, color: willRain ? '#f44336' : 'inherit' }}>
                    <Typography variant="body1">Phí ship {willRain && '(Trời mưa +10k)'}:</Typography>
                    <Typography variant="body1">{baseShippingFee.toLocaleString('vi-VN')}đ</Typography>
                  </Box>
                  {appliedVoucher && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 1, color: '#4caf50', fontWeight: 'bold' }}>
                      <Typography variant="body1">Giảm phí ship:</Typography>
                      <Typography variant="body1">-{shippingDiscount.toLocaleString('vi-VN')}đ</Typography>
                    </Box>
                  )}
                  <Box mb={2} />
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 3 }}>
                    <Typography variant="h6">Tổng cộng:</Typography>
                    <Typography variant="h4" color="primary" fontWeight="bold">{totalPrice.toLocaleString('vi-VN')}đ</Typography>
                  </Box>
                  <TextField fullWidth label="Số điện thoại" variant="outlined" margin="normal" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} sx={{ bgcolor: '#fff' }} placeholder="Nhập số điện thoại liên hệ..." />
                  
                  {/* BẢN ĐỒ CHỌN ĐỊA CHỈ & AUTOCOMPLETE */}
                  <Typography variant="subtitle2" mt={2} mb={1} fontWeight="bold">Chọn địa chỉ giao hàng (Click trên bản đồ):</Typography>
                  <Box id="picker-map" sx={{ width: '100%', height: '200px', borderRadius: 2, border: '1px solid #ccc', mb: 2, zIndex: 1 }}></Box>
                  
                  <Autocomplete
                    freeSolo
                    options={addressOptions}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option.display_name}
                    inputValue={addressQuery}
                    onInputChange={(e, val) => handleSearchAddress(val)}
                    onChange={(e, newValue) => {
                       if(newValue && newValue.lat) {
                           const lat = parseFloat(newValue.lat);
                           const lng = parseFloat(newValue.lon);
                           setSelectedLocation([lat, lng]);
                           setAddressQuery(newValue.display_name);
                           
                           if(pickerMapRef.current) {
                               pickerMapRef.current.setView([lat, lng], 16);
                               const L = window.L;
                               if (pickerMarkerRef.current) pickerMapRef.current.removeLayer(pickerMarkerRef.current);
                               pickerMarkerRef.current = L.marker([lat, lng], { 
                                  icon: L.divIcon({ html: '<i class="fa-solid fa-location-dot" style="font-size:36px; color:#e53935; text-shadow: 0 2px 5px rgba(0,0,0,0.5);"></i>', className: 'custom-icon', iconSize: [36, 36], iconAnchor: [18, 36] }) 
                               }).addTo(pickerMapRef.current);
                           }
                       }
                    }}
                    renderInput={(params) => <TextField {...params} label="Gõ tìm kiếm địa chỉ ở TP.HCM..." variant="outlined" />}
                  />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, p: 2, bgcolor: '#f9f5f3', borderRadius: 2, border: '1px dashed #8D6E63' }}>
                    <Typography variant="body2" fontWeight="bold" color="secondary">Phương thức thanh toán:</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant={paymentMethod === 'COD' ? 'contained' : 'outlined'} color="primary" onClick={() => setPaymentMethod('COD')}>Tiền mặt (COD)</Button>
                      <Button variant={paymentMethod === 'WEB3' ? 'contained' : 'outlined'} color="warning" onClick={async () => {
                         if (window.ethereum) {
                           try {
                             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                             if (accounts && accounts.length > 0) {
                               setWeb3Account(accounts[0]);
                               setPaymentMethod('WEB3');
                               alert("Kết nối ví MetaMask thành công!");
                             }
                           } catch(e) { alert("Kết nối bị từ chối."); }
                         } else { alert("Vui lòng cài đặt tiện ích MetaMask trên trình duyệt (Chrome/Edge/Brave)!"); }
                      }}>Ví Web3 MetaMask</Button>
                    </Box>
                    {paymentMethod === 'WEB3' && web3Account && (
                       <Typography variant="body2" sx={{ mt: 1, color: '#2e7d32', fontWeight: 'bold' }}>
                          <i className="fa-brands fa-ethereum"></i> Đã kết nối ví: {web3Account.substring(0, 6)}...{web3Account.substring(web3Account.length - 4)}
                       </Typography>
                    )}
                  </Box>

                  <Button variant="contained" color="primary" fullWidth size="large" sx={{ mt: 3, py: 1.5, borderRadius: 3, fontSize: '1.2rem', textTransform: 'uppercase' }} onClick={handleCheckout}>
                    Đặt Hàng Ngay
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* GIAO DIỆN CUỘC GỌI KHI SHIPPER ĐẾN NƠI */}
      <Dialog open={showCallUI} PaperProps={{ sx: { borderRadius: 6, width: '380px', textAlign: 'center', bgcolor: '#222' } }}>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ mb: 4, mt: 2 }}>
            <Typography variant="body2" color="rgba(255,255,255,0.6)" mb={1}>Đang gọi đến...</Typography>
            <Typography variant="h4" color="white" fontWeight="bold">{activeOrder?.shipper?.name}</Typography>
            <Typography variant="body2" color="#4caf50" mt={1}>Tài xế Ichi - {activeOrder?.shipper?.rating}⭐</Typography>
            <Typography variant="body2" color="white" mt={2}>"Alo anh/chị ơi, em giao tới nơi rồi ạ!"</Typography>
          </Box>
          <Box sx={{ width: 120, height: 120, borderRadius: '50%', bgcolor: '#4caf50', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)', animation: 'pulse-green 1.5s infinite', mb: 5 }}>
            <i className={`fa-solid ${activeOrder?.shipper?.avatar}`} style={{ fontSize: '3rem', color: 'white' }}></i>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button variant="contained" color="success" size="large" sx={{ borderRadius: 8, py: 1.5, fontWeight: 'bold' }} onClick={() => completeOrder(true)}>
              <i className="fa-solid fa-check-circle" style={{ marginRight: '8px' }}></i> Đã nhận hàng
            </Button>
            <Button variant="outlined" color="error" size="large" sx={{ borderRadius: 8, py: 1.5, fontWeight: 'bold', borderWidth: '2px' }} onClick={() => completeOrder(false)}>
              <i className="fa-solid fa-circle-xmark" style={{ marginRight: '8px' }}></i> Chưa nhận hàng
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      
      {renderHolidayEffect()}
      {renderReviewModal()}

      <style>{`
        @keyframes panBg {
          0% { background-position: 0% 50%; transform: scale(1.0); }
          100% { background-position: 100% 50%; transform: scale(1.15); }
        }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes pulse-green { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(76, 175, 80, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); } }
        .leaflet-container { z-index: 1 !important; }
        .rain-overlay {
           position: absolute; top: 0; left: 0; width: 100%; height: 100%;
           pointer-events: none; z-index: 999;
           background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><line x1='10' y1='0' x2='5' y2='15' stroke='rgba(255,255,255,0.7)' stroke-width='1.5' stroke-dasharray='10, 15'/><line x1='35' y1='25' x2='30' y2='40' stroke='rgba(255,255,255,0.7)' stroke-width='1.5' stroke-dasharray='10, 15'/></svg>");
           background-color: rgba(0,0,0,0.25);
           animation: rainFall 0.4s linear infinite;
        }
        .storm-overlay {
           position: absolute; top: 0; left: 0; width: 100%; height: 100%;
           pointer-events: none; z-index: 999;
           background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><line x1='10' y1='0' x2='5' y2='15' stroke='rgba(255,255,255,0.9)' stroke-width='2' stroke-dasharray='15, 20'/><line x1='35' y1='25' x2='30' y2='40' stroke='rgba(255,255,255,0.9)' stroke-width='2' stroke-dasharray='15, 20'/></svg>");
           background-color: rgba(0,0,50,0.5);
           animation: rainFall 0.2s linear infinite, lightning 5s infinite;
        }
        @keyframes rainFall { 0% { background-position: 0 0; } 100% { background-position: -25px 50px; } }
        @keyframes lightning {
            0%, 9% { background-color: rgba(0,0,50,0.5); }
            10% { background-color: rgba(255,255,255,0.9); }
            11%, 14% { background-color: rgba(0,0,50,0.5); }
            15% { background-color: rgba(255,255,255,0.7); }
            16%, 100% { background-color: rgba(0,0,50,0.5); }
        }
      `}</style>
    </Container>
  );
};

export default CustomerDashboard;
