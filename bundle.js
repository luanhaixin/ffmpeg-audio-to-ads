/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@ffmpeg/ffmpeg/dist/esm sync recursive":
/*!****************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/dist/esm/ sync ***!
  \****************************************************/
/***/ ((module) => {

eval("{function webpackEmptyContext(req) {\n\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\te.code = 'MODULE_NOT_FOUND';\n\tthrow e;\n}\nwebpackEmptyContext.keys = () => ([]);\nwebpackEmptyContext.resolve = webpackEmptyContext;\nwebpackEmptyContext.id = \"./node_modules/@ffmpeg/ffmpeg/dist/esm sync recursive\";\nmodule.exports = webpackEmptyContext;\n\n//# sourceURL=webpack://ffmpeg/./node_modules/@ffmpeg/ffmpeg/dist/esm/_sync?\n}");

/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js":
/*!*********************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FFmpeg: () => (/* binding */ FFmpeg)\n/* harmony export */ });\n/* harmony import */ var _const_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./const.js */ \"./node_modules/@ffmpeg/ffmpeg/dist/esm/const.js\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ \"./node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js\");\n/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errors.js */ \"./node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js\");\n\n\n\n/**\n * Provides APIs to interact with ffmpeg web worker.\n *\n * @example\n * ```ts\n * const ffmpeg = new FFmpeg();\n * ```\n */\nclass FFmpeg {\n    #worker = null;\n    /**\n     * #resolves and #rejects tracks Promise resolves and rejects to\n     * be called when we receive message from web worker.\n     */\n    #resolves = {};\n    #rejects = {};\n    #logEventCallbacks = [];\n    #progressEventCallbacks = [];\n    loaded = false;\n    /**\n     * register worker message event handlers.\n     */\n    #registerHandlers = () => {\n        if (this.#worker) {\n            this.#worker.onmessage = ({ data: { id, type, data }, }) => {\n                switch (type) {\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LOAD:\n                        this.loaded = true;\n                        this.#resolves[id](data);\n                        break;\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.MOUNT:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.UNMOUNT:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.EXEC:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.FFPROBE:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.WRITE_FILE:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.READ_FILE:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.DELETE_FILE:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.RENAME:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.CREATE_DIR:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LIST_DIR:\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.DELETE_DIR:\n                        this.#resolves[id](data);\n                        break;\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LOG:\n                        this.#logEventCallbacks.forEach((f) => f(data));\n                        break;\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.PROGRESS:\n                        this.#progressEventCallbacks.forEach((f) => f(data));\n                        break;\n                    case _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.ERROR:\n                        this.#rejects[id](data);\n                        break;\n                }\n                delete this.#resolves[id];\n                delete this.#rejects[id];\n            };\n        }\n    };\n    /**\n     * Generic function to send messages to web worker.\n     */\n    #send = ({ type, data }, trans = [], signal) => {\n        if (!this.#worker) {\n            return Promise.reject(_errors_js__WEBPACK_IMPORTED_MODULE_2__.ERROR_NOT_LOADED);\n        }\n        return new Promise((resolve, reject) => {\n            const id = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getMessageID)();\n            this.#worker && this.#worker.postMessage({ id, type, data }, trans);\n            this.#resolves[id] = resolve;\n            this.#rejects[id] = reject;\n            signal?.addEventListener(\"abort\", () => {\n                reject(new DOMException(`Message # ${id} was aborted`, \"AbortError\"));\n            }, { once: true });\n        });\n    };\n    on(event, callback) {\n        if (event === \"log\") {\n            this.#logEventCallbacks.push(callback);\n        }\n        else if (event === \"progress\") {\n            this.#progressEventCallbacks.push(callback);\n        }\n    }\n    off(event, callback) {\n        if (event === \"log\") {\n            this.#logEventCallbacks = this.#logEventCallbacks.filter((f) => f !== callback);\n        }\n        else if (event === \"progress\") {\n            this.#progressEventCallbacks = this.#progressEventCallbacks.filter((f) => f !== callback);\n        }\n    }\n    /**\n     * Loads ffmpeg-core inside web worker. It is required to call this method first\n     * as it initializes WebAssembly and other essential variables.\n     *\n     * @category FFmpeg\n     * @returns `true` if ffmpeg core is loaded for the first time.\n     */\n    load = ({ classWorkerURL, ...config } = {}, { signal } = {}) => {\n        if (!this.#worker) {\n            this.#worker = classWorkerURL ?\n                new Worker(__webpack_require__(\"./node_modules/@ffmpeg/ffmpeg/dist/esm sync recursive\")(classWorkerURL), {\n                    type: \"module\",\n                }) :\n                // We need to duplicated the code here to enable webpack\n                // to bundle worekr.js here.\n                new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u(\"worker\"), __webpack_require__.b), {\n                    type: undefined,\n                });\n            this.#registerHandlers();\n        }\n        return this.#send({\n            type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LOAD,\n            data: config,\n        }, undefined, signal);\n    };\n    /**\n     * Execute ffmpeg command.\n     *\n     * @remarks\n     * To avoid common I/O issues, [\"-nostdin\", \"-y\"] are prepended to the args\n     * by default.\n     *\n     * @example\n     * ```ts\n     * const ffmpeg = new FFmpeg();\n     * await ffmpeg.load();\n     * await ffmpeg.writeFile(\"video.avi\", ...);\n     * // ffmpeg -i video.avi video.mp4\n     * await ffmpeg.exec([\"-i\", \"video.avi\", \"video.mp4\"]);\n     * const data = ffmpeg.readFile(\"video.mp4\");\n     * ```\n     *\n     * @returns `0` if no error, `!= 0` if timeout (1) or error.\n     * @category FFmpeg\n     */\n    exec = (\n    /** ffmpeg command line args */\n    args, \n    /**\n     * milliseconds to wait before stopping the command execution.\n     *\n     * @defaultValue -1\n     */\n    timeout = -1, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.EXEC,\n        data: { args, timeout },\n    }, undefined, signal);\n    /**\n     * Execute ffprobe command.\n     *\n     * @example\n     * ```ts\n     * const ffmpeg = new FFmpeg();\n     * await ffmpeg.load();\n     * await ffmpeg.writeFile(\"video.avi\", ...);\n     * // Getting duration of a video in seconds: ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.avi -o output.txt\n     * await ffmpeg.ffprobe([\"-v\", \"error\", \"-show_entries\", \"format=duration\", \"-of\", \"default=noprint_wrappers=1:nokey=1\", \"video.avi\", \"-o\", \"output.txt\"]);\n     * const data = ffmpeg.readFile(\"output.txt\");\n     * ```\n     *\n     * @returns `0` if no error, `!= 0` if timeout (1) or error.\n     * @category FFmpeg\n     */\n    ffprobe = (\n    /** ffprobe command line args */\n    args, \n    /**\n     * milliseconds to wait before stopping the command execution.\n     *\n     * @defaultValue -1\n     */\n    timeout = -1, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.FFPROBE,\n        data: { args, timeout },\n    }, undefined, signal);\n    /**\n     * Terminate all ongoing API calls and terminate web worker.\n     * `FFmpeg.load()` must be called again before calling any other APIs.\n     *\n     * @category FFmpeg\n     */\n    terminate = () => {\n        const ids = Object.keys(this.#rejects);\n        // rejects all incomplete Promises.\n        for (const id of ids) {\n            this.#rejects[id](_errors_js__WEBPACK_IMPORTED_MODULE_2__.ERROR_TERMINATED);\n            delete this.#rejects[id];\n            delete this.#resolves[id];\n        }\n        if (this.#worker) {\n            this.#worker.terminate();\n            this.#worker = null;\n            this.loaded = false;\n        }\n    };\n    /**\n     * Write data to ffmpeg.wasm.\n     *\n     * @example\n     * ```ts\n     * const ffmpeg = new FFmpeg();\n     * await ffmpeg.load();\n     * await ffmpeg.writeFile(\"video.avi\", await fetchFile(\"../video.avi\"));\n     * await ffmpeg.writeFile(\"text.txt\", \"hello world\");\n     * ```\n     *\n     * @category File System\n     */\n    writeFile = (path, data, { signal } = {}) => {\n        const trans = [];\n        if (data instanceof Uint8Array) {\n            trans.push(data.buffer);\n        }\n        return this.#send({\n            type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.WRITE_FILE,\n            data: { path, data },\n        }, trans, signal);\n    };\n    mount = (fsType, options, mountPoint) => {\n        const trans = [];\n        return this.#send({\n            type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.MOUNT,\n            data: { fsType, options, mountPoint },\n        }, trans);\n    };\n    unmount = (mountPoint) => {\n        const trans = [];\n        return this.#send({\n            type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.UNMOUNT,\n            data: { mountPoint },\n        }, trans);\n    };\n    /**\n     * Read data from ffmpeg.wasm.\n     *\n     * @example\n     * ```ts\n     * const ffmpeg = new FFmpeg();\n     * await ffmpeg.load();\n     * const data = await ffmpeg.readFile(\"video.mp4\");\n     * ```\n     *\n     * @category File System\n     */\n    readFile = (path, \n    /**\n     * File content encoding, supports two encodings:\n     * - utf8: read file as text file, return data in string type.\n     * - binary: read file as binary file, return data in Uint8Array type.\n     *\n     * @defaultValue binary\n     */\n    encoding = \"binary\", { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.READ_FILE,\n        data: { path, encoding },\n    }, undefined, signal);\n    /**\n     * Delete a file.\n     *\n     * @category File System\n     */\n    deleteFile = (path, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.DELETE_FILE,\n        data: { path },\n    }, undefined, signal);\n    /**\n     * Rename a file or directory.\n     *\n     * @category File System\n     */\n    rename = (oldPath, newPath, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.RENAME,\n        data: { oldPath, newPath },\n    }, undefined, signal);\n    /**\n     * Create a directory.\n     *\n     * @category File System\n     */\n    createDir = (path, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.CREATE_DIR,\n        data: { path },\n    }, undefined, signal);\n    /**\n     * List directory contents.\n     *\n     * @category File System\n     */\n    listDir = (path, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.LIST_DIR,\n        data: { path },\n    }, undefined, signal);\n    /**\n     * Delete an empty directory.\n     *\n     * @category File System\n     */\n    deleteDir = (path, { signal } = {}) => this.#send({\n        type: _const_js__WEBPACK_IMPORTED_MODULE_0__.FFMessageType.DELETE_DIR,\n        data: { path },\n    }, undefined, signal);\n}\n\n\n//# sourceURL=webpack://ffmpeg/./node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js?\n}");

