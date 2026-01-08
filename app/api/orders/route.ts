import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

/**
 * POST /api/orders
 * إنشاء طلب جديد
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const orderData = await request.json();

    // التحقق من البيانات المطلوبة
    if (!orderData.customerName || !orderData.customerPhone || !orderData.customerAddress) {
      return NextResponse.json(
        { error: 'البيانات غير مكتملة. يرجى إدخال الاسم والهاتف والعنوان' },
        { status: 400 }
      );
    }

    if (!orderData.books || !Array.isArray(orderData.books) || orderData.books.length === 0) {
      return NextResponse.json(
        { error: 'يرجى اختيار كتاب واحد على الأقل' },
        { status: 400 }
      );
    }

    if (!orderData.totalPrice || orderData.totalPrice <= 0) {
      return NextResponse.json(
        { error: 'السعر الإجمالي غير صحيح' },
        { status: 400 }
      );
    }

    // إنشاء الطلب
    const order = await Order.create({
      customerName: orderData.customerName.trim(),
      customerPhone: orderData.customerPhone.trim(),
      customerAddress: orderData.customerAddress.trim(),
      books: orderData.books,
      totalPrice: orderData.totalPrice,
      status: 'new',
      notes: orderData.notes?.trim() || '',
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order._id.toString(),
        message: 'تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}
