$ = require('jquery')
require('loading')
require('./tmpl.coffee')
util = require('./util.coffee')
tplWaysGrid = require('./ways-grid.tpl')
require('./style.less')

$.fn.waysGrid = (options={}) ->
  ###
  $.fn.waysGrid.defaults =
      page: 0
  opts = $.extend({}, $.fn.hilight.defaults, options)
  options.onsort 排序事件
  ###

  $(this).each ->
    $grid = $(this)
    inited = $(this).data("inited")
    options.before() if options.before

    # 事件绑定
    if $.isFunction(options.ajaxSuccess) then $grid.unbind('ajaxSuccess').bind('ajaxSuccess', options.ajaxSuccess)
    if $.isFunction(options.finish) then $grid.unbind('finish').bind('finish', options.finish)

    ((options)->
      ((head) ->
        if head.length
          colspan = head.length
          childrenColspan = 0
          for th, i in head
            if th.children
              childrenColspan += arguments.callee(th.children)
              colspan--
            else if typeof th is "string"
              head[i] = { "text": th }
        return head.colspan = colspan + childrenColspan
      )(options.head)
      bindWaysTableEvent($grid, options)
    )(options)

    $grid.html($.tmpl($("#template-ways-grid"), options))
    $thead = $grid.find("thead:first")
    $tbody = $grid.find("tbody")
    $gridWrapper = null

    # loop colModel
    ((options)->
      colModel = options.colModel

      if colModel.length
        # define fixedWidth
        fixedWidth = 0

        for col in colModel
          if col.width and typeof col.width is "number"
            fixedWidth += col.width
          else
            fixedWidth = 0
            break
        if fixedWidth
          $grid.width(fixedWidth)

        $gridWrapper = $grid.parent(".ways-data-grid-wrapper")
        unless $gridWrapper.length
          $grid.wrap($.tmpl($('#template-ways-grid-wrapper')))
          $gridWrapper = $grid.closest(".ways-data-grid-wrapper")

        $gridWrapper.showLoading()

        $dataGridPrev = $gridWrapper.find(".data-grid-prev")
        unless $dataGridPrev.length
          $dataGridPrev = $('<button class="data-grid-prev" title="返回" style="display:none"></button>')
          $gridWrapper.append($dataGridPrev)

        $grid.show().siblings("table").hide()
        $dataGridPrev.hide() if $grid.index() is 0

        $dataGridPrev.off("click").on "click", ->
          $(this).data("currentGrid").hide()
          $newCurrentGrid = $(this).data("targetGrid").show()
          $newTargetGrid = $newCurrentGrid.data("parentGrid")

          # 如果切换后的当前表格有父层，返回按钮继续显示，否则隐藏
          $dataGridPrev.toggle !!$newTargetGrid

          $(this).data({targetGrid: $newTargetGrid, currentGrid: $newCurrentGrid})


        isDrill = false

        # define action
        for col in colModel
          action = col.action
          ((action)->
              actionType = typeof action

              if actionType is 'function'
                  ((action)->
                      $tbody.off("click.gridAction-#{col.key}").on "click.gridAction-#{col.key}", "td.grid-#{col.key} a", ->
                          action.call(this, $(this).closest('tr').data('json'))
                  )(action)
              else if actionType is 'object'
                  type = action.type
                  url = action.url
                  success = action.success or ->
                  childGrid = action.childGrid or ->
                  params = action.params or {}
                  isDrill = Boolean type

                  hideOtherLine = ($line)->
                    drillLevel = $line.data('drillLevel') or 0
                    isRoot     = drillLevel is 0
                    trs = []

                    $grid.find('.extended').not($line).removeClass('extended').removeData('extended')

                    $grid.find('tr').filter ->
                      currentDrillLevel = $(this).data('drillLevel') or 0
                      return currentDrillLevel isnt 0
                    .hide()

                    while ($line = $line.data('parent'))?
                      trs.push($line)

                    $(trs).each ->
                      if $(this).data('childrenNodes')
                        $(this).addClass('extended').data('extended', true).data('childrenNodes').show()

                  $tbody.off("click.drill-#{col.key}").on "click.drill-#{col.key}", "td.grid-#{col.key} a[data-action-type]", ->
                    $btn = $(this)
                    $tr = $btn.closest('tr')
                    level = $tr.data('drillLevel') or 0
                    data = action.data or {}
                    data = data() if typeof data is "function"

                    rowData = $tr.data('json')
                    for param, key of params
                      data[param] = rowData[key]

                    # 详细内容模式
                    if type is 'details'
                      $trDetails = $tr.next('tr[data-action-type="details"]')
                      if $trDetails and $trDetails.length
                        $trDetails.toggle()
                      else
                        $trDetails = $($.tmpl($('#template-ways-grid-details-wrapper')))
                        $tr.after $trDetails
                        if url

                          $grid.showLoading()
                          $.getJSON url, $.extend({}, data, level: level), (data)->

                            $grid.hideLoading()
                            if data = success(data, rowData)
                              $trDetails.find('td').html(data)
                            else
                              $trDetails.addClass('no-data').find('td').html($.tmpl($('#template-ways-grid-details-no-data-tips')))
                    # 详细内容模式
                    else if type is 'levelDrill'
                      if url
                        $grid.showLoading()
                        $.getJSON url, $.extend({}, data, level: level), (data)->
                          $grid.hideLoading()

                          data = data or []
                          $subGrid = $grid.data("childGrid") or $("<table></table>")
                          $dataGridPrev.data({ targetGrid: $grid, currentGrid: $subGrid, relate: $tr })
                          $grid.hide().data("childGrid", $subGrid)
                          $subGrid.show().data("parentGrid", $grid)
                          $gridWrapper.append($subGrid)
                          $subGrid.waysGrid childGrid(data, rowData)
                          $dataGridPrev.show()
                    # 钻取/对比模式
                    else if type is 'drill' or type is 'compare'
                      lv = $tr.attr('data-drill-level')
                      unless lv
                        $tr.attr('data-drill-level', 0)
                        lv = 0
                      dataDrillLevel = 1 * lv
                      $trsDrill = $tr.data('childrenNodes')

                      # 设置展开/关闭状态类
                      extended = not $tr.data("extended")
                      $tr.data("extended", extended).toggleClass("extended", extended)

                      # 数据已加载直接展开/关闭
                      if $trsDrill and $trsDrill.length
                        # 隐藏已展开的子项
                        # hideOtherLine($tr)

                        # 展开
                        if $tr.data("extended")
                          (($trs)->
                            if $trs and $trs.length
                              args = arguments
                              $trs.each ->
                                $(this).show()
                                if $(this).data("extended")
                                  args.callee($(this).data('childrenNodes'))
                          )($trsDrill)
                        # 收起
                        else
                          (($trs)->
                            if $trs and $trs.length
                              args = arguments
                              $trs.each ->
                                args.callee($(this).hide().data('childrenNodes'))
                          )($trsDrill)

                        resetLineCss($tbody)
                      # 数据未加载先加载再展开
                      else
                        if url
                          url = [url] if typeof url is 'string'
                          if url.length and dataDrillLevel < url.length
                            $btn.addClass("drill-loading")
                            $.getJSON url[dataDrillLevel], $.extend({}, data, level: level + 1), (data)->
                              # 隐藏已展开的子项
                              hideOtherLine($tr)

                              data = if options.format then options.format.call($grid, data) else data
                              if data and data.length
                                $items = createTbodyItems(data, options, $tbody, $tr, 'after', 1 * $tr.attr("data-drill-level") + 1, dataDrillLevel < url.length - 1, type)
                                $items.data('parent', $tr)
                              else
                                $trsDrill = $($.tmpl($('#template-ways-grid-drill-no-data-tips'), type))
                                $tr.after($trsDrill).data("childrenNodes", $trsDrill)
                              $btn.removeClass("drill-loading")
                        if rowData.children
                          # 如果钻取数据已经预加载，直接使用预加载数据
                          data = rowData.children
                          data = if options.format then options.format.call($grid, data) else data
                          if data and data.length
                            $trsDrill = createTbodyItems(data, options, $tbody, $tr, 'after', 1 * $tr.attr("data-drill-level") + 1, true, type)
                            $trsDrill.data('parent', $tr)
                          else
                            $trsDrill = $($.tmpl($('#template-ways-grid-drill-no-data-tips'), type))
                            $tr.after($trsDrill).data("childrenNodes", $trsDrill)
                          $btn.removeClass("drill-loading")

                          $trsDrill.each ->
                            $tr = $(this)
                            drillRowData = $tr.data('json') || {}
                            if options.extendAll || drillRowData._extended && drillRowData.children
                              unless $tr.data('extended')
                                $tr.find("a[data-action-type]").click()
          )(action)

        if isDrill
          setTimeout(() ->
            $tbody.find("tr").each () ->
              rowData = $(this).data('json') || {}
              if options.extendAll || rowData._extended && rowData.children
                $(this).find("a[data-action-type]").click()
            , 0)
    )(options)

    unless inited
      $grid.addClass("ways-data-grid")

      # 鼠标经过行高亮
      $grid.on 'mouseenter', 'tbody tr:not([data-action-type=details])', ->
        $(this).addClass('hover')
      .on 'mouseleave', 'tbody tr:not([data-action-type=details])', ->
        $(this).removeClass('hover')

      $(this).data("inited", true)

    setHeadWidth = ->

    # define frozenHead
    ((options)->
      unless $gridWrapper and $gridWrapper.length
        theadWidth = $thead.parent().outerWidth()
        $thead.width(theadWidth)

      if options.frozenHead
        frozenHeadOffsetTop = options.frozenHeadOffsetTop
        $window = $(window)
        $window.unbind('scroll.waysDataGrid.frozenHead').bind 'scroll.waysDataGrid.frozenHead', ->
          offsetHeight = $('.page-header').outerHeight() + Math.max($('.pos-fixed').outerHeight(), 0) - 1
          if frozenHeadOffsetTop
            offsetHeight = frozenHeadOffsetTop
          if $window.scrollTop() > $grid.offset().top - offsetHeight + $grid.height() - $thead.height()
            $thead.css
              display: 'none'
              position: ""
              top: ""
              "z-index": 0
            $grid.find(".wgfirstrow td").height(0)
          else if $window.scrollTop() > $grid.offset().top - offsetHeight
            if $thead.css("position") isnt "fixed"
              $thead.css
                display: 'table-header-group'
                position: "fixed"
                top: "#{offsetHeight}px"
                "z-index": 1
              $grid.find(".wgfirstrow td").height(31)
              setHeadWidth($thead)
              frozenColumns() unless $.support.html5Clone
          else if $window.scrollTop() <= $grid.offset().top - offsetHeight
            $thead.css
              display: 'none'
              position: ""
              top: ""
              "z-index": 0
          $grid.find(".wgfirstrow td").height(0)

        # 头部橫滚
        $gridWrapper.scroll ->
          $thead.scrollLeft($(this).scrollLeft())

        $("#btn-zoom-main").on 'toggle', ->
          $thead.width($gridWrapper.width())
          setHeadWidth($thead)

        setHeadWidth = ($thead)->
          setTimeout ->
            $ths = $thead.find("tr:first th")
            $tds = $grid.find(".wgfirstrow td")
            counter = 0
            $ths.each ->
              $th = $(this)
              colspan = parseInt($th.attr('colspan'), 10)
              if colspan >= 2
                width = 0
                for j in [0...colspan]
                  tdWidth = $tds.eq(counter).width()
                  width += tdWidth
                  width += 10 if (j > 0 and j < colspan)
                  counter++
              else
                width = $tds.eq(counter).width()
                counter++
              $th.find('div').width(width-2)
          , 0
    )(options)

    frozenColumns = ($moreBar)->
      if options.frozenColumns
        lastScrollLeft = $gridWrapper.unbind('scroll').scrollLeft()
        left = 0
        $ths = $thead.find("th")
        $trs = $tbody.find("tr")
        $firstrow = $trs.filter(".wgfirstrow")
        $datarows = $trs.not($firstrow)
        $firstTds = $firstrow.find("td")
        for frozenColumn in options.frozenColumns
          frozenColumn++
          $th = $ths.eq(frozenColumn-1)
          $firstTd = $firstTds.eq(frozenColumn-1)
          $tds = $datarows.find("td:nth-child(#{frozenColumn})")
          width = $firstTd.width()
          $th.css({'position': 'absolute', width: width-1, 'z-index': 10, left: left + lastScrollLeft})
          $firstTd.css({'position': 'absolute', left: left + lastScrollLeft})
          $tds.css({'position': 'absolute', width: width-1, left: left + lastScrollLeft})

          (($th, $tds, width, left)->
            $gridWrapper.scroll ->
              scrollLeft = $(this).scrollLeft()
              $th.css({'left': scrollLeft+left}, 'z-index': 11)
              $tds.css({'left': scrollLeft+left})
              $thead.scrollLeft(scrollLeft)
          )($th, $tds, width, left)
          left += width + 10

        if $.support.html5Clone
          $thead.width($gridWrapper.width()-left)
          $thead.css({overflow: 'hidden', 'padding-left': left - 1})
          moreBarLeft = $gridWrapper.scrollLeft()
        else
          $thead.css({left: $grid.offset().left - 2 * left + lastScrollLeft})
          $thead.width($gridWrapper.width() - left).scrollLeft(lastScrollLeft)
          if $grid.css('margin-left') is 'auto'
            $grid.css({'margin-left': left})
            $thead.css({overflow: 'hidden', 'padding-left': left})
            $grid.width($grid.width() - left - options.frozenColumns.length)
          moreBarLeft = -left

        $moreBar = $grid.find("tfoot") unless $moreBar
        if $moreBar and $moreBar.length
          $btnMore = $moreBar.find('a').css({width: $gridWrapper.width(), left: moreBarLeft})
          if $.support.html5Clone
            $gridWrapper.scroll ->
              $btnMore.css({left: $(this).scrollLeft()})
          else
            $btnMore.css({left: lastScrollLeft + moreBarLeft}) unless $.support.html5Clone
            $gridWrapper.scroll ->
              $btnMore.css({left: $(this).scrollLeft() + moreBarLeft})

    (getData = (insertMode)->
      success = (data, insertMode)->
        list = if options.format then options.format.call($grid, data) else data

        if typeof list is "object" and not list.length
          $moreBar = $grid.find("tfoot")
          if list.hasmore and list.hasmore > 0
            unless $moreBar.length
              $moreBar = $($.tmpl($('#template-ways-grid-more')))
            $moreBar.appendTo($grid).unbind("click.more").bind "click.more", ->
              getData('page')
            $moreBar.find('.leavings').text list.hasmore
          $moreBar.toggle(list.hasmore > 0)

          list = list.data if list.data

        $trs = createTbodyItems(list, options, $tbody, $tbody, if insertMode is 'page' then 'append' else insertMode)
        bindWaysTableEvent($grid, options, $trs)
        frozenColumns($moreBar)
        if options.frozenHead
          $thead.width($gridWrapper.width())
          setHeadWidth($thead)

        $grid.trigger 'finish'

        $gridWrapper.hideLoading()
      if options.data and insertMode isnt 'page'
        success(options.data, options.mode ? insertMode)
      else if options.ajax
        options.ajax.data = if $.isFunction(options.ajax.data) then options.ajax.data() else options.ajax.data
        $.ajax
          url: options.ajax.url
          data: if options.page then $.extend({page: options.page}, options.ajax.data ? {}) else options.ajax.data ? {}
          success: (data) ->
            success(data, data.mode ? 'page')
            options.ajax.success(data) if options.ajax.success
            $grid.trigger('ajaxSuccess', [options.data])
            options.page++
          dataType: "json"
          beforeSend: options.ajax.beforeSend
    )()

