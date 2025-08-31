// API 기본 URL 설정
export const API_BASE_URL = __API_BASE_URL__ || 'https://welllink-server.onrender.com';

// API 엔드포인트 설정
export const API_ENDPOINTS = {
  health: {
    ping: '/health/ping',
    welfareList: '/health/welfare-list',
    welfareDetail: '/health/welfare-detail'
  }
};

// API 요청 헤더 설정
export const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
  // 필요한 경우 인증 헤더 추가
  // 'Authorization': `Bearer ${token}`,
});

// API 요청을 위한 유틸리티 함수
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
