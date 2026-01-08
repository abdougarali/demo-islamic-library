import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    // معلومات العميل
    customerName: {
      type: String,
      required: [true, 'اسم العميل مطلوب'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'رقم الهاتف مطلوب'],
      trim: true,
    },
    customerAddress: {
      type: String,
      required: [true, 'العنوان مطلوب'],
      trim: true,
    },

    // الكتب المطلوبة
    books: [
      {
        id: String,
        title: String,
        author: String,
        price: Number,
        image: String,
      },
    ],

    // معلومات الطلب
    totalPrice: {
      type: Number,
      required: [true, 'السعر الإجمالي مطلوب'],
    },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'delivered', 'canceled'],
      default: 'new',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // يضيف createdAt و updatedAt تلقائياً
  }
);

// حذف النموذج من الذاكرة إذا كان موجوداً لإعادة تعريفه مع التحديثات الجديدة
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.model('Order', OrderSchema);
