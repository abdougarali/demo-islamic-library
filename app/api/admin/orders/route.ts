import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

/**
 * GET /api/admin/orders
 * جلب جميع الطلبات (محمي - يحتاج تسجيل دخول)
 */
export async function GET(request: NextRequest) {
  try {
    // التحقق من تسجيل الدخول (يجب استخدام await في Next.js 16)
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // بناء الاستعلام
    const query: any = {};
    if (status && ['new', 'confirmed', 'delivered', 'canceled'].includes(status)) {
      query.status = status;
    }

    // جلب الطلبات مع Pagination
    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .sort({ createdAt: -1 }) // الأحدث أولاً
      .skip(skip)
      .limit(limit)
      .lean(); // تحويل إلى JSON عادي

    // عدد الطلبات الإجمالي
    const total = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الطلبات' },
      { status: 500 }
    );
  }
}
