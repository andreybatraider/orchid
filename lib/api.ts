// Обновленные функции API - теперь используют локальное хранилище
import { 
  getPortfolio as getPortfolioData, 
  getTournaments as getTournamentsData,
  type Video,
  type Tournament 
} from './data';

export type { Video, Tournament };

export interface ApiResponse<T> {
  list: T[];
  pageInfo: {
    totalRows: number;
    page: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
}

export async function fetchPortfolio(
  offset: number = 0,
  limit: number = 25
): Promise<ApiResponse<Video>> {
  try {
    const allVideos = await getPortfolioData();
    const totalRows = allVideos.length;
    const paginatedVideos = allVideos.slice(offset, offset + limit);
    
    return {
      list: paginatedVideos,
      pageInfo: {
        totalRows,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
        isFirstPage: offset === 0,
        isLastPage: offset + limit >= totalRows,
      },
    };
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    return {
      list: [],
      pageInfo: {
        totalRows: 0,
        page: 1,
        pageSize: 25,
        isFirstPage: true,
        isLastPage: true,
      },
    };
  }
}

export async function fetchTournaments(
  offset: number = 0,
  limit: number = 25
): Promise<ApiResponse<Tournament>> {
  try {
    const allTournaments = await getTournamentsData();
    const totalRows = allTournaments.length;
    const paginatedTournaments = allTournaments.slice(offset, offset + limit);
    
    return {
      list: paginatedTournaments,
      pageInfo: {
        totalRows,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
        isFirstPage: offset === 0,
        isLastPage: offset + limit >= totalRows,
      },
    };
  } catch (error) {
    console.error('Failed to fetch tournaments:', error);
    return {
      list: [],
      pageInfo: {
        totalRows: 0,
        page: 1,
        pageSize: 25,
        isFirstPage: true,
        isLastPage: true,
      },
    };
  }
}
