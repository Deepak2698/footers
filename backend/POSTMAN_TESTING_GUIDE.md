# Backend API Testing Guide

## Setup Instructions

1. **Install Dependencies:**
```bash
cd backend
npm install
```

2. **Configure Environment Variables:**
```bash
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
```

3. **Start Server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## API Endpoints

### 1. Health Check

**GET /api/health**

**Response:**
```json
{
  "success": true,
  "message": "Server running successfully"
}
```

---

### 2. Test Image Upload

**POST /api/upload**

**Headers:**
- Content-Type: multipart/form-data

**Body (form-data):**
- Key: `images`
- Type: File
- Value: Select image files (jpg, jpeg, png, webp)

**Response:**
```json
{
  "success": true,
  "images": [
    "http://localhost:5000/uploads/products/1715432100000-123456789.jpg"
  ]
}
```

---

### 3. Create Product

**POST /api/products**

**Headers:**
- Content-Type: multipart/form-data

**Body (form-data):**

**Form Fields:**
```
title: "Premium T-Shaped Kolhapuri"
description: "Experience the authentic craftsmanship of traditional Kolhapuri footwear. Handcrafted with genuine leather."
shortDescription: "Traditional T-shaped design with modern comfort"
brand: "Footers"
category: "T-Shaped Kolhapuri"
price: 1299
discountPrice: 899
material: "Genuine Leather"
isFeatured: true
isActive: true
```

**Sizes (JSON format):**
```
sizes: [
  {
    "size": "7",
    "stock": 5
  },
  {
    "size": "8",
    "stock": 10
  },
  {
    "size": "9",
    "stock": 8
  }
]
```

**Colors (JSON format):**
```
colors: ["Black", "Brown", "Tan"]
```

**Images (File Upload):**
- Key: `images`
- Type: File
- Value: Select multiple image files (up to 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "67abc123def456789",
    "title": "Premium T-Shaped Kolhapuri",
    "slug": "premium-t-shaped-kolhapuri",
    "description": "Experience the authentic craftsmanship...",
    "shortDescription": "Traditional T-shaped design...",
    "brand": "Footers",
    "category": "T-Shaped Kolhapuri",
    "price": 1299,
    "discountPrice": 899,
    "images": [
      "http://localhost:5000/uploads/products/1715432100000-123456789.jpg",
      "http://localhost:5000/uploads/products/1715432100001-987654321.jpg"
    ],
    "sizes": [
      { "size": "7", "stock": 5 },
      { "size": "8", "stock": 10 },
      { "size": "9", "stock": 8 }
    ],
    "colors": ["Black", "Brown", "Tan"],
    "material": "Genuine Leather",
    "rating": 0,
    "reviewsCount": 0,
    "isFeatured": true,
    "isActive": true,
    "totalStock": 23,
    "createdAt": "2024-06-08T10:30:00.000Z",
    "updatedAt": "2024-06-08T10:30:00.000Z"
  }
}
```

---

### 4. Get All Products

**GET /api/products**

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search query (searches title and description)
- `category`: Filter by category
- `brand`: Filter by brand
- `size`: Filter by size
- `featured`: Filter featured products (true/false)
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `sort`: Sort order (priceAsc, priceDesc, rating, newest)

**Examples:**

**Get all products:**
```
GET /api/products
```

**Get products with pagination:**
```
GET /api/products?page=1&limit=10
```

**Search products:**
```
GET /api/products?search=Kolhapuri
```

**Filter by category:**
```
GET /api/products?category=T-Shaped%20Kolhapuri
```

**Filter by brand:**
```
GET /api/products?brand=Footers
```

**Filter by size:**
```
GET /api/products?size=8
```

**Filter featured products:**
```
GET /api/products?featured=true
```

**Filter by price range:**
```
GET /api/products?minPrice=500&maxPrice=2000
```

**Sort by price (low to high):**
```
GET /api/products?sort=priceAsc
```

**Sort by rating:**
```
GET /api/products?sort=rating
```

**Combined filters:**
```
GET /api/products?category=T-Shaped%20Kolhapuri&minPrice=500&maxPrice=2000&sort=priceAsc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "67abc123def456789",
      "title": "Premium T-Shaped Kolhapuri",
      "price": 1299,
      "images": ["http://localhost:5000/uploads/products/..."],
      "rating": 4.8,
      "totalStock": 23
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

### 5. Get Product by ID

**GET /api/products/:id**

**Example:**
```
GET /api/products/67abc123def456789
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "67abc123def456789",
    "title": "Premium T-Shaped Kolhapuri",
    "slug": "premium-t-shaped-kolhapuri",
    "description": "Experience the authentic craftsmanship...",
    "brand": "Footers",
    "category": "T-Shaped Kolhapuri",
    "price": 1299,
    "discountPrice": 899,
    "images": ["http://localhost:5000/uploads/products/..."],
    "sizes": [
      { "size": "7", "stock": 5 },
      { "size": "8", "stock": 10 }
    ],
    "colors": ["Black", "Brown"],
    "material": "Genuine Leather",
    "rating": 4.8,
    "reviewsCount": 2456,
    "isFeatured": true,
    "isActive": true,
    "totalStock": 23,
    "createdAt": "2024-06-08T10:30:00.000Z",
    "updatedAt": "2024-06-08T10:30:00.000Z"
  }
}
```

