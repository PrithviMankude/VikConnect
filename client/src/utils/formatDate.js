import React from 'react';

const formatDate = (date) => {
  return new Intl.DateTimeFormat().format(new Date(date));
};

export default formatDate;
