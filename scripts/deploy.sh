rm bundle.zip

zip -r \
  bundle.zip \
  src \
  prisma \
  tsconfig.json \
  package*.json \
  Dockerfile \
  docker-compose.yml