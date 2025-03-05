export const API_CONFIG = {
  baseUrl: 'http://127.0.0.1:1337/api',
  endPoints: {
    post: '/posts',
    user: '/users',
  },
  defaultPageSize: 20,
} as const;
