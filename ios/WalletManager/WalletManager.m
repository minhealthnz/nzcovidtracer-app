//
//  WalletManager.m
//  UniteAppRN
//
//  Created by Varshil Udani on 18/11/21.
//

#import "WalletManager.h"
#import <PassKit/PassKit.h>

@interface WalletManager () <PKAddPassesViewControllerDelegate>

@property (nonatomic, strong) PKPass *pass;
@property (nonatomic, strong) PKPassLibrary *passLibrary;

@end

@implementation WalletManager

RCT_EXPORT_MODULE(WalletManager);

// Go through each passes and find the one that matches the card identifier
RCT_EXPORT_METHOD(getPassLink:(NSString *)cardIdentifier
                    resolver:(RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject
                  )
{
  PKPassLibrary * passLibrary = [[PKPassLibrary alloc] init];
  NSArray *passes = [passLibrary passes];
  
  for (PKPass *pass in passes) {
    if ([self checkPassByIdentifier:pass identifier:cardIdentifier]) {
      NSURL *myString;
      myString = pass.passURL;
      resolve(myString.absoluteString);
      return;
    }
  }
  resolve(@NO);
  return;
}

#pragma mark - PKAddPassesViewControllerDelegate

- (BOOL)checkPassByIdentifier:(PKPass *)pass
                   identifier:(NSString *)cardIdentifier
{
  NSString *passTypeIdentifier = [pass passTypeIdentifier];
  if([passTypeIdentifier isEqualToString:cardIdentifier] == FALSE) {
    return FALSE;
  }
  
  return TRUE;
}

@end
