import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/admin/login
 * تسجيل دخول البائع
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = body?.password;

    if (!password) {
      return NextResponse.json(
        { error: 'كلمة المرور مطلوبة' },
        { status: 400 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('❌ ADMIN_PASSWORD غير معرف في .env.local');
      return NextResponse.json(
        { 
          error: 'خطأ في إعدادات السيرفر. ADMIN_PASSWORD غير موجود.'
        },
        { status: 500 }
      );
    }

    // تنظيف القيم من المسافات والأحرف غير المرئية
    const cleanedPassword = String(password).trim().replace(/\s+/g, '');
    const cleanedAdminPassword = String(adminPassword).trim().replace(/\s+/g, '');

    // Debug: تسجيل مفصل
    console.log('=== LOGIN DEBUG ===');
    console.log('Password received:', JSON.stringify(password));
    console.log('Password type:', typeof password);
    console.log('Password length:', password?.length);
    console.log('Cleaned password:', JSON.stringify(cleanedPassword));
    console.log('Cleaned password length:', cleanedPassword.length);
    console.log('Admin password from env:', JSON.stringify(adminPassword));
    console.log('Admin password type:', typeof adminPassword);
    console.log('Admin password length:', adminPassword?.length);
    console.log('Cleaned admin password:', JSON.stringify(cleanedAdminPassword));
    console.log('Cleaned admin password length:', cleanedAdminPassword.length);
    console.log('Match (exact):', password === adminPassword);
    console.log('Match (cleaned):', cleanedPassword === cleanedAdminPassword);
    console.log('Char codes password:', cleanedPassword.split('').map(c => c.charCodeAt(0)));
    console.log('Char codes admin:', cleanedAdminPassword.split('').map(c => c.charCodeAt(0)));
    console.log('==================');
    
    // التحقق من كلمة المرور
    if (cleanedPassword === cleanedAdminPassword) {
      try {
        // إنشاء session cookie (يجب استخدام await في Next.js 16)
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 أيام
          path: '/',
        });

        console.log('✅ Cookie set successfully');

        return NextResponse.json({
          success: true,
          message: 'تم تسجيل الدخول بنجاح',
        });
      } catch (cookieError: any) {
        console.error('❌ Error setting cookie:', cookieError);
        return NextResponse.json(
          { 
            error: 'حدث خطأ أثناء إنشاء الجلسة',
            debug: cookieError?.message || 'Unknown cookie error'
          },
          { status: 500 }
        );
      }
    } else {
      console.log('❌ Password mismatch');
      return NextResponse.json(
        { 
          error: 'كلمة المرور غير صحيحة',
          debug: {
            receivedLength: cleanedPassword.length,
            expectedLength: cleanedAdminPassword.length,
            match: false
          }
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('❌ Error in login route:', error);
    console.error('Error stack:', error?.stack);
    console.error('Error message:', error?.message);
    return NextResponse.json(
      { 
        error: 'حدث خطأ أثناء تسجيل الدخول',
        debug: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
