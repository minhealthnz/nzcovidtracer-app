
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CovidTracerMigration, NSObject)

RCT_EXTERN_METHOD(applyPublicFileProtection:(NSString *)publicFolderPath resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(findPublicKey:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(findPrivateKey:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(readLastLaunchTime:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
