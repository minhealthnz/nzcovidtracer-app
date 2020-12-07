# Verification

The ff. feature is powered by [Android's SafetNet API](https://developer.android.com/training/safetynet) & [iOS's Device Check](https://developer.apple.com/documentation/devicecheck)

## Enrolment

Enrolling a device is a 2 step process:

    1. POST /register - to get nonce (relevant to Android only)
    2. PUT /register - to get { token, refreshToken } and store in state

## Custom API client

`AuthenticatedENFClient` automatically injects the auth token to the header & handles refresh / single retry.

Below are a list of endpoints identified that require authorization.

```
POST /exposures/verify: Bearer token (auth token). Verify the upload code and returns a upload token
POST /exposures: Bearer token (auth token). Upload exposure keys using the upload token
```

Example usage: `AuthenticatedENFClient.post("/exposures/verify", { /**...payload */ })`

<i>Bear in mind this is accessing the store directly - so only use this client for API calls post store startup.</i>

NOTE: Retry / refresh logic is only invoked for response status `401` - every other status code will throw an error.