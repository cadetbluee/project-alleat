package com.alleat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

import android.util.Log

class MyFirebaseMessagingService : FirebaseMessagingService() {
    private lateinit var reactContext: ReactContext

    override fun onNewToken(token: String) {
        Log.d("FCM Log Token : ", "Refreshed token: $token")
    }

    override fun onCreate() {
        super.onCreate()
        reactContext = (application as ReactApplication).reactNativeHost.reactInstanceManager.currentReactContext!!
        if (reactContext == null) {
            Log.d("FCM", "ReactContext is null")
        }
    }


    override fun onMessageReceived(remoteMessage: RemoteMessage) {
    // TODO(developer): Handle FCM messages here.
    // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
    Log.d("FCM", "From: ${remoteMessage.from}")
    Log.d("FCM", "===========================================메시지받음=========================================")

    // Check if message contains a data payload.
    if (remoteMessage.data.isNotEmpty()) {
        Log.d("MyFirebaseMessagingServiceHasData", "Message data payload: ${remoteMessage.data}")

        // Check if data needs to be processed by long running job
        // if (needsToBeScheduled()) {
            // For long-running tasks (10 seconds or more) use WorkManager.
            // scheduleJob()
        // } else {
            // Handle message within 10 seconds
            // handleNow()
        // }
    }

    // Check if message contains a notification payload.
    remoteMessage.notification?.let { notification ->
        try{
            val eventName = "onNotificationReceived"
            val data: WritableMap = Arguments.createMap()
            data.putString("title", notification.title)
            data.putString("body", notification.body)
            
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, data)
        }catch (e: Exception) {
            Log.d("FCM", "Error processing notification: ${e.message}")
        }


    }

    // Also if you intend on generating your own notifications as a result of a received FCM
    // message, here is where that should be initiated. See sendNotification method below.
    }

}