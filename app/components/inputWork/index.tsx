import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

type Option = {
  id: number;
  nome: string;
};

const options: Option[] = [
  { id: 1, nome: "Designer Gráfico" },
  { id: 2, nome: "Desenvolvedor Mobile" },
  { id: 3, nome: "Eletricista" },
  { id: 4, nome: "Pintor" },
  { id: 5, nome: "Prostituto" },
];

export const ListWork = () => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const rotate = useSharedValue(0);
  const height = useSharedValue(0);

  const toggleDropdown = () => {
    setShowOptions(!showOptions);
    rotate.value = withTiming(showOptions ? 0 : 1, { duration: 300 });
    height.value = withTiming(showOptions ? 0 : 150, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  };

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotate.value * 180}deg`,
      },
    ],
  }));

  const animatedListStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: "hidden",
  }));

  const handleSelect = (item: Option) => {
    setSelectedOption(item);
    toggleDropdown();
  };

  return (
    <View className="w-full px-6 mt-4">
      <TouchableOpacity
        onPress={toggleDropdown}
        className="flex-row justify-between bg-[#252525] p-2 rounded-lg items-center border-b border-[#b9b9b9] pb-2"
      >
        <Text className=" text-2xl text-[#eee]">
          {selectedOption ? selectedOption.nome : "Selecione..."}
        </Text>
        <Animated.View style={animatedIconStyle}>
          <Ionicons name="arrow-down" size={24} color="#eee" />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[animatedListStyle]}>
      <ScrollView>
        {options.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => handleSelect(item)}
            className="py-2 border-b border-gray-200"
          >
            <Text className="text-[#b9b9b9] text-xl">{item.nome}</Text>
          </Pressable>
        ))}
         </ScrollView>
      </Animated.View>
    </View>
  );
};