/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/dist/esm/const.js":
/*!*******************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/dist/esm/const.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CORE_URL: () => (/* binding */ CORE_URL),\n/* harmony export */   CORE_VERSION: () => (/* binding */ CORE_VERSION),\n/* harmony export */   FFMessageType: () => (/* binding */ FFMessageType),\n/* harmony export */   MIME_TYPE_JAVASCRIPT: () => (/* binding */ MIME_TYPE_JAVASCRIPT),\n/* harmony export */   MIME_TYPE_WASM: () => (/* binding */ MIME_TYPE_WASM)\n/* harmony export */ });\nconst MIME_TYPE_JAVASCRIPT = \"text/javascript\";\nconst MIME_TYPE_WASM = \"application/wasm\";\nconst CORE_VERSION = \"0.12.9\";\nconst CORE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd/ffmpeg-core.js`;\nvar FFMessageType;\n(function (FFMessageType) {\n    FFMessageType[\"LOAD\"] = \"LOAD\";\n    FFMessageType[\"EXEC\"] = \"EXEC\";\n    FFMessageType[\"FFPROBE\"] = \"FFPROBE\";\n    FFMessageType[\"WRITE_FILE\"] = \"WRITE_FILE\";\n    FFMessageType[\"READ_FILE\"] = \"READ_FILE\";\n    FFMessageType[\"DELETE_FILE\"] = \"DELETE_FILE\";\n    FFMessageType[\"RENAME\"] = \"RENAME\";\n    FFMessageType[\"CREATE_DIR\"] = \"CREATE_DIR\";\n    FFMessageType[\"LIST_DIR\"] = \"LIST_DIR\";\n    FFMessageType[\"DELETE_DIR\"] = \"DELETE_DIR\";\n    FFMessageType[\"ERROR\"] = \"ERROR\";\n    FFMessageType[\"DOWNLOAD\"] = \"DOWNLOAD\";\n    FFMessageType[\"PROGRESS\"] = \"PROGRESS\";\n    FFMessageType[\"LOG\"] = \"LOG\";\n    FFMessageType[\"MOUNT\"] = \"MOUNT\";\n    FFMessageType[\"UNMOUNT\"] = \"UNMOUNT\";\n})(FFMessageType || (FFMessageType = {}));\n\n\n//# sourceURL=webpack://ffmpeg/./node_modules/@ffmpeg/ffmpeg/dist/esm/const.js?\n}");

