import { NextResponse } from 'next/server';
import User from '@/models/User';

export const revalidate = 86400; // Revalidate every 24 hours (86400 seconds)

export async function GET() {
      try {
            const totalUsers = await User.countDocuments();

            return NextResponse.json(
                  {
                        status: 'success',
                        count: totalUsers
                  },
                  {
                        headers: {
                              'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
                        },
                  }
            );
      } catch (error) {
            console.error('Error fetching user count:', error);
            return NextResponse.json(
                  {
                        status: 'failed',
                        message: 'Failed to fetch user count'
                  },
                  { status: 500 }
            );
      }
}

