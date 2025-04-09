import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    "Desenvolvedor",
    "Designer",
    "Fotógrafo",
    "Editor de vídeo",
    "Social Media",
  ];

  const handleSelect = (item: string) => {
    setSelected(item);
    setIsOpen(false);
  };

  return (
    <View className="w-full px-6 mt-6">
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className="border border-gray-300 rounded-md px-4 py-3 bg-white"
      >
        <Text className="text-gray-500">
          {selected ? selected : "Selecione uma profissão"}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View className="bg-white border border-gray-300 rounded-md mt-2">
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                className="px-4 py-3 hover:bg-gray-100"
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Dropdown;
