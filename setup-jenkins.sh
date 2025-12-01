#!/bin/bash

# =============================================================================
# Jenkins Local Setup Script
# =============================================================================
# This script helps you set up Jenkins locally using Docker
# Perfect for learning and testing CI/CD pipelines!
#
# Prerequisites:
#   - Docker installed and running
#   - Docker Compose installed
#
# Usage:
#   chmod +x setup-jenkins.sh
#   ./setup-jenkins.sh
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =============================================================================
# Helper Functions
# =============================================================================

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# =============================================================================
# Check Prerequisites
# =============================================================================

check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        echo "Please install Docker from: https://www.docker.com/get-started"
        exit 1
    fi
    print_success "Docker is installed"
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        print_error "Docker is not running!"
        echo "Please start Docker Desktop and try again"
        exit 1
    fi
    print_success "Docker is running"
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed!"
        echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
        exit 1
    fi
    print_success "Docker Compose is installed"
    
    echo ""
}

# =============================================================================
# Start Jenkins
# =============================================================================

start_jenkins() {
    print_header "Starting Jenkins"
    
    print_info "Pulling Jenkins Docker image (this may take a few minutes)..."
    docker-compose -f docker-compose.jenkins.yml pull
    
    print_info "Starting Jenkins container..."
    docker-compose -f docker-compose.jenkins.yml up -d
    
    print_success "Jenkins container started!"
    echo ""
}

# =============================================================================
# Wait for Jenkins to be Ready
# =============================================================================

wait_for_jenkins() {
    print_header "Waiting for Jenkins to Start"
    
    print_info "Jenkins is initializing (this may take 1-2 minutes)..."
    
    # Wait for Jenkins to be ready
    COUNTER=0
    MAX_ATTEMPTS=60  # 60 attempts = 2 minutes
    
    while [ $COUNTER -lt $MAX_ATTEMPTS ]; do
        if docker exec todo-app-jenkins curl -s http://localhost:8080/login > /dev/null 2>&1; then
            print_success "Jenkins is ready!"
            echo ""
            return 0
        fi
        
        echo -n "."
        sleep 2
        COUNTER=$((COUNTER + 1))
    done
    
    print_error "Jenkins took too long to start. Please check Docker logs:"
    echo "docker logs todo-app-jenkins"
    exit 1
}

# =============================================================================
# Get Initial Admin Password
# =============================================================================

get_admin_password() {
    print_header "Jenkins Initial Setup"
    
    print_info "Getting initial admin password..."
    sleep 5  # Wait a bit for the password file to be created
    
    PASSWORD=$(docker exec todo-app-jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null || echo "")
    
    if [ -z "$PASSWORD" ]; then
        print_error "Could not retrieve admin password"
        print_info "You can get it manually with:"
        echo "docker exec todo-app-jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
        echo ""
    else
        print_success "Initial admin password retrieved!"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo -e "${GREEN}Initial Admin Password:${NC}"
        echo ""
        echo -e "${YELLOW}$PASSWORD${NC}"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
    fi
}

# =============================================================================
# Display Next Steps
# =============================================================================

show_next_steps() {
    print_header "Next Steps"
    
    echo "1. Open Jenkins in your browser:"
    echo -e "   ${GREEN}http://localhost:8080${NC}"
    echo ""
    
    echo "2. Use the admin password shown above to unlock Jenkins"
    echo ""
    
    echo "3. Click 'Install suggested plugins'"
    echo ""
    
    echo "4. Create your admin user"
    echo ""
    
    echo "5. Read the JENKINS_GUIDE.md for detailed instructions:"
    echo -e "   ${GREEN}cat JENKINS_GUIDE.md${NC}"
    echo ""
    
    print_header "Useful Commands"
    
    echo -e "${YELLOW}View Jenkins logs:${NC}"
    echo "docker logs -f todo-app-jenkins"
    echo ""
    
    echo -e "${YELLOW}Stop Jenkins:${NC}"
    echo "docker-compose -f docker-compose.jenkins.yml down"
    echo ""
    
    echo -e "${YELLOW}Restart Jenkins:${NC}"
    echo "docker-compose -f docker-compose.jenkins.yml restart"
    echo ""
    
    echo -e "${YELLOW}Remove Jenkins (including data):${NC}"
    echo "docker-compose -f docker-compose.jenkins.yml down -v"
    echo ""
    
    print_header "🎉 Setup Complete!"
    
    echo -e "${GREEN}Jenkins is running at: http://localhost:8080${NC}"
    echo ""
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
    clear
    
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║   Jenkins Local Setup for Todo App        ║"
    echo "║   Perfect for Learning DevOps!             ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    
    check_prerequisites
    start_jenkins
    wait_for_jenkins
    get_admin_password
    show_next_steps
}

# Run the script
main

