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
		return "<a href='javascript:openTransferTaskTab("
				+ row.id
				+ ")'>转办</a>&nbsp;<a href='javascript:openDelegateTaskTab("
				+ row.id
				+ ")'>委派</a>&nbsp;<a href='javascript:openRebutTaskTab("
				+ row.id
				+ ")'>驳回</a>&nbsp;<a href='javascript:openFinishTaskTab("
				+ row.id
				+ ")'>办理任务</a>&nbsp;<a style='padding:5px;background:#fafafa;width:500px;border:1px solid #ccc' href='javascript:openListCommentDialog("
				+ row.id
				+ ")'>历史批注</a>&nbsp;<a href='#' onclick='javascript:showHisCurrentView("
				+ row.id + ")'>查看当前流程图</a>"
	}

	$(function() {
		$('#tgroupId')
				.combobox(
						{
							onShowPanel : function() {
								$(this).combobox('options').url = "${pageContext.request.contextPath}/group/findGroup.action";
								$(this).combobox('reload');
							},
							onSelect : function(row) {
								$('#tuserId')
										.combobox(
												{
													url : "${pageContext.request.contextPath}/user/getUserByGoupId.action?groupId="
															+ row.id + "",
													formatter : function(row) {
														return '<span class="item-text">'
																+ row.firstName
																+ row.lastName
																+ '</span>';
													}
												});
							},
						});

		$('#groupId')
				.combobox(
						{
							onShowPanel : function() {
								$(this).combobox('options').url = "${pageContext.request.contextPath}/group/findGroup.action";
								$(this).combobox('reload');
							},
							onSelect : function(row) {
								$('#userId')
										.combobox(
												{
													url : "${pageContext.request.contextPath}/user/getUserByGoupId.action?groupId="
															+ row.id + "",
													formatter : function(row) {
														return '<span class="item-text">'
																+ row.firstName
																+ row.lastName
																+ '</span>';
													}
												});
							},
						});

		$('#rTaskId')
				.combobox(
						{
							formatter : function(row) {
								return '<span class="item-text">' + row.name
										+ '</span>';
							},
							onShowPanel : function() {
								var rebutTaskId = $("#rebutTaskId").val();
								$(this).combobox('options').url = "${pageContext.request.contextPath}/task/getAllUserTask.action?taskId="
										+ rebutTaskId;
								$(this).combobox('reload');
							},
						});

	})

	function showHisCurrentView(taskId) {
		var url = "${pageContext.request.contextPath}/task/showHisCurrentView.do?taskId="
				+ taskId + "";
		$("#dlg10").dialog("open").dialog("setTitle", "查看流程图片");
		$("#simg").attr("src", url);
	}

	function openDelegateTaskTab(taskId) {
		$("#dlg4").dialog("open").dialog("setTitle", "添加委派信息");
		$("#detaskId").val(taskId);
	}

	function openTransferTaskTab(taskId) {
		$("#dlg5").dialog("open").dialog("setTitle", "添加转办信息");
		$("#tdetaskId").val(taskId);
	}

	function openRebutTaskTab(taskId) {
		$("#dlg6").dialog("open").dialog("setTitle", "添加驳回信息");
		$("#rebutTaskId").val(taskId);
	}

	function openListCommentDialog(taskId) {
		var opts = $("#dg2").datagrid("options");
		opts.url = "${pageContext.request.contextPath}/task/listHistoryComment.action?taskId="
				+ taskId + "";
		$("#dg2").datagrid("load");
		$("#dlg2").dialog("open").dialog("setTitle", "查看历史批注");
	}

	function closeDialog4() {
		$("#dlg4").dialog("close");
	}
	function closeDialog5() {
		$("#dlg5").dialog("close");
	}
	function closeDialog6() {
		$("#dlg6").dialog("close");
	}

	function openFinishTaskTab(taskId) {
		$
				.post(
						"${pageContext.request.contextPath}/leave/getLeaveByTaskId.action",
						{
							taskId : taskId
						}, function(result) {
							$("#dg3").datagrid("load");
							$("#fm").form("load", result.leave);
							$("#dlg3").dialog("open")
									.dialog("setTitle", "申请明细");
							$("#taskId").val(taskId);
						}, "json");
	}

	function submit(state) {
		$("#fm")
				.form(
						"submit",
						{
							url : '${pageContext.request.contextPath}/task/audit_bz.action?state='
									+ state,
							onSubmit : function() {
								return $(this).form("validate");
							},
							success : function(result) {
								var result = eval('(' + result + ')');
								if (result.success) {
									$.messager.alert("系统系统", "操作成功！");
									$("#dlg3").dialog("close");
									$("#dg").datagrid("reload");
								} else {
									$.messager.alert("系统系统", "提交失败，请联系管理员！");
									return;
								}
							}
						});
	}

	function saveLeave() {
		$("#gfm")
				.form(
						"submit",
						{
							url : '${pageContext.request.contextPath}/task/delegateTask.action',
							onSubmit : function() {
								if ($("#groupId").combobox("getValue") == "请选择") {
									$.messager.alert("系统提示", "请选择组！");
									return false;
								}
								if ($("#userId").combobox("getValue") == "请选择") {
									$.messager.alert("系统提示", "请选择用户！");
									return false;
								}
								return $(this).form("validate");
							},
							success : function(result) {
								var result = eval('(' + result + ')');
								if (result.success) {
									$.messager.alert("系统系统", "委派成功！");
									$("#dlg4").dialog("close");
									$("#dg").datagrid("reload");
								} else {
									$.messager.alert("系统系统", "委派失败！");
									return;
								}
							}
						});
	}

	function saveTransfer() {
		$("#tfm")
				.form(
						"submit",
						{
							url : '${pageContext.request.contextPath}/task/transferTask.action',
							onSubmit : function() {
								if ($("#tgroupId").combobox("getValue") == "请选择") {
									$.messager.alert("系统提示", "请选择组！");
									return false;
								}
								if ($("#tuserId").combobox("getValue") == "请选择") {
									$.messager.alert("系统提示", "请选择用户！");
									return false;
								}
								return $(this).form("validate");
							},
							success : function(result) {
								var result = eval('(' + result + ')');
								if (result.success) {
									$.messager.alert("系统系统", "转办成功！");
									$("#dlg5").dialog("close");
									$("#dg").datagrid("reload");
								} else {
									$.messager.alert("系统系统", "转办失败！");
									return;
								}
							}
						});
	}

	function saveRebuts() {
		$("#rfm").form("submit", {
			url : '${pageContext.request.contextPath}/task/anyRebut.action',
			onSubmit : function() {
				if ($("#rTaskId").combobox("getValue") == "请选择") {
					$.messager.alert("系统提示", "请选择用户节点！");
					return false;
				}
				return $(this).form("validate");
			},
			success : function(result) {
				var result = eval('(' + result + ')');
				if (result.success) {
					$.messager.alert("系统系统", "驳回成功！");
					$("#dlg6").dialog("close");
					$("#dg").datagrid("reload");
				} else {
					$.messager.alert("系统系统", "驳回失败！");
					return;
				}
			}
		});
	}
