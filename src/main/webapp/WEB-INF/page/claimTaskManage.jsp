<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>待办任务管理</title>
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/themes/default/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/themes/icon.css">
<script type="text/javascript"
	src="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/jquery.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript">
	var url;
	function searchTask() {
		$("#dg").datagrid('load', {
			"s_name" : $("#s_name").val()
		});
	}

	function formatAction(val, row) {
		return "<a href='javascript:openClaimTaskTab("
				+ row.id
				+ ")'>签收</a>&nbsp;<a href='#' onclick='javascript:showHisCurrentView("
				+ row.id + ")'>查看当前流程图</a>"
	}
	
	function showHisCurrentView(taskId) {
		var url = "${pageContext.request.contextPath}/task/showHisCurrentView.do?taskId="
				+ taskId + "";
		$("#dlg10").dialog("open").dialog("setTitle", "查看流程图片");
		$("#simg").attr("src", url);
	}

	function openClaimTaskTab(taskId) {
		$.post("${pageContext.request.contextPath}/task/claimTask.action", {
			taskId : taskId,
			userId : '${currentMemberShip.user.id }'
		}, function(result) {
			if (result.success) {
				$.messager.alert("系统系统", "签收成功！");
				$("#dg").datagrid("reload");
			} else {
				$.messager.alert("系统系统", "签收失败！");
				return;
			}
		}, "json");
	}
</script>
</head>
<body style="margin: 1px">

	<table id="dg" title="待办任务管理" class="easyui-datagrid" fitColumns="true"
		pagination="true" rownumbers="true"
		url="${pageContext.request.contextPath}/task/claimTaskPage.action?userId=${currentMemberShip.user.id }"
		fit="true" toolbar="#tb">
		<thead>
			<tr>
				<th field="cb" checkbox="true" align="center"></th>
				<th field="id" width="100" align="center">任务ID</th>
				<th field="name" width="100" align="center">任务名称</th>
				<th field="createTime" width="100" align="center">创建时间</th>
				<th field="action" width="100" align="center"
					formatter="formatAction">操作</th>
			</tr>
		</thead>
	</table>

	<div id="tb">
		<div>
			&nbsp;任务名称&nbsp;<input type="text" id="s_name" size="20"
				onkeydown="if(event.keyCode==13) searchTask()" /> <a
				href="javascript:searchTask()" class="easyui-linkbutton"
				iconCls="icon-search" plain="true">搜索</a>
		</div>
	</div>
		<div id="dlg10" class="easyui-dialog"
		style="width: 900px; height: 400px; padding: 100px 20px" closed="true">
		<img id="simg" src="" alt="流程图片">
	</div>
	
</body>
</html>