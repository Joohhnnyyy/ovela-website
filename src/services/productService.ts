import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, ProductData, ProductFilters, ApiResponse, PaginatedResponse } from '@/types/database';

const PRODUCTS_COLLECTION = 'products';

export class ProductService {
  /**
   * Create a new product
   */
  static async createProduct(productData: Omit<ProductData, 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    try {
      const productRef = doc(collection(db, PRODUCTS_COLLECTION));
      
      const newProduct: ProductData = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: productData.isActive ?? true,
        isFeatured: productData.isFeatured ?? false,
        rating: productData.rating ?? 0,
        reviewCount: productData.reviewCount ?? 0
      };

      await setDoc(productRef, {
        ...newProduct,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        data: { id: productRef.id, ...newProduct },
        message: 'Product created successfully'
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: 'Failed to create product'
      };
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(productId: string): Promise<ApiResponse<Product>> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      const productData = productSnap.data() as ProductData;
      const product: Product = {
        id: productSnap.id,
        ...productData,
        createdAt: productData.createdAt instanceof Timestamp ? productData.createdAt.toDate() : productData.createdAt,
        updatedAt: productData.updatedAt instanceof Timestamp ? productData.updatedAt.toDate() : productData.updatedAt
      };

      return {
        success: true,
        data: product
      };
    } catch (error) {
      console.error('Error getting product:', error);
      return {
        success: false,
        error: 'Failed to fetch product'
      };
    }
  }

  /**
   * Get products with filters and pagination
   */
  static async getProducts(
    filters: ProductFilters = {},
    page: number = 1,
    pageLimit: number = 20,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      let q = query(productsRef);

      // Apply filters
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.subcategory) {
        q = query(q, where('subcategory', '==', filters.subcategory));
      }
      if (filters.brand) {
        q = query(q, where('brand', '==', filters.brand));
      }
      if (filters.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }
      if (filters.isFeatured !== undefined) {
        q = query(q, where('isFeatured', '==', filters.isFeatured));
      }
      if (filters.tags && filters.tags.length > 0) {
        q = query(q, where('tags', 'array-contains-any', filters.tags));
      }

      // Apply sorting
      q = query(q, orderBy(sortBy, sortOrder));

      // Apply pagination
      const offset = (page - 1) * pageLimit;
      if (offset > 0) {
        // For pagination, we need to get the last document from previous page
        const prevQuery = query(q, limit(offset));
        const prevSnapshot = await getDocs(prevQuery);
        if (!prevSnapshot.empty) {
          const lastDoc = prevSnapshot.docs[prevSnapshot.docs.length - 1];
          q = query(q, startAfter(lastDoc), limit(pageLimit));
        }
      } else {
        q = query(q, limit(pageLimit));
      }

      const querySnapshot = await getDocs(q);
      
      const products: Product[] = querySnapshot.docs.map(doc => {
        const productData = doc.data() as ProductData;
        return {
          id: doc.id,
          ...productData,
          createdAt: productData.createdAt instanceof Timestamp ? productData.createdAt.toDate() : productData.createdAt,
          updatedAt: productData.updatedAt instanceof Timestamp ? productData.updatedAt.toDate() : productData.updatedAt
        };
      });

