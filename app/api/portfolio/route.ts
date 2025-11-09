import { NextRequest, NextResponse } from 'next/server';
import { fetchPortfolio } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '25');
    const viewId = searchParams.get('viewId') || undefined;

    const data = await fetchPortfolio(offset, limit, viewId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    return NextResponse.json(
      {
        list: [],
        pageInfo: {
          totalRows: 0,
          page: 1,
          pageSize: 25,
          isFirstPage: true,
          isLastPage: true,
        },
      },
      { status: 200 }
    );
  }
}

