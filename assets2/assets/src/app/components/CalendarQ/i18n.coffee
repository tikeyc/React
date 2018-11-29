define (require, exports) ->

    ###*
     * @fileoverview 国际化语言控制库
     * @author 张毅（Daniel）<zhangyi@way-s.cn>
    ###

    $ = require("jquery")

    util = require("./util.coffee")

    # language = require('../config/i18n/{locale}')
    language = require('./zh_CN.coffee')

    locale = ''

    $locale = $("#locale")

    exports.init = ->
        $locale = $locale or $("#locale")

        exports.locale()

        initLocalSwitch()

        # loadLocaleCss()

    initLocalSwitch = ->
        $locale.waysDropdownToggle().change (event, value)->
            href = location.href
            if href.indexOf("?") > -1
                if href.match(/(\?|&)locale=[_a-zA-Z]+(&?.*)/g)
                    href = href.replace(/(\?|&)locale=[_a-zA-Z]+(&?.*)/g, "$1locale=#{value}$2")
                else
                    href = "#{href}&locale=#{value}"
            else
                href = "#{href}?locale=#{value}"
            location.href = href

    # CSS样式国际化
    # loadLocaleCss = ->
    #     suffixDebug = if seajs.data.debug then '-debug' else ''
    #     localeCss = require.resolve("jquery#{suffixDebug}").replace(/(.+)(\/javascripts\/.+$)/g, "$1/stylesheets/i18n/#{locale}.css")
    #     require.async localeCss if locale

    exports.locale = ->
        unless locale

            # 从地址栏读取语言，模拟后端切换语言
            qsLocale = util.getQueryString('locale')
            if $locale?.length
                if qsLocale
                    $locale.find('input:hidden').val(qsLocale)
                else
                    qsLocale = $locale.store().value
            locale = qsLocale or 'zh_CN'
        locale

    exports.controllerName = (uri)->
        # uri = module.uri
        # if seajs.data.debug
        #     uri = uri.replace('-debug', '')
        if match = uri.replace(/^.+\/(controllers|libs)\//g, "$1/").replace(/\.js$/g, "").match(/[-a-z]+/g)
            return match
        else
            return ""

    exports.lang = (module)->
        tmplLang = language

        if moduleName = exports.controllerName(module)
            for item in moduleName
                tmplLang = tmplLang[item]

            return tmplLang
        else
            throw new Error('undefine language!')

    exports.month = (month)->
        language.months[month-1]

    return