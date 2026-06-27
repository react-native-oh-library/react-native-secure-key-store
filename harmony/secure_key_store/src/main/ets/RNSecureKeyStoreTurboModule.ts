/**
 * React Native Secure Key Store
 * Store keys securely in HarmonyOS using HUKS (HarmonyOS Universal KeyStore)
 */

import { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { TM } from './generated/ts';
import huks from '@ohos.security.huks';
import util from '@ohos.util';
import preferences from '@ohos.data.preferences';
import { cryptoFramework } from '@kit.CryptoArchitectureKit';
import { BusinessError } from '@ohos.base';
// 加密存储的服务名称
const SERVICE_NAME = 'RNSecureKeyStoreHarmony';
const PREFERENCES_NAME = 'secure_key_store_prefs';
const HUKS_KEY_ALIAS = 'RNSecureKeyStoreMainKey';

interface GeneratedTypeLiteralInterface_1 {
  cipherText: string;
  iv: string;
  authTag: string;
}

export class RNSecureKeyStoreTurboModule extends TurboModule implements TM.RNSecureKeyStore.Spec {
  private context: TurboModuleContext;
  private resetOnAppUninstall: boolean = true;
  private dataPreferences: preferences.Preferences | null = null;

  constructor(ctx: TurboModuleContext) {
    super(ctx);
    this.context = ctx;
    this.initPreferences();
    this.ensureMainKeyExists();
  }

  /**
   * 初始化 Preferences 实例
   */
  private async initPreferences(): Promise<void> {
    try {
      const context = this.context.uiAbilityContext;
      this.dataPreferences = await preferences.getPreferences(context, PREFERENCES_NAME);
      await this.handleAppUninstallation();
    } catch (error) {
      console.error(`${SERVICE_NAME}: Failed to init preferences:`, error);
    }
  }

  /**
   * 确保主密钥存在，用于加解密数据
   */
  private async ensureMainKeyExists(): Promise<void> {
    try {
      const keyExists = await this.isKeyExist(HUKS_KEY_ALIAS);
      if (!keyExists) {
        await this.generateMainKey();
      }
    } catch (error) {
      console.error(`${SERVICE_NAME}: Failed to ensure main key exists:`, error);
    }
  }

  /**
   * 检查密钥是否存在
   */
  private async isKeyExist(alias: string): Promise<boolean> {
    const options: huks.HuksOptions = {
      properties: []
    };
    try {
      await huks.isKeyItemExist(alias, options);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 生成主密钥（AES256）
   */
  private async generateMainKey(): Promise<void> {
    const properties: huks.HuksParam[] = [
      { tag: huks.HuksTag.HUKS_TAG_ALGORITHM, value: huks.HuksKeyAlg.HUKS_ALG_AES },
      {
        tag: huks.HuksTag.HUKS_TAG_PURPOSE,
        value: huks.HuksKeyPurpose.HUKS_KEY_PURPOSE_ENCRYPT | huks.HuksKeyPurpose.HUKS_KEY_PURPOSE_DECRYPT
      },
      { tag: huks.HuksTag.HUKS_TAG_KEY_SIZE, value: huks.HuksKeySize.HUKS_AES_KEY_SIZE_256 },
      { tag: huks.HuksTag.HUKS_TAG_BLOCK_MODE, value: huks.HuksCipherMode.HUKS_MODE_GCM },
      { tag: huks.HuksTag.HUKS_TAG_PADDING, value: huks.HuksKeyPadding.HUKS_PADDING_NONE },
    ];

    const options: huks.HuksOptions = {
      properties: properties
    };

    try {
      await huks.generateKeyItem(HUKS_KEY_ALIAS, options);
      console.info(`${SERVICE_NAME}: Main key generated successfully`);
    } catch (error) {
      console.error(`${SERVICE_NAME}: Failed to generate main key:`, error);
      // throw error;
    }
  }

  /**
   * 加密数据
   */
  private async encryptData(plainText: string): Promise<GeneratedTypeLiteralInterface_1> {
    const textEncoder = new util.TextEncoder();
    const plainData = textEncoder.encodeInto(plainText);

    // 生成随机 IV
    const iv = this.generateRandomIV();

    const encryptProperties: huks.HuksParam[] = [
      { tag: huks.HuksTag.HUKS_TAG_ALGORITHM, value: huks.HuksKeyAlg.HUKS_ALG_AES },
      { tag: huks.HuksTag.HUKS_TAG_PURPOSE, value: huks.HuksKeyPurpose.HUKS_KEY_PURPOSE_ENCRYPT },
      { tag: huks.HuksTag.HUKS_TAG_KEY_SIZE, value: huks.HuksKeySize.HUKS_AES_KEY_SIZE_256 },
      { tag: huks.HuksTag.HUKS_TAG_BLOCK_MODE, value: huks.HuksCipherMode.HUKS_MODE_GCM },
      { tag: huks.HuksTag.HUKS_TAG_PADDING, value: huks.HuksKeyPadding.HUKS_PADDING_NONE },
      { tag: huks.HuksTag.HUKS_TAG_NONCE, value: iv },
      { tag: huks.HuksTag.HUKS_TAG_AE_TAG, value: new Uint8Array(16) },// GCM auth tag
    ];

    const encryptOptions: huks.HuksOptions = {
      properties: encryptProperties,
      inData: plainData
    };

    try {
      // 初始化加密会话
      const initResult = await huks.initSession(HUKS_KEY_ALIAS, encryptOptions);
      const handle = initResult.handle;

      // 完成加密
      const finishOptions: huks.HuksOptions = {
        properties: encryptProperties,
        inData: plainData
      };
      const finishResult = await huks.finishSession(handle, finishOptions);

      // 提取密文和 authTag
      const outData = finishResult.outData as Uint8Array;
      const cipherData = outData.slice(0, outData.length - 16);
      const authTag = outData.slice(outData.length - 16);

      return {
        cipherText: this.uint8ArrayToBase64(cipherData),
        iv: this.uint8ArrayToBase64(iv),
        authTag: this.uint8ArrayToBase64(authTag)
      };
    } catch (error) {
      console.error(`${SERVICE_NAME}: Encryption failed:`, error);
      // throw error;
    }
  }

  /**
   * 解密数据
   */
  private async decryptData(cipherText: string, iv: string, authTag: string): Promise<string> {
    const cipherData = this.base64ToUint8Array(cipherText);
    const ivData = this.base64ToUint8Array(iv);
    const authTagData = this.base64ToUint8Array(authTag);
    // 合并密文和 authTag
    // const combinedData = new Uint8Array(cipherData.length + authTagData.length);
    // combinedData.set(cipherData, 0);
    // combinedData.set(authTagData, cipherData.length);

    const decryptProperties: huks.HuksParam[] = [
      { tag: huks.HuksTag.HUKS_TAG_ALGORITHM, value: huks.HuksKeyAlg.HUKS_ALG_AES },
      { tag: huks.HuksTag.HUKS_TAG_PURPOSE, value: huks.HuksKeyPurpose.HUKS_KEY_PURPOSE_DECRYPT },
      { tag: huks.HuksTag.HUKS_TAG_KEY_SIZE, value: huks.HuksKeySize.HUKS_AES_KEY_SIZE_256 },
      { tag: huks.HuksTag.HUKS_TAG_BLOCK_MODE, value: huks.HuksCipherMode.HUKS_MODE_GCM },
      { tag: huks.HuksTag.HUKS_TAG_PADDING, value: huks.HuksKeyPadding.HUKS_PADDING_NONE },
      { tag: huks.HuksTag.HUKS_TAG_NONCE, value: ivData },
      { tag: huks.HuksTag.HUKS_TAG_AE_TAG, value: authTagData },
    ];

    const decryptOptions: huks.HuksOptions = {
      properties: decryptProperties,
      inData: cipherData
    };

    try {
      // 初始化解密会话
      const initResult = await huks.initSession(HUKS_KEY_ALIAS, decryptOptions);
      const handle = initResult.handle;
      // 完成解密
      const finishOptions: huks.HuksOptions = {
        properties: decryptProperties,
        inData: cipherData
      };
      const finishResult = await huks.finishSession(handle, finishOptions);
      const textDecoder = util.TextDecoder.create('utf-8');
      return textDecoder.decodeToString(finishResult.outData as Uint8Array);
    } catch (error) {
      console.error(`${SERVICE_NAME}: Decryption failed:`, error);
      // throw error;
    }
  }

  /**
   * 生成随机 IV (12 bytes for GCM)
   */
  private generateRandomIV(): Uint8Array {
    const random = cryptoFramework.createRandom(); 
    const randomData = random.generateRandomSync(12); 
    return new Uint8Array(randomData.data); 
  }

  /**
   * Uint8Array 转 Base64
   */
  private uint8ArrayToBase64(array: Uint8Array): string {
    const base64Helper = new util.Base64Helper();
    return base64Helper.encodeToStringSync(array);
  }

  /**
   * Base64 转 Uint8Array
   */
  private base64ToUint8Array(base64: string): Uint8Array {
    const base64Helper = new util.Base64Helper();
    return base64Helper.decodeSync(base64);
  }

  /**
   * 处理应用卸载（类似 iOS 的行为）
   */
  private async handleAppUninstallation(): Promise<void> {
    if (!this.dataPreferences) {
      return;
    }

    try {
      const isInstalled = await this.dataPreferences.get('RnSksIsAppInstalled', false);
      if (this.resetOnAppUninstall && !isInstalled) {
        await this.clearSecureKeyStore();
        await this.dataPreferences.put('RnSksIsAppInstalled', true);
        await this.dataPreferences.flush();
      }
    } catch (error) {
      console.error(`${SERVICE_NAME}: handleAppUninstallation error:`, error);
    }
  }

  /**
   * 清除所有安全存储的数据
   */
  private async clearSecureKeyStore(): Promise<void> {
    try {
      // 删除主密钥
      const options: huks.HuksOptions = { properties: [] };
      await huks.deleteKeyItem(HUKS_KEY_ALIAS, options).catch(() => {
      });

      // 清除 preferences
      if (this.dataPreferences) {
        await this.dataPreferences.clear();
        await this.dataPreferences.flush();
      }
    } catch (error) {
      console.error(`${SERVICE_NAME}: clearSecureKeyStore error:`, error);
    }
  }

  /**
   * 设置是否在应用卸载时重置
   */
  setResetOnAppUninstallTo(enabled: boolean): void {
    this.resetOnAppUninstall = enabled;
  }

  /**
   * 存储键值对
   * @param key 键名
   * @param value 值
   * @param options 选项（accessible 参数，与 iOS 保持接口一致）
   */
  async set(key: string, value: string): Promise<string> {
    try {
      await this.handleAppUninstallation();

      if (!this.dataPreferences) {
        throw new Error('Preferences not initialized');
      }

      // 加密数据
      const encrypted = await this.encryptData(value);

      // 存储加密数据（包含 cipherText, iv, authTag）
      const storedValue = JSON.stringify({
        cipherText: encrypted.cipherText,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
      });

      await this.dataPreferences.put(key, storedValue);
      await this.dataPreferences.flush();

      return 'key stored successfully';
    } catch (error) {
      const err = error as BusinessError;
      const errorMessage = JSON.stringify({
        code: 9,
        message: err.message || 'error saving key'
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * 获取键对应的值
   * @param key 键名
   */
  async get(key: string): Promise<string> {
    try {
      await this.handleAppUninstallation();

      if (!this.dataPreferences) {
        throw new Error('Preferences not initialized');
      }

      const storedValue = await this.dataPreferences.get(key, '') as string;

      if (!storedValue) {
        const errorMessage = JSON.stringify({
          code: 404,
          message: 'key does not present'
        });
        throw new Error(errorMessage);
      }

      // 解析存储的数据
      const parsed = JSON.parse(storedValue);
      // 解密数据
      const decrypted = await this.decryptData(parsed.cipherText, parsed.iv, parsed.authTag);
      return decrypted;
    } catch (error) {
      const err = error as BusinessError;
      if (err.message && err.message.includes('404')) {
        // throw error;
      }
      const errorMessage = JSON.stringify({
        code: 1,
        message: err.message || 'error retrieving key'
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * 删除键
   * @param key 键名
   */
  async remove(key: string): Promise<string> {
    try {
      if (!this.dataPreferences) {
        throw new Error('Preferences not initialized');
      }

      const hasKey = await this.dataPreferences.has(key);
      if (!hasKey) {
        const errorMessage = JSON.stringify({
          code: 6,
          message: 'could not delete key'
        });
        throw new Error(errorMessage);
      }

      await this.dataPreferences.delete(key);
      await this.dataPreferences.flush();

      return 'key removed successfully';
    } catch (error) {
      const err = error as BusinessError;
      const errorMessage = JSON.stringify({
        code: 6,
        message: err.message || 'could not delete key'
      });
      throw new Error(errorMessage);
    }
  }
}
