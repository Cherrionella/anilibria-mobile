// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import "./i18n"
import React, { useState, useEffect, useRef } from "react"
import { YellowBox, Platform } from "react-native"
import { NavigationContainerRef } from "@react-navigation/native"
import { contains } from "ramda"
import { enableScreens } from "react-native-screens"
import { SafeAreaProvider, initialWindowSafeAreaInsets } from "react-native-safe-area-context"
import codePush from 'react-native-code-push'
import crashlytics from '@react-native-firebase/crashlytics'
import remoteConfig from '@react-native-firebase/remote-config'
import DeviceInfo from 'react-native-device-info'

import { RootNavigator, exitRoutes, setRootNavigation } from "./navigation"
import { useBackButtonHandler } from "./navigation/use-back-button-handler"
import { RootStore, RootStoreProvider, setupRootStore } from "./models/root-store"
import * as storage from "./utils/storage"
import getActiveRouteName from "./navigation/get-active-routename"

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
enableScreens()

/**
 * Ignore some yellowbox warnings. Some of these are for deprecated functions
 * that we haven't gotten around to replacing yet.
 */
YellowBox.ignoreWarnings([
  "componentWillMount is deprecated",
  "componentWillReceiveProps is deprecated",
  "Require cycle:",
])

/**
 * Are we allowed to exit the app?  This is called when the back button
 * is pressed on android.
 *
 * @param routeName The currently active route name.
 */
const canExit = (routeName: string) => contains(routeName, exitRoutes)

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

crashlytics().setAttribute('uuid', DeviceInfo.getUniqueId())

const getRemoteConfig = async (defaults: Record<string, any> = {}) => {
  await remoteConfig().setConfigSettings({
    isDeveloperModeEnabled: __DEV__,
    minimumFetchInterval: 300
  })
  await remoteConfig().setDefaults(defaults)
  const activated = await remoteConfig().fetchAndActivate()
  if (!activated) console.log('Remote Config not activated')
  const config = remoteConfig().getAll()
  const configProps: typeof defaults = {}

  Object.keys(config).forEach(c => {
    configProps[c] = config[c].value
  })

  return configProps
}

const channels = Platform.select({
  ios: {
    staging: 'W5UiawkG_dK2thP6muc5LHekaxyWrlKc4fCp8',
    stable: 'wARZsPJEdgQRuCSD8EjwJxmtIKH6eOpXA4gOE'
  },
  android: {
    staging: '7fsZJLkYMsOoZ4puh4xdLOOZJ3yPdgYh0pFMn',
    stable: '6BT2zvlS9D2-taI2j6U_9GxzfBmoO_n_Jtubc'
  }
})

const selectChannel = (channel: keyof typeof channels) => {
  codePush.sync({ deploymentKey: channel })
  crashlytics().setAttribute('channel', channel)
}

/**
 * This is the root component of our app.
 */
const App: React.FunctionComponent<{}> = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const navigationRef = useRef<NavigationContainerRef>()
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const [initialNavigationState, setInitialNavigationState] = useState()
  const [isRestoringNavigationState, setIsRestoringNavigationState] = useState(true)

  setRootNavigation(navigationRef)
  useBackButtonHandler(navigationRef, canExit)

  /**
   * Keep track of state changes
   * Track Screens
   * Persist State
   */
  const routeNameRef = useRef()
  const onNavigationStateChange = state => {
    const previousRouteName = routeNameRef.current
    const currentRouteName = getActiveRouteName(state)

    if (previousRouteName !== currentRouteName) {
      // track screens.
      __DEV__ && console.tron.log(currentRouteName)
    }

    // Save the current route name for later comparision
    routeNameRef.current = currentRouteName

    // Persist state to storage
    storage.save(NAVIGATION_PERSISTENCE_KEY, state)
  }

  useEffect(() => {
    ;(async () => {
      setupRootStore().then(setRootStore)
    })()
  }, [])

  useEffect(() => {
    const restoreState = async () => {
      try {
        const state = await storage.load(NAVIGATION_PERSISTENCE_KEY)

        if (state) {
          setInitialNavigationState(state)
        }
      } finally {
        setIsRestoringNavigationState(false)
      }
    }

    if (isRestoringNavigationState) {
      restoreState()
    }
  }, [isRestoringNavigationState])

  useEffect(() => {
    (async () => {
      try {
        const config = await getRemoteConfig({
          channels
        })
        const channel = await storage.loadString('channel')
        if (Object.prototype.hasOwnProperty.call(config.channels, channel)) {
          selectChannel(channel as keyof typeof channels)
        } else {
          selectChannel('stable')
        }
      } catch (e) {
        selectChannel('stable')
      } finally {
        setIsLoaded(true)
      }
    })()
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  //
  // This step should be completely covered over by the splash screen though.
  //
  // You're welcome to swap in your own component to render if your boot up
  // sequence is too slow though.
  if (!rootStore && !isLoaded) {
    return null
  }

  // otherwise, we're ready to render the app
  return (
    <RootStoreProvider value={rootStore}>
      <SafeAreaProvider initialSafeAreaInsets={initialWindowSafeAreaInsets}>
        <RootNavigator
          ref={navigationRef}
          initialState={initialNavigationState}
          onStateChange={onNavigationStateChange}
        />
      </SafeAreaProvider>
    </RootStoreProvider>
  )
}

export default App
