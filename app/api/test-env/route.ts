import { NextResponse } from 'next/server';

/**
 * GET /api/test-env
 * اختبار قراءة Environment Variables
 */
export async function GET() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const mongodbUri = process.env.MONGODB_URI;

  return NextResponse.json({
    adminPassword: adminPassword ? `Found (length: ${adminPassword.length})` : 'NOT FOUND',
    adminPasswordValue: adminPassword || null,
    mongodbUri: mongodbUri ? `Found (length: ${mongodbUri.length})` : 'NOT FOUND',
    allEnvKeys: Object.keys(process.env).filter((k) => k.includes('ADMIN') || k.includes('MONGO')),
  });
}
