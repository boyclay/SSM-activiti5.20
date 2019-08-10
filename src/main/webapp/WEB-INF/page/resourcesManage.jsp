<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>角色管理</title>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/themes/icon.css">
<script type="text/javascript" src="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/jquery.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript">
	function deleteResources(){
		var selectRows=$("#dg").datagrid("getSelections");
		if(selectRows.length==0){
			$.messager.alert("系统提示","请选择要删除的数据！");
			return;
		}
		var strIds=[];
		for(var i=0;i<selectRows.length;i++){
			strIds.push(selectRows[i].id);
		}
		var ids=strIds.join(",");
		$.messager.confirm("系统提示","您确定要删除这<font color=red>"+selectRows.length+"</font>条数据吗?",function(r){
			if(r){
				$.post("${pageContext.request.contextPath}/resources/deleteResources.action",{ids:ids},function(result){
					if(result.success){
						$.messager.alert("系统提示","数据已经成功删除！");
						$("#dg").datagrid("reload");
					}else{
						$.messager.alert("系统提示","数据删除失败，请联系管理员！");
					}
				},"json");
			}
		});
	}
	
	
	function openResourcesAddDiglog(){
		$("#dlg").dialog("open").dialog("setTitle","添加资源信息");
		$("#flag").val(1);
	}
	
	function openResourcesModifyDiglog(){
		var selectRows=$("#dg").datagrid("getSelections");
		if(selectRows.length!=1){
			$.messager.alert("系统提示","请选择一条要编辑的数据！");
			return;
		}
		var row=selectRows[0];
		$("#dlg").dialog("open").dialog("setTitle","编辑资源信息");
		$("#fm").form("load",row);
		$("#flag").val(2);
		$("#name").attr("readonly", true);
	}
	
	
	function checkData(){
		if($("#name").val()==''){
			$.messager.alert("系统系统","请输入角色名！");
			$("#name").focus();
			return;
		}
		var flag=$("#flag").val();
		if(flag==1){
			$.post("${pageContext.request.contextPath}/resources/existResourcesName.do",{resourcesName:$("#name").val()},function(result){
				if(result.exist){
					$.messager.alert("系统系统","该角色名已存在，请更换下！");
					$("#name").focus();
				}else{
					saveResources();
				}
			},"json");
		}else{
			updateResources();
		}
	}
	
	function saveResources(){
		$("#fm").form("submit",{
			url:'${pageContext.request.contextPath}/resources/addResources.action',
			onSubmit:function(){
				return $(this).form("validate");
			},
			success:function(result){
				var result=eval('('+result+')');
				if(result.success){
					$.messager.alert("系统系统","保存成功！");
					resetValue();
					$("#dlg").dialog("close");
					$("#dg").datagrid("reload");
				}else{
					$.messager.alert("系统系统","保存失败！");
					return;
				}
			}
		});
	}
	
	function updateResources(){
		$("#fm").form("submit",{
			url:'${pageContext.request.contextPath}/resources/updateResources.action',
			onSubmit:function(){
				return $(this).form("validate");
			},
			success:function(result){
				var result=eval('('+result+')');
				if(result.success){
					$.messager.alert("系统系统","更新成功！");
					resetValue();
					$("#dlg").dialog("close");
					$("#dg").datagrid("reload");
				}else{
					$.messager.alert("系统系统","保存失败！");
					return;
				}
			}
		});
	}
	
	function resetValue(){
		$("#resurl").val("");
		$("#name").val("");
		$("#type").val("");
		$("#parentId").val("");
		$("#sort").val("");
	}
	
	function closeResourcesDialog(){
		$("#dlg").dialog("close");
		resetValue();
	}
	
	function formatType(val, row) {
		if (val == 0) {
			return "其他";
		} else if(val == 1){
			return "菜单";
		}else{
			return "按钮";
		}
	}

</script>
</head>
<body style="margin: 1px">
<table id="dg" title="角色管理" class="easyui-datagrid"
  fitColumns="true" pagination="true" rownumbers="true"
  url="${pageContext.request.contextPath}/resources/resourcesPage.action" fit="true" toolbar="#tb">
 <thead>
 	<tr>
 		<th field="cb" checkbox="true" align="center"></th>
 		<th field="id" width="80" align="center">资源ID</th>
 		<th field="name" width="80" align="center">资源名</th>
 		<th field="resurl" width="80" align="center">资源地址</th>
 		<th field="parentId" width="80" align="center">资源父ID</th>
 		<th field="type" width="80" align="center" formatter="formatType">资源类型</th>
 		<th field="sort" width="80" align="center">资源顺序</th>
 	</tr>
 </thead>
</table>
<div id="tb">
 <div>
 <shiro:hasPermission name="/resourcesManage/add">
	<a href="javascript:openResourcesAddDiglog()" class="easyui-linkbutton" iconCls="icon-add" plain="true">添加</a>
	</shiro:hasPermission>
	
	<shiro:hasPermission name="/resourcesManage/update">
	<a href="javascript:openResourcesModifyDiglog()" class="easyui-linkbutton" iconCls="icon-edit" plain="true">修改</a>
	</shiro:hasPermission>
	<shiro:hasPermission name="/resourcesManage/delete">
	<a href="javascript:deleteResources()" class="easyui-linkbutton" iconCls="icon-remove" plain="true">删除</a>
	</shiro:hasPermission>
 </div>
</div>

<div id="dlg" class="easyui-dialog" style="width: 1000px;height: 300px;padding: 10px 20px" closed="true"  closable="false" buttons="#dlg-buttons">
 
 	<form id="fm" method="post">
 		<table cellpadding="8px">
 			<tr>
 				<td>资源名：</td>
 				<td>
 					<input type="text" id="name" name="name" class="easyui-validatebox" required="true"/>
 				</td>
 				<td>资源地址：</td>
 				<td>
 					<input type="text" id="resurl" name="resurl" class="easyui-validatebox" required="true"/>
 				</td>
 			</tr><tr>
 				<td>资源父ID：</td>
 				<td>
 					<input type="text" id="parentId" name="parentId" class="easyui-validatebox" required="true"/>
 				</td>
 				<td>资源类型：</td>
 				<td>
				<input id="type" name="type" class="easyui-combobox" data-options=" valueField:'CODEVALUE', textField:'CODENAME', data: [{CODENAME: '其他',CODEVALUE: '0',selected:true},{CODENAME: '菜单',CODEVALUE: '1'},{CODENAME: '按钮',CODEVALUE: '2'}]" style="width:162px;" />
 				</td>
 				<td>资源顺序：</td>
 				<td>
 					<input type="text" id="sort" name="sort" class="easyui-validatebox" required="true"/>
 					<input type="hidden" id="flag" name="flag"/>
 				</td>
 			</tr>
 		</table>
 	</form>
 
</div>

<div id="dlg-buttons">
	<a href="javascript:checkData()" class="easyui-linkbutton" iconCls="icon-ok">保存</a>
	<a href="javascript:closeResourcesDialog()" class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
</div>
</body>
</html>