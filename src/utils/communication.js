// 统一的 Bridge 初始化
export function setupBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = "https://__bridge_loaded__";
  document.documentElement.appendChild(iframe);
  setTimeout(function () {
    document.documentElement.removeChild(iframe);
  }, 0);
}

// 统一调用方法
export function callNativeMethod(methodName, params, callback) {
  setupBridge(function (bridge) {
    bridge.callHandler(methodName, params, function (response) {
      if (callback) {
        callback(response);
      }
    });
  });
}
