# Docker Setup for Offshore Mate

This document provides instructions for running Offshore Mate using Docker in both development and production environments.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB available RAM

## Quick Start

### Production Build
```bash
# Build and run production container
npm run docker:build
npm run docker:run

# Or use Docker Compose
npm run docker:up
```

### Development Build
```bash
# Build and run development container with hot reload
npm run docker:build-dev
npm run docker:run-dev

# Or use Docker Compose
npm run docker:up-dev
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run docker:build` | Build production Docker image |
| `npm run docker:build-dev` | Build development Docker image |
| `npm run docker:run` | Run production container on port 3000 |
| `npm run docker:run-dev` | Run development container on port 3001 |
| `npm run docker:up` | Start production services with Docker Compose |
| `npm run docker:up-dev` | Start development services with Docker Compose |
| `npm run docker:down` | Stop all Docker Compose services |
| `npm run docker:logs` | View logs from running containers |
| `npm run docker:clean` | Clean up unused Docker resources |

## Docker Files Overview

### Production Files
- `Dockerfile` - Multi-stage production build
- `docker-compose.prod.yml` - Production deployment configuration
- `nginx.conf` - Nginx reverse proxy configuration

### Development Files
- `Dockerfile.dev` - Development build with hot reload
- `docker-compose.yml` - Development environment configuration

### Configuration Files
- `.dockerignore` - Files excluded from Docker build context

## Environment Configurations

### Production Environment

The production setup includes:
- Optimized Next.js standalone build
- Non-root user for security
- Health checks
- Resource limits
- Security hardening
- Optional Nginx reverse proxy

#### Running Production Setup

```bash
# Basic production run
docker-compose up -d

# With Nginx reverse proxy
docker-compose --profile nginx up -d

# Using production compose file
docker-compose -f docker-compose.prod.yml up -d
```

### Development Environment

The development setup includes:
- Hot reload capability
- Volume mounting for live code changes
- Development dependencies
- Debug-friendly configuration

#### Running Development Setup

```bash
# Start development environment
docker-compose --profile dev up -d

# View logs
docker-compose logs -f offshore-mate-dev

# Rebuild and restart
docker-compose --profile dev up -d --build
```

## Health Checks

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "offshore-mate",
  "version": "1.0.0",
  "uptime": 123.456
}
```

## Security Features

### Production Security
- Non-root user execution
- Read-only filesystem
- Dropped capabilities
- No new privileges
- Security headers via Nginx
- Rate limiting
- Resource limits

### Network Security
- Custom Docker networks
- Port exposure control
- Nginx proxy protection

## Monitoring and Logging

### Container Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f offshore-mate

# View last 100 lines
docker-compose logs --tail=100 offshore-mate
```

### Health Monitoring
```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' offshore-mate-app

# Check health endpoint
curl http://localhost:3000/api/health
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Stop existing containers
docker-compose down
```

#### Build Failures
```bash
# Clean Docker cache
npm run docker:clean

# Rebuild without cache
docker-compose build --no-cache
```

#### Permission Issues
```bash
# Fix file permissions on Linux/Mac
sudo chown -R $USER:$USER .
```

### Debug Commands

```bash
# Access running container shell
docker exec -it offshore-mate-app sh

# Check container resource usage
docker stats offshore-mate-app

# Inspect container configuration
docker inspect offshore-mate-app

# View container filesystem
docker exec offshore-mate-app ls -la /app
```

### Performance Optimization

#### Image Size Optimization
- Multi-stage builds reduce final image size
- Alpine Linux base images
- .dockerignore excludes unnecessary files
- Next.js standalone output for minimal runtime

#### Runtime Optimization
- Process management with Node.js server
- Memory limits and resource constraints
- Nginx caching and compression
- Health checks for container orchestration

## Deployment

### Production Deployment

1. **Build the image:**
   ```bash
   docker build -t offshore-mate:v1.0.0 .
   ```

2. **Tag for registry:**
   ```bash
   docker tag offshore-mate:v1.0.0 your-registry/offshore-mate:v1.0.0
   ```

3. **Push to registry:**
   ```bash
   docker push your-registry/offshore-mate:v1.0.0
   ```

4. **Deploy on server:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment Variables

Set these environment variables for production:

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0
```

### SSL/HTTPS Setup

1. Place SSL certificates in the `ssl/` directory
2. Update `nginx.conf` with your domain
3. Uncomment HTTPS server block
4. Deploy with Nginx profile:
   ```bash
   docker-compose --profile nginx -f docker-compose.prod.yml up -d
   ```

## Maintenance

### Regular Maintenance
```bash
# Update dependencies
npm update

# Rebuild images
docker-compose build --no-cache

# Clean up unused resources
npm run docker:clean

# View disk usage
docker system df
```

### Backup Considerations
- Container logs (if using file logging driver)
- Environment configuration files
- SSL certificates (if using HTTPS)
- Application data (if using volumes for storage)

## Support

For Docker-related issues:
1. Check the logs: `npm run docker:logs`
2. Verify health status: `curl http://localhost:3000/api/health`
3. Review container resources: `docker stats`
4. Check the troubleshooting section above