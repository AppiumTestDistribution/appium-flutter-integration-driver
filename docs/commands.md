# Flutter Commands

## mobile: scheduleAction

Launches the app with given app with appId(Android) or bundleId iOS. Will throw error when the app is not installed. 

### Arguments

Name | Type | Required | Description | Example
--- | --- | --- | --- | ---
appId | string | yes | app identifier(Android) or bundle identifier(iOS) of the app to be launched | com.mycompany.app
arguments | string&#124;array | no | One or more command line arguments for the app. If the app is already running then this argument is ignored. | ['-s', '-m']
environment | dict | no | Environment variables mapping for the app. If the app is already running then this argument is ignored. | {'var': 'value'}
