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
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, UserData, Address, ApiResponse } from '@/types/database';

const USERS_COLLECTION = 'users';

export class UserService {
  /**
   * Create a new user profile in Firestore
   */
  static async createUser(userId: string, userData: Partial<UserData>): Promise<ApiResponse<User>> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      
      const newUser: UserData = {
        email: userData.email || '',
        displayName: userData.displayName || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      await setDoc(userRef, {
        ...newUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        data: { id: userId, ...newUser },
        message: 'User created successfully'
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: 'Failed to create user profile'
      };
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserById(userId: string): Promise<ApiResponse<User>> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const userData = userSnap.data() as UserData;
      const user: User = {
        id: userSnap.id,
        ...userData,
        createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData.createdAt,
        updatedAt: userData.updatedAt instanceof Timestamp ? userData.updatedAt.toDate() : userData.updatedAt
      };

      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Error getting user:', error);
      return {
        success: false,
        error: 'Failed to fetch user profile'
      };
    }
  }

  /**
   * Get user profile by email
   */
  static async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    try {
      const usersRef = collection(db, USERS_COLLECTION);
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as UserData;
      const user: User = {
        id: userDoc.id,
        ...userData,
        createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData.createdAt,
        updatedAt: userData.updatedAt instanceof Timestamp ? userData.updatedAt.toDate() : userData.updatedAt
      };

      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return {
        success: false,
        error: 'Failed to fetch user profile'
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateUser(userId: string, updates: Partial<UserData>): Promise<ApiResponse<User>> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      
      // Check if user exists
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(userRef, updateData);

      // Get updated user data
      const updatedUserSnap = await getDoc(userRef);
      const userData = updatedUserSnap.data() as UserData;
      const user: User = {
        id: updatedUserSnap.id,
        ...userData,
        createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData.createdAt,
        updatedAt: userData.updatedAt instanceof Timestamp ? userData.updatedAt.toDate() : userData.updatedAt
      };

      return {
        success: true,
        data: user,
        message: 'User profile updated successfully'
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: 'Failed to update user profile'
      };
    }
  }

  /**
   * Update user address
   */
  static async updateUserAddress(userId: string, address: Address): Promise<ApiResponse<User>> {
    try {
      return await this.updateUser(userId, { address });
    } catch (error) {
      console.error('Error updating user address:', error);
      return {
        success: false,
        error: 'Failed to update user address'
      };
    }
  }

  /**
   * Deactivate user account
   */
  static async deactivateUser(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      
      await updateDoc(userRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        data: true,
        message: 'User account deactivated successfully'
      };
    } catch (error) {
      console.error('Error deactivating user:', error);
      return {
        success: false,
        error: 'Failed to deactivate user account'
      };
    }
  }

  /**
   * Reactivate user account
   */
  static async reactivateUser(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      
      await updateDoc(userRef, {
        isActive: true,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        data: true,
        message: 'User account reactivated successfully'
      };
    } catch (error) {
      console.error('Error reactivating user:', error);
      return {
        success: false,
        error: 'Failed to reactivate user account'
      };
    }
  }

  /**
   * Delete user account and all associated data
   */
  static async deleteUser(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await deleteDoc(userRef);

      return {
        success: true,
        data: true,
        message: 'User account deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: 'Failed to delete user account'
      };
    }
  }

  /**
   * Check if user exists
   */
  static async userExists(userId: string): Promise<boolean> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }

  /**
   * Get all active users (admin function)
   */
  static async getAllActiveUsers(): Promise<ApiResponse<User[]>> {
    try {
      const usersRef = collection(db, USERS_COLLECTION);
      const q = query(usersRef, where('isActive', '==', true));
      const querySnapshot = await getDocs(q);

      const users: User[] = querySnapshot.docs.map(doc => {
        const userData = doc.data() as UserData;
        return {
          id: doc.id,
          ...userData,
          createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData.createdAt,
          updatedAt: userData.updatedAt instanceof Timestamp ? userData.updatedAt.toDate() : userData.updatedAt
        };
      });

      return {
        success: true,
        data: users
      };
    } catch (error) {
      console.error('Error getting all users:', error);
      return {
        success: false,
        error: 'Failed to fetch users'
      };
    }
  }
}