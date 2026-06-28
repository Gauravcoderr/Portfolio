import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 10MB' }, { status: 400 });
    }

    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF, DOC, or DOCX allowed' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'pdf';
    const filename = `resume/resume-${Date.now()}.${ext}`;

    const blob = await put(filename, file, { access: 'public' });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('[resume/upload]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
