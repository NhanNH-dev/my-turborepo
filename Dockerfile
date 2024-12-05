# Bước 1: Chọn image Node.js
FROM node:18-alpine

# Bước 2: Thiết lập thư mục làm việc trong container
WORKDIR /app

# Bước 3: Sao chép các tệp package.json và turbo.json vào container
COPY package.json turbo.json ./ 
COPY apps/web/package.json ./apps/web/package.json
COPY apps/docs/package.json ./apps/docs/package.json

# Bước 4: Cài đặt các phụ thuộc cho toàn bộ monorepo
RUN npm install --legacy-peer-deps

# Bước 5: Sao chép các tệp khóa cài đặt npm (nếu có) để tận dụng cache
COPY package-lock.json ./ 
# Sao chép lại nếu bạn có package-lock.json
# COPY apps/web/package-lock.json ./apps/web/package-lock.json
# COPY apps/docs/package-lock.json ./apps/docs/package-lock.json

# Bước 6: Sao chép toàn bộ mã nguồn vào container
COPY . .

# Bước 7: Build ứng dụng
RUN npx turbo run build

# Bước 8: Expose cổng mà ứng dụng của bạn sẽ chạy trên đó
EXPOSE 3000

# Bước 9: Chạy ứng dụng (Ví dụ ở đây là web, bạn có thể thay đổi cho phù hợp với ứng dụng bạn muốn chạy)
CMD ["npm", "run", "dev", "--workspace", "web"]
