/**
 * 公共js工具类
 */

/**
 * action:请求地址
 * param：请求参数
 * pageId：请求展示页面地址
 * callBackData：请求回调数据初始化函数
 * auth：是否权限认证
 * isGo：是否需要显示扩展
 */
$.turnPageAjax=function turnPageAjax(action, param,pageId,callBackData,auth,isGo){
	//页码点击事件复制
	ApiUtil.sendPost(action, param,auth, function(resp) {
		var reData = apiMobileService(resp);
		var content = reData.msg[0];
//		if(content.pages<1){
//			return;
//		}
		//初始化分页数据
	    $("#"+pageId).pagination(content.pages, {
			num_edge_entries: 1, //边缘页数
			num_display_entries: 4, //主体页数
			items_per_page:1, //每页显示1项
			current_page:content.pageNum-1,
			prev_text: "前一页",
			next_text: "后一页",
			callback: function(index){
				$.turnPageAjaxPage(index,action, param,callBackData, auth);
			}
		});
	    if(isGo){
	    	//搜索会创建，创建前先删除
	    	$("#"+pageId).parent().find('div:eq(1)').remove();
	    	//添加附加的信息
	    	$("#"+pageId).parent().append('<div class="searchPage fl">' +
	    			'<span class="page-sum">共<strong class="allPage">'+content.pages+'</strong>页,每页<strong class="allPage">'+content.pageSize+'</strong>条</span>'+
	    			'<span class="page-go">跳转<input type="text">页</span>'+
	    	'<a href="javascript:;" class="page-btn" >GO</a></div>');
	    }
	    $('.page-btn').bind('click',function(){
	    	page_index = $("#"+pageId).parent().find('input').val();
	    	//判断页码是否超出范围
	    	if(0<page_index&&page_index<(content.pages+1)){
	    		$.turnPageAjaxPage(page_index-1,action, param,callBackData, auth);
	    		$("#"+pageId +' .current').removeClass('current');
	    		$("#"+pageId).find('a:eq('+page_index+')').attr('class','current');
	    	}else{
	    		alert('超出查询范围');
	    	}
	    	});
	});	
}

$.turnPageAjaxPage=function turnPageAjaxPage(index,action, param,callBackData, auth){
	param.page = index+1;
	//页码点击事件复制
	ApiUtil.sendPost(action, param,auth, function(resp) {
		var reData = apiMobileService(resp);
		var content = reData.msg[0];
        //回调函数
		var re = /function\s*(\w*)/i;
		var matches = re.exec(callBackData);

	    callBackData(content);
	});	
}
