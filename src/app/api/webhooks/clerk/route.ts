import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import clientPromise from '@/lib/db';
import { User } from '@/types/user';

export async function POST(req: NextRequest) {
  const headerPayload = req.headers;
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: any;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error occurred', {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      const client = await clientPromise;
      const db = client.db('your_database_name');
      const users = db.collection<User>('users');

      const newUser: User = {
        clerkId: id,
        email: email_addresses[0]?.email_address || '',
        firstName: first_name || '',
        lastName: last_name || '',
        imageUrl: image_url || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await users.insertOne(newUser);
      console.log('User created in MongoDB:', newUser);

      return new NextResponse('User created successfully', { status: 200 });
    } catch (error) {
      console.error('Error creating user in MongoDB:', error);
      return new NextResponse('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      const client = await clientPromise;
      const db = client.db('your_database_name');
      const users = db.collection<User>('users');

      await users.updateOne(
        { clerkId: id },
        {
          $set: {
            email: email_addresses[0]?.email_address || '',
            firstName: first_name || '',
            lastName: last_name || '',
            imageUrl: image_url || '',
            updatedAt: new Date(),
          },
        }
      );

      console.log('User updated in MongoDB');
      return new NextResponse('User updated successfully', { status: 200 });
    } catch (error) {
      console.error('Error updating user in MongoDB:', error);
      return new NextResponse('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      const client = await clientPromise;
      const db = client.db('your_database_name');
      const users = db.collection<User>('users');

      await users.deleteOne({ clerkId: id });
      console.log('User deleted from MongoDB');

      return new NextResponse('User deleted successfully', { status: 200 });
    } catch (error) {
      console.error('Error deleting user from MongoDB:', error);
      return new NextResponse('Error deleting user', { status: 500 });
    }
  }

  return new NextResponse('Webhook received', { status: 200 });
}
