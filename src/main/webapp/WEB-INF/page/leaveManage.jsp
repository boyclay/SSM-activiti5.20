<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>请假管理</title>
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
	function formatAction(val, row) {
		if (row.state == '未提交') {
			return "<a href='javascript:startApply(" + row.id + ")'>提交申请</a>";
		} else if (row.state == '审核通过'||row.state == '审核未通过' || row.state == '审核中') {
			return "<a href='javascript:openListCommentDialog("
					+ row.processInstanceId
					+ ")'>历史批注</a>&nbsp;<a href='#' onclick='javascript:showHisView("
					+ row.processInstanceId + ")'>流程图</a>&nbsp";
		} else if (row.state == '驳回修改中') {
			return "<a href='javascript:change("
					+ row.processInstanceId
					+ ")'>修改重新发起</a>&nbsp;<a href='javascript:openListCommentDialog("
					+ row.processInstanceId
					+ ")'>历史批注</a>&nbsp;<a href='#' onclick='javascript:showHisView("
					+ row.processInstanceId
					+ ")'>流程图</a>";
		}
	}

	function recall(processInstanceId) {
		$.post(
				"${pageContext.request.contextPath}/task/recall?processInstanceId="
						+ processInstanceId + "", function(result) {
					if (result.success) {
						$.messager.alert("系统提示", "撤回处理成功！");
						$("#dg").datagrid("reload");
					} else {
						$.messager.alert("系统提示", "撤回失败！");
					}
				}, "json");
	}

	function checkData() {
		$("#changfm").form("submit", {
			url : '${pageContext.request.contextPath}/leave/change.action',
			onSubmit : function() {
				return $(this).form("validate");
			},
			success : function(result) {
				var result = eval('(' + result + ')');
				if (result.success) {
					$.messager.alert("系统系统", "更新成功！");
					resetChangeValue();
					$("#dlg3").dialog("close");
					$("#dg").datagrid("reload");
				} else {
					$.messager.alert("系统系统", "更新失败！");
					return;
				}
			}
		});
	}

	function change() {
		var selectRows = $("#dg").datagrid("getSelections");
		if (selectRows.length != 1) {
			$.messager.alert("系统提示", "请选择一条要编辑的数据！");
			return;
		}
		var row = selectRows[0];
		$("#dlg3").dialog("open").dialog("setTitle", "修改申请信息");
		$("#changfm").form("load", row);
		$("#leaveType").attr("readonly", true);
	}

	function showHisView(processInstanceId) {
		var url = "${pageContext.request.contextPath}/task/showHisView.do?processInstanceId="
				+ processInstanceId + "";
		$("#dlg10").dialog("open").dialog("setTitle", "查看流程图片");
		$("#simg").attr("src", url);
	}

	function openListCommentDialog(processInstanceId) {
		$("#dg2").datagrid("load", {
			processInstanceId : processInstanceId
		});
		$("#dlg2").dialog("open").dialog("setTitle", "查看历史批注");
	}

	function openLeaveAddDialog() {
		$("#dlg").dialog("open").dialog("setTitle", "添加请假单信息");
	}

	function saveLeave() {
		$("#fm").form("submit", {
			url : '${pageContext.request.contextPath}/leave/save.action',
			onSubmit : function() {
				if ($("#leaveType").combobox("getValue") == "请选择") {
					$.messager.alert("系统提示", "请选择休假类型！");
					return false;
				}
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

	function closeChangeDialog() {
		$("#dlg3").dialog("close");
		resetChangeValue();
	}

	function resetChangeValue() {
		$("#leaveType").val("");
		$("#leaveDays").val("");
		$("#leaveReason").val("");
	}

	function resetValue() {
		$("#leaveDays").val("");
		$("#leaveReason").val("");
	}

	function closeLeaveDialog() {
		$("#dlg").dialog("close");
		resetValue();
	}
	//提交请假流程申请
	function startApply(leaveId) {
		$.post("${pageContext.request.contextPath}/leave/startApply.action", {
			leaveId : leaveId
		}, function(result) {
			if (result.success) {
				$.messager.alert("系统系统", "请假申请提交成功，目前审核中，请耐心等待！");
				$("#dg").datagrid("reload");
			} else {
				$.messager.alert("系统系统", "请假申请提交失败，请联系管理员！");
			}
		}, "json");
	}

	function formatType(val, row) {
		if (val == 'AL') {
			return "年假";
		} else if (val == 'OT') {
			return "加班";
		} else if (val == 'PL') {
			return "事假";
		} else {
			return "病假";
		}
	}
</script>
</head>
<body style="margin: 1px">
	<table id="dg" title="请假管理" class="easyui-datagrid" fitColumns="true"
		pagination="true" rownumbers="true"
		url="${pageContext.request.contextPath}/leave/leavePage.action"
		fit="true" toolbar="#tb">
		<thead>
			<tr>
				<th field="cb" checkbox="true" align="center"></th>
				<th field="id" width="30" align="center">编号</th>
				<th field="leaveType" width="40" align="center"
					formatter="formatType">请假类型</th>
				<th field="leaveDate" width="80" align="center">请假日期</th>
				<th field="leaveDays" width="30" align="center">请假天数</th>
				<th field="leaveReason" width="200" align="center">请假原因</th>
				<th field="state" width="30" align="center">审核状态</th>
				<th field="processInstanceId" width="30" hidden="true"
					align="center">流程实例Id</th>
				<th field="action" width="70" align="center"
					formatter="formatAction">操作</th>
			</tr>
		</thead>
	</table>
	<div id="tb">
		<div>
			<a href="javascript:openLeaveAddDialog()" class="easyui-linkbutton"
				iconCls="icon-add" plain="true">新增请假单</a>
		</div>
	</div>

	<div id="dlg" class="easyui-dialog"
		style="width: 620px; height: 280px; padding: 10px 20px" closed="true" closable="false"
		buttons="#dlg-buttons">

		<form id="fm" method="post">
			<table cellpadding="8px">
				<tr>
					<td>请假类型：</td>
					<td><input id="leaveType" name="leaveType"
						class="easyui-combobox"
						data-options="panelHeight:'auto',valueField:'key',textField:'name',url:'${pageContext.request.contextPath}/leave/getLeaveType.action'"
						value="请选择" /></td>
				</tr>
				<tr>
					<td>请假天数：</td>
					<td><input type="text" id="leaveDays" name="leaveDays"
						class="easyui-numberbox" required="true" /></td>
				</tr>
				<tr>
					<td valign="top">请假原因：</td>
					<td><input type="hidden" name="userId"
						value="${currentMemberShip.userId}" /> <input type="hidden"
						name="state" value="未提交" /> <textarea type="text"
							id="leaveReason" name="leaveReason" rows="5" cols="49"
							class="easyui-validatebox" required="true"></textarea></td>
				</tr>

			</table>
		</form>
	</div>

	<div id="dlg-buttons">
		<a href="javascript:saveLeave()" class="easyui-linkbutton"
			iconCls="icon-ok">保存</a> <a href="javascript:closeLeaveDialog()"
			class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
	</div>

	<div id="dlg2" class="easyui-dialog"
		style="width: 750px; height: 250px; padding: 10px 20px" closed="true">
		<table id="dg2" title="批注列表" class="easyui-datagrid" fitColumns="true"
			url="${pageContext.request.contextPath}/task/listHistoryCommentWithProcessInstanceId.action"
			style="width: 700px; height: 200px;">
			<thead>
				<tr>
					<th field="time" width="120" align="center">批注时间</th>
					<th field="userId" width="100" align="center">批注人</th>
					<th field="message" width="200" align="center">批注信息</th>
				</tr>
			</thead>
		</table>
	</div>


	<div id="dlg3" class="easyui-dialog"
		style="width: 620px; height: 250px; padding: 10px 20px" closed="true" closable="false"
		buttons="#cdlg-buttons">

		<form id="changfm" method="post">
			<table cellpadding="8px">
				<tr>
					<td>请假类型:</td>
					<td><input type="text" id="leaveType" name="leaveType"
						class="easyui-validatebox" required="true" /></td>
					<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
					<td>请假天数:</td>
					<td><input type="text" id="leaveDays" name="leaveDays"
						class="easyui-validatebox" required="true" /></td>
				</tr>
				<tr>
					<td><input id="id" type="hidden" name="id" /><input
						id="processInstanceId" type="hidden" name="processInstanceId" /></td>
				</tr>
				<tr>
					<td valign="top">请假原因：</td>
					<td colspan="4"><textarea id="leaveReason" name="leaveReason"
							rows="2" cols="49" class="easyui-validatebox" required="true"></textarea>
					</td>
				</tr>
			</table>
		</form>
	</div>

	<div id="cdlg-buttons">
		<a href="javascript:checkData()" class="easyui-linkbutton"
			iconCls="icon-ok">保存</a> <a href="javascript:closeChangeDialog()"
			class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
	</div>

	<div id="dlg10" class="easyui-dialog"
		style="width: 900px; height: 400px; padding: 100px 20px" closed="true">
		<img id="simg" src="" alt="流程图片">
	</div>
</body>
</html>