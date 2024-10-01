#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import "RNAppAuthAuthorizationFlowManager.h" // Import AppAuth

@interface AppDelegate : RCTAppDelegate <UIApplicationDelegate, RNAppAuthAuthorizationFlowManager> // Conform to the protocol

  @property(nonatomic, weak) id<RNAppAuthAuthorizationFlowManagerDelegate> authorizationFlowManagerDelegate; // Add the delegate property

@end
