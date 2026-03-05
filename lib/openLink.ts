function transParams(params) {
    var result = "";
    if (typeof params === "object" && Object.keys(params).length > 0) {
        var keys = Object.keys(params);
        if (keys.length > 0) {
            keys.forEach(function (key, index) {
                var pre = index === 0 ? "?" : "&";
                result += pre + key + "=" + params[key]
            })
        }
    }
    return result
}

function getFrameParams(urlStr) {
    var url = urlStr || window.location.href;
    var params = {};
    var urlParams = [];
    if (url.indexOf('#') !== -1) {
        var paramsArr = url.split('#');
        paramsArr.forEach(function (item) {
            if (item.indexOf('?') !== -1) {
                var urlItem = item.slice(item.indexOf('?') + 1).split('&');
                urlItem.forEach(function (element) {
                    var datas = element.split('=');
                    params[datas[0]] = datas[1];
                }.bind(this));
            }
        }.bind(this));
    } else {
        urlParams = url.slice(url.indexOf('?') + 1).split('&');
        urlParams.forEach(function (element) {
            var datas = element.split('=');
            params[datas[0]] = datas[1];
        }.bind(this));
    }
    return params;
};

function webOpen(url, openType) {

    if (!/^http/.test(url)) {
        var reg = new RegExp("^" + window.ecologyContentPath + "");
        url = reg.test(url)
            ? url
            : (window.ecologyContentPath || "") + url;
    }

    var type = openType;
    if (window.e9mobileConfig && window.e9mobileConfig.openLinkType) {
        type = window.e9mobileConfig.openLinkType;
    }
    if (type === "href") {
        window.location.href = url;
    } else if (type === "iframe") {
        // 190601
        if (window.WeaverMobilePage && window.WeaverMobilePage.RouteLayout
            && typeof window.WeaverMobilePage.RouteLayout.open === 'function') {
            window.WeaverMobilePage.RouteLayout.open(url);
            return {
                close: function () {
                    window.history && window.history.go(-1);
                }
            };
        }
        var frameView = document.createElement("div");
        frameView.style.position = "fixed";
        frameView.style.width = "100%";
        frameView.style.height = "100%";
        frameView.style.top = 0;
        frameView.style.left = 0;
        frameView.style.zIndex = 998;
        frameView.innerHTML = '<iframe style="border:none;height:100%;width:100%" src="' + url + '"></iframe>';
        document.body.appendChild(frameView);
        return {
            close: function () {
                document.body.removeChild(frameView)
            }
        }
    } else if (type === "form") {
        var form = document.createElement("form");
        form.setAttribute("style", "display:none");
        form.setAttribute("method", "get");
        form.setAttribute("action", url);
        form.setAttribute("target", "");
        var input = document.createElement("input");
        input.setAttribute("name", "test");
        input.setAttribute("value", "download");
        document.body.appendChild(form);
        form.appendChild(input);
        form.submit()
    } else {
        return window.open(url);
    }
}
function openDefaultBrowser(url) {

    var reg = new RegExp("^" + window.ecologyContentPath + "");
    url = reg.test(url)
        ? url
        : (window.ecologyContentPath || "") + url;

    window.em.openDefaultBrowser({
        url:url,
        sysId: window.localStorage.emobile_ec_id,
        success: function (res) {
            var fun = function () {
                window.wfOpenTimer = setTimeout(function () {
                    window.WeaverMobile.Tools.callApi({
                        url: '/api/workflow/reqlist/judgeReloadList',
                        method: 'POST',
                        params:{},
                    }).then(function (res) {
                        if (res.needReload && res.needReload > 0) {
                            window.loadList();
                        }
                        fun();
                    })
                }, 2000)
            }
            if(!!!window.wfOpenTimer){
                fun();
            }
        }
    });
}
var openLink = function (url, type, isDownload) {
    if (!/^http/.test(url)) {
        var reg = new RegExp("^" + window.ecologyContentPath + "");
        url = reg.test(url)
            ? url
            : (window.ecologyContentPath || "") + url;
    }

    if (window.em && typeof window.em.checkJsApi === "function"
        && window.em.checkJsApi("openLink")
        && (!isDownload || (isDownload && window.navigator.userAgent.indexOf("E-Mobile") < 0))) {
        window.em.openLink({
            url: url,
            openType: 2
        })
    } else {
        return webOpen(url, isDownload ? "open" : (type || "open"))
    }
}
openLink.openWorkflowByParams = function () {
    return function (params, callbackFun, returnUrl) {
        var urlParams = typeof params === "object" ? transParams(params) : params;
        if (urlParams && (urlParams.substring(0, 1) === "?" || urlParams.substring(0, 1) === "&"))
            urlParams = urlParams.substring(1);
        var rootpath = window.ecologyContentPath || '';
        var url = rootpath + "/spa/workflow/static4mobileform/index.html?_random=" + new Date().getTime() + "#/req?" + urlParams;
        if(urlParams.includes("openByDefaultBrowser=1") && window.em && typeof window.em.checkJsApi === "function" && window.em.checkJsApi("openDefaultBrowser") ){
            url = rootpath + '/spa/workflow/static4form/index.html?_rdm='+ new Date().getTime() +'#/main/workflow/req?'+ urlParams
            openDefaultBrowser(url);
        }else{
            openLink.openWorkflow(url, callbackFun, returnUrl);
        }
    }
}();
openLink.openWorkflow = function () {
    return function (url: any, callbackFun: any, returnUrl: any,otherParams = {}) {
        const { autoReloadWfListTime } = otherParams;

        var reg = new RegExp("^" + window.ecologyContentPath + "");
        url = reg.test(url)
            ? url
            : (window.ecologyContentPath || "") + url;

        if (window.em && typeof window.em.checkJsApi === "function" && window.em.checkJsApi("openLink") && window.em.checkJsApi("closeWindow") && window.navigator.userAgent.indexOf("E-Mobile") > -1) {
            var title = "表单详情";
            if (window.e9_locale && window.e9_locale.label) {
                title = window.e9_locale.label[500244] || "表单详情";
            }

            if(parseInt(autoReloadWfListTime,0) > 0){//移动端打开异构系统流程，是否启动监听时间，当异构系统流程提交后自动刷新列表
                window.em.appEventListener({'name':'KPageVisibleNotificationName','action':function(argument){
                        //name 关心的事件，1. KBadgeChangedNotificationName 未读数角标变化
                        //action 事件回调
                        if (typeof(argument) == 'string') {
                            try {
                                argument = JSON.parse(argument)
                            } catch (error) {}
                        }
                        if (argument.visible) {
                            setTimeout(() => {
                                window.loadList();
                            }, autoReloadWfListTime);
                            window.em.appEventListener({'name':'KPageVisibleNotificationName','action':function(argument){
                                    //注册空方法remove原方法
                                },'success':function (res) {}
                            })
                        }
                    },'success':function (res) {
                        //注册监听成功
                    }
                })
            }

            window.em.openLink({
                openType: 2,
                title: title,
                url: url
            });
            if (typeof callbackFun === "function") {
                window.em.ready(function () {
                    window.em.registerBroadcast({
                        name: "_closeWfFormCallBack",
                        action: function (argument) {
                            if (typeof argument === "string") {
                                argument = JSON.parse(argument);
                            }
                            callbackFun(argument.text);
                        }
                    });
                });
            }
        } else {
            //window.open(url);   //微信、钉钉客户端open就等于location.href
            //处理二级路径
            var reg = new RegExp("^" + (window.ecologyContentPath || "") + "");
            url = reg.test(url) ? url : (window.ecologyContentPath || "") + url;

            if(parseInt(autoReloadWfListTime,0) > 0){//移动端打开异构系统流程，是否启动监听时间，当异构系统流程提交后自动刷新列表
                var doc = document;
                var loop = setInterval(function () {
                    alert(doc.hidden);
                    if (!doc.hidden) {
                        clearInterval(loop);
                        window.loadList();
                    }
                }, autoReloadWfListTime);
            }

            window.location.href = url;
            if (returnUrl === "") {
                returnUrl = window.location.href;
                if (returnUrl.indexOf("/spa") > -1) {
                    returnUrl = returnUrl.substr(returnUrl.indexOf("/spa"));
                }
            }
            sessionStorage.setItem("__wf__openform__returnurl__", returnUrl);
            if (typeof callbackFun === "function") {
                window.__closeFormCallBack = callbackFun;
            }
        }
    }
}();
openLink.openDocument = function () {
    return function (docId, params, type) {
        var search = "";
        if (Object.prototype.toString.call(params) === "[object Object]") {
            search = transParams(params)
        }
        var url = "/spa/document/static4mobile/index.html#/doc/" + docId + search;
        openLink(url, type)
    }
}();
openLink.openAttach = function () {
    return function (attachId, params, type) {
        var search = "";
        if (Object.prototype.toString.call(params) === "[object Object]") {
            search = transParams(params)
        }
        var url = "/spa/document/static4mobile/index.html#/attach/" + attachId + search;
        openLink(url, type)
    }
}();
openLink.getWeaverFile = function () {
    return function (url, downloadType, docType) {

        var reg = new RegExp("^" + window.ecologyContentPath + "");
        url = reg.test(url)
            ? url
            : (window.ecologyContentPath || "") + url;

        if (window.e9DownloadConfig && window.e9DownloadConfig.inUse && typeof window.e9DownloadConfig.downloadHandler === "function") {
            window.e9DownloadConfig.downloadHandler(url)
        } else {
            var fileId = "";
            fileId = url.slice(url.indexOf("fileid="));
            fileId = fileId.slice(0, fileId.indexOf("&"));
            if (window.sso_callApi) {
                window.sso_callApi({
                    url: "/api/doc/mobile/imagefile/getMobileDownloadParams?" + fileId,
                    method: "GET",
                    params: {
                        type: docType
                    },
                    type: "json"
                }).then(function (res) {
                    if (res.params) {
                        url += res.params
                    }
                    openLink(url, undefined, true)
                }).catch(function () {
                    openLink(url, undefined, true)
                })
            }
        }
    }
}();
openLink.openMeeting = function () {
    return function (meetingId, params, type) {
        var search = "";
        if (Object.prototype.toString.call(params) === "[object Object]") {
            params.meetingid = meetingid;
            search = transParams(params)
        } else {
            search = "?meetingid=" + meetingId
        }
        var url = "/spa/meeting/static4mobile/index.html#/calendar/detail" + search;
        openLink(url, type)
    }
}();
openLink.openWorkplan = function () {
    return function (workplanId, params, type) {
        var search = "";
        if (Object.prototype.toString.call(params) === "[object Object]") {
            params.workplanId = workplanId;
            search = transParams(params)
        } else {
            search = "?workplanId=" + workplanId
        }
        var url = "/spa/workplan/static4mobile/index.html#/detail" + search;
        openLink(url, type)
    }
}();
openLink.openHrm = function () {
    return function (hrmId, params, type) {
        var search = "";
        if (Object.prototype.toString.call(params) === "[object Object]") {
            search = transParams(params)
        }
        var url = "/spa/hrm/static4mobile/index.html#/resourceInfo/" + hrmId + search;
        openLink(url, type)
    }
}();
openLink.openCrm = function () {
    return function (crmId, params, type) {
        var search = "";
        if (Object.prototype.toString.call(params) === "[object Object]") {
            search = transParams(params)
        }
        var url = "/spa/crm/static4mobile/index.html#/customerCard/" + crmId + search;
        openLink(url, type)
    }
}();
openLink.openSendMsg = function () {
    return function (requestid, type) {
        var url = "/spa/sms/static4mobile/index.html#/sendSms?src=supervise&requestid=" + requestid;
        openLink(url, type)
    }
}();
openLink.openSendEmail = function () {
    return function (requestid, type) {
        var url = "/spa/email/static4mobile/index.html#/new?requestid=" + requestid;
        openLink(encodeURI(url), type)
    }
}();
openLink.openInteApp = function () {
    // item = { inteSwitch:'',openType:'',inteSysid:'',itemUrl:'' }
    return function (item) {
        // item.itemUrl = item.itemUrl.replace('&hasEmCode=1', '').replace('?hasEmCode=1', '');
        if (window.sso_callApi) {
            window.sso_callApi({
                method: 'POST',
                url: '/api/integration/OutterPCAndApp/getOutterPCAndAppUrl',
                params: {
                    sysid: item.inteSysid,
                },
            }).then(function(result) {
                if (result.appUrl && result.appUrl.indexOf('/integration/accountSetting') !== -1) {
                    // 跳到账号登陆页面
                    // this.username = result.userName;
                    // this.password = result.passWord;
                    // history.push('/single-sign');
                    // 跳转到集成用户录入页面，需要传递inteSwitch 和 homeUrl参数给集成页面
                    // 如果inteSwitch==1,集成直接跳转集成地址；否则，需要跳转homeUrl并拼接用户录入参数

                    var newUrl = (window.ecologyContentPath || '') + '/spa/integration/static4mobile/index.html#/accountSetting?inteSwitch=' + item.inteSwitch + '&openType=' + item.openType + '&inteSysid=' + item.inteSysid + '&homeUrl=' + encodeURIComponent(item.itemUrl);
                    if (window.em && window.localStorage.emobile_ec_id) {
                        window.em.checkJsApi("openLink") && window.em.openLink({
                            url: newUrl,
                            openType: 2,
                            sysId: window.localStorage.emobile_ec_id,
                            error: function (error) {
                                alert(JSON.stringify(error));
                            }
                        })
                        !window.em.checkJsApi("openLink") && openLink(newUrl);
                    } else {
                        openLink(newUrl);
                    }
                } else {
                    // 不需要用户录入
                    if (item.inteSwitch === '1') {
                        // 集成地址,直接跳转
                        if (window.em) {
                            var params = {};
                            var appScheme = result.appUrl;
                            if (result.appUrl.indexOf('?') !== -1) {
                                var urlParams = getFrameParams(result.appUrl);
                                var keys = Object.keys(urlParams);
                                var values = Object.values(urlParams);
                                keys.map(function(item, index) {
                                    params[item] = values[index];
                                })
                                appScheme = appScheme.split('?')[0];
                            }
                            window.em.checkJsApi("openApp") && window.em.openApp({
                                iOSscheme: appScheme,
                                androidscheme: appScheme,
                                params: params,
                                error: function (error) {
                                    alert(JSON.stringify(error));
                                }
                            })
                            !window.em.checkJsApi("openApp") && openLink(result.appUrl);
                        } else {
                            openLink(result.appUrl);
                        }
                    } else {
                        // 拼接集成参数
                        var param = '';
                        if (result.appUrl && result.appUrl.indexOf('?') !== -1) {
                            param = result.appUrl.slice(result.appUrl.indexOf('?') + 1);
                        }
                        var url = item.itemUrl;
                        var split = '';
                        if (/.*\?.*/.test(item.itemUrl)) {
                            split = '&'
                            if (/.*\?.*#\/(?!.*\?).*/.test(item.itemUrl)) {
                                split = '?'
                            }
                        } else {
                            split = '?'
                        }
                        if (param) {
                            url += split + param;
                        }
                        // result && Object.keys(result).map(key => {
                        //   url = url + '&' + key + '=' + result[key];
                        // })

                        if (window.em) {
                            window.em.checkJsApi("openLink") && window.em.openLink({
                                url: url,
                                openType: item.openType || 2,
                                error: function (error) {
                                    alert(JSON.stringify(error));
                                }
                            })
                            !window.em.checkJsApi("openLink") && openLink(url);
                        } else {
                            openLink(url);
                        }
                    }
                }
            })
        }
    }
}();
var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};
openLink.browserOpenLink = {
    defaultOptions: {
        // type : function
        1: 'openHrm',
        17: 'openHrm',
        7: 'openCrm',
        18: 'openCrm',
        16: 'openWorkflow',
        152: 'openWorkflow',
        9: 'openDocument',
        37: 'openDocument',
        28: 'openMeeting',
        workplan: 'openWorkplan',
    },
    customOpenLink: {
        // type : function
    },
    set: function (options) {
        options = options || {};
        this.customOpenLink = _extends(this.customOpenLink, options);
    },
    get: function () {
        return _extends({}, this.defaultOptions, this.customOpenLink);
    }
};
if (typeof window !== 'undefined') {
    window.openLink = openLink;

    var openOld = window.open
    var openNew = function(a, b, c, d) {
        if (!/^http/.test(a)) {
            var reg = new RegExp("^" + window.ecologyContentPath + "");
            a = reg.test(a) ? a : (window.ecologyContentPath || "") + a;
        }
        return openOld(a, b, c, d)
    }
    window.open = openNew
}