</script>
</head>
<body style="margin: 1px">

	<table id="dg" title="待办任务管理" class="easyui-datagrid" fitColumns="true"
		pagination="true" rownumbers="true"
		url="${pageContext.request.contextPath}/task/taskPage.action?userId=${currentMemberShip.user.id }"
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

	<div id="dlg2" class="easyui-dialog" url=""
		style="width: 750px; height: 250px; padding: 10px 20px" closed="true">
		<table id="dg2" title="批注列表" class="easyui-datagrid" url=""
			fitColumns="true" style="width: 700px; height: 200px;">
			<thead>
				<tr>
					<th field="time" width="120" align="center">批注时间</th>
					<th field="userId" width="100" align="center">批注人</th>
					<th field="message" width="200" align="center">批注信息</th>
				</tr>
			</thead>
		</table>
	</div>

	<div id="dlg3" class="easyui-dialog" url=""
		style="width: 1050px; height: 550px; padding: 10px 20px" closed="true">
		<form id="fm" method="post">
			<table cellspacing="8px">
				<tr>
					<td>请假类型：</td>
					<td><select id="leaveType" disabled="disabled"
						class="easyui-combobox" name="leaveType" style="width: 200px;">
					</select></td>
					<td>&nbsp;</td>
					<td>请假天数：</td>
					<td><input type="text" id="leaveDays" name="leaveDays"
						readonly="readonly" /></td>
				</tr>
				<tr>
					<td valign="top">请假原因：</td>
					<td colspan="4"><textarea id="leaveReason" name="leaveReason"
							rows="2" cols="49" readonly="readonly"></textarea></td>
				</tr>
				<tr>
					<td valign="top">批注：</td>
					<td colspan="4"><textarea id="comment" name="comment" rows="2"
							cols="49" class="easyui-validatebox" required="true"></textarea>
					</td>
				</tr>
				<tr>
					<td><input id="taskId" type="hidden" name="taskId" /></td>
					<td colspan="4"><a href="javascript:submit(1)"
						class="easyui-linkbutton" iconCls="icon-ok">批准</a>&nbsp;&nbsp; <a
						href="javascript:submit(2)" class="easyui-linkbutton"
						iconCls="icon-no">驳回</a></td>
				</tr>
			</table>
		</form>
	</div>

	<div id="dlg4" class="easyui-dialog"
		style="width: 620px; height: 280px; padding: 10px 20px" closed="true" closable="false"
		buttons="#dlg-buttons">

		<form id="gfm" method="post">
			<table cellpadding="8px">
				<tr>
					<td>委派組：</td>
					<td><input id="groupId" name="groupId" class="easyui-combobox"
						data-options="panelHeight:'auto',valueField:'id',textField:'name'"
						value="请选择" /></td>
				</tr>
				<tr>
					<td>委派人：</td>
					<td><input id="userId" name="userId" class="easyui-combobox"
						data-options="panelHeight:'auto',valueField:'id',textField:'id' "
						value="请选择" /></td>
				</tr>
				<tr>
					<td valign="top">批注：</td>
					<td colspan="4"><textarea id="comment" name="comment" rows="2"
							cols="49" class="easyui-validatebox" required="true"></textarea>
					</td>
				</tr>
				<td><input id="detaskId" type="hidden" name="taskId" /></td>
			</table>
		</form>
	</div>

	<div id="dlg-buttons">
		<a href="javascript:saveLeave()" class="easyui-linkbutton"
			iconCls="icon-ok">保存</a> <a href="javascript:closeDialog4()"
			class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
	</div>


	<div id="dlg5" class="easyui-dialog"
		style="width: 620px; height: 280px; padding: 10px 20px" closed="true" closable="false"
		buttons="#dlg-buttons">

		<form id="tfm" method="post">
			<table cellpadding="8px">
				<tr>
					<td>处理組：</td>
					<td><input id="tgroupId" name="groupId"
						class="easyui-combobox"
						data-options="panelHeight:'auto',valueField:'id',textField:'name'"
						value="请选择" /></td>
				</tr>
				<tr>
					<td>处理人：</td>
					<td><input id="tuserId" name="userId" class="easyui-combobox"
						data-options="panelHeight:'auto',valueField:'id',textField:'id' "
						value="请选择" /></td>
				</tr>
				<tr>
					<td valign="top">批注：</td>
					<td colspan="4"><textarea id="comment" name="comment" rows="2"
							cols="49" class="easyui-validatebox" required="true"></textarea>
					</td>
				</tr>
				<td><input id="tdetaskId" type="hidden" name="taskId" /></td>
			</table>
		</form>
	</div>

	<div id="dlg-buttons">
		<a href="javascript:saveTransfer()" class="easyui-linkbutton"
			iconCls="icon-ok">保存</a> <a href="javascript:closeDialog5()"
			class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
	</div>

	<div id="dlg6" class="easyui-dialog"
		style="width: 620px; height: 280px; padding: 10px 20px" closed="true" closable="false"
		buttons="#dlg-buttons">

		<form id="rfm" method="post">
			<table cellpadding="8px">
				<tr>
					<td>驳回节点：</td>
					<td><input id="rTaskId" name="id" class="easyui-combobox"
						data-options="panelHeight:'auto',valueField:'id',textField:'name' "
						value="请选择" /></td>
				</tr>
				<tr>
					<td valign="top">批注：</td>
					<td colspan="4"><textarea id="comment" name="comment" rows="2"
							cols="49" class="easyui-validatebox" required="true"></textarea>
					</td>
				</tr>
				<td><input id="rebutTaskId" type="hidden" name="taskId" /></td>
			</table>
		</form>
	</div>

	<div id="dlg-buttons">
		<a href="javascript:saveRebuts()" class="easyui-linkbutton"
			iconCls="icon-ok">驳回</a> <a href="javascript:closeDialog6()"
			class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
	</div>

	<div id="dlg10" class="easyui-dialog"
		style="width: 900px; height: 400px; padding: 100px 20px" closed="true">
		<img id="simg" src="" alt="流程图片">
	</div>
</body>
</html>