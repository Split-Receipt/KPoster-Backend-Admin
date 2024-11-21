import React from 'react';
import { utcToZonedTime, format } from 'date-fns-tz';

const CustomDateField = ({ value }) => {
  // Часовой пояс пользователя
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Конвертируем и форматируем дату
  const localDate = value ? utcToZonedTime(value, timezone) : null;
  const formattedDate = localDate ? format(localDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: timezone }) : 'N/A';

  return <span>{formattedDate}</span>;
};

export default CustomDateField;
