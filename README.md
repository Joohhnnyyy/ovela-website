# Ovela Website

A modern e-commerce platform built with Next.js, featuring a comprehensive admin dashboard, user authentication, and real-time inventory management.

## Features

### Customer Features
- Modern, responsive design with custom typography
- Product browsing with collections (hoodies, accessories, bags, sneakers)
- Shopping cart with persistent storage
- User authentication and account management
- Secure checkout process
- Order tracking and history

### Admin Features
- Comprehensive admin dashboard with analytics
- User management system
- Product inventory management
- Order processing and tracking
- Real-time sales insights
- Settings configuration
- Unified authentication system

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Firebase Auth
- **State Management**: React Context API
- **Deployment**: Docker, Vercel
- **Package Manager**: npm/bun

## Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database (Supabase)
- Firebase project for authentication

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Joohhnnyyy/ovela-website.git
cd ovela-website
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
```

4. Set up the database:
```bash
node setup-database.js
```

5. Run database migrations:
```bash
cd supabase
supabase db push
```

## Development

Start the development server:
```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:3000`.

## Database Schema

The application uses the following main tables:
- `users` - User accounts and profiles
- `products` - Product catalog
- `orders` - Order management
- `cart_items` - Shopping cart persistence
- `inventory` - Stock management
- `error_logs` - Error tracking

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/admin/orders` - Get all orders (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove cart item

## Deployment

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t ovela-website .
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── collections/       # Product collections
│   └── products/          # Product pages
├── components/            # Reusable components
│   ├── sections/          # Page sections
│   └── ui/                # UI components
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
├── lib/                   # Utility libraries
├── services/              # API services
└── types/                 # TypeScript types
```

## Admin Access

To access the admin dashboard:
1. Navigate to `/auth/login`
2. Login with admin credentials
3. Access admin features at `/admin/dashboard`

Admin users are identified by the `role` field in the users table set to `admin`.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
