
import Foundation

@objc(CovidTracerMigration)
class CovidTracerMigration: NSObject
{
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc
    func applyPublicFileProtection(_ publicFolderPath: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Repository.applyFileProtection(publicFolderPath: publicFolderPath)
        resolve(nil)
    }

    @objc
    func findPublicKey(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let result = Repository.getPublicKey()?.base64EncodedString(options: [])
        resolve(result)
    }

    @objc
    func findPrivateKey(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let result = Repository.getPrivateKey()?.base64EncodedString(options: [])
        resolve(result)
    }
}
