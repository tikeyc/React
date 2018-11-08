define (require, exports) ->

    ###*
     * @fileoverview 公共函数
     * @author 张毅（Daniel）<zhangyi@way-s.cn>
    ###

    exports.format_date = (date, format) ->

        if arguments.length is 1
            if "string" is typeof date
                date = new Date(Date.parse(date.replace(/-/g, "/")));
            date = new Date(date)
            "#{date.getFullYear()}-#{this.format_month_day date.getMonth()+1}-#{this.format_month_day date.getDate()}"
        else
            _date = date
            if Object.prototype.toString.call(date).slice(8, -1) isnt 'Date'
                if "string" is typeof date then date = new Date(Date.parse(date.replace(/-/g, "/")))
                else date = new Date(date)

            return _date if isNaN(date)

            name_list=
                'yyyy|YYYY': date.getFullYear()
                'yy|yy': date.getYear()
                'MM': "#{this.format_month_day date.getMonth()+1}"
                'DD|dd': "#{this.format_month_day date.getDate()}"
                'HH|hh': "#{this.format_month_day date.getHours()}"
                'mm': "#{this.format_month_day date.getMinutes()}"
                'SS|ss': "#{this.format_month_day date.getSeconds()}"
                'w|W|ww|WW': date.getDay

            format= format.replace(new RegExp(key,'g'), name_list[key]) for key of name_list

            return format

    exports.format_month_day = (num) ->
        num = parseInt(num, 10)
        if num < 10 then "0#{num}" else num

    exports.compare_date = (begin, end)->
        begin = new Date(Date.parse(begin.replace(/-/g, "/")));
        end = new Date(Date.parse(end.replace(/-/g, "/")));
        if begin > end
            return 1
        else if begin < end
            return -1
        else
            0

    exports.date_calculate = (date = new Date, daynum = 0) ->
        date = new Date(Date.parse(date.replace(/-/g,"/")))
        des_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + daynum)
        des_date.getFullYear() + "-" + (des_date.getMonth() + 1) + "-" + des_date.getDate()

    exports.gt_1_year = (begin, end)->
        begin = begin.split("-")
        end = end.split("-")
        if begin[0] isnt end[0]
            return true
        return false

    exports.gt_1_month = (begin, end)->
        begin = begin.split("-")
        end = end.split("-")
        if begin[1] isnt end[1] or begin[0] isnt end[0]
            return true
        return false

    exports.check_date_format = (date)->
        #reg = /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/
        reg = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/
        unless reg.test(date)
            return false
        return true

    exports.check_yy_mm_format = (date)->
        reg = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])))$/
        unless reg.test(date)
            return false
        return true

    exports.formatToThousands = (number)->
        number = "#{number}"
        return number if number.indexOf(',') > -1
        return "-" if number is "" or number is "-"
        number.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,"$1,")

    exports.formatToPercent = (number, num=2)->
        #"#{((number - 0) * 100).toFixed(num)}%"
        number = "#{number}"
        return "-" if number is "" or number is "-"
        return number if "#{number}".indexOf("%") > -1
        unless number is "-"
            return "#{number}%"
        else
            return "-"

    exports.qs2obj = (str)->
        obj = {}
        eval("obj = " + ("{\"#{str}\"}").replace(/\=/g, '":"').replace(/&/g, '","')) if str
        return obj

    # 创建一个地址
    exports.buildUrl = (url, queryStr) ->
        if url.indexOf('?') > -1
            return [url, queryStr].join('&')
        else
            return [url, queryStr].join('?')

    exports.splitArray = (arr, begin, number) ->
        return arr.slice(begin, begin + number)

    # 检测key是否常用的允许的键，key必须为event.keyCode
    exports.usualKey= (key) ->
        throw new Error('util.coffee, exports.usualKey, 传入的key必须为数字') if typeof key isnt 'number'
        allowKeys= [8, 9, 13, 33, 34, 35, 36, 37, 38, 39, 40, 116] # 退格，F5, TAB, 上, 下, 左, 右, 回车, PageUp, PageDown, Home, End
        return key in allowKeys

    # 替换模板中的变量
    exports.replace_vars = ( tmpl, data_obj ) ->
        template = tmpl
        template= template.replace( new RegExp('\\$\\{'+attr+'\\}', 'ig'), data_obj[attr] ) for attr of data_obj
        template= template.replace( new RegExp('\\{\\{='+attr+'\\}\\}', 'ig'), data_obj[attr] ) for attr of data_obj
        template

    # 检测文件名称是否指定的文件格式
    exports.check_file_ext= (path, ext) ->
        throw new Error('in util.coffee, check_file_ext, path is empty') if $.trim( path ) is ''
        throw new Error('in util.coffee, check_file_ext, ext is empty') if $.trim( ext ) is ''


        # 有些地址中包含querystring
        path= path.split('?')[0] if path.indexOf('?') isnt -1
        return new RegExp('\.' + ext + '$').test(path)


    exports.arrayAttrsGet = (items, attr) ->

        return '-' unless $.isArray(items)
        throw new Error('in util.coffee, arrayAttrsGet, attr is null') if not (attr?) or attr is ''

        data = $(items).map ->
            return this[attr]
        .toArray()

        return data.join(',')

    exports.parseDate = (strDate) ->
        throw new Error('in util.coffee, parseDate, strDate is null') unless strDate?

        if typeof strDate is 'string'
            strDate = strDate.replace(/\-/g, '/')
            strDate += "/01" if strDate.split('/').length is 2
            strDate += "/1/01" if strDate.split('/').length is 1       # 年增益处理  -2018-6-5--122

        date = new Date(strDate)
        if isNaN(date)
            date = new Date( Date.parse(strDate) )

        return date

    exports.clip = (text, count) ->
        throw new Error('util.coffee, exports.clip, text未定义') unless text?

        unless $.isNumeric(count)
            count = 10

        length = text.length
        text = text.join(',') if $.isArray(text)

        text = [text.substring(0, count), '...'].join('') if length >  count
        return text

    exports.hasFlashPlugin = ->
        hasFlash = false       #是否安装了flash
        flashVersion = 0       #flash版本
        try
            if window.ActiveXObject and new ActiveXObject('ShockwaveFlash.ShockwaveFlash')?
                hasFlash = true
            else if navigator.plugins and navigator.plugins.length > 0 and navigator.plugins["Shockwave Flash"]?
                hasFlash = true
        catch ex
            hasFlash = true
        return hasFlash

    # 获取不等于null或者undefined的值
    exports.getValueIfNotNull = () ->
        args = [].slice.call(arguments, 0)

        for arg in args
            if arg? then return arg

    # 获取请求参数的值
    exports.getQueryString = (name) ->
        reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i")
        if reg.test(location.href)
            return unescape(RegExp.$2.replace(/\+/g, " "))
        else
            return ""

    exports.delay = ( fn, timer, callback) ->
        callback = timer if $.isFunction(timer)
        timer = if not $.isNumeric(timer) then 0 else timer

        setTimeout ->
            do fn if $.isFunction(fn)
            do callback if $.isFunction(callback)
        , timer

    ###
    * 将文本的首字母转换为大写
    * @param words {String} 文本
    * @return {string} 转换后的文本
    ###
    exports.firstLetterToUpper = (words) ->
        throw Error('util::firstLetterToUpper, words not string') if typeof words isnt 'string'
        return words.replace /^[a-z]{1}/, (letter) -> return letter.toUpperCase()

    return