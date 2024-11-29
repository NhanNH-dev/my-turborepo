# Sử dụng image node chính thức
FROM node:16-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json (hoặc yarn.lock) vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy tất cả các file còn lại vào container
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Expose port mà ứng dụng Next.js sẽ chạy
EXPOSE 3000

COPY ../.npmrc ./

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]
