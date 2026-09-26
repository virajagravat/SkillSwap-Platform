#!/usr/bin/env bash

# ------------------------------------------------------------
# start-services.sh – Start all SkillSwap Platform microservices
# ------------------------------------------------------------

set -u

services=(
  "service-registry|backend/service-registry|service-registry.log|8761"
  "api-gateway|backend/api-gateway|api-gateway.log|8086"
  "auth-service|backend/auth-service|auth-service.log|8085"
  "profile-service|backend/profile-service|profile-service.log|8087"
  "browse-skill-service|backend/browse-skill-service|browse-skill-service.log|8089"
  "skill-swap-request-service|backend/skill-swap-request-service|skill-swap-request-service.log|8090"
)

start_service() {
  local name=$1
  local dir=$2
  local log=$3

  echo ""
  echo "Starting $name..."

  if [[ ! -d "$dir" ]]; then
    echo "[WARN] Directory $dir not found - skipping $name"
    return
  fi

  if [[ ! -f "$dir/mvnw" ]]; then
    echo "[WARN] mvnw not found in $dir - skipping $name"
    return
  fi

  chmod +x "$dir/mvnw" 2>/dev/null || true

  (
    cd "$dir"
    ./mvnw spring-boot:run > "../../$log" 2>&1
  ) &

  echo "$name started in background."
}

# ------------------------------------------------------------
# Start services
# ------------------------------------------------------------

echo "=========================================="
echo " Starting SkillSwap Platform Services"
echo "=========================================="

for entry in "${services[@]}"; do
  IFS='|' read -r name dir log port <<< "$entry"

  start_service "$name" "$dir" "$log"

  # Give service some time before starting next one
  sleep 5
done

# ------------------------------------------------------------
# Wait
# ------------------------------------------------------------

echo ""
echo "Waiting for services to start..."
sleep 20

# ------------------------------------------------------------
# Port check
# ------------------------------------------------------------

port_is_open() {
  local port=$1

  if command -v nc >/dev/null 2>&1; then
    nc -z localhost "$port" >/dev/null 2>&1
  else
    (echo > /dev/tcp/localhost/$port) >/dev/null 2>&1
  fi
}

# ------------------------------------------------------------
# Health summary
# ------------------------------------------------------------

echo ""
echo "=========================================="
echo " Service Health Summary"
echo "=========================================="

for entry in "${services[@]}"; do
  IFS='|' read -r name dir log port <<< "$entry"

  if port_is_open "$port"; then
    echo "[OK]   $name -> http://localhost:$port"
  else
    echo "[FAIL] $name -> port $port"
    echo "       Check: $log"
  fi
done

echo ""
echo "=========================================="
echo " All services have been launched."
echo " Logs are available in the project root."
echo "=========================================="