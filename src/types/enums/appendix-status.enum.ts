export const APPENDIX_STATUS = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  EXECUTED: "EXECUTED",
} as const;

export type TAppendixStatus =
  (typeof APPENDIX_STATUS)[keyof typeof APPENDIX_STATUS];

export function getAppendixStatusLabel(status: string): {
  label: string;
  className: string;
} {
  switch (status) {
    case APPENDIX_STATUS.DRAFT:
      return {
        label: "Bản nháp",
        className: "text-slate-700 bg-slate-50 border border-slate-200",
      };
    case APPENDIX_STATUS.SENT:
      return {
        label: "Đã gửi",
        className: "text-sky-700 bg-sky-50 border border-sky-200",
      };
    case APPENDIX_STATUS.ACCEPTED:
      return {
        label: "Khách đã chấp nhận",
        className: "text-emerald-700 bg-emerald-50 border border-emerald-200",
      };
    case APPENDIX_STATUS.REJECTED:
      return {
        label: "Khách từ chối",
        className: "text-rose-700 bg-rose-50 border border-rose-200",
      };
    case APPENDIX_STATUS.EXECUTED:
      return {
        label: "Đã thực thi",
        className: "text-violet-700 bg-violet-50 border border-violet-200",
      };
    default:
      return {
        label: "Không xác định",
        className: "text-neutral-600 bg-neutral-50 border border-neutral-200",
      };
  }
}
