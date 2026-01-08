import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/admin/logout
 * تسجيل خروج البائع
 */
export async function POST() {
  try {
    // حذف session cookie (يجب استخدام await في Next.js 16)
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح',
    });
  } catch (error: any) {
    console.error('Error in logout:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الخروج' },
      { status: 500 }
    );
  }
}