/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js":
/*!********************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ERROR_IMPORT_FAILURE: () => (/* binding */ ERROR_IMPORT_FAILURE),\n/* harmony export */   ERROR_NOT_LOADED: () => (/* binding */ ERROR_NOT_LOADED),\n/* harmony export */   ERROR_TERMINATED: () => (/* binding */ ERROR_TERMINATED),\n/* harmony export */   ERROR_UNKNOWN_MESSAGE_TYPE: () => (/* binding */ ERROR_UNKNOWN_MESSAGE_TYPE)\n/* harmony export */ });\nconst ERROR_UNKNOWN_MESSAGE_TYPE = new Error(\"unknown message type\");\nconst ERROR_NOT_LOADED = new Error(\"ffmpeg is not loaded, call `await ffmpeg.load()` first\");\nconst ERROR_TERMINATED = new Error(\"called FFmpeg.terminate()\");\nconst ERROR_IMPORT_FAILURE = new Error(\"failed to import ffmpeg-core.js\");\n\n\n//# sourceURL=webpack://ffmpeg/./node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js?\n}");

/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/dist/esm/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/dist/esm/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FFFSType: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_1__.FFFSType),\n/* harmony export */   FFmpeg: () => (/* reexport safe */ _classes_js__WEBPACK_IMPORTED_MODULE_0__.FFmpeg)\n/* harmony export */ });\n/* harmony import */ var _classes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes.js */ \"./node_modules/@ffmpeg/ffmpeg/dist/esm/classes.js\");\n/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ \"./node_modules/@ffmpeg/ffmpeg/dist/esm/types.js\");\n\n\n\n\n//# sourceURL=webpack://ffmpeg/./node_modules/@ffmpeg/ffmpeg/dist/esm/index.js?\n}");

