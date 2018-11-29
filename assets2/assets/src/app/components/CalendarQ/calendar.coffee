define (require, exports, module)->

    _ = require('lodash')
    $ = require 'jquery'
    util = require './util.coffee'
    i18n = require './i18n.coffee'
    # lang = i18n.lang(module)
    lang = {
        singleMon: '月份选择'
        singleMonOfYear: '单月年分析'
    }

    class Popup
        constructor: (options)->

            @options = $.extend {}, Popup.defaults, options
            @options.zIndex = Popup.zIndex++ if typeof @options.zIndex isnt 'number'

            @_create()

        ###
        * 创建对话框对象
        ###
        _create: ->

            @elmPopup  = $("<div/>")

            @elmContent = $("<div class='ui-popup-content'/>").appendTo(@elmPopup)

            # 默认将对话框隐藏
            @elmPopup.hide()
            .addClass(@options.className)
            #.css
            #    position : 'absolute'
            #    zIndex   : @options.zIndex
            .appendTo(@options.element)

            # 非延迟则显示对话框
            #@show(@options.follow) if @options.delay isnt true
            return @

        ###
        * 跟随元素
        * @param element 所要跟随的对象
        ###
        follow : (element)->
            $follow = $(element)
            followOffset = $follow.offset()
            @elmPopup.css
                left: followOffset.left
                top : followOffset.top + $follow.outerHeight() + 2

            return @

        ###
        * 设置对话框内容
        * @param content 内容
        ###
        content: (content)->
            @elmContent.html(content) if content?
            return @
        ###
        * 显示对话框, 如果传入元素则跟随元素
        * @param element 所要跟随的对象
        ###
        show   : (element)->
            @elmPopup.show()
            @follow(element) if element?
            return @

        ###
        * 隐藏对话框
        ###
        hide   : ()->
            @elmPopup.hide()
            return @

        ###
        * 在对话框上注册事件，api请看是jQuery.fn.on
        ###
        on     : ->
            @elmPopup.on.apply @elmPopup, arguments
            return @

        ###
        * 注销事件，api请看是jQuery.fn.off
        ###
        off    : ->
            @elmPopup.off.apply @elmPopup, arguments
            return @




    class Base

        constructor: (options={})->

            @options = $.extend {}, Base.defaults, options

            $.extend @, @options

            @object = @

        ###
        * 显示对话框, 如果传入元素则跟随元素
        * @param element 所要跟随的对象
        ###
        show   : ->
            @ui.show()
            return @

        ###
        * 隐藏对话框
        ###
        hide   : ->
            @ui.hide()
            return @

        ###
        * 在对话框上注册事件，api请看是jQuery.fn.on
        ###
        on     : ->
            @ui.on.apply @ui, arguments
            return @

        ###
        * 注销事件，api请看是jQuery.fn.off
        ###
        off    : ->
            @ui.off.apply @ui, arguments
            return @

        add: (childView)->

            @ui.append(childView)

    Base::defaults = {}

    ###class CalendarContainer extends Base

        constructor: (options={})->

            super(options)

            #@options.zIndex = Popup.zIndex++ if typeof @options.zIndex isnt 'number'

            @_create()

        _create: ->

            #@elmPopup  = $("<div/>") # 弹出框，TODO...............................

            #@elmContent = $("<div class='ui-popup-content'/>").appendTo(@elmPopup)

            @ui = $("<div class='ui-calendar'/>")

            @container.append(@ui) if @container.length

            # 默认将对话框隐藏
            #@ui@uiCalendar.hide()
            #.addClass(@options.className)
            #.appendTo(@options.element)###

    class CalendarBase extends Base

        constructor: (options)->

            super(options)

            #@_create()

        ###
        * 创建对话框对象
        ###
        ###_create: ->

            @ui = $("<div class='ui-calendar'/>")

            @container.append(@ui) if @container?.length and not @container.find('.ui-calendar').length

            return @###



    # 默认的对话框索引
    Popup.zIndex   = 1024

    Popup.defaults =
        className: 'ways-calendar ui-popup'

    class Calendar extends CalendarBase
        constructor: (options) ->

            options = $.extend {}, Calendar.defaults, options

            super(options)

            do @init

        ###
        * 初始化日历，填充日历内容
        ###
        init       : ->

            # 用来标识是否需要刷新界面
            @stateChanged = true
            @element = $(@options.element)
            @input = @options.input
            @type = @options.type
            @isMultiple = @options.mode is 'multiple'
            @select = @formatParameter(@options.select)
            @disabled = @formatParameter(@options.disabled)
            @select = [@options.currentDate] if @options.currentDate

            @options.min = util.parseDate(@options.min)
            @options.max = util.parseDate(@options.max)
            minTime = @options.min.getTime()
            maxTime = @options.max.getTime()

            # 默认渲染当天日期
            @renderDate = new Date()

            # 无指定的渲染日期时
            unless @select.length
                # 如果当天日期大于最大可选日期时，渲染最大可选日期
                if maxTime < @renderDate.getTime()
                    @renderDate = @options.max
            else
                currentTime = util.parseDate(@select[0]).getTime()
                # 渲染指定的日期
                if minTime <= currentTime <= maxTime
                    @renderDate = @formatDate(@select[0])

            @ui   = $(@options.template)

            @elmSelectors       = @ui.find('.ui-selectors')
            @elmCalendarContent = @elmSelectors.find('.ui-calendar-content .slide-box')
            @elmCurrent         = @ui.find('.ui-current')
            @elmFooter          = @ui.find('tfoot')
            @elmButtonContainer = @elmFooter.find('.ui-button-container')
            @elmPrev            = @ui.find('.ui-prev>a').html(@options.language.prev)
            @elmNext            = @ui.find('.ui-next>a').html(@options.language.next)
            @elmReset           = @elmFooter.find('.ui-reset').html(@options.language.reset)
            @elmCancel          = @elmFooter.find('.ui-cancel').html(@options.language.cancel)
            @elmConfirm         = @elmFooter.find('.ui-confirm').html(@options.language.confirm)

            if @options.count > 1
                $newElmCurrent = @elmCurrent.clone()
                @elmCurrent.after $newElmCurrent
                @elmCurrent = @ui.find('.ui-current')

            @container.append(@ui)

            # 如果是多选则根据配置显示隐藏按钮
            if @isMultiple is true
                do @elmButtonContainer.show
                do @elmConfirm.show
                do @elmCancel.show if @options.showCancel
                do @elmReset.show if @options.showReset

            # 根据配置显示隐藏前进后退按钮
            do @elmPrev.hide if @options.hidePrev
            do @elmNext.hide if @options.hideNext

            # 将文本框设为只读
            @input.attr 'readonly', true

            do @initEvent unless @inited

        ###
        * 初始化日历事件
        ###
        initEvent: ->

            @inited = true
            instance = @

            @element.on('dateChange', @options.onDateChange)

            @on 'mousedown', (event) ->
                do event.stopPropagation

            @on 'mousedown.prev', '.ui-prev', =>
                @render(do @getPrev, 'prev')

            @on 'mousedown.next', '.ui-next', =>
                @render(do @getNext, 'next')

            @on 'mousedown.reset', '.ui-reset', =>
                @elmItems.removeClass(@options.selectedClass)
                do @handleConfirm

            @on 'mousedown.cancel', '.ui-cancel', =>
                do @hide

            @on 'mousedown.confirm', '.ui-confirm', =>
                do @handleConfirm

            @on 'mousedown.selectItem', '.ui-selectors a', (event)->
                instance.handleSelectEvent $(this)
                event.preventDefault()

            # 在文本框获取焦点后取消焦点来去除光标
            @input.on 'focus', =>
                do @input.blur

            # 注册日历显示隐藏事件
            ###$(document).on 'mousedown.toggleCalendar, focus.toggleCalendar', (event) =>

                return unless @object instanceof Calendar.decorators[@type]

                $target = $(event.target)

                if $target.is(@input)
                    # 如果状态已经更改，则重新渲染界面，通常用于用户选中后没有点确定再打开时可以显示上次选中的内容
                    @render(@renderDate) if @stateChanged
                    @show(@element)
                    do event.stopPropagation
                else
                    do @hide if @ui.is(':visible')###

        ###
        * 根据数据创建视图html
        * @param data array 数据
        ###
        view : (data) ->
            @error('data必须是一个数组') unless $.isArray(data)

            html  = ['<table cellpadding="0" cellspacing="0">']

            for line in data
                html.push '<tr>'
                for item in line
                    className = ''
                    if not item.disabled and item.selected
                        className += ' selected'
                    else if item.disabled
                        className += ' disabled'
                    html.push "<td><a data-value='#{item.value}' class='#{className}' title='#{item.value}'>#{item.text}</a></td>"
                html.push '</tr>'

            html.push('</table>')

            return html.join('\n')

        ###
        * 渲染界面
        * @param date 时间
        ###
        render: (date, direction)->
            @stateChanged = false
            date = @formatDate(date)
            #@elmCalendarContent.empty()

            # 根据传入的面板数量来生成面板并装入控件中
            formatedData = $([0...@options.count]).map (i) =>
                data = @formatData(@getPanelDate(date, i))

                # 设置标题
                headerHtml = @headerHtml(data, i)
                @elmCurrent.eq(i).html(headerHtml)
                # 插入日历面板
                @insertPanel(data, i, direction)
                return data

            # 缓存选择项
            @elmItems = @elmSelectors.find('a')

        ###
        * 渲染头部标题
        * @param date 时间
        ###
        headerHtml: (data, index)->
            begin  = data[0]
            end = data[data.length - 1]
            @formatTitle([begin[0].value, end[end.length - 1].value], index)

        ###
        * 将数据转换为视图并加入日历面板中
        * @param data array 数据
        ###
        insertPanel: (data, index, direction) ->
            @error('data必须是一个数组') unless $.isArray(data)

            #$calendarContent = @elmCalendarContent.find(".ui-container:eq(#{index})")
            # if $calendarContent.length and data[0][0].value isnt $calendarContent.data('data')[0][0].value
            #     $newCalendarContent = $("<td class='ui-container' colspan='3'>#{@view(data)}</td>")
            #     $calendarContent.replaceWith $newCalendarContent
            #     $newCalendarContent.data('data', data)
            # else if not $calendarContent.length
            #     $newCalendarContent = $("<td class='ui-container' colspan='3'>#{@view(data)}</td>")
            #     @elmCalendarContent.append $newCalendarContent
            #     $newCalendarContent.data('data', data)

            $oldTable = @elmCalendarContent.find('table')
            $newTable = $(@view(data))
            if direction
                @elmCalendarContent.css({
                    position: 'relative',
                    overflow: 'hidden',
                    width: @elmCalendarContent.width(),
                    height: @elmCalendarContent.height();
                })
                $oldTable.css({position: 'absolute', left: '0'})
                $newTable.css({position: 'absolute', left: '0'})
            @elmCalendarContent.append $newTable
            $newTable.data('data', data)
            switch direction
                when 'next'
                    $newTable.css('left', $oldTable.width())
                    $oldTable.animate({'left': -$oldTable.width()}, 300, -> $(this).remove())
                    $newTable.animate({'left': 0}, 300)
                when 'prev'
                    $newTable.css('left', -$oldTable.width())
                    $oldTable.animate({'left': $oldTable.width()}, 300, -> $(this).remove())
                    $newTable.animate({'left': 0}, 300)
                else
                    $oldTable.remove()
                    #@elmCalendarContent.css({'width': $newTable.width(), 'height': $newTable.height()})

            return @

        ###
        * 格式化值
        ###
        formatValue: (value) ->
            return @formatDate(value)

        ###
        * 将文本转换为时间
        * @param dateText string 时间文本
        ###
        formatDate: (dateText)->

            # 如果已经是时间，直接返回
            return dateText if $.type(dateText) is 'date'

            # 如果是数组则递归方法并返回数据
            return $(dateText).map((index, value) => return @formatDate(value)).toArray() if $.isArray(dateText)

            pattern = Calendar.Pattern

            # 如果传入的文本为年，如2014则加上1月1日
            switch
                when pattern.year.test(dateText) then new Date(parseInt(dateText, 10), 1, 1)
                # 如果传入的文本为月，如2014-1则加上1日
                when pattern.yearMonth.test(dateText) then util.parseDate("#{dateText}-1")
                # 如果传入的文本为正常的格式使用util.parseDate转换
                when pattern.fullDate.test(dateText) then util.parseDate(dateText)
                # 否则返回当天
                else new Date()

        ###
        * 格式化参数, 如果参数是函数则执行函数，如果不是数据则转为数组
        * @param parms 参数
        * @return array
        ###
        formatParameter: (parms) ->
            switch
                when not parms? then []
                when $.isFunction(parms) then parms()
                when not $.isArray(parms) then [parms]
                else parms

        ###
        * 获取两个时间间隔，将转换为时间返回
        * @param date1 时间
        * @param date2 时间
        ###
        getMinusDays: (date1, date2) ->
            if date2 < date1
                date3 = date2
                date2 = date1
                date1 = date3

            return (date2 - date1) / 1000 / 60 / 60 / 24

        ###
        * 时间加上指定的时间
        * @param date 时间
        * @param addNum 增加的数量
        * @param type 增加类型, 默认为天
        ###
        add: (date, addNum, type = 'days')->
            createDate = new Date(date)
            switch type
                when 'day' then createDate.setDate(date.getDate() + addNum)
                when 'month' then createDate.setMonth(date.getMonth() + addNum)
                when 'year' then createDate.setFullYear(date.getFullYear() + addNum)
            return createDate

        stringify: (date, type='date')->
            date = new Date(date)
            if type is 'date'
                "#{date.getFullYear()}-#{date.getMonth() + 1}-#{date.getDate()}"
            if type is 'month'
                "#{date.getFullYear()}-#{date.getMonth() + 1}"
            else if type is 'year'
                date.getFullYear()

        ###
        * 判断当前传入的值是否禁止选择
        * @param value 值, 可为日期对象或文本
        ###
        isDisabled: (value) ->
            valueDisabled = false
            date = @formatDate value
            min   = @formatDate @options.min
            max   = @formatDate @options.max

            unless min.getTime() <= date.getTime() <= max.getTime()
                valueDisabled = true
            else if @disabled?.length
                value = if typeof value is 'object' then "#{value.getFullYear()}-#{value.getMonth()+1}"
                valueDisabled = (value in @disabled)
            # else
            #     console.log @dates
            #     for date in @dates
            #         if "#{date.year}-#{date}"
            #     valueDisabled = value not in @disabled

            return valueDisabled

        ###
        * 判断当前值是否选中
        * @param value 值 , 可为日期对象或文本
        ###
        isSelected: (value) ->
            return false unless $.isArray(@select)
            return (value in @select)

        ###
        * 设置禁止选中时间
        * @params values string|date|array|function 值，可为数组、函数、文本、日期
        ###
        setDisabled: (values) ->
            @disabled = @formatParameter(values) if $.isArray(values)
            @stateChanged = true # 更改状态以便于重新渲染界面
            return @

        ###
        * 设置选中时间
        * @params values string|date|array|function 值，可为数组、函数、文本、日期
        ###
        setSelect : (values) ->
            values = @formatParameter(values)

            if values.length > 0
                @select = values
                @stateChanged = true # 更改状态以便于重新渲染界面

            return @

        ###
        * 设置选中范围
        * @param min string|date 最小值
        * @param max string|date 最大值
        ###
        setSelectRange: (min, max) ->

            if min?
                @options.min = min
                @stateChanged = true

            if max?
                @options.max = max
                @stateChanged = true

            return @

        ###
        * 处理选中事件（私有方法）
        * @param $element 当前选中项
        ###
        handleSelectEvent: ($element) ->

            # 如果当前项已经禁用则不做任何操作
            return if $element.hasClass(@options.disabledClass)
            elementValue = $element.data('value')

            # 如果定义了选中事件则执行选中事件
            if $.isFunction(@options.onSelect)
                disabledSelect = @options.onSelect.call(@, elementValue, $element)

            # 如果允许选中
            unless disabledSelect

                selectedClass = @options.selectedClass

                # 单选
                unless @isMultiple
                    type = if @options.require then 'add' else 'toggle'
                    @elmItems.not($element).removeClass(selectedClass)
                    $element["#{type}Class"](selectedClass).hasClass(selectedClass)
                    do @handleConfirm
                else
                    # 多选
                    selected = @elmItems.filter(".#{selectedClass}")
                    selectedLength = selected.length
                    elmConfirmVisible = @elmConfirm.is(':visible')

                    # 如果当前未选中，则添加一个选中标记
                    if selectedLength is 0
                        $element.addClass(selectedClass)

                    else if selectedLength is 1
                        isSelected = $element.hasClass(selectedClass)

                        # 如果选中项只有一个且当前项为选中项，如果非必选则移除选中标记
                        if isSelected
                            $element.removeClass(selectedClass) unless @options.require
                        else
                            # 否则为两个项及其中间的项添加选中标记
                            selectedIndexs = [@elmItems.index(selected.eq(0)), @elmItems.index($element)].sort( (x, y)-> return x - y)
                            $([selectedIndexs[0]...(selectedIndexs[1] + 1) ]).each (index, value) =>
                                $currentSelect = @elmItems.eq(value)
                                $currentSelect.addClass(selectedClass) unless $currentSelect.hasClass(@options.disabledClass)
                            do @handleConfirm unless elmConfirmVisible
                    else
                        @elmItems.removeClass(selectedClass)
                        $element.addClass(selectedClass)

        ###
        * 处理确定事件（私有方法）
        ###
        handleConfirm: ->
            formatValue = if $.isFunction(@options.formatValue) then @options.formatValue else @formatValue
            @select = @elmItems.filter(".#{@options.selectedClass}").map (index, item) =>
                formatValue($(item).data('value'))
            .toArray()

            # 原值
            oldValue = @input.val()
            # 新值
            newValue = @formatText(@select)

            selectValue = if @isMultiple then @select else @select[0]

            if @options.onConfirm(selectValue) isnt false
                # 如果本次选中值跟上次不一样则触发change事件
                if newValue isnt oldValue and @ instanceof Calendar.decorators[@type]
                    # 文本域更新值
                    @input.val(newValue)
                    # 触发 `dateChange` 事件
                    @element.trigger('dateChange', selectValue)

                do @hide

                @element.trigger('submit', selectValue) if @ instanceof Calendar.decorators[@type]

            return

        error : (message, error=Error) ->
            throw error("calendar::#{message}")

    # 验证日期类型的正则
    Calendar.Pattern =
        year: /^\d{4}$/
        yearMonth: /^\d{4}[\-\/]\d{1,2}$/
        fullDate: /^\d{4}([\-\/]\d{1,2}){2}$/


    Calendar.defaults =
        mode : 'radio'                    # 选中模式，当前有 radio|multiple
        delay: true                       # 是否延迟加载
        showCancel: false                 # 是否显示取消
        showReset : false                 # 是否显示重置
        hidePrev  : false                 # 是否显示后退
        hideNext  : false                 # 是否显示前进
        require   : true                  # 是否必选
        selectedClass: 'selected'         # 选中样式
        disabledClass: 'disabled'         # 禁用样式
        onSelect  : (->)                  # 选中后执行的事件
        onConfirm : (->)                  # 确定事件
        #formatTitle: null                 # 格式化头部标题
        #formatValue: null                 # 格式化值
        template: '''
            <table cellpadding="0" cellspacing="0" style="display: none;">
                <tbody><tr><td>
                    <table cellpadding="0" cellspacing="0">
                        <thead>
                            <tr class="ui-calendar-header">
                                <td class="ui-nav ui-prev"><a></a></td>
                                <td class="ui-current"></td>
                                <td class="ui-nav ui-next"><a></a></td>
                            </tr>
                        </thead>
                        <tbody class="ui-selectors">
                            <tr class="ui-calendar-content">
                                <td class='ui-container' colspan='3'>
                                    <div class='slide-box'></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td></tr></tbody>
                <tfoot><tr><td>
                    <div class="ui-button-container" style="display: none;">
                        <button style="display: none;" class="ui-button ui-cancel"></button>
                        <button style="display: none;" class="ui-button ui-reset"></button>
                        <button style="display: none;" class="ui-button ui-confirm"></button>
                    </div>
                </td></tr></tfoot>
            </table>
        '''
        # 界面语言
        language:
            prev    : "\u00AB"
            next    : "\u00BB"
            cancel  : "取消"
            reset   : "重置"
            confirm : "确认"
            month   : '月'
            days    : ['日', '一', '二', '三', '四', '五', '六']

    Calendar.decorators = {}

    ###
        年控件
    ###
    class Calendar.decorators.Year extends Calendar
        constructor: (options) ->

            options = $.extend {
                itemPerLine: 4
                itemPerPage: 12
                count: 1
                min  : 1970
                max  : 2099
            }, options

            super(options)
            @ui.addClass('ui-year')

        formatTitle: (select) ->
            selectTitle = select

            if $.isArray(select)
                selectTitle = select[0]
                selectTitle += "-#{select[select.length - 1]}" if select.length > 1

            return selectTitle

        formatText: (select)->
            @formatTitle(select)

        formatValue: (value) ->
            return parseInt(value, 10)

        getPrev: ->
            @renderDate = @add(@renderDate, - @options.itemPerPage * @options.count, 'year')

        getNext: ->
            @renderDate = @add(@renderDate, @options.itemPerPage * @options.count, 'year')

        getPanelDate: (date, index) ->
            @add(date, @options.itemPerPage * index, 'year')

        formatData : (date) ->
            @error('date必须是一个时间类型') if $.type(date) isnt 'date'

            j = 0
            startYear = date.getFullYear()
            yearData  = []

            for i in [0...@options.itemPerPage]
                value = startYear + i
                j++ if (i % @options.itemPerLine) is 0 and i isnt 0
                yearData[j] = [] unless yearData[j]
                yearData[j].push
                    text: value
                    value: value
                    disabled: @isDisabled(value)
                    selected: @isSelected(value)

            return yearData

    ###
        月控件
    ###
    class Calendar.decorators.Month extends Calendar
        constructor: (options) ->
            options = $.extend {
                itemPerLine: 4
                itemPerPage: 12
                count: 1
                min  : new Date(1970, 1, 1)
                max  : new Date(2099, 1, 1)
            }, options

            super(options)
            do @createYearCalendar
            @ui.addClass('ui-month')

        show: ->
            @ui.show()
            @onShowMonths() if @onShowMonths
            return @

        # 创建一个年日历
        createYearCalendar: ->
            options = $.extend {}, @options
            options.mode = 'radio'
            options.require = true
            options.onConfirm = (value)=>
                @renderDate = new Date(value, 1, 1)
                @render(@renderDate)
                do @show

            @year = new Calendar.decorators.Year(options)

            @on 'click.showYear', '.ui-current', =>
                do @hide
                do @year.show
                @year.render(@renderDate)

        formatTitle : (select) ->
            return (select[0].split('-'))[0]

        formatText: (select)->
            selectTitle = select

            if $.isArray(select)
                selectTitle = select[0]
                selectTitle += "~#{select[select.length - 1]}" if select.length > 1

            selectTitle

        formatValue: (value) ->
            return value

        getPrev: ->
            @renderDate = @add(@renderDate, -@options.count, 'year')

        getNext: ->
            @renderDate = @add(@renderDate, @options.count, 'year')

        getPanelDate: (date, index) ->
            @add(date, index, 'year')

        formatData : (date) ->

            j = 0
            year = date.getFullYear()
            monthData  = []

            for i in [0...4]
                value = 1 + i
                dataValue = "#{year}-#{value}"
                j++ if (i % @options.itemPerLine) is 0 and i isnt 0
                monthData[j] = [] unless monthData[j]
                monthData[j].push
                    text: i18n.month(value)
                    value: "#{year}-Q#{value}"
                    disabled: @isDisabled(@formatDate dataValue)
                    selected: @isSelected(dataValue)

            return monthData

    # 日控件
    class Calendar.decorators.Day extends Calendar

        constructor: (options)->
            @childOptions = options
            options = $.extend {
                itemPerLine: 7
                count: 1
                min  : new Date(1970, 1, 1)
                max  : new Date(2099, 1, 1)
            }, options

            super(options)
            do @createMonthCalendar
            @ui.addClass('ui-day')

        # 创建一个月日历
        createMonthCalendar: ->
            options = $.extend {}, @childOptions
            options.mode = 'radio'
            options.require = true
            options.dayObject = @
            options.onConfirm = (value)=>
                @renderDate = new Date(value)
                @render(@renderDate)
                do @show

            @month = new Calendar.decorators.Month(options)

            @on 'click.showMonth', '.ui-current', =>
                do @hide
                do @month.show
                @month.render(@renderDate)

        formatTitle : (select, index)->
            selectTitle = select
            if $.isArray(select)
                selectTitle = @stringify(select[0], 'month')
                if (new Date(select[0])).getMonth() isnt @add(@renderDate, index, 'month').getMonth()
                    selectTitle = @stringify(@add(new Date(selectTitle), 1, 'month'), 'month')

            return selectTitle

        formatText: (select)->
            selectTitle = select

            if $.isArray(select)
                selectTitle = select[0]
                selectTitle += "~#{select[select.length - 1]}" if select.length > 1

            selectTitle

        formatValue: (value) ->
            return value

        getPrev: ->
            @renderDate = @add(@renderDate, -@options.count, 'month')

        getNext: ->
            @renderDate = @add(@renderDate, @options.count, 'month')

        getPanelDate: (date, index)->
            @add(date, index, 'month')

        # month 月份数，从1开始，12结束
        getLastDay: (year, month)->
            # 取当前的年份
            new_year = year

            # 取下一个月的第一天，方便计算（最后一天不固定）
            new_month = month++

            # 如果当前大于12月，则年份转到下一年
            if month > 12
                new_month -=12;        # 月份减
                new_year++;            # 年份增

            # 取当年当月中的第一天
            new_date = new Date(new_year,new_month,1)

            # 获取当月最后一天日期
            return (new Date(new_date.getTime()-1000*60*60*24)).getDate()

        formatData : (date) ->
            row = 0
            monthData  = []
            year = date.getFullYear()
            month = date.getMonth()
            prevMonthDate = @add(date, -1, 'month')
            prevMonth = "#{prevMonthDate.getFullYear()}-#{prevMonthDate.getMonth() + 1}"
            nextMonthDate = @add(date, 1, 'month')
            nextMonth = "#{nextMonthDate.getFullYear()}-#{nextMonthDate.getMonth() + 1}"
            # 首日星期
            beginDay = (new Date(year, month, 1)).getDay()
            # 本月末日日期
            endDate = @getLastDay(year, month + 1)
            # 上月末日日期
            prevEndDate = @getLastDay(year, month)
            # 末日星期
            endDay = (new Date(year, month, endDate)).getDay()

            if endDate is 28 and beginDay is 0
                monthData[row] = []
                for i in [1..7]
                    value = prevEndDate - 7 + i
                    dataValue = "#{prevMonth}-#{value}"
                    monthData[row].push
                        text: value
                        value: dataValue
                        disabled: @isDisabled(@formatDate dataValue)
                        selected: @isSelected(dataValue)
                        notCurrentMonthDate: true
                row++

            for i in [0...endDate + beginDay]
                row++ if (i % @options.itemPerLine) is 0 and i isnt 0
                monthData[row] = [] unless monthData[row]
                # 上月最后部分日期
                if i in [0...(beginDay)] and beginDay >= 0
                    value = prevEndDate - beginDay + 1 + i
                    dataValue = "#{prevMonth}-#{value}"
                    monthData[row].push
                        text: value
                        value: dataValue
                        disabled: @isDisabled(@formatDate dataValue)
                        selected: @isSelected(dataValue)
                        notCurrentMonthDate: true
                # 本月日期
                else
                    value = 1 + i - beginDay
                    dataValue = "#{year}-#{month + 1}-#{value}"
                    monthData[row].push
                        text: value
                        value: dataValue
                        disabled: @isDisabled(@formatDate dataValue)
                        selected: @isSelected(dataValue)
            # 下月开始日期
            if endDay < 6
                for i in [0...(6 - endDay)]
                    value = i + 1
                    dataValue = "#{nextMonth}-#{value}"
                    monthData[row].push
                        text: value
                        value: dataValue
                        disabled: @isDisabled(@formatDate dataValue)
                        selected: @isSelected(dataValue)
                        notCurrentMonthDate: true
            if row is 4
                row++
                monthData[row] = [] unless monthData[row]
                value = 0 if value > 6
                for i in [0...7]
                    value = value + 1
                    dataValue = "#{nextMonth}-#{value}"
                    monthData[row].push
                        text: value
                        value: dataValue
                        disabled: @isDisabled(@formatDate dataValue)
                        selected: @isSelected(dataValue)
                        notCurrentMonthDate: true

            return monthData

        view : (data) ->
            @error('data必须是一个数组') unless $.isArray(data)

            html  = ['<table cellpadding="0" cellspacing="0">']

            html.push '<thead><tr>'
            html.push "<th>#{day}</th>" for day in @options.language.days
            html.push '</tr></thead>'

            for line in data
                html.push '<tr>'
                for item in line
                    className = tdClassName = ''
                    if not item.disabled and item.selected
                        className += ' selected'
                    else if item.disabled
                        className += ' disabled'
                    if item.notCurrentMonthDate
                        tdClassName = 'not-current-month-date'
                    html.push "<td class='#{tdClassName}'><a data-value='#{item.value}' class='#{className}' title='#{item.value}'>#{item.text}</a></td>"
                html.push '</tr>'

            html.push('</table>')

            return html.join('\n')

    $.fn.extend

        calendar123: (options={}) ->

            $uiPopup  = $("<div class='ways-calendar ui-popup' style='display: none; position: absolute; z-index: 1024;'/>").appendTo(this)

            $uiPopupContent = $("<div class='ui-popup-content'/>").appendTo($uiPopup)

            $uiCalendar = $("<div class='ui-calendar'/>").appendTo($uiPopupContent)

            $input = this.find('input')
            options = $.extend {}, { element: this, type: 'Month', input: $input, container: $uiCalendar }, options
            delete options.template
            type = util.firstLetterToUpper(options.type)
            calendar = new Calendar.decorators[type](options)

            this.on 'submit', ->
                $uiPopup.hide()

            $uiPopup.on 'click', (event)->
                event.stopPropagation()

            # 注册日历显示隐藏事件
            $(document).on 'click.toggleCalendar, focus.toggleCalendar', (event)->

                #return unless @object instanceof Calendar.decorators[@type]

                $target = $(event.target)

                if $target.is($input)
                    # 如果状态已经更改，则重新渲染界面，通常用于用户选中后没有点确定再打开时可以显示上次选中的内容
                    calendar.render(calendar.renderDate) if calendar.stateChanged
                    calendar.show()
                    $uiPopup.show()
                    event.stopPropagation()
                else
                    $uiPopup.hide()

            return this

        monthCalendar123: (options={}) ->
            $calendar = $(this).empty().addClass('ways-popup-calendar').off('change')

            $calendar.append "<input type='text' class='text-field waysdatepicker' value='#{options.select or ''}' aaa='#{options.select}' />"
            options.select=options.select.replace('Q', '');

            $calendar.calendar123(options).off('dateChange').on 'dateChange', (event, value) -> $(this).trigger('change', [value])

            return this

    return