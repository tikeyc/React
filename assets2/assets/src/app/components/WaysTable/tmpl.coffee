$ = require('jquery')
dot = require('dot')

$.tmpl = (template, data...)->
  window.lang =
    more: "查看更多"
    remaining: "剩余"
    remainingUnit: "项"
    noData: "暂无数据"
    noDatas: "没有数据."
  if typeof template is "string"
    dot.template(template).apply(null, data)
  else
    dot.template(template.html()).apply(null, data)
