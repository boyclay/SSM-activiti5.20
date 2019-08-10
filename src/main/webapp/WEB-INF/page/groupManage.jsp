<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>角色管理</title>

<style>
/*重点代码*/
/*默认*/
</style>
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
	function openAuthDiglog() {
		var selectRows = $("#dg").datagrid("getSelections");
		if (selectRows.length != 1) {
			$.messager.alert("系统提示", "请选择一条要设置的用户！");
			return;
		}
		var row = selectRows[0];
		$("#dlg2").dialog("open").dialog("setTitle", "设置用户权限");
		loadAllTrees(row.id); // 加载所有角色
		$("#groupId").val(row.id);
	}

	function loadAllTrees(groupId) {
		$("#tt")
				.tree(
						{
							url : "${pageContext.request.contextPath}/resources/getAllResources.action?groupId="
									+ groupId + "",
							loadFilter : function(rows) {
								return convert(rows);
							}
						});
	}

	function exists(rows, parentId) {
		for (var i = 0; i < rows.length; i++) {
			if (rows[i].id == parentId)
				return true;
		}
		return false;
	}

	function convert(rows) {
		var nodes = [];
		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			if (!exists(rows, row.parentId)) {
				if(row.type==2){
					if (row.isChecked == "true") {
						nodes.push({
							id : row.id,
							text : row.name,
							checked : row.isChecked,
							iconCls:'icon-remove'
						});
					} else {
					nodes.push({
						id : row.id,
						text : row.name,
						iconCls:'icon-remove'
					});
					}
				}else{
					if (row.isChecked == "true") {
						nodes.push({
							id : row.id,
							text : row.name,
							checked : row.isChecked
						});
					} else {
					nodes.push({
						id : row.id,
						text : row.name
					});
					}
				}
				
			}
		}
		var toDo = [];
		for (var i = 0; i < nodes.length; i++) {
			toDo.push(nodes[i]);
		}
		while (toDo.length) {
			var node = toDo.shift(); // the parent node
			// get the children nodes
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				if (row.parentId == node.id) {
					
					if(row.type==2){
						if (row.isChecked == "true") {
							var child = {
									id : row.id,
									text : row.name,
									checked : row.isChecked,
									iconCls:'icon-remove'
								};
						} else {
							var child = {
									id : row.id,
									text : row.name,
									iconCls:'icon-remove'
								};
						}
					}else{
						if (row.isChecked == "true") {
							var child = {
									id : row.id,
									text : row.name,
									checked : row.isChecked
								};
						} else {
							var child = {
									id : row.id,
									text : row.name,
								};
						}
					}
					if (node.children) {
						node.children.push(child);
					} else {
						node.children = [ child ];
					}
					toDo.push(child);
				}
			}
		}
		return nodes;
	}

	function saveAuth() {
		var nodes = $('#tt').tree('getChecked');
		var resourcesIdString = '';
		for (var i = 0; i < nodes.length; i++) {
			resourcesIdString = resourcesIdString + nodes[i].id + ",";
		}
		var groupId = $("#groupId").val();
		$
				.post(
						"${pageContext.request.contextPath}/resources/addRoleResources.action",
						{
							groupId : groupId,
							resourcesId : resourcesIdString
						}, function(result) {
							if (result.success) {
								$.messager.alert("系统提示", "数据保存成功！");
								closeAuthDialog();
								$("#dg").datagrid("reload");
							} else {
								$.messager.alert("系统提示", "数据保存失败，请联系管理员！");
							}
						}, "json");
	}

	function closeAuthDialog() {
		$("#dlg2").dialog("close");
	}

	function deleteGroup() {
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
												"${pageContext.request.contextPath}/group/deleteGroup.action",
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

	function openGroupAddDiglog() {
		$("#dlg").dialog("open").dialog("setTitle", "添加角色信息");
		$("#flag").val(1);
		$("#id").attr("readonly", false);
	}

	function openGroupModifyDiglog() {
		var selectRows = $("#dg").datagrid("getSelections");
		if (selectRows.length != 1) {
			$.messager.alert("系统提示", "请选择一条要编辑的数据！");
			return;
		}
		var row = selectRows[0];
		$("#dlg").dialog("open").dialog("setTitle", "编辑角色信息");
		$("#fm").form("load", row);
		$("#flag").val(2);
		$("#id").attr("readonly", true);
	}

	function checkData() {
		if ($("#id").val() == '') {
			$.messager.alert("系统系统", "请输入角色名！");
			$("#id").focus();
			return;
		}
		var flag = $("#flag").val();
		if (flag == 1) {
			$
					.post(
							"${pageContext.request.contextPath}/group/existGroupName.do",
							{
								groupName : $("#id").val()
							}, function(result) {
								if (result.exist) {
									$.messager.alert("系统系统", "该角色名已存在，请更换下！");
									$("#id").focus();
								} else {
									saveGroup();
								}
							}, "json");
		} else {
			updateGroup();
		}
	}

	function saveGroup() {
		$("#fm").form("submit", {
			url : '${pageContext.request.contextPath}/group/groupSave.action',
			onSubmit : function() {
				return $(this).form("validate");
			},
			success : function(result) {
				var result = eval('(' + result + ')');
				if (result.success) {
					$.messager.alert("系统系统", "保存成功！");
					resetValue();
					$("#dlg").dialog("close");
					$("#dg").datagrid("reload");
				} else {
					$.messager.alert("系统系统", "保存失败！");
					return;
				}
			}
		});
	}

	function updateGroup() {
		$("#fm")
				.form(
						"submit",
						{
							url : '${pageContext.request.contextPath}/group/updateGroup.action',
							onSubmit : function() {
								return $(this).form("validate");
							},
							success : function(result) {
								var result = eval('(' + result + ')');
								if (result.success) {
									$.messager.alert("系统系统", "更新成功！");
									resetValue();
									$("#dlg").dialog("close");
									$("#dg").datagrid("reload");
								} else {
									$.messager.alert("系统系统", "保存失败！");
									return;
								}
							}
						});
	}

	function resetValue() {
		$("#id").val("");
		$("#name").val("");
	}

	function closeGroupDialog() {
		$("#dlg").dialog("close");
		resetValue();
	}
</script>
</head>
<body style="margin: 1px">
	<table id="dg" title="角色管理" class="easyui-datagrid" fitColumns="true"
		pagination="true" rownumbers="true"
		url="${pageContext.request.contextPath}/group/groupPage.action"
		fit="true" toolbar="#tb">
		<thead>
			<tr>
				<th field="cb" checkbox="true" align="center"></th>
				<th field="id" width="80" align="center">角色名</th>
				<th field="name" width="80" align="center">角色名称</th>
			</tr>
		</thead>
	</table>
	<div id="tb">
		<div>
			<shiro:hasPermission name="/roleManage/add">
				<a href="javascript:openGroupAddDiglog()" class="easyui-linkbutton"
					iconCls="icon-add" plain="true">添加</a>
			</shiro:hasPermission>
			<shiro:hasPermission name="/roleManage/update">
				<a href="javascript:openGroupModifyDiglog()"
					class="easyui-linkbutton" iconCls="icon-edit" plain="true">修改</a>
			</shiro:hasPermission>
			<shiro:hasPermission name="/roleManage/delete">
				<a href="javascript:deleteGroup()" class="easyui-linkbutton"
					iconCls="icon-remove" plain="true">删除</a>
			</shiro:hasPermission>
			<shiro:hasPermission name="/roleManage/permission">
				<a href="javascript:openAuthDiglog()" class="easyui-linkbutton"
					iconCls="icon-power" plain="true">授权</a>
			</shiro:hasPermission>
		</div>
	</div>

	<div id="dlg" class="easyui-dialog"
		style="width: 600px; height: 150px; padding: 10px 20px" closed="true"
		closable="false" buttons="#dlg-buttons">

		<form id="fm" method="post">
			<table cellpadding="8px">
				<tr>
					<td>角色名：</td>
					<td><input type="text" id="id" name="id"
						class="easyui-validatebox" required="true" /></td>
					<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
					<td>角色名称：</td>
					<td><input type="text" id="name" name="name"
						class="easyui-validatebox" required="true" /> <input
						type="hidden" id="flag" name="flag" /></td>
				</tr>
			</table>
		</form>
	</div>

	<div id="dlg-buttons">
		<a href="javascript:checkData()" class="easyui-linkbutton"
			iconCls="icon-ok">保存</a> <a href="javascript:closeGroupDialog()"
			class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
	</div>

	<div id="dlg2" class="easyui-dialog"
		style="width: 450px; height: 200px; padding: 10px 20px" closed="true"
		closable="false" buttons="#dlg2-buttons" closable="false">
		<ul id="tt" class="easyui-tree" checkbox="true"></ul>
		<input type="hidden" id="groupId" name="groupId" />
		</td>
	</div>

	<div id="dlg2-buttons">
		<a href="javascript:saveAuth()" class="easyui-linkbutton"
			iconCls="icon-ok">保存</a> <a href="javascript:closeAuthDialog()"
			class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
	</div>
</body>
</html>