import { NextResponse } from 'next/server';
import { authAdmin, dbAdmin } from '@/lib/firebase-admin';

async function authenticate(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    return await authAdmin.verifyIdToken(token);
  } catch (error) {
    return null;
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ projectId: string; designId: string }> }) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { projectId, designId } = await params;
    const projectRef = dbAdmin.collection('users').doc(user.uid).collection('projects').doc(projectId);
    const doc = await projectRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    const project = doc.data()!;
    const design = project.designs.find((d: any) => d.id === designId);
    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }
    design.saved = !design.saved;
    await projectRef.update({ designs: project.designs });
    return NextResponse.json({ saved: !!design.saved });
  } catch (error) {
    console.error('Error saving design:', error);
    return NextResponse.json({ error: 'Failed to save design' }, { status: 500 });
  }
}
