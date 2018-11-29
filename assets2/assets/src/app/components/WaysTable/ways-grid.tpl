<!-- 默认数据表格头 -->
<!-- 使用data属性会自动缓存，加快查找速度, 如果开启了排序，没有设置数据类型，则将数据类型默认设为'string' -->
<script id="template-ways-grid" type="text/template">
<thead style="display: none; overflow: hidden">
    {{var hasSub = true, head = it.head, children = [];}}
    {{while (hasSub) {}}
        {{ hasSub = false; }}
        <tr>
            {{~head :th:index}}
                <th
                    {{? th.colspan}}
                        colspan="{{=th.colspan}}"
                    {{?? th.children && th.children.colspan > 1 }}
                        colspan="{{=th.children.colspan}}"
                    {{?}}
                    {{? th.rowspan}}
                        rowspan="{{=th.rowspan}}"
                    {{?}}

                    {{? th.sortable && !th.children }}
                        data-type="{{=th.dataType||'string'}}"
                        data-sortable="{{=th.sortable||false}}"
                        {{? th.sortOrder}}
                            data-sortorder="{{=th.sortOrder}}"
                        {{?}}
                        {{? th.defaultSort}}
                            data-defaultsort="true"
                        {{?}}
                        {{? th.sortColumn}}
                            data-sortcolumn="{{=th.sortColumn}}"
                        {{?}}
                    {{?}}
                    {{? th.style }} style="{{=th.style}}" {{?}}
                    class="
                        {{? th.sortable && !th.children }}
                            sort {{? th.defaultSort}} {{=th.sortOrder}} {{?}}
                        {{?}}
                        {{? th.className }}{{=th.className}}{{?}} 
                        {{? it.colModel[index].separater}}separater{{?}}
                    "
                >
                    {{ var text = (th.text != null ? th.text : th) ; }}
                    {{? /<[^<>]+>/.test(text)}}
                        <div>{{=text}}</div>
                    {{??}}
                    <div><span>
                        {{=text}}
                        {{? th.sortable && !th.children }}
                        <strong class="after"></strong><strong class="before"></strong>
                        {{?}}
                    </span></div>
                    {{?}}
                </th>
                {{ if (th.children && th.children.length) { hasSub = true; children = children.concat(th.children); } }}
            {{~}}
        </tr>
        {{ head = children; children = []; }}
    {{}}}
</thead>
<thead>
    {{var hasSub = true, head = it.head, children = [];}}
    {{while (hasSub) {}}
        {{ hasSub = false; }}
        <tr>
            {{~head :th:index}}
                <th
                    {{? th.colspan}}
                        colspan="{{=th.colspan}}"
                    {{?? th.children && th.children.colspan > 1 }}
                        colspan="{{=th.children.colspan}}"
                    {{?}}
                    {{? th.rowspan}}
                        rowspan="{{=th.rowspan}}"
                    {{?}}

                    {{? th.sortable && !th.children }}
                        data-type="{{=th.dataType||'string'}}"
                        data-sortable="{{=th.sortable||false}}"
                        {{? th.sortOrder}}
                            data-sortorder="{{=th.sortOrder}}"
                        {{?}}
                        {{? th.defaultSort}}
                            data-defaultsort="true"
                        {{?}}
                        {{? th.sortColumn}}
                            data-sortcolumn="{{=th.sortColumn}}"
                        {{?}}
                    {{?}}
                    {{? th.style }} style="{{=th.style}}" {{?}}
                    class="
                        {{? th.sortable && !th.children }}
                            sort {{? th.defaultSort}} {{=th.sortOrder}} {{?}}
                        {{?}}
                        {{? th.className }}{{=th.className}}{{?}}
                        {{? it.colModel[index].separater}}separater{{?}}
                    "
                >
                    {{ var text = (th.text != null ? th.text : th) ; }}
                    {{? /<[^<>]+>/.test(text)}}
                        <div>{{=text}}</div>
                    {{??}}
                    <div><span>
                        {{=text}}
                        {{? th.sortable && !th.children }}
                        <strong class="after"></strong><strong class="before"></strong>
                        {{?}}
                    </span></div>
                    {{?}}
                </th>
                {{ if (th.children && th.children.length) { hasSub = true; children = children.concat(th.children); } }}
            {{~}}
        </tr>
        {{ head = children; children = []; }}
    {{}}}
