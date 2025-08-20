import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
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

export async function GET(req: Request) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const snapshot = await dbAdmin.collection('users').doc(user.uid).collection('projects').orderBy('createdAt', 'desc').get();
    const projects = snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, roomType, styles, designs } = await req.json();
    if (!Array.isArray(styles) || !Array.isArray(designs)) {
      return NextResponse.json({ error: 'styles and designs are required arrays' }, { status: 400 });
    }
    const project = {
      name: name || 'AI Design Project',
      roomType: roomType || null,
      styles,
      createdAt: new Date().toISOString(),
      designs: designs.map((d: any) => ({ ...d, liked: false, saved: false })),
    };
    const docRef = await dbAdmin.collection('users').doc(user.uid).collection('projects').add(project);
    return NextResponse.json({ project: { id: docRef.id, ...project } });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