/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/dist/esm/types.js":
/*!*******************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/dist/esm/types.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FFFSType: () => (/* binding */ FFFSType)\n/* harmony export */ });\nvar FFFSType;\n(function (FFFSType) {\n    FFFSType[\"MEMFS\"] = \"MEMFS\";\n    FFFSType[\"NODEFS\"] = \"NODEFS\";\n    FFFSType[\"NODERAWFS\"] = \"NODERAWFS\";\n    FFFSType[\"IDBFS\"] = \"IDBFS\";\n    FFFSType[\"WORKERFS\"] = \"WORKERFS\";\n    FFFSType[\"PROXYFS\"] = \"PROXYFS\";\n})(FFFSType || (FFFSType = {}));\n\n\n//# sourceURL=webpack://ffmpeg/./node_modules/@ffmpeg/ffmpeg/dist/esm/types.js?\n}");

/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js":
/*!*******************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getMessageID: () => (/* binding */ getMessageID)\n/* harmony export */ });\n/**\n * Generate an unique message ID.\n */\nconst getMessageID = (() => {\n    let messageID = 0;\n    return () => messageID++;\n})();\n\n\n//# sourceURL=webpack://ffmpeg/./node_modules/@ffmpeg/ffmpeg/dist/esm/utils.js?\n}");

/***/ }),

