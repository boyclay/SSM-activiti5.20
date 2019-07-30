<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>流程定义管理</title>
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
	function searchProcessDefinition() {
		$("#dg").datagrid('load', {
			"s_name" : $("#s_name").val()
		});
	}

	function formatAction(val, row) {
		return "<a href='#' onclick='javascript:showView("
				+ row.deploymentId
				+ ")'>查看流程图</a>&nbsp;<a style='padding:5px;background:#fafafa;width:500px;border:1px solid #ccc' href='javascript:actProcessDefinition("
				+ row.deploymentId
				+ ","
				+ row.suspensionState
				+ ")'>激活</a>&nbsp;<a style='padding:5px;background:#fafafa;width:500px;border:1px solid #ccc' href='javascript:susProcessDefinition("
				+ row.deploymentId + "," + row.suspensionState + ")'>挂起</a>";
	}

	function showView(deploymentId) {
		var url = "${pageContext.request.contextPath}/processDefinition/showView.action?deploymentId="
				+ deploymentId
				+ "";
		$("#dlg10").dialog("open").dialog("setTitle", "查看流程图片");
		$("#simg").attr("src", url);
	}

	function actProcessDefinition(deploymentId, suspensionState) {
		if (suspensionState == 1) {
			$.messager.alert("系统提示", "流程处于激活状态！");
			return;
		}
		$
				.post(
						"${pageContext.request.contextPath}/processDefinition/actProcessDefinition",
						{
							deploymentId : deploymentId
						}, function(result) {
							if (result.success) {
								$.messager.alert("系统系统", "激活成功！");
								$("#dg").datagrid("reload");
							} else {
								$.messager.alert("系统系统", "激活失败！");
								return;
							}
						}, "json");
	}

	function susProcessDefinition(deploymentId, suspensionState) {
		if (suspensionState == 2) {
			$.messager.alert("系统提示", "流程处于挂起状态！");
			return;
		}
		$
				.post(
						"${pageContext.request.contextPath}/processDefinition/susProcessDefinition",
						{
							deploymentId : deploymentId
						}, function(result) {
							if (result.success) {
								$.messager.alert("系统系统", "挂起成功！");
								$("#dg").datagrid("reload");
							} else {
								$.messager.alert("系统系统", "挂起失败！");
								return;
							}
						}, "json");
	}
	function formatStatus(val, row) {
		if (val == 1) {
			return "激活状态";
		} else {
			return "挂起状态";
		}
	}
</script>
</head>
<body style="margin: 1px">
	<table id="dg" title="流程定义管理" class="easyui-datagrid" fitColumns="true"
		pagination="true" rownumbers="true"
		url="${pageContext.request.contextPath}/processDefinition/processDefinitionPage.action"
		fit="true" toolbar="#tb">
		<thead>
			<tr>
				<th field="cb" checkbox="true" align="center"></th>
				<th field="id" width="80" align="center">编号</th>
				<th field="name" width="60" align="center">流程名称</th>
				<th field="key" width="50" align="center">流程定义的key</th>
				<th field="version" width="20" align="center">版本</th>
				<th field="deploymentId" width="30" align="center">流程部署Id</th>
				<th field="suspensionState" width="30" align="center"
					formatter="formatStatus">状态</th>
				<th field="action" width="80" align="center"
					formatter="formatAction">操作</th>
			</tr>
		</thead>
	</table>
	<div id="tb">
		<div>
			&nbsp;流程定义名称&nbsp;<input type="text" id="s_name" size="20"
				onkeydown="if(event.keyCode==13) searchProcessDefinition()" /> <a
				href="javascript:searchProcessDefinition()"
				class="easyui-linkbutton" iconCls="icon-search" plain="true">搜索</a>
		</div>
	</div>
	<div id="dlg10" class="easyui-dialog"
		style="width: 900px; height: 400px; padding: 100px 20px" closed="true">
		<img id="simg" src="" alt="流程图片">
	</div>


</body>
</html>