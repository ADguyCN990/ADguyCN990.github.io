'use strict'
// 全局声明插件代号
const pluginname = 'butterfly_categories_card'
// 全局声明依赖
const pug = require('pug')
const path = require('path')
const urlFor = require('hexo-util').url_for.bind(hexo)
const util = require('hexo-util')

hexo.extend.filter.register('after_generate', function () {

// =====================================================================
  // 首先获取整体的配置项名称
  const config = hexo.config.categoryBar || hexo.theme.config.categoryBar
  // 如果配置开启
  if (!(config && config.enable)) return
    // 获取所有分类
    var categories_list= hexo.locals.get('categories').data;
    var categories_message= config.message;
    //声明一个空数组用来存放合并后的对象
    var new_categories_list = [];
    // 合并分类属性和新添加的封面描述属性
    for(var i=0;i<categories_list.length;i++){
      var a = categories_list[i]
      var b = categories_message[i]
      new_categories_list[i] = Object.assign(a,b)
      }
    // console.log(new_categories_list)
  // 集体声明配置项
    const data = {
      pjaxenable: hexo.theme.config.pjax.enable,
      enable_page: config.enable_page ? config.enable_page : "/",
      layout_type: config.layout.type,
      layout_name: config.layout.name,
      layout_index: config.layout.index ? config.layout.index : 0,
      categories_list: new_categories_list,
      column: config.column ? config.column : odd, // odd：3列 | even：4列
      row: config.row ? config.row : 2, //显示行数，默认两行，超过行数切换为滚动显示
      custom_css: config.custom_css ? urlFor(config.custom_css) : "https://cdn.jsdelivr.net/npm/hexo-butterfly-categories-card/lib/categorybar.css"
    }
  // 渲染页面
  const temple_html_text = config.temple_html ? config.temple_html : pug.renderFile(path.join(__dirname, './lib/html.pug'),data);

  //cdn资源声明
    //样式资源
  const css_text = `<link rel="stylesheet" href="${data.custom_css}">`
  //注入容器声明
  var get_layout
  //若指定为class类型的容器
  if (data.layout_type === 'class') {
    //则根据class类名及序列获取容器
    get_layout = `document.getElementsByClassName('${data.layout_name}')[${data.layout_index}]`
  }
  // 若指定为id类型的容器
  else if (data.layout_type === 'id') {
    // 直接根据id获取容器
    get_layout = `document.getElementById('${data.layout_name}')`
  }
  // 若未指定容器类型，默认使用id查询
  else {
    get_layout = `document.getElementById('${data.layout_name}')`
  }

  //挂载容器脚本
  var user_info_js = `<script data-pjax>
    function ${pluginname}_injector_config(){
      var parent_div_git = ${get_layout};
      var item_html = '${temple_html_text}';
      console.log('已挂载${pluginname}')
      parent_div_git.insertAdjacentHTML("afterbegin",item_html)
      }
    if( ${get_layout} && (location.pathname ==='${data.enable_page}'|| '${data.enable_page}' ==='all')){
    ${pluginname}_injector_config()
    }
  </script>`
  // 注入用户脚本
  // 此处利用挂载容器实现了二级注入
  hexo.extend.injector.register('body_end', user_info_js, "default");
  // 注入样式资源
  hexo.extend.injector.register('head_end', css_text, "default");
},
hexo.extend.helper.register('priority', function(){
  // 过滤器优先级，priority 值越低，过滤器会越早执行，默认priority是10
  const pre_priority = hexo.config.categoryBar.priority || hexo.theme.config.categoryBar.priority
  const priority = pre_priority ? pre_priority : 10
  return priority
})
)
