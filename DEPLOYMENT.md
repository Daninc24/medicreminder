# Deployment Guide

This guide will help you deploy the Medical Reminder System using Docker and Docker Compose.

## Prerequisites

1. Install Docker:
   - [Docker Desktop](https://www.docker.com/products/docker-desktop) for Windows/Mac
   - [Docker Engine](https://docs.docker.com/engine/install/) for Linux

2. Install Docker Compose:
   - Usually comes with Docker Desktop
   - For Linux: `sudo apt-get install docker-compose`

## Deployment Steps

### 1. Environment Setup

1. Create a `.env` file in the root directory:
```bash
# MongoDB
MONGO_INITDB_ROOT_USERNAME=your_secure_username
MONGO_INITDB_ROOT_PASSWORD=your_secure_password

# Backend
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

### 2. Build and Start Services

1. Build the Docker images:
```bash
docker-compose build
```

2. Start all services:
```bash
docker-compose up -d
```

3. Check service status:
```bash
docker-compose ps
```

### 3. Access the Application

- Frontend: http://localhost
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### 4. Monitoring and Logs

1. View logs for all services:
```bash
docker-compose logs -f
```

2. View logs for specific service:
```bash
docker-compose logs -f [service_name]
```

### 5. Maintenance

1. Stop all services:
```bash
docker-compose down
```

2. Stop and remove volumes:
```bash
docker-compose down -v
```

3. Rebuild and restart a specific service:
```bash
docker-compose up -d --build [service_name]
```

### 6. Production Deployment

For production deployment, consider the following:

1. Use a reverse proxy (e.g., Nginx) for SSL/TLS termination
2. Set up proper domain names and DNS
3. Configure proper security measures:
   - Strong passwords
   - Firewall rules
   - Rate limiting
   - SSL certificates

### 7. Backup and Restore

1. Backup MongoDB data:
```bash
docker-compose exec mongodb mongodump --out /backup
```

2. Restore MongoDB data:
```bash
docker-compose exec mongodb mongorestore /backup
```

### 8. Troubleshooting

1. Check container logs:
```bash
docker-compose logs [service_name]
```

2. Access container shell:
```bash
docker-compose exec [service_name] sh
```

3. Common issues:
   - Port conflicts: Change port mappings in docker-compose.yml
   - Database connection issues: Check MongoDB credentials
   - Build failures: Check Dockerfile syntax and dependencies

### 9. Scaling

To scale the application:

1. Use Docker Swarm or Kubernetes for orchestration
2. Set up load balancing
3. Configure database replication
4. Implement caching strategies

### 10. Security Considerations

1. Update environment variables with secure values
2. Enable HTTPS
3. Configure proper firewall rules
4. Regular security updates
5. Monitor system logs
6. Implement backup strategies

## Support

For deployment issues or questions, please:
1. Check the troubleshooting section
2. Review Docker and Docker Compose documentation
3. Open an issue in the project repository 