FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/db/package.json ./packages/db/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn workspace backend build

# Expose port
ENV PORT=9902
EXPOSE 9902

# Start the application
CMD ["yarn", "workspace", "backend", "start"]
