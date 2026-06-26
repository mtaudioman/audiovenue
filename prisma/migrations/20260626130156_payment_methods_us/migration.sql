/*
  Warnings:

  - The values [zelle,paypal,CASH_ON_DELIVERY] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('BANK_TRANSFER', 'CHIME', 'CASHAPP', 'ZELLE', 'APPLE_PAY', 'PAYPAL', 'VENMO', 'CARD', 'BITCOIN');
ALTER TABLE "orders" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new" USING ("paymentMethod"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
COMMIT;