/***/ "./node_modules/@ffmpeg/util/dist/esm/const.js":
/*!*****************************************************!*\
  !*** ./node_modules/@ffmpeg/util/dist/esm/const.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   HeaderContentLength: () => (/* binding */ HeaderContentLength)\n/* harmony export */ });\nconst HeaderContentLength = \"Content-Length\";\n\n\n//# sourceURL=webpack://ffmpeg/./node_modules/@ffmpeg/util/dist/esm/const.js?\n}");

/***/ }),

/***/ "./node_modules/@ffmpeg/util/dist/esm/errors.js":
/*!******************************************************!*\
  !*** ./node_modules/@ffmpeg/util/dist/esm/errors.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ERROR_INCOMPLETED_DOWNLOAD: () => (/* binding */ ERROR_INCOMPLETED_DOWNLOAD),\n/* harmony export */   ERROR_RESPONSE_BODY_READER: () => (/* binding */ ERROR_RESPONSE_BODY_READER)\n/* harmony export */ });\nconst ERROR_RESPONSE_BODY_READER = new Error(\"failed to get response body reader\");\nconst ERROR_INCOMPLETED_DOWNLOAD = new Error(\"failed to complete download\");\n\n\n//# sourceURL=webpack://ffmpeg/./node_modules/@ffmpeg/util/dist/esm/errors.js?\n}");

/***/ }),

