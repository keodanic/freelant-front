import { Image, View } from "react-native";

const Logo = () => {
    return ( 
         <View className="flex items-center" >
                <Image source={require("@/assets/images/FREELANT-PNG.png")} className="inline-block h-24 w-20 " />
                <Image source={require("@/assets/images/TEXTO-SF.png")} className="inline-block h-10 w-32"/>
            </View>
     );
}
 
export default Logo;