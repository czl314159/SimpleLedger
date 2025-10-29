const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

export const getStartOfCurrentMonth = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
};

export const getEndOfCurrentMonth = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
};

export const isWithinCurrentMonth = (isoString: string): boolean => {
  const target = new Date(isoString);
  if (Number.isNaN(target.getTime())) {
    return false;
  }
  const start = getStartOfCurrentMonth().getTime();
  const end = getEndOfCurrentMonth().getTime();
  const timestamp = target.getTime();
  return timestamp >= start && timestamp <= end;
};

export const toISODate = (date: Date): string => date.toISOString();

export const formatDateLabel = (isoString: string): string => {
  const target = new Date(isoString);
  if (Number.isNaN(target.getTime())) {
    return isoString;
  }

  const today = new Date();
  const diffInDays = Math.floor(
    (stripTime(today).getTime() - stripTime(target).getTime()) / MILLISECONDS_IN_DAY
  );

  if (diffInDays === 0) {
    return "今天";
  }
  if (diffInDays === 1) {
    return "昨天";
  }

  const month = target.getMonth() + 1;
  const date = target.getDate();
  return `${month.toString().padStart(2, "0")}月${date.toString().padStart(2, "0")}日`;
};

export const formatAsDate = (isoString: string): string => {
  const target = new Date(isoString);
  if (Number.isNaN(target.getTime())) {
    return isoString;
  }
  const year = target.getFullYear();
  const month = (target.getMonth() + 1).toString().padStart(2, "0");
  const day = target.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const mergeDateWithTime = (date: Date, timeSource?: Date): Date => {
  if (!timeSource) {
    return date;
  }
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    timeSource.getHours(),
    timeSource.getMinutes(),
    timeSource.getSeconds(),
    timeSource.getMilliseconds()
  );
};

const stripTime = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());