---

### 6. Update Product

**PUT /api/products/:id**

**Headers:**
- Content-Type: multipart/form-data

**Body (form-data):**

Same as create product, but all fields are optional. Only include fields you want to update.

**Example:**
```
PUT /api/products/67abc123def456789
```

**Body:**
```
price: 1499
sizes: [
  {
    "size": "7",
    "stock": 3
  },
  {
    "size": "8",
    "stock": 15
  }
]
```

**Images (optional):**
- Key: `images`
- Type: File
- Value: Select new image files to replace existing ones

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "67abc123def456789",
    "title": "Premium T-Shaped Kolhapuri",
    "price": 1499,
    "sizes": [
      { "size": "7", "stock": 3 },
      { "size": "8", "stock": 15 }
    ],
    "totalStock": 18,
    "updatedAt": "2024-06-08T11:00:00.000Z"
  }
}
```

---

### 7. Delete Product

**DELETE /api/products/:id**

**Example:**
```
DELETE /api/products/67abc123def456789
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Error Codes:**
- `400`: Bad Request (validation errors, missing fields)
- `404`: Not Found (product not found)
- `500`: Internal Server Error (database errors, server issues)

---

## Sample Postman Collection

### Import this JSON into Postman:

```json
{
  "info": {
    "name": "Footers E-Commerce API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/api/health",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "health"]
        }
      }
    },
    {
      "name": "Create Product",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "title",
              "value": "Premium T-Shaped Kolhapuri",
              "type": "text"
            },
            {
              "key": "description",
              "value": "Experience the authentic craftsmanship of traditional Kolhapuri footwear.",
              "type": "text"
            },
            {
              "key": "brand",
              "value": "Footers",
              "type": "text"
            },
            {
              "key": "category",
              "value": "T-Shaped Kolhapuri",
              "type": "text"
            },
            {
              "key": "price",
              "value": "1299",
              "type": "text"
            },
            {
              "key": "sizes",
              "value": "[{\"size\":\"7\",\"stock\":5},{\"size\":\"8\",\"stock\":10}]",
              "type": "text"
            },
            {
              "key": "images",
              "type": "file",
              "src": "/path/to/image.jpg"
            }
          ]
        },
        "url": {
          "raw": "http://localhost:5000/api/products",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "products"]
        }
      }
    },
    {
      "name": "Get All Products",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/api/products?page=1&limit=10",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "products"],
          "query": [
            {
              "key": "page",
              "value": "1"
            },
            {
              "key": "limit",
              "value": "10"
            }
          ]
        }
      }
    },
    {
      "name": "Get Product by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/api/products/67abc123def456789",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "products", "67abc123def456789"]
        }
      }
    },
    {
      "name": "Update Product",
      "request": {
        "method": "PUT",
        "header": [],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "price",
              "value": "1499",
              "type": "text"
            }
          ]
        },
        "url": {
          "raw": "http://localhost:5000/api/products/67abc123def456789",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "products", "67abc123def456789"]
        }
      }
    },
    {
      "name": "Delete Product",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/api/products/67abc123def456789",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "products", "67abc123def456789"]
        }
      }
    }
  ]
}
```

---

## Notes

1. **Image Uploads:**
   - Allowed formats: jpg, jpeg, png, webp
   - Maximum file size: 5 MB per image
   - Maximum images per product: 10
   - Images are stored in `backend/uploads/products/`
   - Images are accessible via `/uploads/products/filename`

2. **Auto-Calculations:**
   - `totalStock` is automatically calculated from the `sizes` array
   - `slug` is auto-generated from `title` if not provided

3. **Validations:**
   - Title, description, brand, category, and price are required
   - At least one image and one size are required
   - Stock values cannot be negative
   - Price cannot be negative

4. **Pagination:**
   - Default page: 1
   - Default limit: 10
   - Response includes pagination metadata

5. **Filtering:**
   - Multiple filters can be combined
   - All filters are optional
   - Default sort is by newest first

---

## Next Steps

After testing the Product module, you can extend the backend with:

1. **Authentication & Authorization**
   - User registration/login
   - JWT tokens
   - Role-based access control (Owner, Staff, Customer)

2. **Cart Module**
   - Add to cart
   - Update cart items
   - Remove from cart
   - Get user cart

3. **Order Module**
   - Create orders
   - Get user orders
   - Update order status
   - Order tracking

4. **Admin Dashboard**
   - Product management
   - Order management
   - User management
   - Analytics

5. **Review Module**
   - Add product reviews
   - Get product reviews
   - Update/delete reviews

6. **Category & Brand Management**
   - CRUD operations for categories
   - CRUD operations for brands