</thead>
<tbody></tbody>
</script>

<!-- 默认数据表格主体 -->
<script id="template-ways-grid-body" type="text/template">
{{ var text, base={}, drillLevel = it.drillLevel || 0, templateWaysGridBody = $('#template-ways-grid-body').html(); }}
{{? (it.drillLevel === 0 && it.page && it.page <= 1) || (it.drillLevel === 0 && !it.page) || it.insertMode === 'html' }}
<tr class="wgfirstrow">
    {{~it.colModel :col}}
        <td{{? col.width}} style="width:{{? (""+col.width).indexOf("%")>-1}}{{=col.width}}{{??}}{{=col.width-10}}px{{?}};"{{?}}>
            {{? col.width}}<div style="width:{{? (""+col.width).indexOf("%")>-1}}{{=col.width}}{{??}}{{=col.width-10}}px{{?}};"></div>{{?}}
        </td>
    {{~}}
</tr>
{{?}}
{{? it.data && it.data.length}}
    {{~it.data :item:index}}
        {{ var hasChildren = $.isArray(item.data) && item.data.length > 0; }}
        <tr
            class="
                {{? item.my}} my-manufacturer{{?}}
                {{?it.drillLevel}} drill-{{=it.drillLevel}}{{?}}
                {{?hasChildren}} extended{{?}}
                {{= item.className || '' }}"
            {{? it.drillLevel && it.type}}data-action-type="{{=it.type}}"{{?}}
            data-drill-level="{{=drillLevel}}"
            {{? hasChildren}}data-extended="true" {{?}}
            {{? item.id }}data-id="{{=item.id}}"{{?}}
            {{? it.parentId }}data-parent-id="{{=it.parentId}}"{{?}}
        >
            {{~it.colModel :col}}
                {{ col = $.extend({}, col, item[col.key]); }}
                {{? !col.template}}
                    {{text = it.util.getValueIfNotNull(col.text, item[col.key], "");}}
                    {{? $.isFunction(text) }} {{text = text(item);}} {{?}}
                    {{? $.isPlainObject(text) }} {{text = it.util.getValueIfNotNull(text.text,""); }} {{?}}
                    {{? col.format}}
                        {{? typeof col.format === "string"}}
                            {{? col.format === "percent"}}
                                {{text = it.util.formatToPercent(text);}}
                            {{?? col.format === "thousands"}}
                                {{text = it.util.formatToThousands(text);}}
                            {{?? col.format === "tendency" && $.isNumeric(text) }}
                                {{if (text < 0) { text = "up"; } else if (text > 0) {text = "down"}}}
                                {{text = '<span class="tendency ' + text + '"></span>';}}
                            {{?? col.format === "linenumber" && $.trim(text) !== ''}}
                                {{text = text +'.';}}
                            {{?? col.format === "percentBar"}}
                                {{? $.isNumeric(text) }}
                                    {{if (index === 0) { base[col.key] = text / 100; } }}
                                    {{ text = Math.abs(text / base[col.key]) + '%'; }}
                                {{?}}
                                {{? String(text).indexOf('%') > 0 && String(text).indexOf('-') < 0 && $.trim(String(text)) !== '' }}
                                    {{text = '<div class="percent" style="width: ' + text + '"></div>';}}
                                {{?}}
                            {{?}}
                        {{?? typeof col.format === "function" }}
                            {{ text = col.format(text, item, index); }}
                        {{?}}
                    {{?}}
                    <td
                        class="
                            {{? col.key}}grid-{{=col.key}}{{?}} 
                            {{? col.align}}t{{=col.align}}{{?}} 
                            {{? (""+text).indexOf("-") === 0 && text.length > 1}}highlight-negative{{?}} 
                            {{? col.className }} {{=col.className }} {{?}}
                            {{? col.separater}}separater{{?}}
                        "
                        style="
                            {{? col.style }}{{=col.style}};{{?}}
                            {{? col.color}}color:{{=col.color}};{{?}}
                            {{? col.separater}}border-right:1px solid #DFDBDC;{{?}}
                            {{? col.separater === false}}border-right:1px solid transparent{{?}}"
                    >
                        {{? col.linkTo || col.action}}
                            <span style="
                                {{? it.source === 'dataChildren' || (typeof col.action === "object" && col.action.type === "drill" && it.drillLevel)}}margin-left:{{=(it.drillHasMore ? it.drillLevel : it.drillLevel + 1)*20}}px;{{?}}
                                {{? col.color}}color:{{=col.color}}{{?}}
                            "></span>
                            {{? col.action}}
                                {{? typeof col.action === "object" && it.drillHasMore }}
                                    <!-- hasChildren 标识是否可钻取 -->
                                    {{? item.hasChildren === true || item.children && item.children.length }}
                                        {{? col.action.type === "drill"}}
                                            <a class="drill-tree-ico" href="javascript:;" data-action-type="{{=col.action.type||""}}" ></a>
                                        {{?}}
                                        {{? col.action.type === "drill" || col.action.type === "compare"}}
                                            {{var dataActionType = 'data-action-type="drill"';}}
                                        {{?}}
                                    {{??}}
                                        <span class="drill-tree-space"></span>
                                    {{?}}
                                {{?}}
                            {{?}}
                            <{{? item[col.key +"Link"] !== false && col.link !== false && (it.drillHasMore  || $.isFunction(col.action) || col.linkTo || ($.isPlainObject(col.action) && col.action.type === 'levelDrill')) }}a{{??}}span{{?}}
                                class="{{? col.linkToClassName}}{{=col.linkToClassName}}{{?}} {{? typeof col.action === "object" && col.action.classNames}}{{=col.action.classNames}}{{?}}"

                                {{? col.action.type === 'levelDrill' }}
                                    data-action-type="levelDrill" 
                                {{?}}

                                {{? col.linkTo}}
                                    {{? $.isFunction(col.linkTo) }}
                                        href="{{=col.linkTo(item) }}"
                                    {{??}}
                                        href="{{=col.linkTo}}"
                                    {{?}}
                                {{?}}
                            >{{? text}}{{=text||""}}{{?}}</{{? it.drillHasMore}}a{{??}}span{{?}}>
                        {{??}}
                            {{=text}}
                        {{?}}
                    </td>
                {{??}}
                    <td>{{=$.tmpl($(col.template), item)}}</td>
                {{?}}
            {{~}}
        </tr>
        {{?item.data && item.data.length && item.data.length > 0 }}
            {{=$.tmpl(templateWaysGridBody, $.extend({}, it, { 
                data         : item.data,
                drillHasMore : true,
                source       : 'dataChildren',
                drillLevel   : ( drillLevel + 1 ),
                parentId     : item.id
            })) }}
        {{?}}
    {{~}}
{{??}}
<tr class="no-data"><td colspan="20">{{=lang.noData}}...</td></tr>
{{?}}
</script>

<!-- 详细数据模式外框 -->
<script id="template-ways-grid-details-wrapper" type="text/template">
    <tr data-action-type="details"><td colspan="100" style="padding: 5px 20px"><p class="loading">Loading...</p></td></tr>
</script>

<!-- 固定宽度显示模式外框，用于设置滚动条 -->
<script id="template-ways-grid-wrapper" type="text/template">
    <div class="ways-data-grid-wrapper"></div>
</script>

<!-- 钻取模式暂无数据提示框 -->
<script id="template-ways-grid-drill-no-data-tips" type="text/template">
    <tr class="no-data" data-action-type="{{=it}}"><td colspan="100">{{=lang.noData}}...</td></tr>
</script>

<!-- 详细数据模式暂无数据提示框 -->
<script id="template-ways-grid-details-no-data-tips" type="text/template">
    暂无数据...
</script>

<!-- 详细数据模式暂无数据提示框 -->
<script id="template-ways-grid-more" type="text/template">
    <tfoot><tr><td colspan="100"><div class="grid-more-bar"><a>{{=lang.more}}<span style="color: #666">（{{=lang.remaining}}<span class="leavings"></span>{{=lang.remainingUnit}}）</span></a></div></td></tr></tfoot>
</script>