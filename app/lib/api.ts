// API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

export type ProductCategory =
  | "Pheran & Kaftans"
  | "Co-ord Sets"
  | "Ethnic Dresses"
  | "Churidar Sets"
  | "Sharara Suits"
  | "Designer Lehengas";

export interface Product {
  id: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  lookbook?: string;
  category?: ProductCategory | string | Category;
  size?: string;
  availability?: boolean;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lookbook {
  _id: string;
  name: string;
  image: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Fetch all products (public endpoint - no auth required)
export async function fetchProducts(): Promise<Product[]> {
  try {
    const url = `${API_BASE_URL}/products`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data on each request
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("API Error Response:", text);
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      throw new Error(
        "Server returned non-JSON response. Make sure the API server is running."
      );
    }

    const result: ApiResponse<Product[]> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to fetch products");
  } catch (error) {
    console.error("Error fetching products:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to API server. Please make sure the server is running on port 5002."
      );
    }
    throw error;
  }
}

// Fetch single product by ID (public endpoint - no auth required)
export async function fetchProductById(id: string): Promise<Product> {
  try {
    const url = `${API_BASE_URL}/products/${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data on each request
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const result: ApiResponse<Product> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to fetch product");
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function fetchProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  try {
    const url = `${API_BASE_URL}/products/category/${categoryId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products by category: ${response.statusText}`
      );
    }

    const result: ApiResponse<Product[]> = await response.json();
    if (result.success && result.data) return result.data;

    throw new Error(result.message || "Failed to fetch products by category");
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
}

// Admin API functions

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    username: string;
  };
}

// Admin login
export async function adminLogin(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  try {
    const url = `${API_BASE_URL}/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const result: LoginResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    return result;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

// Create a new product (admin only)
export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "image"> & { image: File }
): Promise<Product> {
  try {
    const url = `${API_BASE_URL}/products`;
    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price.toString());
    if (product.quantity !== undefined)
      formData.append("quantity", product.quantity.toString());
    if (product.lookbook) formData.append("lookbook", product.lookbook);
    const categoryValue =
      typeof product.category === "string"
        ? product.category
        : product.category?._id;
    if (categoryValue) formData.append("category", categoryValue);
    // if ((product as any).lookbook) formData.append("lookbook", (product as any).lookbook as string);
    if (product.size) formData.append("size", product.size);
    if (product.availability !== undefined)
      formData.append("availability", product.availability.toString());
    if (product.image instanceof File) {
      formData.append("image", product.image);
    }

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create product");
    }

    const result: ApiResponse<Product> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to create product");
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

// Update a product (admin only)
export async function updateProduct(
  id: string,
  product: Partial<Omit<Product, "id" | "createdAt" | "image">> & {
    image?: File;
  }
): Promise<Product> {
  try {
    const url = `${API_BASE_URL}/products/${id}`;
    const formData = new FormData();

    if (product.name) formData.append("name", product.name);
    if (product.lookbook) formData.append("lookbook", product.lookbook);
    if (product.description)
      formData.append("description", product.description);
    if (product.price !== undefined)
      formData.append("price", product.price.toString());
    const categoryValue =
      typeof product.category === "string"
        ? product.category
        : product.category?._id;
    if (categoryValue) formData.append("category", categoryValue);
    if (product.size) formData.append("size", product.size);
    if (product.availability !== undefined)
      formData.append("availability", product.availability.toString());
    if (product.quantity !== undefined)
      formData.append("quantity", product.quantity.toString());
    if (product.image instanceof File) {
      formData.append("image", product.image);
    }

    const response = await fetch(url, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update product");
    }

    const result: ApiResponse<Product> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to update product");
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

// Delete a product (admin only)
export async function deleteProduct(id: string): Promise<void> {
  try {
    const url = `${API_BASE_URL}/products/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete product");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// Category API functions

export interface Category {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

// Fetch all categories
export async function fetchCategories(): Promise<Category[]> {
  try {
    const url = `${API_BASE_URL}/categories`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("API Error Response:", text);
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`
      );
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      throw new Error(
        "Server returned non-JSON response. Make sure the API server is running."
      );
    }

    const result: ApiResponse<Category[]> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to fetch categories");
  } catch (error) {
    console.error("Error fetching categories:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to API server. Please make sure the server is running on port 5002."
      );
    }
    throw error;
  }
}

// Create a new category
export async function createCategory(
  category: Omit<Category, "_id" | "id" | "createdAt" | "image"> & {
    image: File;
  }
): Promise<Category> {
  try {
    const url = `${API_BASE_URL}/categories`;
    const formData = new FormData();

    formData.append("name", category.name);
    if (category.image instanceof File) {
      formData.append("image", category.image);
    }

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      throw new Error(
        "Server returned non-JSON response. Make sure the API server is running."
      );
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create category");
    }

    const result: ApiResponse<Category> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to create category");
  } catch (error) {
    console.error("Error creating category:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to API server. Please make sure the server is running on port 5002."
      );
    }
    throw error;
  }
}

