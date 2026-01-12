import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseConnection, checkStorageConnection } from '@/app/lib/supabase';
import { verifyToken } from '@/app/lib/jwt';

export async function GET(request: NextRequest) {
    try {
        // Check server status (always true if this endpoint responds)
        const serverConnected = true;

        // Check database connection
        const databaseConnected = await checkDatabaseConnection();

        // Check storage connection
        const storageConnected = await checkStorageConnection();

        // Get admin info from token
        const token = request.cookies.get('admin_token')?.value;
        let adminInfo = null;

        if (token) {
            const payload = await verifyToken(token);
            if (payload) {
                adminInfo = {
                    name: payload.name,
                    username: payload.username,
                };
            }
        }

        return NextResponse.json({
            serverConnected,
            databaseConnected,
            storageConnected,
            adminInfo,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Status check error:', error);
        return NextResponse.json({
            serverConnected: true,
            databaseConnected: false,
            storageConnected: false,
            adminInfo: null,
            timestamp: new Date().toISOString(),
        });
    }
}
