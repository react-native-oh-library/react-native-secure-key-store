> 模板版本：v0.2.2

<p align="center">
  <h1 align="center"> <code>react-native-secure-key-store</code> </h1>
</p>
<p align="center">
    <a href="https://github.com/ovr/react-native-secure-key-store">
        <img src="https://img.shields.io/badge/platforms-android%20|%20ios%20|%20harmony%20-lightgrey.svg" alt="Supported platforms" />
    </a>
    <a href="https://github.com/ovr/react-native-secure-key-store/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
    </a>
</p>

> [!TIP] [Github 地址](https://github.com/react-native-oh-library/react-native-secure-key-store)

## 安装与使用

请到三方库的 Releases 发布地址查看配套的版本信息：

| 三方库版本 | 发布信息 | 支持RN版本 |
| ---------- | ------------------------------------------------------------ | ---------- |
| 2.0.11     | [@react-native-ohos/react-native-secure-key-store Releases](https://github.com/react-native-oh-library/react-native-secure-key-store/releases/2.0.11-rc.1) | 0.72     |
| 2.1.0     | [@react-native-ohos/react-native-secure-key-store Releases](https://github.com/react-native-oh-library/react-native-secure-key-store/releases/2.1.0-rc.1) | 0.77     |

对于未发布到npm的旧版本，请参考[安装指南](/zh-cn/tgz-usage.md)安装tgz包。

进入到工程目录并输入以下命令：

<!-- tabs:start -->

#### **npm**

```bash
npm install @react-native-ohos/react-native-secure-key-store
```

#### **yarn**

```bash
yarn add @react-native-ohos/react-native-secure-key-store
```

<!-- tabs:end -->

下面的代码展示了这个库的基本使用场景：

> [!WARNING] 使用时 import 的库名不变。

```ts
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView, TouchableOpacity } from "react-native";
import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";
const AppDemo: React.FC = () => {
  const [key, setKey] = useState<string>("key1");
  const [value, setValue] = useState<string>("value1");
  const [log, setLog] = useState<string>("");
  const handleSet = async () => {
    try {
      const res = await RNSecureKeyStore.set(key, value);
      setLog(prevLog => prevLog + `Set: key=${key}, value=${value}, res=${res}\n`);
      console.log("set res:", key, value, res);
    } catch (err) {
      Alert.alert("Set Error", JSON.stringify(err));
    }
  };

  const handleGet = async () => {
    try {
      const res = await RNSecureKeyStore.get(key);
      setLog(prevLog => prevLog + `Get: key=${key}, value=${value}, res=${res}\n`);
    } catch (err) {
      Alert.alert("Get Error", JSON.stringify(err));
    }
  };

  const handleRemove = async () => {
    try {
      const res = await RNSecureKeyStore.remove(key);
      setLog(prevLog => prevLog + `Remove: key=${key}, value=${value}, res=${res}\n`);
    } catch (err) {
      Alert.alert("Remove Error", JSON.stringify(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>React - Native SecureKeyStore Demo</Text>

      <View style={{ width: "90%", marginTop: 16 }}>
        <Text>Key</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={key}
            onChangeText={setKey}
            style={styles.input}
            placeholder="输入 key"
            autoCapitalize="none"
          />
          {key.length > 0 && (
            <TouchableOpacity onPress={() => setKey("")} style={styles.clearBtn}>
              <Text style={styles.clearText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={{ marginTop: 8 }}>Value</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={value}
            onChangeText={setValue}
            style={styles.input}
            placeholder="输入 value"
          />
          {value.length > 0 && (
            <TouchableOpacity onPress={() => setValue("")} style={styles.clearBtn}>
              <Text style={styles.clearText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Button title="Set" onPress={handleSet} />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Button title="Get" onPress={handleGet} />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Button title="Remove" onPress={handleRemove} color="#d9534f" />
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', marginTop: 16 }}>
        <Text style={{ fontWeight: "600" }}>Log</Text>
        <Button title="Clear Log" onPress={() => setLog("")} />
      </View>
      <ScrollView style={styles.log} contentContainerStyle={{ padding: 8 }}>
        <Text>{ log || "No logs yet"}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 40,
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginTop: 4,
    height: 40,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  clearBtn: {
    marginLeft: 5,
    padding: 5,
  },
  clearText: {
    fontSize: 18,
    color: '#999',
  },
  log: {
    marginTop: 12,
    width: "90%",
    maxHeight: 200,
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 4,
  },
});

export default AppDemo;
```
## Link

此步骤为手动配置原生依赖项的指导。

首先需要使用 DevEco Studio 打开项目里的 HarmonyOS 工程 `harmony`

### 1.在工程根目录的 `oh-package.json` 添加 overrides字段

```json
{
  ...
  "overrides": {
    "@rnoh/react-native-openharmony" : "./react_native_openharmony"
  }
  ...
}
```

### 2.引入原生端代码

当前有两种方式：

- 通过 HAR 包导入（IDE 功能完善后将废弃，目前推荐使用此方式）；
- 直接链接源码。

方式一：通过 HAR 包导入（推荐）
> [!TIP] HAR 包位于三方库安装目录的 harmony 子文件夹中。

打开 entry/oh-package.json5 文件并追加以下依赖项：

```json
"dependencies": {
    "@rnoh/react-native-openharmony": "file:../react_native_openharmony",
    "@react-native-ohos/react-native-secure-key-store": "file:../../node_modules/@react-native-ohos/react-native-secure-key-store/harmony/secure_key_store.har"
  }
```

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

方法二：直接链接源码

> [!TIP] 如需使用直接链接源码，请参考[直接链接源码说明](/zh-cn/link-source-code.md)

### 3.配置 CMakeLists 和引入 RTNSecureKeyStorePackage

open entry/src/main/cpp/CMakeLists.txt，add：

```diff
include(FetchContent)
# BOOST
set(BOOST_ENABLE_CMAKE On)
FetchContent_Declare(
 Boost
 URL /7277/boost-1.82.0.tar.xz
 OVERRIDE_FIND_PACKAGE)
project(rnapp)
cmake_minimum_required(VERSION 3.4.1)
set(CMAKE_SKIP_BUILD_RPATH TRUE)
set(RNOH_APP_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
set(NODE_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../node_modules")
+ set(OH_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")
set(RNOH_CPP_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../oh_modules/@rnoh/react-native-openharmony/src/main/cpp")
set(RNOH_GENERATED_DIR "${CMAKE_CURRENT_SOURCE_DIR}/generated")
set(LOG_VERBOSITY_LEVEL 1)
set(CMAKE_ASM_FLAGS "-Wno-error=unused-command-line-argument -Qunused-arguments")
set(CMAKE_CXX_FLAGS "-fstack-protector-strong -Wl,-z,relro,-z,now,-z,noexecstack -s -fPIE -pie")
set(WITH_HITRACE_SYSTRACE 1) # for other CMakeLists.txt files to use
add_compile_definitions(WITH_HITRACE_SYSTRACE)


add_subdirectory("${RNOH_CPP_DIR}" ./rn)

# RNOH_BEGIN: manual_package_linking_1
add_subdirectory("${OH_MODULES}/@react-native-ohos/react-native-gesture-handler/src/main/cpp" ./gesture-handler)
+ add_subdirectory("${OH_MODULES}/@react-native-ohos/react-native-secure-key-store/src/main/cpp" ./secure_key_store)
# RNOH_END: manual_package_linking_1

file(GLOB GENERATED_CPP_FILES "./generated/*.cpp") # this line is needed by codegen v1
add_library(rnoh_app SHARED
    ${GENERATED_CPP_FILES}
    "./PackageProvider.cpp"
    "${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp"
)
target_link_libraries(rnoh_app PUBLIC rnoh)

# RNOH_BEGIN: manual_package_linking_2
target_link_libraries(rnoh_app PUBLIC rnoh_gesture_handler)
+ target_link_libraries(rnoh_app PUBLIC rnoh_secure_key_store)
# RNOH_END: manual_package_linking_2
```

打开 `entry/src/main/cpp/PackageProvider.cpp`，添加：

```diff
#include "RNOH/PackageProvider.h"
#include "generated/RNOHGeneratedPackage.h"
#include "SamplePackage.h"
+ #include "RTNSecureKeyStorePackage.h"

using namespace rnoh;

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
        std::make_shared<RNOHGeneratedPackage>(ctx),
        std::make_shared<SamplePackage>(ctx),
+       std::make_shared<RTNSecureKeyStorePackage>(ctx),
    };
}
```

### 4.在 ArkTs 侧引入 RNSecureKeyStorePackage

打开 `entry/src/main/ets/RNPackagesFactory.ts`，添加：

```diff
...
+ import { RNSecureKeyStorePackage } from "@react-native-ohos/react-native-secure-key-store/ts";

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new SamplePackage(ctx),
+   new RNSecureKeyStorePackage(ctx)
  ];
}
```

### 5.运行

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

然后编译、运行即可。

## 约束与限制

### 兼容性

要使用此库，需要使用正确的 React-Native 和 RNOH 版本。另外，还需要使用配套的 DevEco Studio 和 手机 ROM。

本文档内容基于以下版本验证通过：

1. RNOH：0.72.90; SDK：HarmonyOS NEXT Developer DB3; IDE: DevEco Studio: 5.0.5.220; ROM：NEXT.0.0.105;
2. RNOH：0.77.18; SDK：HarmonyOS 6.0.0 Release; IDE: DevEco Studio 6.0.0.858; ROM：6.0.0.112;

## 技术实现

### 安全存储机制

HarmonyOS 版本使用以下技术实现安全存储：

1. **HUKS (HarmonyOS Universal KeyStore)**
   
   - 使用 AES-256-GCM 加密算法
   - 密钥存储在系统级安全区域
   - 提供硬件级别的安全保护
2. **Preferences**
   
   - 用于存储加密后的数据
   - 数据以 JSON 格式存储（包含 cipherText, iv, authTag）

### 加密流程

```
原始数据 → AES-256-GCM 加密 → Base64 编码 → Preferences 存储
```

## API
> [!TIP] "Platform"列表示该属性在原三方库上支持的平台。

> [!TIP] "HarmonyOS Support"列为 yes 表示 HarmonyOS 平台支持该属性；no 则表示不支持；partially 表示部分支持。使用方法跨平台一致，效果对标 iOS 或 Android 的效果。

| Name                    | Description                                  | Type     | Required | Platform    | HarmonyOS Support |
| ----------------------- | -------------------------------------------- | -------- | -------- | ----------- | ----------------- |
| RNSecureKeyStore.set    | Securely stores the key-value pair.          | function | No      | iOS/Android | yes               |
| RNSecureKeyStore.get    | Retrieves the value for the given key.       | function | No      | iOS/Android | yes               |
| RNSecureKeyStore.remove | Removes the key-value pair.                  | function | No      | iOS/Android | yes               |

```typescript

```

## 平台差异

| 功能 | HarmonyOS | iOS | Android |
|------|-----------|-----|---------|
| 加密算法 | AES-256-GCM | Keychain 系统加密 | AES-256-GCM |
| 密钥存储 | HUKS | Secure Enclave | Android KeyStore |
| accessible 选项 |  ❌ 忽略 | ✅ 完整支持 | ❌ 忽略 |
| setResetOnAppUninstallTo | ❌ 忽略 | ✅ 支持 |  ❌ 忽略 |

## 开源协议

本项目基于 [The MIT License (MIT)](https://github.com/pradeep1991singh/react-native-secure-key-store/blob/master/LICENSE) ，请自由地享受和参与开源。