resetLineCss = ($tbody) ->
  $tbody.find("tr.odd").removeClass("odd")
  $trs = $tbody.find('tr:visible:not(.wgfirstrow)')
  $trs.filter(":odd").addClass("odd")
  $trs.filter(":even").addClass("even")

# 根据ID获取数据
getItemById = (data, id) ->
  data = $grid.data('source') unless data

  for item in data
    return item if String(item.id) is String(id)

    if item.data
      return item2 if (item2 = getItemById(item.data, id))?

createTbodyItems = (data, options, $tbody, $container, insertMode='html', drillLevel=0, drillHasMore=true, type="")->
  json =
    data: data
    util: util
    colModel: options.colModel
    drillLevel: drillLevel
    drillHasMore: drillHasMore # 可在合并后考虑重构该功能
    type: type
    insertMode: insertMode
  if options.page
    json.page = options.page


  template = options.template ? "#template-ways-grid-body"
  $items = $($.tmpl($(template), json))
  $container.closest('table').data('source', data)

  $container[insertMode]($items)

  # 缓存单行数据(json)
  $newTrs = $items.filter("tr:not(.wgfirstrow)").each (index)->
    $line = $(this)
    $line.data("json", getItemById(data, $line.data('id')))

  $container.data("childrenNodes", $newTrs) if drillLevel

  # 修复已展开的项
  $trs = $tbody.find('tr')
  $trs.filter('.extended').each ->
    $extended = $(this)
    item      = $extended.data('json')
    childrenNodes = $trs.filter("[data-parent-id='#{item.id}']")
    childrenNodes.data('parent', $extended)
    $extended.data('childrenNodes', childrenNodes) if childrenNodes.length

  if type isnt 'compare'
    resetLineCss($tbody)

  $items

