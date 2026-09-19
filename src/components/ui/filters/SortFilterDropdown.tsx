'use client';

import React from 'react';
import { FilterDropdown, FilterOption } from './FilterDropdown';

export interface SortItem<T extends string = string> {
  value: T;
  label: string;
  subtitle?: string;
  badge?: string | number;
}

export interface SortFilterDropdownProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SortItem<T>[];
  align?: 'left' | 'right';
  className?: string;
}

export function SortFilterDropdown<T extends string = string>({
  value,
  onChange,
  options,
  align = 'right',
  className = '',
}: SortFilterDropdownProps<T>) {
  const filterOptions: FilterOption[] = options.map((opt) => ({
    value: opt.value,
    label: opt.label,
    subtitle: opt.subtitle,
    badge: opt.badge,
  }));

  const activeOption = options.find((o) => o.value === value) || options[0];

  return (
    <FilterDropdown
      id="sunu-sort-filter-dropdown"
      label="Trier"
      placeholder={`Trier : ${activeOption?.label || ''}`}
      value={value}
      options={filterOptions}
      onChange={(v) => onChange(v as T)}
      align={align}
      className={className}
      icon={
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="14" y2="12" />
          <line x1="4" y1="18" x2="8" y2="18" />
        </svg>
      }
    />
  );
}
