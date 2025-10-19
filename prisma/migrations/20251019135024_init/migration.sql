-- CreateEnum
CREATE TYPE "public"."RoleName" AS ENUM ('client', 'admin', 'seller');

-- CreateEnum
CREATE TYPE "public"."VehicleStatus" AS ENUM ('available', 'sold', 'rented', 'maintenance');

-- CreateEnum
CREATE TYPE "public"."StatusTransaction" AS ENUM ('pending', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('sale', 'rental');

-- CreateTable
CREATE TABLE "public"."Language" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "name" "public"."RoleName" NOT NULL DEFAULT 'client',

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'fr',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "verificationExpiresAt" TIMESTAMP(3),
    "resetPasswordToken" TEXT,
    "resetPasswordExpiresAt" TIMESTAMP(3),
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category_Translation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "Category_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Brand" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Brand_Translation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brandId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "Brand_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vehicle" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "bodyType" TEXT,
    "range" TEXT,
    "condition" TEXT NOT NULL,
    "status" "public"."VehicleStatus" NOT NULL DEFAULT 'available',
    "stock" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2),
    "rentalPricePerDay" DECIMAL(10,2),
    "firstRegistration" TIMESTAMP(3),
    "countryOrigin" TEXT,
    "axleCount" INTEGER,
    "axleBrand" TEXT,
    "mileage" INTEGER,
    "emissionNorm" TEXT,
    "gearbox" TEXT,
    "enginePower" INTEGER,
    "engineSize" INTEGER,
    "dimensions" TEXT,
    "fuelType" TEXT,
    "tonnage" TEXT,
    "tires" TEXT,
    "cabinType" TEXT,
    "cabinEquipments" TEXT,
    "specificEquipments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "supplierId" TEXT,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vehicle_Translation" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "vehicleId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "Vehicle_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VehicleImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "vehicleId" TEXT NOT NULL,

    CONSTRAINT "VehicleImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "public"."StatusTransaction" NOT NULL DEFAULT 'pending',
    "whatsappLink" TEXT,
    "totalAmount" DECIMAL(10,2),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VehicleTransaction" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(10,2),
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "vehicleId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "VehicleTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_Translation_categoryId_languageId_key" ON "public"."Category_Translation"("categoryId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "public"."Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_Translation_brandId_languageId_key" ON "public"."Brand_Translation"("brandId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "public"."Supplier"("name");

-- CreateIndex
CREATE INDEX "Vehicle_status_idx" ON "public"."Vehicle"("status");

-- CreateIndex
CREATE INDEX "Vehicle_categoryId_idx" ON "public"."Vehicle"("categoryId");

-- CreateIndex
CREATE INDEX "Vehicle_brandId_idx" ON "public"."Vehicle"("brandId");

-- CreateIndex
CREATE INDEX "Vehicle_createdAt_idx" ON "public"."Vehicle"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_Translation_vehicleId_languageId_key" ON "public"."Vehicle_Translation"("vehicleId", "languageId");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "public"."Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "public"."Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "public"."Transaction"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleTransaction_vehicleId_transactionId_key" ON "public"."VehicleTransaction"("vehicleId", "transactionId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category_Translation" ADD CONSTRAINT "Category_Translation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category_Translation" ADD CONSTRAINT "Category_Translation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Brand_Translation" ADD CONSTRAINT "Brand_Translation_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Brand_Translation" ADD CONSTRAINT "Brand_Translation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vehicle" ADD CONSTRAINT "Vehicle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vehicle" ADD CONSTRAINT "Vehicle_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vehicle" ADD CONSTRAINT "Vehicle_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vehicle" ADD CONSTRAINT "Vehicle_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vehicle_Translation" ADD CONSTRAINT "Vehicle_Translation_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vehicle_Translation" ADD CONSTRAINT "Vehicle_Translation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VehicleImage" ADD CONSTRAINT "VehicleImage_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VehicleTransaction" ADD CONSTRAINT "VehicleTransaction_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VehicleTransaction" ADD CONSTRAINT "VehicleTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
