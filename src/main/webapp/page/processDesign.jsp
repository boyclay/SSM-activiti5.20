<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>流程管理</title>
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
	function searchUser() {
		$("#dg").datagrid('load', {
			"name" : $("#s_id").val()
		});
	}
	
	function formatAction(val,row){
		return "<a href='${pageContext.request.contextPath}/deploy/editorModel?modelId="+row.id+"'>编辑模型</a>&nbsp;<a href='javascript:deployModel("+row.id+")'>部署模型</a>&nbsp;<a href='${pageContext.request.contextPath}/deploy/exportModel?modelId="+row.id+"'>导出模型</a>&nbsp;<a href='javascript:deleteModel("+row.id+")'>删除模型</a>"
	}
	
	function deployModel(modelId){
		$.post("${pageContext.request.contextPath}/deploy/deployModel",{modelId:modelId},function(){
				$.messager.alert("系统系统"," 部署成功！！！");
		},"json");
	}
	
	function deleteModel(modelId){
		$.post("${pageContext.request.contextPath}/deploy/deleteModel",{modelId:modelId},function(){
				$.messager.alert("系统系统","删除成功！！！");
		},"json");
	}
	
	function exportModel(modelId){
		$.messager.alert("系统系统","保存成功！！！！");
		$.post("${pageContext.request.contextPath}/deploy/exportModel",{modelId:modelId},function(){
				$.messager.alert("系统系统","导出成功！！！");
		},"json");
	}
			

	function deleteUser() {
		var selectRows = $("#dg").datagrid("getSelections");
		if (selectRows.length == 0) {
			$.messager.alert("系统提示", "请选择要删除的数据！");
			return;
		}
		var strIds = [];
		for (var i = 0; i < selectRows.length; i++) {
			strIds.push(selectRows[i].id);
		}
		var ids = strIds.join(",");
		$.messager
				.confirm(
						"系统提示",
						"您确定要删除这<font color=red>" + selectRows.length
								+ "</font>条数据吗?",
						function(r) {
							if (r) {
								$
										.post(
												"${pageContext.request.contextPath}/user/deleteUser.action",
												{
													ids : ids
												},
												function(result) {
													if (result.success) {
														$.messager.alert(
																"系统提示",
																"数据已经成功删除！");
														$("#dg").datagrid(
																"reload");
													} else {
														$.messager
																.alert("系统提示",
																		"数据删除失败，请联系管理员！");
													}
												}, "json");
							}
						});
	}

	function openUserAddDiglog() {
		$("#dlg").dialog("open").dialog("setTitle", "添加流程信息");
		$("#flag").val(1);
	}

	function openUserModifyDiglog() {
		var selectRows = $("#dg").datagrid("getSelections");
		if (selectRows.length != 1) {
			$.messager.alert("系统提示", "请选择一条要编辑的数据！");
			return;
		}
		var row = selectRows[0];
		$("#dlg").dialog("open").dialog("setTitle", "编辑用户信息");
		$("#fm").form("load", row);
		$("#flag").val(2);
		$("#id").attr("readonly", true);
	}

	function checkData() {
			saveUser();
	}

	function saveUser() {
		$("#fm").form("submit", {
			url : '${pageContext.request.contextPath}/service/create.action',
			onSubmit : function() {
				return $(this).form("validate");
			},
			success : function(modelId) {
				$.messager.alert("系统系统", "保存成功！");
				resetValue();
				$("#dlg").dialog("close");
				$("#dg").datagrid("reload");
				window.location.href="<%=request.getContextPath()%>/act/rest/modeler.html?modelId="+modelId;
			}
		});
	}

	function resetValue() {
		$("#id").val("");
		$("#password").val("");
		$("#firstName").val("");
		$("#lastName").val("");
		$("#email").val("");
	}

	function closeUserDialog() {
		$("#dlg").dialog("close");
		resetValue();
	}
</script>
</head>
<body style="margin: 1px">
	<table id="dg" title="流程管理" class="easyui-datagrid" fitColumns="true"
		pagination="true" rownumbers="true"
		url="${pageContext.request.contextPath}/deploy/getModelList.action"
		fit="true" toolbar="#tb">
		<thead>
			<tr>
				<th field="cb" checkbox="true" align="center"></th>
				<th field="id" width="20" align="center">模型ID</th>
				<th field="name" width="20" align="center">模型名</th>
				<th field="createTime" width="50" align="center">创建时间</th>
				<th field="lastUpdateTime" width="50" align="center">最后更新时间</th>
				<th field="action" width="80" align="center" formatter="formatAction">操作</th>
			</tr>
		</thead>
	</table>
	<div id="tb">
		<div>
			<a href="javascript:openUserAddDiglog()" class="easyui-linkbutton"
				iconCls="icon-add" plain="true">添加模型</a>
		</div>
		<div>
			&nbsp;模型名&nbsp;<input type="text" id="s_id" size="20"
				onkeydown="if(event.keyCode==13) searchUser()" /> <a
				href="javascript:searchUser()" class="easyui-linkbutton"
				iconCls="icon-search" plain="true">搜索</a>
		</div>
	</div>

	<div id="dlg" class="easyui-dialog"
		style="width: 620px; height: 250px; padding: 10px 20px" closed="true"
		buttons="#dlg-buttons">
		<form id="fm" method="post">
			<table cellpadding="8px">
				<tr>
					<td>流程名称：</td>
					<td><input type="text" id="processName" name="processName"
						class="easyui-validatebox" required="true" /></td>
				</tr>
				<tr>
					<td>流程主键：</td>
					<td><input type="text" id="processKey" name="processKey"
						class="easyui-validatebox" required="true" /></td>
				</tr>
				<tr>
					<td>流程描述：</td>
					<td><input type="text" id="processDescription"
						name="processDescription" class="easyui-validatebox"
						required="true" /></td>
				</tr>
			</table>
		</form>
	</div>

	<div id="dlg-buttons">
		<a href="javascript:checkData()" class="easyui-linkbutton"
			iconCls="icon-ok">保存</a> <a href="javascript:closeUserDialog()"
			class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
	</div>
</body>
</html>