      // Filter by price range (client-side filtering for complex queries)
      let filteredProducts = products;
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        filteredProducts = products.filter(product => {
          if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
          if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;
          return true;
        });
      }

      const hasMore = querySnapshot.docs.length === pageLimit;

      return {
        success: true,
        data: {
          data: filteredProducts,
          total: filteredProducts.length,
          page,
          limit: pageLimit,
          hasMore
        }
      };
    } catch (error) {
      console.error('Error getting products:', error);
      return {
        success: false,
        error: 'Failed to fetch products'
      };
    }
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limitCount: number = 10): Promise<ApiResponse<Product[]>> {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(
        productsRef,
        where('isFeatured', '==', true),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      
      const products: Product[] = querySnapshot.docs.map(doc => {
        const productData = doc.data() as ProductData;
        return {
          id: doc.id,
          ...productData,
          createdAt: productData.createdAt instanceof Timestamp ? productData.createdAt.toDate() : productData.createdAt,
          updatedAt: productData.updatedAt instanceof Timestamp ? productData.updatedAt.toDate() : productData.updatedAt
        };
      });

      return {
        success: true,
        data: products
      };
    } catch (error) {
      console.error('Error getting featured products:', error);
      return {
        success: false,
        error: 'Failed to fetch featured products'
      };
    }
  }

  /**
   * Update product
   */
  static async updateProduct(productId: string, updates: Partial<ProductData>): Promise<ApiResponse<Product>> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      
      // Check if product exists
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(productRef, updateData);

      // Get updated product data
      const updatedProductSnap = await getDoc(productRef);
      const productData = updatedProductSnap.data() as ProductData;
      const product: Product = {
        id: updatedProductSnap.id,
        ...productData,
        createdAt: productData.createdAt instanceof Timestamp ? productData.createdAt.toDate() : productData.createdAt,
        updatedAt: productData.updatedAt instanceof Timestamp ? productData.updatedAt.toDate() : productData.updatedAt
      };

      return {
        success: true,
        data: product,
        message: 'Product updated successfully'
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return {
        success: false,
        error: 'Failed to update product'
      };
    }
  }

  /**
   * Update product inventory
   */
  static async updateInventory(productId: string, size: string, color: string, quantity: number): Promise<ApiResponse<boolean>> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      const productData = productSnap.data() as ProductData;
      const inventory = productData.inventory || [];
      
      // Find and update the specific inventory item
      const inventoryIndex = inventory.findIndex(item => item.size === size && item.color === color);
      
      if (inventoryIndex >= 0) {
        inventory[inventoryIndex].quantity = quantity;
      } else {
        // Add new inventory item if not found
        inventory.push({
          size,
          color,
          quantity,
          sku: `${productId}-${size}-${color}`.toUpperCase()
        });
      }

      await updateDoc(productRef, {
        inventory,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        data: true,
        message: 'Inventory updated successfully'
      };
    } catch (error) {
      console.error('Error updating inventory:', error);
      return {
        success: false,
        error: 'Failed to update inventory'
      };
    }
  }

  /**
   * Decrease inventory (for purchases)
   */
  static async decreaseInventory(productId: string, size: string, color: string, quantity: number): Promise<ApiResponse<boolean>> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      const productData = productSnap.data() as ProductData;
      const inventory = productData.inventory || [];
      
      const inventoryIndex = inventory.findIndex(item => item.size === size && item.color === color);
      
      if (inventoryIndex < 0) {
        return {
          success: false,
          error: 'Inventory item not found'
        };
      }

      const currentQuantity = inventory[inventoryIndex].quantity;
      if (currentQuantity < quantity) {
        return {
          success: false,
          error: 'Insufficient inventory'
        };
      }

      inventory[inventoryIndex].quantity = currentQuantity - quantity;

      await updateDoc(productRef, {
        inventory,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        data: true,
        message: 'Inventory decreased successfully'
      };
    } catch (error) {
      console.error('Error decreasing inventory:', error);
      return {
        success: false,
        error: 'Failed to decrease inventory'
      };
    }
  }

  /**
   * Delete product
   */
  static async deleteProduct(productId: string): Promise<ApiResponse<boolean>> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await deleteDoc(productRef);

      return {
        success: true,
        data: true,
        message: 'Product deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      return {
        success: false,
        error: 'Failed to delete product'
      };
    }
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category: string, limitCount: number = 20): Promise<ApiResponse<Product[]>> {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(
        productsRef,
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      
      const products: Product[] = querySnapshot.docs.map(doc => {
        const productData = doc.data() as ProductData;
        return {
          id: doc.id,
          ...productData,
          createdAt: productData.createdAt instanceof Timestamp ? productData.createdAt.toDate() : productData.createdAt,
          updatedAt: productData.updatedAt instanceof Timestamp ? productData.updatedAt.toDate() : productData.updatedAt
        };
      });

      return {
        success: true,
        data: products
      };
    } catch (error) {
      console.error('Error getting products by category:', error);
      return {
        success: false,
        error: 'Failed to fetch products by category'
      };
    }
  }

  /**
   * Search products by name or description
   */
  static async searchProducts(searchTerm: string, limitCount: number = 20): Promise<ApiResponse<Product[]>> {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(
        productsRef,
        where('isActive', '==', true),
        orderBy('name'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      
      // Client-side filtering for text search (Firestore doesn't support full-text search)
      const products: Product[] = querySnapshot.docs
        .map(doc => {
          const productData = doc.data() as ProductData;
          return {
            id: doc.id,
            ...productData,
            createdAt: productData.createdAt instanceof Timestamp ? productData.createdAt.toDate() : productData.createdAt,
            updatedAt: productData.updatedAt instanceof Timestamp ? productData.updatedAt.toDate() : productData.updatedAt
          };
        })
        .filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return {
        success: true,
        data: products
      };
    } catch (error) {
      console.error('Error searching products:', error);
      return {
        success: false,
        error: 'Failed to search products'
      };
    }
  }

  /**
   * Update product rating
   */
  static async updateProductRating(productId: string, newRating: number): Promise<ApiResponse<boolean>> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      
      await updateDoc(productRef, {
        rating: newRating,
        reviewCount: increment(1),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        data: true,
        message: 'Product rating updated successfully'
      };
    } catch (error) {
      console.error('Error updating product rating:', error);
      return {
        success: false,
        error: 'Failed to update product rating'
      };
    }
  }
}