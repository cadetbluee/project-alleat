import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {store, persistor} from './redux/store';
import AppNavigator from './navigation/AppNavigator'; // 네비게이터 임포트
import ReportNavigator from './features/report/components/ReportNavigator';
import {PersistGate} from 'redux-persist/integration/react';

import messaging from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import RNAndroidNotificationListener, {
  RNAndroidNotificationListenerHeadlessJsName,
} from 'react-native-android-notification-listener';
import {
  setNotification,
  clearNotification,
} from './redux/features/notificationSlice';
const status = async () => {
  await RNAndroidNotificationListener.getPermissionStatus();
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const headlessNotificationListener = async ({
  notification,
}: {
  notification: any;
}) => {
  // 백그라운드 처리
  console.log('========================================');
  // console.log(notification);
  const notificationData = JSON.parse(notification);
  if (notificationData.title.includes('녹화')) {
  } else {
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // 들어오는 값 모니터링 용 섹션
    // console.log(notificationData.text);
    console.log('app이름 : ', notificationData.app);
    console.log('text : ', notificationData.text);
    console.log('bigText : ', notificationData.bigText);
    console.log('extraInfoText : ', notificationData.extraInfoText);
    console.log('subText : ', notificationData.subText);
    console.log('summaryText : ', notificationData.summaryText);
    console.log('groupedMessages : ', notificationData.groupedMessages);
    console.log('title : ', notificationData.title);
    console.log('titleBig : ', notificationData.titleBig);
    // console.log(notificationData.subText);
    // console.log(notificationData.app);
    // console.log(notificationData.bigText);
    // console.log(notificationData.title);
    // console.log(notificationData.titleBig);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const newNotification = {
      text: notificationData.text,
      subText: notificationData.subText,
      app: notificationData.app,
      bigText: notificationData.bigText,
      title: notificationData.title,
      titleBig: notificationData.titleBig,
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // 현재 상태 : newNotification.title에 주문이라는 단어가 있으면 store에 값을 갱신
    if (newNotification.title.includes('주문')) {
      store.dispatch(setNotification(newNotification));
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////
  }
};

AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener,
);

function App() {
  return (
    <Provider store={store}>
      {/* <ReportNavigator /> */}
      <NavigationContainer>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
