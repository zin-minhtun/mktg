import React from 'react';
import { View, TouchableOpacity } from 'react-native';

const Pagination = ({ totalPages, currentPage, onChangePage }) => {
  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < totalPages; i++) {
      dots.push(
        <TouchableOpacity
          key={i}
          className={`w-2 h-2 rounded-full mx-1 ${i === currentPage ? 'bg-blue-500' : 'bg-gray-300'}`}
          onPress={() => onChangePage(i)}
        />
      );
    }
    return dots;
  };

  return (
    <View className="flex-row justify-center items-center my-4">
      {renderDots()}
    </View>
  );
};

export default Pagination;
