export interface ErrorBody { code?: string; message?: string; traceId?: string | null }
export class ApiError extends Error {
 constructor(public status: number, public detail: ErrorBody) {
  super(detail.message ?? 'Không thể thực hiện yêu cầu.')
 }
}
export class SessionChanged extends Error {
 constructor() { super('Phiên làm việc đã thay đổi. Vui lòng thử lại.') }
}