/***/ "./node_modules/@ffmpeg/util/dist/esm/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/@ffmpeg/util/dist/esm/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   downloadWithProgress: () => (/* binding */ downloadWithProgress),\n/* harmony export */   fetchFile: () => (/* binding */ fetchFile),\n/* harmony export */   importScript: () => (/* binding */ importScript),\n/* harmony export */   toBlobURL: () => (/* binding */ toBlobURL)\n/* harmony export */ });\n/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors.js */ \"./node_modules/@ffmpeg/util/dist/esm/errors.js\");\n/* harmony import */ var _const_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./const.js */ \"./node_modules/@ffmpeg/util/dist/esm/const.js\");\n\n\nconst readFromBlobOrFile = (blob) => new Promise((resolve, reject) => {\n    const fileReader = new FileReader();\n    fileReader.onload = () => {\n        const { result } = fileReader;\n        if (result instanceof ArrayBuffer) {\n            resolve(new Uint8Array(result));\n        }\n        else {\n            resolve(new Uint8Array());\n        }\n    };\n    fileReader.onerror = (event) => {\n        reject(Error(`File could not be read! Code=${event?.target?.error?.code || -1}`));\n    };\n    fileReader.readAsArrayBuffer(blob);\n});\n/**\n * An util function to fetch data from url string, base64, URL, File or Blob format.\n *\n * Examples:\n * ```ts\n * // URL\n * await fetchFile(\"http://localhost:3000/video.mp4\");\n * // base64\n * await fetchFile(\"data:<type>;base64,wL2dvYWwgbW9yZ...\");\n * // URL\n * await fetchFile(new URL(\"video.mp4\", import.meta.url));\n * // File\n * fileInput.addEventListener('change', (e) => {\n *   await fetchFile(e.target.files[0]);\n * });\n * // Blob\n * const blob = new Blob(...);\n * await fetchFile(blob);\n * ```\n */\nconst fetchFile = async (file) => {\n    let data;\n    if (typeof file === \"string\") {\n        /* From base64 format */\n        if (/data:_data\\/([a-zA-Z]*);base64,([^\"]*)/.test(file)) {\n            data = atob(file.split(\",\")[1])\n                .split(\"\")\n                .map((c) => c.charCodeAt(0));\n            /* From remote server/URL */\n        }\n        else {\n            data = await (await fetch(file)).arrayBuffer();\n        }\n    }\n    else if (file instanceof URL) {\n        data = await (await fetch(file)).arrayBuffer();\n    }\n    else if (file instanceof File || file instanceof Blob) {\n        data = await readFromBlobOrFile(file);\n    }\n    else {\n        return new Uint8Array();\n    }\n    return new Uint8Array(data);\n};\n/**\n * importScript dynamically import a script, useful when you\n * want to use different versions of ffmpeg.wasm based on environment.\n *\n * Example:\n *\n * ```ts\n * await importScript(\"http://localhost:3000/ffmpeg.js\");\n * ```\n */\nconst importScript = async (url) => new Promise((resolve) => {\n    const script = document.createElement(\"script\");\n    const eventHandler = () => {\n        script.removeEventListener(\"load\", eventHandler);\n        resolve();\n    };\n    script.src = url;\n    script.type = \"text/javascript\";\n    script.addEventListener(\"load\", eventHandler);\n    document.getElementsByTagName(\"head\")[0].appendChild(script);\n});\n/**\n * Download content of a URL with progress.\n *\n * Progress only works when Content-Length is provided by the server.\n *\n */\nconst downloadWithProgress = async (url, cb) => {\n    const resp = await fetch(url);\n    let buf;\n    try {\n        // Set total to -1 to indicate that there is not Content-Type Header.\n        const total = parseInt(resp.headers.get(_const_js__WEBPACK_IMPORTED_MODULE_1__.HeaderContentLength) || \"-1\");\n        const reader = resp.body?.getReader();\n        if (!reader)\n            throw _errors_js__WEBPACK_IMPORTED_MODULE_0__.ERROR_RESPONSE_BODY_READER;\n        const chunks = [];\n        let received = 0;\n        for (;;) {\n            const { done, value } = await reader.read();\n            const delta = value ? value.length : 0;\n            if (done) {\n                if (total != -1 && total !== received)\n                    throw _errors_js__WEBPACK_IMPORTED_MODULE_0__.ERROR_INCOMPLETED_DOWNLOAD;\n                cb && cb({ url, total, received, delta, done });\n                break;\n            }\n            chunks.push(value);\n            received += delta;\n            cb && cb({ url, total, received, delta, done });\n        }\n        const data = new Uint8Array(received);\n        let position = 0;\n        for (const chunk of chunks) {\n            data.set(chunk, position);\n            position += chunk.length;\n        }\n        buf = data.buffer;\n    }\n    catch (e) {\n        console.log(`failed to send download progress event: `, e);\n        // Fetch arrayBuffer directly when it is not possible to get progress.\n        buf = await resp.arrayBuffer();\n        cb &&\n            cb({\n                url,\n                total: buf.byteLength,\n                received: buf.byteLength,\n                delta: 0,\n                done: true,\n            });\n    }\n    return buf;\n};\n/**\n * toBlobURL fetches data from an URL and return a blob URL.\n *\n * Example:\n *\n * ```ts\n * await toBlobURL(\"http://localhost:3000/ffmpeg.js\", \"text/javascript\");\n * ```\n */\nconst toBlobURL = async (url, mimeType, progress = false, cb) => {\n    const buf = progress\n        ? await downloadWithProgress(url, cb)\n        : await (await fetch(url)).arrayBuffer();\n    const blob = new Blob([buf], { type: mimeType });\n    return URL.createObjectURL(blob);\n};\n\n\n//# sourceURL=webpack://ffmpeg/./node_modules/@ffmpeg/util/dist/esm/index.js?\n}");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ffmpeg_ffmpeg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ffmpeg/ffmpeg */ \"./node_modules/@ffmpeg/ffmpeg/dist/esm/index.js\");\n/* harmony import */ var _ffmpeg_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ffmpeg/util */ \"./node_modules/@ffmpeg/util/dist/esm/index.js\");\n// const { FFmpeg } = require('@ffmpeg/ffmpeg');\r\n\r\n\r\n\r\n\r\nconst message = document.getElementById('message');\r\nconst audio = document.getElementById('output-audio');\r\nconst uploader = document.getElementById('uploader');\r\n\r\nconst uploadLabel = document.getElementById('uploadLabel');\r\n\r\n\r\n\r\nconst fileName = document.getElementById('fileName');\r\nconst processBtn = document.getElementById('processBtn');\r\n\r\nconst rangeSlider = document.getElementById('rangeSlider');\r\nconst silenceStartSlider = document.getElementById('silenceStartSlider');\r\nconst silenceEndSlider = document.getElementById('silenceEndSlider');\r\n\r\n\r\nlet currentFile = null;\r\nlet startTime = 0;\r\nlet endTime = 10;\r\nlet silenceStart = 0;\r\nlet silenceEnd = 0;\r\n\r\nconst ffmpeg = new _ffmpeg_ffmpeg__WEBPACK_IMPORTED_MODULE_0__.FFmpeg();\r\nconst baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';\r\n\r\nasync function loadFFmpeg() {\r\n    message.innerText = '⏳ 正在加载 FFmpeg 核心文件...';\r\n    await ffmpeg.load({\r\n        coreURL: await (0,_ffmpeg_util__WEBPACK_IMPORTED_MODULE_1__.toBlobURL)(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),\r\n        wasmURL: await (0,_ffmpeg_util__WEBPACK_IMPORTED_MODULE_1__.toBlobURL)(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),\r\n    });\r\n    message.innerText = '✅ FFmpeg 加载完成，请上传文件';\r\n}\r\n\r\n// 初始化截取区间滑块\r\nnoUiSlider.create(rangeSlider, {\r\n    start: [0, 0],\r\n    connect: true,\r\n    range: { min: 0, max: 10 },\r\n    step: 0.1,\r\n    tooltips: [true, true],\r\n    format: {\r\n        to: (v) => v.toFixed(1) + \"s\",\r\n        from: (v) => parseFloat(v)\r\n    },\r\n});\r\nrangeSlider.noUiSlider.on('update', (values) => {\r\n    startTime = parseFloat(values[0]);\r\n    endTime = parseFloat(values[1]);\r\n\r\n});\r\n\r\n// 初始化开头静音滑块\r\nnoUiSlider.create(silenceStartSlider, {\r\n    start: [0],\r\n    connect: 'lower',\r\n    step: 0.1,\r\n    range: { min: 0, max: 120 },\r\n    tooltips: true,\r\n    format: {\r\n        to: (v) => v.toFixed(1) + \"s\",\r\n        from: (v) => parseFloat(v),\r\n    },\r\n});\r\nsilenceStartSlider.noUiSlider.on('update', (values) => {\r\n    silenceStart = parseFloat(values[0]);\r\n\r\n});\r\n\r\n// 初始化结尾静音滑块\r\nnoUiSlider.create(silenceEndSlider, {\r\n    start: [0],\r\n    connect: 'lower',\r\n    step: 0.1,\r\n    range: { min: 0, max: 120 },\r\n    tooltips: true,\r\n    format: {\r\n        to: (v) => v.toFixed(1) + \"s\",\r\n        from: (v) => parseFloat(v),\r\n    },\r\n});\r\nsilenceEndSlider.noUiSlider.on('update', (values) => {\r\n    silenceEnd = parseFloat(values[0]);\r\n});\r\n\r\n\r\n\r\n// 监听上传文件\r\nuploader.addEventListener('change', async (e) => {\r\n\r\n    if (uploader.files.length > 0) {\r\n        fileName.textContent = uploader.files[0].name;\r\n\r\n    currentFile = e.target.files[0];\r\n    const audioInfo = await getAudioInfo(currentFile);\r\n    updateRangeSlider(audioInfo.duration);\r\n    processBtn.disabled = false;\r\n    audio.style.display = 'none';\r\n\r\n    } else {\r\n        fileName.textContent = '未选择文件';\r\n    }\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n});\r\n\r\n\r\nasync function getAudioInfo(file) {\r\n    return new Promise((resolve, reject) => {\r\n        const context = new AudioContext();\r\n        const reader = new FileReader();\r\n        reader.onload = async (e) => {\r\n            try {\r\n                const arrayBuffer = e.target.result;\r\n                const audioBuffer = await context.decodeAudioData(arrayBuffer);\r\n                resolve({\r\n                    sampleRate: audioBuffer.sampleRate,\r\n                    channels: audioBuffer.numberOfChannels,\r\n                    duration: audioBuffer.duration,  // 这个字段就是音频时长（秒）\r\n                    length: audioBuffer.length,      // 采样点数\r\n                });\r\n            } catch (err) {\r\n                reject(err);\r\n            }\r\n        };\r\n        reader.onerror = reject;\r\n        reader.readAsArrayBuffer(file);\r\n    });\r\n}\r\n\r\nfunction updateRangeSlider(duration) {\r\n    // 更新范围和初始值\r\n    rangeSlider.noUiSlider.updateOptions({\r\n        range: { min: 0, max: duration },\r\n        start: [0, duration],\r\n    });\r\n\r\n\r\n\r\n}\r\n\r\n\r\n\r\n\r\nprocessBtn.addEventListener('click', async () => {\r\n    if (!currentFile) {\r\n        alert('请先上传文件');\r\n        return;\r\n    }\r\n    message.innerText = '处理中，请稍候...';\r\n    processBtn.disabled = true;\r\n    audio.style.display = 'none';\r\n\r\n    await ffmpeg.writeFile(currentFile.name, await (0,_ffmpeg_util__WEBPACK_IMPORTED_MODULE_1__.fetchFile)(currentFile));\r\n\r\n    message.innerText = '⏳ 正在分析音频参数...';\r\n    const audioInfo = await getAudioInfo(currentFile);\r\n    const sampleRate = audioInfo.sampleRate || 44100;\r\n    const channelLayout = audioInfo.channels === 1 ? 'mono' : 'stereo';\r\n\r\n\r\n\r\n    message.innerText = '⏳ 正在截取音频片段...';\r\n    await ffmpeg.exec([\r\n        '-i', currentFile.name,\r\n        '-ss', startTime.toString(),\r\n        '-to', endTime.toString(),\r\n        '-map', 'a',\r\n        '-q:a', '0',\r\n        'segment.mp3',\r\n    ]);\r\n\r\n    if (silenceStart > 0) {\r\n        message.innerText = '⏳ 生成开头静音...';\r\n        await ffmpeg.exec([\r\n            '-f', 'lavfi',\r\n            '-i', `anullsrc=r=${sampleRate}:cl=${channelLayout}`,\r\n            '-t', silenceStart.toString(),\r\n            '-q:a', '0',\r\n            'silence_start.mp3',\r\n        ]);\r\n    }\r\n\r\n    if (silenceEnd > 0) {\r\n        message.innerText = '⏳ 生成结尾静音...';\r\n        await ffmpeg.exec([\r\n            '-f', 'lavfi',\r\n            '-i', `anullsrc=r=${sampleRate}:cl=${channelLayout}`,\r\n            '-t', silenceEnd.toString(),\r\n            '-q:a', '0',\r\n            'silence_end.mp3',\r\n        ]);\r\n    }\r\n\r\n    message.innerText = '⏳ 拼接音频中...';\r\n\r\n    // 生成 concat 文件列表\r\n    const concatList = [];\r\n    if (silenceStart > 0) concatList.push(\"file 'silence_start.mp3'\");\r\n    concatList.push(\"file 'segment.mp3'\");\r\n    if (silenceEnd > 0) concatList.push(\"file 'silence_end.mp3'\");\r\n\r\n    await ffmpeg.writeFile('concat_list.txt', new TextEncoder().encode(concatList.join('\\n')));\r\n\r\n    await ffmpeg.exec([\r\n        '-f', 'concat',\r\n        '-safe', '0',\r\n        '-i', 'concat_list.txt',\r\n        '-c:a', 'libmp3lame',\r\n        '-q:a', '2',\r\n        'output.mp3',\r\n    ]);\r\n\r\n    message.innerText = '⏳ 读取输出文件...';\r\n    const data = await ffmpeg.readFile('output.mp3');\r\n    const blob = new Blob([data.buffer], { type: 'audio/mpeg' });\r\n    audio.src = URL.createObjectURL(blob);\r\n    audio.style.display = 'block';\r\n\r\n    document.getElementById('audioContainer').style.display = 'block';\r\n    message.innerText = '✅ 处理完成，可以播放或下载音频了';\r\n    processBtn.disabled = false;\r\n});\r\n\r\nloadFFmpeg();\n\n//# sourceURL=webpack://ffmpeg/./src/index.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;