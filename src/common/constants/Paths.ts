
export default {
  Base: '/api',
  Version: '/v1',
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
    Chat: "/chat",
    Load: "/load-chats",
    Generate: "/generate-docs"
  },
} as const;
