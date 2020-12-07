
import Foundation

class Repository
{
    static let publicFileProtection = FileProtectionType.completeUntilFirstUserAuthentication
    static let privateFileProtection = FileProtectionType.complete
    static let publicKeychainProtection = kSecAttrAccessibleAfterFirstUnlock as String
    static let privateKeychainProtection = kSecAttrAccessibleWhenUnlocked as String
    static let publicKeychainIdentifier = "public_database_key_identifier"
    static let privateKeychainIdentifier = "private_database_key_identifier"
    
    static func applyFileProtection(publicFolderPath: String) {
        updateFileProtectionForFileIfRequired(publicFolderPath, Repository.publicFileProtection)
    }

    private static func updateFileProtectionForFileIfRequired(_ folderPath: String, _ expectedFileProtectionAttribute: FileProtectionType)
    {
        guard let attributes = try? FileManager.default.attributesOfItem(atPath: folderPath) else {
            return
        }
        let fileProtectionAttribute = attributes[FileAttributeKey.protectionKey] as? FileProtectionType
        if fileProtectionAttribute == nil || fileProtectionAttribute! != expectedFileProtectionAttribute
        {
            try? FileManager.default.setAttributes(
                [FileAttributeKey.protectionKey: expectedFileProtectionAttribute],
                ofItemAtPath: folderPath)
        }
    }

    static func getPublicKey() -> Data?
    {
        return Repository.getKey(Repository.publicKeychainIdentifier, Repository.publicKeychainProtection, Repository.publicFileProtection);
    }

    static func getPrivateKey() -> Data? {
        return Repository.getKey(Repository.privateKeychainIdentifier, Repository.privateKeychainProtection, Repository.privateFileProtection)
    }

    // IMPORTANT: The getKey function has been updated to use a local file to store the encryption key
    // because of an issue where restoring the OS from a backup or transfering to another device has caused the
    // keychain to lose the keychain entries. This causes realm to fail to get the correct key to decrypt the
    // database.
    //
    // The reason we are storing the encryption key in an insecure file is that the file will have the same OS
    // level file protection attributes applied to the database. We are thus moving to a system where we just
    // use the OS standard security mechanisms that come out of the box to protect the data.
    //
    // Please see _https://github.com/realm/realm-cocoa/issues/5615_ for more information about this issue.
    private static func getKey(_ keychainIdentifier: String, _ keychainProtectionAttribute: String, _ fileProtectionAttribute: FileProtectionType)
    -> Data?
    {
#if false
        RDLog(MessageCode.repositoryGetKey)
#endif

        // NOTE: Try to retrieve existing key from the keychain- to handle existing users.
        let keychainIdentifierData = keychainIdentifier.data(using: String.Encoding.utf8, allowLossyConversion: false)!
        let query: [NSString: AnyObject] =
        [
            kSecClass: kSecClassKey,
            kSecAttrApplicationTag: keychainIdentifierData as AnyObject,
            kSecAttrKeySizeInBits: 512 as AnyObject,
            kSecReturnAttributes: true as AnyObject,
            kSecReturnData: true as AnyObject
        ]
        // NOTE: To view a text version of the status, you can type
        // 'e SecCopyErrorMessageString(status, nil)' into clang or gcc.
        var match: AnyObject? = nil
        let status = SecItemCopyMatching(query as CFDictionary, &match)

        var accessible: String? = nil
        var result: Data? = nil
        if (status == errSecSuccess)
        {
            let matchDictionary = match as? [String: Any]
            if (matchDictionary != nil)
            {
                result = matchDictionary![kSecValueData as String] as? Data
                accessible = matchDictionary![kSecAttrAccessible as String] as? String
            }
            else
            {
#if false
                RDLog(MessageCode.repositoryUnableToGetMatchDictionary)
#endif
            }
        }

        // NOTE: Check if the file containing the encryption key is available in the
        // users document folder.
        let folderPaths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)
        let documentsFolder = folderPaths[0]
        let documentsFolderURL = URL(string: documentsFolder)!
        let keyFileURL = documentsFolderURL.appendingPathComponent("\(keychainIdentifier)")
        let keyFilePath = keyFileURL.absoluteString
        let doesFileExist = FileManager.default.fileExists(atPath: keyFilePath)

        if (result != nil)
        {
#if false
            RDLog(MessageCode.repositoryKeyRetrieved)
#endif

            if ((accessible == nil) ||
                (accessible! != (keychainProtectionAttribute as String)))
            {
                let updateQuery: [NSString: AnyObject] =
                [
                    kSecClass: kSecClassKey,
                    kSecAttrApplicationTag: keychainIdentifierData as AnyObject,
                    kSecAttrKeySizeInBits: 512 as AnyObject,
                ]
                let updateAttributes: [NSString: AnyObject] =
                [
                    kSecAttrAccessible: keychainProtectionAttribute as AnyObject,
                ]
                let updateStatus = SecItemUpdate(updateQuery as CFDictionary, updateAttributes as CFDictionary)
                if (updateStatus == errSecSuccess)
                {
#if false
                    RDLog(MessageCode.repositoryUpdatedKeychainItemAccessibleAttributeSuccessfully)
#endif
                }
                else
                {
#if false
                    RDLog(MessageCode.repositoryFailedToUpdateKeychainItemAccessibleAttribute)
#endif
                }
            }

            // NOTE: If we successfully retrieve the key from the keychain, make
            // sure we save the key into the local file to ensure we can decrypt the
            // database if the key vanishes.
            if (!doesFileExist)
            {
                let attributes = [FileAttributeKey.protectionKey: fileProtectionAttribute]
                let created = FileManager.default.createFile(atPath: keyFilePath, contents: result, attributes: attributes)
                if (created)
                {
#if false
                    RDLog(MessageCode.repositoryCreatedEncryptionKeyBackupSuccessfully)
#endif
                }
                else
                {
#if false
                    RDLog(MessageCode.repositoryFailedToCreateEncryptionKeyBackup)
#endif
                }
            }
        }
        else
        {
            // NOTE: If we could not get the key from the keychain, try to get
            // it from the file on disk.
            if (doesFileExist)
            {
#if false
                RDLog(MessageCode.repositoryRetrieveBackupKey)
#endif

                result = FileManager.default.contents(atPath: keyFilePath)
            }

            // NOTE: If we could not get the encryption key from the file, then
            // set it to a known encryption key.
            if (result == nil)
            {
#if false
                RDLog(MessageCode.repositoryFallbackToBuiltinEncryptionKey)
#endif

                return nil
            }
        }

        return result!
    }
}
