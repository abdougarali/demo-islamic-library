import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

/**
 * PATCH /api/orders/[id]
 * تحديث حالة الطلب (محمي - يحتاج تسجيل دخول)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // await params في Next.js 16
    const { id } = await params;

    const { status } = await request.json();

    // التحقق من الحالة
    if (!status || !['new', 'confirmed', 'delivered', 'canceled'].includes(status)) {
      return NextResponse.json(
        { error: 'حالة الطلب غير صحيحة' },
        { status: 400 }
      );
    }

    // البحث عن الطلب وتحديثه
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        _id: order._id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        status: order.status,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      message: 'تم تحديث حالة الطلب بنجاح',
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    
    // خطأ في ID غير صحيح
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'رقم الطلب غير صحيح' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الطلب' },
      { status: 500 }
    );
  }
}
