
import CommonCrypto
import Foundation

@objc
enum HashType: Int
{
    case md5
    case sha1
    case sha224
    case sha256
    case sha384
    case sha512
}

class Cryptography
{
    static func hash(_ type: HashType, _ plainText: String)
    -> String
    {
        let data = plainText.data(using: String.Encoding.utf8)!
        let result = Cryptography.hash(type, data)
        return result
    }

    static func hash(_ type: HashType, _ data: Data)
    -> String
    {
        let digestLength = Cryptography.hashDigestLength(type)
        var digest = Data(count: Int(digestLength))

        _ = digest.withUnsafeMutableBytes
        {
            digestBytes -> UInt8 in
            data.withUnsafeBytes
            {
                plainTextBytes -> UInt8 in
                let srcBaseAddress = plainTextBytes.baseAddress!
                let dstBaseAddress = digestBytes.bindMemory(to: UInt8.self).baseAddress!
                let length = CC_LONG(data.count)
                switch (type)
                {
                    case .md5: CC_MD5(srcBaseAddress, length, dstBaseAddress)
                    case .sha1: CC_SHA1(srcBaseAddress, length, dstBaseAddress)
                    case .sha224: CC_SHA224(srcBaseAddress, length, dstBaseAddress)
                    case .sha256: CC_SHA256(srcBaseAddress, length, dstBaseAddress)
                    case .sha384: CC_SHA384(srcBaseAddress, length, dstBaseAddress)
                    case .sha512: CC_SHA512(srcBaseAddress, length, dstBaseAddress)
                }
                return 0
            }
        }

        let result = digest.base64EncodedString(options: [])
        return result
    }

    static func hashDigestLength(_ type: HashType)
    -> Int32
    {
        var result: Int32 = 0
        switch (type)
        {
            case .md5: result = CC_MD5_DIGEST_LENGTH
            case .sha1: result = CC_SHA1_DIGEST_LENGTH
            case .sha224: result = CC_SHA224_DIGEST_LENGTH
            case .sha256: result = CC_SHA256_DIGEST_LENGTH
            case .sha384: result = CC_SHA384_DIGEST_LENGTH
            case .sha512: result = CC_SHA512_DIGEST_LENGTH
        }

        return result
    }
}
