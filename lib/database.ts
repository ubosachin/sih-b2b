// Firestore database operations for B2B herb portal
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
} from "firebase/firestore"
import { db } from "./firebase"

// Type definitions
export interface Business {
  id?: string
  name: string
  email: string
  contactPerson?: string
  phone?: string
  address?: string
  registrationNumber?: string
  taxId?: string
  status: "active" | "inactive"
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Product {
  id?: string
  name: string
  description: string
  categoryId: string
  farmerId: string
  price: number
  unit: string
  stockQuantity: number
  minOrderQuantity: number
  imageUrl?: string
  batchNumber: string
  harvestDate: Timestamp
  expiryDate: Timestamp
  organicCertified: boolean
  labReportUrl?: string
  qrCode: string
  barcode: string
  status: "active" | "inactive"
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CartItem {
  id?: string
  businessId: string
  productId: string
  quantity: number
  addedAt: Timestamp
}

export interface Order {
  id?: string
  businessId: string
  orderNumber: string
  totalAmount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  shippingAddress?: string
  billingAddress?: string
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface OrderItem {
  id?: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  createdAt: Timestamp
}

// Database helper functions
export const firebaseDb = {
  // Business operations
  async createBusiness(business: Omit<Business, "id" | "createdAt" | "updatedAt">) {
    const now = Timestamp.now()
    const docRef = await addDoc(collection(db, "businesses"), {
      ...business,
      createdAt: now,
      updatedAt: now,
    })
    return { id: docRef.id, ...business, createdAt: now, updatedAt: now }
  },

  async getBusinessByEmail(email: string) {
    const q = query(collection(db, "businesses"), where("email", "==", email))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Business
  },

  async getBusinessById(id: string) {
    const docRef = doc(db, "businesses", id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return { id: docSnap.id, ...docSnap.data() } as Business
  },

  // Product operations
  async getProducts(limitCount = 20, categoryId?: string) {
    let q = query(
      collection(db, "products"),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    )

    if (categoryId) {
      q = query(
        collection(db, "products"),
        where("status", "==", "active"),
        where("categoryId", "==", categoryId),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      )
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product)
  },

  async getProductById(id: string) {
    const docRef = doc(db, "products", id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return { id: docSnap.id, ...docSnap.data() } as Product
  },

  async getProductByQRCode(qrCode: string) {
    const q = query(collection(db, "products"), where("qrCode", "==", qrCode), where("status", "==", "active"))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    const docData = querySnapshot.docs[0]
    return { id: docData.id, ...docData.data() } as Product
  },

  async getProductByBarcode(barcode: string) {
    const q = query(collection(db, "products"), where("barcode", "==", barcode), where("status", "==", "active"))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    const docData = querySnapshot.docs[0]
    return { id: docData.id, ...docData.data() } as Product
  },

  // Categories
  async getCategories() {
    const querySnapshot = await getDocs(collection(db, "categories"))
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  // Cart operations
  async addToCart(businessId: string, productId: string, quantity: number) {
    // Check if item already exists in cart
    const q = query(
      collection(db, "cartItems"),
      where("businessId", "==", businessId),
      where("productId", "==", productId),
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      // Update existing cart item
      const existingDoc = querySnapshot.docs[0]
      const currentQuantity = existingDoc.data().quantity
      await updateDoc(existingDoc.ref, {
        quantity: currentQuantity + quantity,
        addedAt: Timestamp.now(),
      })
      return { id: existingDoc.id, ...existingDoc.data(), quantity: currentQuantity + quantity }
    } else {
      // Add new cart item
      const docRef = await addDoc(collection(db, "cartItems"), {
        businessId,
        productId,
        quantity,
        addedAt: Timestamp.now(),
      })
      return { id: docRef.id, businessId, productId, quantity, addedAt: Timestamp.now() }
    }
  },

  async getCartItems(businessId: string) {
    const q = query(collection(db, "cartItems"), where("businessId", "==", businessId), orderBy("addedAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as CartItem)
  },

  async updateCartItem(businessId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(businessId, productId)
    }

    const q = query(
      collection(db, "cartItems"),
      where("businessId", "==", businessId),
      where("productId", "==", productId),
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref
      await updateDoc(docRef, {
        quantity,
        addedAt: Timestamp.now(),
      })
      return { id: querySnapshot.docs[0].id, businessId, productId, quantity, addedAt: Timestamp.now() }
    }
    return null
  },

  async removeFromCart(businessId: string, productId: string) {
    const q = query(
      collection(db, "cartItems"),
      where("businessId", "==", businessId),
      where("productId", "==", productId),
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      await deleteDoc(querySnapshot.docs[0].ref)
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() }
    }
    return null
  },

  async clearCart(businessId: string) {
    const q = query(collection(db, "cartItems"), where("businessId", "==", businessId))
    const querySnapshot = await getDocs(q)

    const batch = writeBatch(db)
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()
  },

  // Order operations
  async createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">) {
    const now = Timestamp.now()
    const docRef = await addDoc(collection(db, "orders"), {
      ...order,
      createdAt: now,
      updatedAt: now,
    })
    return { id: docRef.id, ...order, createdAt: now, updatedAt: now }
  },

  async addOrderItems(orderId: string, items: Omit<OrderItem, "id" | "orderId" | "createdAt">[]) {
    const batch = writeBatch(db)
    const now = Timestamp.now()

    items.forEach((item) => {
      const docRef = doc(collection(db, "orderItems"))
      batch.set(docRef, {
        ...item,
        orderId,
        createdAt: now,
      })
    })

    await batch.commit()
  },

  async getOrdersByBusiness(businessId: string) {
    const q = query(collection(db, "orders"), where("businessId", "==", businessId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order)
  },

  async getOrderById(orderId: string, businessId: string) {
    const docRef = doc(db, "orders", orderId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null

    const orderData = { id: docSnap.id, ...docSnap.data() } as Order
    if (orderData.businessId !== businessId) return null

    return orderData
  },

  async getOrderItems(orderId: string) {
    const q = query(collection(db, "orderItems"), where("orderId", "==", orderId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as OrderItem)
  },

  // Product scan tracking
  async recordProductScan(scan: {
    businessId: string
    productId: string
    scanType: "qr" | "barcode"
    scanCode: string
    location?: string
  }) {
    const docRef = await addDoc(collection(db, "productScans"), {
      ...scan,
      scanTimestamp: Timestamp.now(),
      verified: true,
    })
    return { id: docRef.id, ...scan, scanTimestamp: Timestamp.now(), verified: true }
  },
}

export { db as firestore }
