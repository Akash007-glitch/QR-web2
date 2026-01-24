
import React from 'react';
import { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  count: number;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onAdd, count }) => {
  return null; // Logic integrated into App.tsx for a better mobile list view
};

export default MenuCard;
