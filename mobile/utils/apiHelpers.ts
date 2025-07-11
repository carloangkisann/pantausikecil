
import { ApiResponse } from '../types';

export const extractApiData = <T>(response: ApiResponse<T>): T | null => {
  if (response.success && response.data !== undefined) {
    return response.data;
  }
  return null;
};


export const extractApiArrayData = <T>(response: ApiResponse<T[]>): T[] => {
  if (response.success && response.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};


export const hasValidData = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } => {
  return response.success && response.data !== undefined && response.data !== null;
};


export const hasValidArrayData = <T>(response: ApiResponse<T[]>): response is ApiResponse<T[]> & { data: T[] } => {
  return response.success && response.data !== undefined && Array.isArray(response.data) && response.data.length > 0;
};


export const setSafeState = <T>(
  setState: React.Dispatch<React.SetStateAction<T | null>>,
  response: ApiResponse<T>
): void => {
  const data = extractApiData(response);
  setState(data);
};


export const setSafeArrayState = <T>(
  setState: React.Dispatch<React.SetStateAction<T[]>>,
  response: ApiResponse<T[]>
): void => {
  const data = extractApiArrayData(response);
  setState(data);
};