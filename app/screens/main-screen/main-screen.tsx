import * as React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack/index"
import { ParamListBase } from "@react-navigation/native"

export interface MainScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>
}

export const MainScreen: React.FunctionComponent<MainScreenProps> = () => {
  return null
}
