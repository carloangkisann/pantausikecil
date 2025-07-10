export const calculateTrimester = (startDate: string, currentDate?: string): number => {
  const pregnancyStart = new Date(startDate);
  const now = currentDate ? new Date(currentDate) : new Date();
  
  const diffTime = now.getTime() - pregnancyStart.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    throw new Error('Current date cannot be before pregnancy start date');
  }
  
  if (diffDays <= 83) {
    return 1;
  } else if (diffDays <= 181) { 
    return 2;
  } else {
    return 3;
  }
};

export const calculatePregnancyWeek = (startDate: string, currentDate?: string): number => {
  const pregnancyStart = new Date(startDate);
  const now = currentDate ? new Date(currentDate) : new Date();
  
  const diffTime = now.getTime() - pregnancyStart.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 0;
  }
  
  return Math.ceil(diffDays / 7);
};

export const getPregnancyInfo = (startDate: string, currentDate?: string) => {
  const trimester = calculateTrimester(startDate, currentDate);
  const week = calculatePregnancyWeek(startDate, currentDate);
  
  return {
    trimester,
    week,
    trimesterName: getTrimesterName(trimester)
  };
};

export const getTrimesterName = (trimester: number): string => {
  switch (trimester) {
    case 1:
      return 'Trimester Pertama';
    case 2:
      return 'Trimester Kedua';
    case 3:
      return 'Trimester Ketiga';
    default:
      return 'Unknown';
  }
};

export const isActivePregnancy = (startDate: string, endDate?: string): boolean => {
  if (endDate) {
    return false; 
  }
  
  const pregnancyStart = new Date(startDate);
  const now = new Date();
  
  // Check if pregnancy started and hasn't exceeded typical duration (40 weeks = 280 days)
  const diffTime = now.getTime() - pregnancyStart.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 && diffDays <= 280;
};