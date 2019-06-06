package com.java.activiti.controller;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.ProcessDefinition;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.java.activiti.model.PageInfo;
import com.java.activiti.util.ResponseUtil;

/**
 * ���̶������
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/processDefinition")
public class ProcessDefinitionController {
		
	@Resource
	private RepositoryService repositoryService;
	
	@Resource
	private HistoryService historyService;
	
	/**
	 * ���̶����ҳ��ѯ
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping("/processDefinitionPage")
	public String processDefinitionPage(String rows,String s_name,String page,HttpServletResponse response) throws Exception{
		if(s_name==null){
			s_name="";
		}
		PageInfo pageInfo=new PageInfo();
		Integer sizePage=Integer.parseInt(rows);
		pageInfo.setPageSize(sizePage);
		if(page==null||page.equals("")){
			page="1";
		}
		pageInfo.setPageIndex((Integer.parseInt(page) - 1)
				* sizePage);
		long count=repositoryService.createProcessDefinitionQuery()
				.processDefinitionNameLike("%"+s_name+"%")
				.count();
		List<ProcessDefinition> processDefinitionList=repositoryService.createProcessDefinitionQuery()
				.orderByDeploymentId().desc()
				.processDefinitionNameLike("%"+s_name+"%")
				.listPage(pageInfo.getPageIndex(), pageInfo.getPageSize());
		JsonConfig jsonConfig=new JsonConfig();
		jsonConfig.setExcludes(new String[]{"identityLinks","processDefinition"});
		JSONObject result=new JSONObject();
		JSONArray jsonArray=JSONArray.fromObject(processDefinitionList,jsonConfig);
		result.put("rows", jsonArray);
		result.put("total", count);
		ResponseUtil.write(response, result);
		return null;
	}
	/**
	 * �鿴����ͼ
	 * @param deploymentId  ����ID
	 * @param diagramResourceName
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/showView")
	public String showView(String deploymentId,String diagramResourceName,HttpServletResponse response)throws Exception{
		InputStream inputStream=repositoryService.getResourceAsStream(deploymentId, diagramResourceName);
		OutputStream out=response.getOutputStream();
		for(int b=-1;(b=inputStream.read())!=-1;){
			out.write(b);
		}
		out.close();
		inputStream.close();
		return null;
	}
	
	
	/**
	 * �鿴����ͼ
	 * @param deploymentId  ����ID
	 * @param diagramResourceName
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/showViewByTaskId")
	public String showViewByTaskId(String taskId,HttpServletResponse response)throws Exception{
		String processDefinitionId =  historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult().getProcessDefinitionId();
		ProcessDefinition processDefinition= repositoryService.createProcessDefinitionQuery().processDefinitionId(processDefinitionId).singleResult();
		InputStream inputStream = repositoryService.getProcessDiagram(processDefinition.getId());
		OutputStream out=response.getOutputStream();
		for(int b=-1;(b=inputStream.read())!=-1;){
			out.write(b);
		}
		out.close();
		inputStream.close();
		return null;
	}
	
	/**
	 * �������̶���
	 * @param processDefinitionId  ����ID
	 * @return
	 */
	@RequestMapping("/actProcessDefinition")
	public String actProcessDefinition(HttpServletResponse response, String deploymentId){
		
			JSONObject result = new JSONObject();
		try {
			repositoryService.activateProcessDefinitionById(repositoryService.createProcessDefinitionQuery().deploymentId(deploymentId).singleResult().getId());
			result.put("success", true);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.put("success", false);
		}
		ResponseUtil.write(response, result);
		return null;
	}
	
	/**
	 * �������̶���
	 * @param processDefinitionId  ���̶���ID
	 * @param diagramResourceName
	 * @return
	 */
	@RequestMapping("/susProcessDefinition")
	public String susProcessDefinition(HttpServletResponse response,String deploymentId){
		JSONObject result = new JSONObject();
		try {
			repositoryService.suspendProcessDefinitionById(repositoryService.createProcessDefinitionQuery().deploymentId(deploymentId).singleResult().getId());
			result.put("success", true);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("success", false);
		}
		ResponseUtil.write(response, result);
		return null;
	}
}
