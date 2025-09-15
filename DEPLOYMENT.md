# Deployment Guide

This guide covers multiple deployment options for the Ovela e-commerce website.

## Prerequisites

1. **Environment Variables**: Copy `.env.example` to `.env.local` and fill in your values
2. **Database**: Set up Supabase or PostgreSQL database
3. **Firebase**: Configure Firebase for authentication and storage
4. **Domain**: Have a domain ready for production deployment

## Deployment Options

### 1. Vercel Deployment (Recommended)

#### Quick Deploy
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

#### Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Environment Variables for Vercel
Add these in your Vercel dashboard under Settings > Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXTAUTH_SECRET
NEXTAUTH_URL
```

### 2. Docker Deployment

#### Build and Run Locally
```bash
# Build the Docker image
docker build -t ovela-website .

# Run the container
docker run -p 3000:3000 --env-file .env.local ovela-website
```

#### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Production Docker Deployment
1. Set up a VPS (DigitalOcean, AWS EC2, etc.)
2. Install Docker and Docker Compose
3. Clone your repository
4. Configure environment variables
5. Run with Docker Compose

### 3. Manual Server Deployment

#### Prerequisites
- Node.js 18+
- PM2 for process management
- Nginx for reverse proxy
- SSL certificate

#### Steps
```bash
# Clone repository
git clone <your-repo-url>
cd ovela-website

# Install dependencies
npm ci --only=production

# Build the application
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "ovela-website" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Nginx Configuration
Copy the provided `nginx.conf` to `/etc/nginx/nginx.conf` and restart Nginx.

### 4. Database Setup

#### Supabase (Recommended)
1. Create a new Supabase project
2. Run the SQL migrations in the Supabase SQL editor:
   - `supabase/schema.sql`
   - All files in `supabase/migrations/`
3. Configure Row Level Security policies
4. Update environment variables with Supabase credentials

#### Self-hosted PostgreSQL
1. Install PostgreSQL 15+
2. Create database and user
3. Run migration files in order
4. Configure connection string in environment variables

## Environment Configuration

### Required Environment Variables

#### Firebase
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Application
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_random_secret
NODE_ENV=production
```

## Security Checklist

- [ ] All environment variables are set
- [ ] NEXTAUTH_SECRET is a strong random string
- [ ] Database has proper access controls
- [ ] Firebase security rules are configured
- [ ] SSL certificate is installed
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Security headers are set

## Performance Optimization

### CDN Setup
- Configure Cloudflare or similar CDN
- Enable caching for static assets
- Optimize images with Next.js Image component

### Database Optimization
- Set up database indexes
- Configure connection pooling
- Monitor query performance

### Monitoring
- Set up error tracking (Sentry)
- Configure uptime monitoring
- Set up performance monitoring

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check TypeScript errors

2. **Database Connection Issues**
   - Verify connection string
   - Check firewall settings
   - Ensure database is running

3. **Authentication Issues**
   - Verify Firebase configuration
   - Check NEXTAUTH_URL matches deployment URL
   - Ensure NEXTAUTH_SECRET is set

4. **Performance Issues**
   - Enable gzip compression
   - Optimize images
   - Use CDN for static assets

### Logs

#### Vercel
```bash
vercel logs
```

#### Docker
```bash
docker-compose logs -f app
```

#### PM2
```bash
pm2 logs ovela-website
```

## Maintenance

### Updates
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm ci

# Rebuild
npm run build

# Restart application
pm2 restart ovela-website
```

### Database Migrations
```bash
# Run new migrations
npx supabase db push
```

### Backup
- Set up automated database backups
- Backup environment variables
- Document deployment configuration

## Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Test locally with production build
4. Check database connectivity
5. Review security settings

For additional help, refer to the documentation of your chosen deployment platform.