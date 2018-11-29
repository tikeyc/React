import React from 'react';

export function toThousand(number) {
  const nextNumber = `${number}`;
  if (nextNumber.indexOf(',') > -1) return nextNumber;
  if (nextNumber === '' || nextNumber === '-') return '-';
  return nextNumber.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
}

export function toPercent(number) {
  const nextNumber = `${number}`;
  if (nextNumber.indexOf(',') > -1) return nextNumber;
  if (nextNumber === '' || nextNumber === '-') return '-';
  return nextNumber.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
}

export function highlightMinus(number) {
  const nextNumber = `${number}`;
  if (nextNumber === '-') return nextNumber;
  if (/^-\d/.test(nextNumber)) return <span style={{ color: '#B5211D' }}>{number}</span>;
  return nextNumber;
}

export function capitalized(word) {
  return word.toLowerCase().replace(/^([a-z])/, match => match.toUpperCase());
}
