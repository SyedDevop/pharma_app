type ApiResponse<DataT> = {
  success: boolean;
  data: DataT;
  message: string;
  httpStatus: number;
  meta?: Record<string, unknown> | unknown[];
  timestamp: string;
};
