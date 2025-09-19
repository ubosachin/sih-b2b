// Firebase seed script to populate initial data
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seedFirestore() {
  try {
    console.log("Starting Firestore seeding...")

    // Seed categories
    const categories = [
      {
        name: "Medicinal Herbs",
        description: "Herbs used for therapeutic and medicinal purposes",
        imageUrl: "/medicinal-herbs-turmeric-ginseng.jpg",
        createdAt: Timestamp.now(),
      },
      {
        name: "Culinary Herbs",
        description: "Fresh herbs for cooking and seasoning",
        imageUrl: "/culinary-herbs-basil-oregano.jpg",
        createdAt: Timestamp.now(),
      },
      {
        name: "Aromatic Herbs",
        description: "Herbs used for aromatherapy and fragrance",
        imageUrl: "/aromatic-herbs-lavender-rosemary.jpg",
        createdAt: Timestamp.now(),
      },
      {
        name: "Tea Herbs",
        description: "Herbs specifically for brewing teas and infusions",
        imageUrl: "/tea-herbs-chamomile-mint.jpg",
        createdAt: Timestamp.now(),
      },
    ]

    const categoryRefs = []
    for (const category of categories) {
      const docRef = await addDoc(collection(db, "categories"), category)
      categoryRefs.push(docRef.id)
      console.log(`Added category: ${category.name}`)
    }

    // Seed farmers
    const farmers = [
      {
        name: "John Smith",
        farmName: "Green Valley Organic Farm",
        location: "California, USA",
        contactEmail: "john@greenvalley.com",
        contactPhone: "+1-555-0101",
        certificationType: "USDA Organic",
        bio: "Specializing in organic medicinal herbs for over 20 years",
        createdAt: Timestamp.now(),
      },
      {
        name: "Maria Rodriguez",
        farmName: "Sunrise Herb Gardens",
        location: "Oregon, USA",
        contactEmail: "maria@sunriseherbs.com",
        contactPhone: "+1-555-0102",
        certificationType: "Certified Organic",
        bio: "Family-owned farm focusing on culinary and aromatic herbs",
        createdAt: Timestamp.now(),
      },
      {
        name: "David Chen",
        farmName: "Mountain View Herbs",
        location: "Colorado, USA",
        contactEmail: "david@mountainviewherbs.com",
        contactPhone: "+1-555-0103",
        certificationType: "Organic Plus",
        bio: "High-altitude herb cultivation with focus on potency and purity",
        createdAt: Timestamp.now(),
      },
    ]

    const farmerRefs = []
    for (const farmer of farmers) {
      const docRef = await addDoc(collection(db, "farmers"), farmer)
      farmerRefs.push(docRef.id)
      console.log(`Added farmer: ${farmer.name}`)
    }

    // Seed products
    const products = [
      {
        name: "Organic Turmeric Root",
        description: "Premium quality organic turmeric root with high curcumin content",
        categoryId: categoryRefs[0], // Medicinal Herbs
        farmerId: farmerRefs[0], // John Smith
        price: 24.99,
        unit: "kg",
        stockQuantity: 150,
        minOrderQuantity: 5,
        imageUrl: "/organic-turmeric-root.jpg",
        batchNumber: "TUR-2024-001",
        harvestDate: Timestamp.fromDate(new Date("2024-08-15")),
        expiryDate: Timestamp.fromDate(new Date("2026-08-15")),
        organicCertified: true,
        labReportUrl: "/lab-reports/turmeric-001.pdf",
        qrCode: "QR-TUR-001",
        barcode: "BC-789123456",
        status: "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        name: "Fresh Basil Leaves",
        description: "Aromatic sweet basil leaves perfect for culinary use",
        categoryId: categoryRefs[1], // Culinary Herbs
        farmerId: farmerRefs[1], // Maria Rodriguez
        price: 18.5,
        unit: "kg",
        stockQuantity: 80,
        minOrderQuantity: 2,
        imageUrl: "/fresh-basil.png",
        batchNumber: "BAS-2024-002",
        harvestDate: Timestamp.fromDate(new Date("2024-09-10")),
        expiryDate: Timestamp.fromDate(new Date("2024-12-10")),
        organicCertified: true,
        labReportUrl: "/lab-reports/basil-002.pdf",
        qrCode: "QR-BAS-002",
        barcode: "BC-789123457",
        status: "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        name: "Dried Chamomile Flowers",
        description: "Premium dried chamomile flowers for tea and aromatherapy",
        categoryId: categoryRefs[3], // Tea Herbs
        farmerId: farmerRefs[2], // David Chen
        price: 32.0,
        unit: "kg",
        stockQuantity: 120,
        minOrderQuantity: 3,
        imageUrl: "/dried-chamomile-flowers.jpg",
        batchNumber: "CAM-2024-003",
        harvestDate: Timestamp.fromDate(new Date("2024-07-20")),
        expiryDate: Timestamp.fromDate(new Date("2025-07-20")),
        organicCertified: true,
        labReportUrl: "/lab-reports/chamomile-003.pdf",
        qrCode: "QR-CAM-003",
        barcode: "BC-789123458",
        status: "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        name: "Organic Lavender Buds",
        description: "Fragrant organic lavender buds for aromatherapy and crafts",
        categoryId: categoryRefs[2], // Aromatic Herbs
        farmerId: farmerRefs[1], // Maria Rodriguez
        price: 28.75,
        unit: "kg",
        stockQuantity: 95,
        minOrderQuantity: 4,
        imageUrl: "/organic-lavender-buds.jpg",
        batchNumber: "LAV-2024-004",
        harvestDate: Timestamp.fromDate(new Date("2024-06-30")),
        expiryDate: Timestamp.fromDate(new Date("2025-06-30")),
        organicCertified: true,
        labReportUrl: "/lab-reports/lavender-004.pdf",
        qrCode: "QR-LAV-004",
        barcode: "BC-789123459",
        status: "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        name: "Fresh Oregano",
        description: "Aromatic fresh oregano leaves for Mediterranean cuisine",
        categoryId: categoryRefs[1], // Culinary Herbs
        farmerId: farmerRefs[0], // John Smith
        price: 22.0,
        unit: "kg",
        stockQuantity: 65,
        minOrderQuantity: 3,
        imageUrl: "/fresh-oregano-leaves.jpg",
        batchNumber: "ORE-2024-005",
        harvestDate: Timestamp.fromDate(new Date("2024-09-05")),
        expiryDate: Timestamp.fromDate(new Date("2024-11-05")),
        organicCertified: true,
        labReportUrl: "/lab-reports/oregano-005.pdf",
        qrCode: "QR-ORE-005",
        barcode: "BC-789123460",
        status: "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
    ]

    for (const product of products) {
      await addDoc(collection(db, "products"), product)
      console.log(`Added product: ${product.name}`)
    }

    console.log("Firestore seeding completed successfully!")
    console.log(`Created ${categories.length} categories, ${farmers.length} farmers, and ${products.length} products`)
  } catch (error) {
    console.error("Error seeding Firestore:", error)
  }
}

// Run the seed function
seedFirestore()