// Update a category
export async function updateCategory(
  id: string,
  category: Partial<Omit<Category, "id" | "createdAt" | "image">> & {
    image?: File;
  }
): Promise<Category> {
  try {
    const url = `${API_BASE_URL}/categories/${id}`;
    const formData = new FormData();

    if (category.name) formData.append("name", category.name);
    if (category.image instanceof File) {
      formData.append("image", category.image);
    }

    const response = await fetch(url, {
      method: "PUT",
      body: formData,
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      throw new Error(
        "Server returned non-JSON response. Make sure the API server is running."
      );
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update category");
    }

    const result: ApiResponse<Category> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.message || "Failed to update category");
  } catch (error) {
    console.error("Error updating category:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to API server. Please make sure the server is running on port 5002."
      );
    }
    throw error;
  }
}

// Delete a category
export async function deleteCategory(id: string): Promise<void> {
  try {
    const url = `${API_BASE_URL}/categories/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      throw new Error(
        "Server returned non-JSON response. Make sure the API server is running."
      );
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete category");
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to API server. Please make sure the server is running on port 5002."
      );
    }
    throw error;
  }
}
export async function fetchLookbooks(): Promise<Lookbook[]> {
  try {
    const url = `${API_BASE_URL}/lookbook`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok)
      throw new Error(`Failed to fetch lookbooks: ${response.statusText}`);

    const result: ApiResponse<Lookbook[]> = await response.json();
    if (result.success && result.data) return result.data;

    throw new Error(result.message || "Failed to fetch lookbooks");
  } catch (error) {
    console.error("Error fetching lookbooks:", error);
    throw error;
  }
}

// ✅ Fetch single lookbook by ID
export async function fetchLookbookById(id: string): Promise<Lookbook> {
  try {
    const url = `${API_BASE_URL}/lookbook/${id}`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok)
      throw new Error(`Failed to fetch lookbook: ${response.statusText}`);

    const result: ApiResponse<Lookbook> = await response.json();
    if (result.success && result.data) return result.data;

    throw new Error(result.message || "Failed to fetch lookbook");
  } catch (error) {
    console.error("Error fetching lookbook:", error);
    throw error;
  }
}

// ✅ Create a new lookbook
export async function createLookbook(data: {
  name: string;
  image: File;
  description?: string;
}): Promise<Lookbook> {
  try {
    const url = `${API_BASE_URL}/lookbook`;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", data.image);
    if (data.description) formData.append("description", data.description);

    const response = await fetch(url, { method: "POST", body: formData });
    if (!response.ok) {
      const result: ApiResponse<Lookbook> = await response.json();
      console.log("result", result);
      throw new Error(` ${result?.message ?? response.statusText}`);
    }

    const result: ApiResponse<Lookbook> = await response.json();
    if (result.success && result.data) return result.data;

    throw new Error(result.message || "Failed to create lookbook");
  } catch (error) {
    console.error("Error creating lookbook:", error);
    throw error;
  }
}

// ✅ Update lookbook by ID
export async function updateLookbook(
  id: string,
  data: { name?: string; image?: File; description?: string }
): Promise<Lookbook> {
  try {
    const url = `${API_BASE_URL}/lookbook/${id}`;
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.image) formData.append("image", data.image);
    if (data.description) formData.append("description", data.description);

    const response = await fetch(url, { method: "PUT", body: formData });
    if (!response.ok) {
      const result: ApiResponse<Lookbook> = await response.json();
      console.log("result", result);
      throw new Error(` ${result?.message ?? response.statusText}`);
    }

    const result: ApiResponse<Lookbook> = await response.json();
    if (result.success && result.data) return result.data;

    throw new Error(result.message || "Failed to update lookbook");
  } catch (error) {
    console.error("Error updating lookbook:", error);
    throw error;
  }
}

// ✅ Delete lookbook by ID
export async function deleteLookbook(id: string): Promise<Lookbook> {
  try {
    const url = `${API_BASE_URL}/lookbook/${id}`;
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok)
      throw new Error(`Failed to delete lookbook: ${response.statusText}`);

    const result: ApiResponse<Lookbook> = await response.json();
    if (result.success && result.data) return result.data;

    throw new Error(result.message || "Failed to delete lookbook");
  } catch (error) {
    console.error("Error deleting lookbook:", error);
    throw error;
  }
}


// get country //

export async function getCountry() {
  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    const data = await res.json();
    return data.country; // Example: "IN", "AE"
  } catch (e) {
    return "US"; // fallback
  }
}

// convert price //
const currencyMap: Record<string, { code: string; symbol: string }> = {
  IN: { code: "INR", symbol: "₹" },
  AE: { code: "AED", symbol: "AED " },
  US: { code: "USD", symbol: "$" },
};

export async function convertPrice(basePriceINR: number, country: string) {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/INR", {
      cache: "no-store",
    });
    const data = await res.json();

    const currency = currencyMap[country] || currencyMap["AED"];
    const rate = data.rates[currency.code];

    const finalPrice = (basePriceINR * rate).toFixed(2);

    return currency.symbol + finalPrice;
  } catch (e) {
    return "$" + basePriceINR;
  }
}




