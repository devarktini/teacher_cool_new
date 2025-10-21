export const mockProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 199.99,
    description: 'Premium noise-canceling wireless headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 299.99,
    description: 'Latest generation smartwatch with health tracking',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop',
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 89.99,
    description: 'Comfortable running shoes for daily use',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    category: 'Sports'
  },
  {
    id: 4,
    name: 'Backpack',
    price: 59.99,
    description: 'Durable waterproof backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    category: 'Accessories'
  },
  {
    id: 5,
    name: 'Coffee Maker',
    price: 79.99,
    description: 'Automatic drip coffee maker',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=300&fit=crop',
    category: 'Home'
  }
];

export const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    joinDate: '2023-01-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2023-02-20'
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'editor',
    status: 'inactive',
    joinDate: '2023-03-10'
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2023-04-05'
  },
  {
    id: 5,
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    role: 'editor',
    status: 'active',
    joinDate: '2023-05-15'
  }
];

export const mockCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'sports', label: 'Sports' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'home', label: 'Home' }
];

export const mockProfile = {
  id: 1,
  email: 'admin@example.com',
  username: 'Admin User',
  role: 'admin'
};
