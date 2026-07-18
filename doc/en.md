> Template version: v0.2.2

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

> [!TIP] [Github Address](https://github.com/react-native-oh-library/react-native-secure-key-store)

## Installation and Usage

Please go to the Releases page of the third-party library to check the matching version information:

| Library Version | Release Info | Supported RN Version |
| --------------- | ------------------------------------------------------------ | -------------------- |
| 2.0.11     | [@react-native-ohos/react-native-secure-key-store Releases](https://github.com/react-native-oh-library/react-native-secure-key-store/releases/2.0.11-rc.1) | 0.72     |
| 2.1.0     | [@react-native-ohos/react-native-secure-key-store Releases](https://github.com/react-native-oh-library/react-native-secure-key-store/releases/2.1.0-rc.1) | 0.77     |

For older versions not published to npm, please refer to the [installation guide](/en/tgz-usage-en.md) to install the tgz package.

Enter the project directory and run the following command:

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

The following code shows the basic usage scenarios of this library:

> [!WARNING] The library name imported remains unchanged when using.

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
            placeholder="Enter key"
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
            placeholder="Enter value"
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

This step is a guide for manually configuring native dependencies.

First, you need to use DevEco Studio to open the HarmonyOS project `harmony` in the project.

### 1. Add overrides field to `oh-package.json` in the project root directory

```json
{
  ...
  "overrides": {
    "@rnoh/react-native-openharmony" : "./react_native_openharmony"
  }
  ...
}
```

### 2. Introduce Native Code

There are currently two methods:

Import via har package (this method will be deprecated after the IDE improves related functions, and it is the preferred method currently);
Link source code directly.

Method 1: Import via har package (recommended)

> [!TIP] The HAR package can be found in the harmony subfolder of the third-party library's installation directory.

Open the entry/oh-package.json5 file and append the following dependencies:

```json
"dependencies": {
    "@rnoh/react-native-openharmony": "file:../react_native_openharmony",
    "@react-native-ohos/react-native-secure-key-store": "file:../../node_modules/@react-native-ohos/react-native-secure-key-store/harmony/secure_key_store.har"
  }
```

Click the `sync` button in the upper right corner.

Or run in the terminal:

```bash
cd entry
ohpm install
```

Method 2: Link source code directly

> [!TIP] If you need to use direct source code linking, please refer to [Direct Source Code Linking Description](/en/link-source-code.md)

### 3. Configure CMakeLists and Introduce RTNSecureKeyStorePackage

open entry/src/main/cpp/CMakeLists.txt, add:

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

Open `entry/src/main/cpp/PackageProvider.cpp`, add:

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

### 4. Introduce RNSecureKeyStorePackage on ArkTs side

Open `entry/src/main/ets/RNPackagesFactory.ts`, add:

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

### 5. Run

Click the `sync` button in the upper right corner.

Or run in the terminal:

```bash
cd entry
ohpm install
```

Then compile and run.

## Constraints

### Compatibility

To use this library, you need to use the correct React-Native and RNOH versions. In addition, you need to use the matching DevEco Studio and phone ROM.

This document is verified based on the following versions:

1. RNOH: 0.72.90; SDK: HarmonyOS NEXT Developer DB3; IDE: DevEco Studio: 5.0.5.220; ROM: NEXT.0.0.105;
2. RNOH: 0.77.18; SDK: HarmonyOS 6.0.0 Release; IDE: DevEco Studio 6.0.0.858; ROM: 6.0.0.112;

## Technical Implementation

### Secure Storage Mechanism

The HarmonyOS version uses the following technologies to implement secure storage:

1. **HUKS (HarmonyOS Universal KeyStore)**
   
   - Uses AES-256-GCM encryption algorithm
   - Keys are stored in a system-level secure area
   - Provides hardware-level security protection
2. **Preferences**
   
   - Used to store encrypted data
   - Data is stored in JSON format (including cipherText, iv, authTag)

### Encryption Process

```
Original Data → AES-256-GCM Encryption → Base64 Encoding → Preferences Storage
```

## API
> [!TIP] The "Platform" column shows the platforms supported by the original third-party library.

> [!TIP] The "HarmonyOS Support" column: yes means the property is supported on HarmonyOS; no means not supported; partially means partially supported. The usage is the same across platforms, and the behavior aligns with iOS or Android.

| Name                    | Description                                  | Type     | Required | Platform    | HarmonyOS Support |
| ----------------------- | -------------------------------------------- | -------- | -------- | ----------- | ----------------- |
| RNSecureKeyStore.set    | Securely stores the key-value pair.          | function | no      | iOS/Android | yes               |
| RNSecureKeyStore.get    | Retrieves the value for the given key.       | function | no      | iOS/Android | yes               |
| RNSecureKeyStore.remove | Removes the key-value pair.                  | function | no      | iOS/Android | yes               |

```typescript

```

## Platform Differences

| Feature | HarmonyOS | iOS | Android |
|------|-----------|-----|---------|
| Encryption Algorithm | AES-256-GCM | Keychain System Encryption | AES-256-GCM |
| Key Storage | HUKS | Secure Enclave | Android KeyStore |
| accessible Option |  ❌ Ignored | ✅ Fully Supported | ❌ Ignored |
| setResetOnAppUninstallTo | ❌ Ignored | ✅ Supported |  ❌ Ignored |

## License

This project is based on [The MIT License (MIT)](https://github.com/pradeep1991singh/react-native-secure-key-store/blob/master/LICENSE), please freely enjoy and participate in open source.

