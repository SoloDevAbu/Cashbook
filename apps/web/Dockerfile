FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/utils/package.json ./packages/utils/
COPY packages/validation/package.json ./packages/validation/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn workspace web build

# Expose port
EXPOSE 9901

# Start the application
CMD ["yarn", "workspace", "web", "start"]