# 绑定排序事件
bindWaysTableEvent = ($grid, options= {})->
  throw new Error('component.coffee, bindSortEvent, grid is undefined') unless $grid?

  $grid.find('thead th[data-sortable="true"]').each ->
    $this= $(this)
    order= $this.data('sortorder')
    $this.data('sortorder', order) if order
    $this.removeClass('asc desc').removeData('sortorder') unless $(this).data('defaultsort')
    $this.removeAttr('data-sortorder')

  unless $grid.data("inited")
    # 绑定排序事件
    $grid.bind('sort', options.onsort) if options?.onsort
    $grid.on 'click.sort', 'thead th[data-sortable="true"]', ->
      $th= $(this)
      index= $th.data('sortcolumn') or $th.index()
      dataType= $th.data('type') ? 'string'
      orderBy= $th.data('sortorder')
      sortItems= $grid.find('tbody tr:not(.wgfirstrow)').detach()

      if not orderBy or orderBy is 'asc'
        orderBy= 'desc'
        orderFlag= -1
      else
        orderBy= 'asc'
        orderFlag= 1

      nonSort= ->
        return $.trim($(this).children("td:eq(#{index})").text()) is '-'

      # 取出内容为-的元素放最后
      nonSortItems= sortItems.filter nonSort

      sortItems= sortItems.filter ->
        return not nonSort.call(this)

      #排序
      sortItems.sort (x, y)->
        xValue= $.trim $(x).children("td:eq(#{index})").text()
        yValue= $.trim $(y).children("td:eq(#{index})").text()

        if dataType is 'number'
          xValue= parseFloat(xValue.replace(/,|%/g, ''), 10)
          yValue= parseFloat(yValue.replace(/,|%/g, ''), 10)

        return ( if xValue > yValue then orderFlag else -orderFlag )

      sortItems = $.merge sortItems, nonSortItems

      $grid.find('thead .desc, thead .asc').removeClass('desc').removeClass('asc').removeData('sortorder')

      $th.data('sortorder', orderBy).addClass(orderBy).removeClass($(['asc', 'desc']).not([orderBy]))

      $grid.append sortItems

      # 子 tr 重新定位到父 tr 之后
      (resort = (counter)->
        hasChildren = false
        sortItems.filter("[data-drill-level='#{counter}']").each ->
          $parent = $(this)
          $childrenNodes = $parent.data('childrenNodes')
          if $childrenNodes
            $parent.after($childrenNodes)
            hasChildren = true
        resort(++counter) if hasChildren
      )(0)

      #$trs = $grid.find('tbody tr').removeClass('even odd')
      #$trs.filter(':even').addClass('odd')
      #$trs.filter(':odd').addClass('odd')
      resetLineCss($grid.find('tbody'))

      # 触发排序事件
      $grid.trigger 'sort'

$ ->
  $('body').append(tplWaysGrid)
