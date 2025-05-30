import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserHome from "../screens/User/Home";
import Chat from "../screens/Chat";

export type UserStackParamList = {
  UserHome: undefined;
  Chat: {
    senderId: string;
    receiverId: string;
  };
};

const Stack = createNativeStackNavigator<UserStackParamList>();

const UserRoutes = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UserHome" component={UserHome} />
    <Stack.Screen name="Chat" component={Chat} />
  </Stack.Navigator>
);

export default UserRoutes;
