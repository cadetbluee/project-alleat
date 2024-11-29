/**
 * @format
 */
import {AppRegistry} from 'react-native';
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import App from './src/App.tsx';
import {name as appName} from './app.json';
import { LogBox } from 'react-native';

// 시연떼 경고 메시지 안띄우기 위해 넣은 코드
LogBox.ignoreAllLogs(true);


// const status = async ()=>{
//     await RNAndroidNotificationListener.getPermissionStatus(); 
// } ;

// console.log(status);
// console.log(RNAndroidNotificationListener.getPermissionStatus());
// console.log(RNAndroidNotificationListener.getPermissionStatus());

// notification 읽기 권한 허가를 구하는 함수
// RNAndroidNotificationListener.requestPermission();


// const headlessNotificationListener = async ({ notification }) => {
//     // 백그라운드 처리
//     console.log(notification);
//     const notificationData = JSON.parse(notification)
//     console.log(notificationData.text);
//     // console.log(notificationData.subText);
//     // console.log(notificationData.app);
//     // console.log(notificationData.bigText);
//     console.log(notificationData.title);
//     // console.log(notificationData.titleBig);

//     const newNotification = {
//         text: notificationData.text,
//         subText: notificationData.subText,
//         app: notificationData.app,
//         bigText: notificationData.bigText,
//         title: notificationData.title,
//         titleBig: notificationData.titleBig,
//       };

//     store.dispatch(setNotification(newNotification));

// }

// AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName,	() => headlessNotificationListener)
AppRegistry.registerComponent(appName, () => App);
