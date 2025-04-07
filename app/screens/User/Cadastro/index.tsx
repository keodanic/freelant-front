import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"

const Cadastro=()=>{
const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const router=useRouter()
  return (
    
    <View className="flex-1 bg-[#5d5d5d]">
      <StatusBar barStyle="light-content" />
      {/* Back button */}
      <TouchableOpacity 
        className="w-10 h-10 ml-4 mt-2 rounded-full bg-[#5d5d5d] items-center justify-center"
      >
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <View className="px-6 mt-4">
        {/* Header */}
        <Text className="text-white text-3xl font-bold">Register</Text>
        <Text className="text-gray-400 mt-1 mb-8">Crie sua conta como Freelancer</Text>
        
        {/* Form */}
        <View className="space-y-4">
          {/* Full Name Input with label on border */}
          <View className="mb-4">
            <View className="absolute top-0 left-4 z-10 bg-[#5d5d5d] px-2">
              <Text className="text-[#fff] text-xs">Nome Completo</Text>
            </View>
            <TextInput
              className="bg-transparent text-white rounded-full px-4 py-3 border border-[#333333] mt-2"
              placeholder="Ferdinand Sinaga"
              placeholderTextColor="#777"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          
          {/* Email Input with label on border */}
          <View className="mb-4">
            <View className="absolute top-0 left-4 z-10 bg-[#5d5d5d] px-2">
              <Text className="text-[#fff] text-xs">Email</Text>
            </View>
            <TextInput
              className="bg-transparent text-white rounded-full px-4 py-3 border border-[#333333] mt-2"
              placeholder="Ferdinand@gmail.com"
              placeholderTextColor="#777"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          {/* Password Input with label on border */}
          <View className="mb-4">
            <View className="absolute top-0 left-4 z-10 bg-[#5d5d5d] px-2">
              <Text className="text-[#fff] text-xs">Password</Text>
            </View>
            <View className="flex-row items-center bg-transparent rounded-full border border-[#333333] mt-2">
              <TextInput
                className="flex-1 text-white px-4 py-3"
                placeholder="••••••••"
                placeholderTextColor="#777"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                className="pr-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Repeat Password Input with label on border */}
          <View className="mb-4">
            <View className="absolute top-0 left-4 z-10 bg-[#5d5d5d] px-2">
              <Text className="text-[#fff] text-xs">Repeat Password</Text>
            </View>
            <View className="flex-row items-center bg-transparent rounded-full border border-[#333333] mt-2">
              <TextInput
                className="flex-1 text-white px-4 py-3"
                placeholder="••••••••"
                placeholderTextColor="#777"
                secureTextEntry={!showRepeatPassword}
                value={repeatPassword}
                onChangeText={setRepeatPassword}
              />
              <TouchableOpacity 
                className="pr-4"
                onPress={() => setShowRepeatPassword(!showRepeatPassword)}
              >
                <Ionicons 
                  name={showRepeatPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Register Button */}
        <TouchableOpacity 
          className="bg-[#252525] rounded-full py-4 items-center mt-4"
          onPress={() => console.log('Register pressed')}
        >
          <Text className="text-white font-semibold text-lg">Register</Text>
        </TouchableOpacity>
        
        {/* Login Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-400">I have account? </Text>
          <TouchableOpacity onPress={()=>router.push('/screens/Freela/Login')}>
            <Text className="text-[#252525]">Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    
    )
}

export default Cadastro;