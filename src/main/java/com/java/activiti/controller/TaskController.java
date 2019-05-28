package com.java.activiti.controller;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.FlowNode;
import org.activiti.bpmn.model.SequenceFlow;
import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.form.TaskFormData;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.impl.identity.Authentication;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;
import org.activiti.image.ProcessDiagramGenerator;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.java.activiti.model.Group;
import com.java.activiti.model.Leave;
import com.java.activiti.model.MemberShip;
import com.java.activiti.model.MyTask;
import com.java.activiti.model.PageInfo;
import com.java.activiti.model.User;
import com.java.activiti.service.LeaveService;
import com.java.activiti.util.DateJsonValueProcessor;
import com.java.activiti.util.ResponseUtil;

/**
 * ��ʷ������ע����
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/task")
public class TaskController {

	// ����activiti�Դ���Service�ӿ�
	@Resource
	private TaskService taskService;
	
	@Resource
	private RepositoryService repositoryService;
	
	@Resource
	private RuntimeService runtimeService;
	
	@Resource
	private FormService formService;
	
	@Resource
	private LeaveService leaveService;
	
	@Resource
	private HistoryService historyService;
	
	@Resource
	private ProcessEngineConfiguration processEngineConfiguration;

	
	/**
	 * ��ѯ��ʷ������ע
	 * 
	 * @param response
	 * @param processInstanceId
	 *            ����ID
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping("/listHistoryCommentWithProcessInstanceId")
	public String listHistoryCommentWithProcessInstanceId(
			HttpServletResponse response, String processInstanceId) throws Exception {
		if (processInstanceId == null) {
			return null;
		}
		List<Comment> commentList = taskService
				.getProcessInstanceComments(processInstanceId);
		// �ı�˳�򣬰�ԭ˳��ķ���˳�򷵻�list
		Collections.reverse(commentList); //����Ԫ�ط�ת
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class,
			//ʱ���ʽת��
				new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result = new JSONObject();
		JSONArray jsonArray = JSONArray.fromObject(commentList, jsonConfig);
		result.put("rows", jsonArray);
		ResponseUtil.write(response, result);
		return null;
	}
	
	/**
	 * �ض�����˴���ҳ��
	 * @param taskId
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/redirectPage")
	public String redirectPage(String taskId,HttpServletResponse response)throws Exception{
		TaskFormData formData=formService.getTaskFormData(taskId);
		String url=formData.getFormKey();
		System.out.println("*********************"+url);
		JSONObject result=new JSONObject();
		result.put("url", url);
		ResponseUtil.write(response, result);
		return null;
	}
	

	/**
	 * �������̷�ҳ��ѯ
	 * @param response
	 * @param page ��ǰҳ��
	 * @param rows ÿҳ��ʾҳ��
	 * @param s_name ��������
	 * @param userId ����ID
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping("/taskPage")
	public String taskPage(HttpServletResponse response,String page,String rows,String s_name,String userId) throws Exception{
		if(s_name==null){
			s_name="";
		}
		PageInfo pageInfo=new PageInfo();
		Integer pageSize=Integer.parseInt(rows);
		pageInfo.setPageSize(pageSize);
		if(page==null||page.equals("")){
			page="1";
		}
		pageInfo.setPageIndex((Integer.parseInt(page)-1)*pageInfo.getPageSize());
		// ��ȡ�ܼ�¼��
		System.out.println("�û�ID��"+userId+"\n"+"����:"+s_name);
		long total=taskService.createTaskQuery()
				.taskCandidateGroup(userId)
				.taskNameLike("%"+s_name+"%")
				.count(); // ��ȡ�ܼ�¼��
		//���뷨�Ļ�������ȥ���ݿ�۲�  ACT_RU_TASK �ı仯
		List<Task> taskList=taskService.createTaskQuery()
				 // �����û�id��ѯ
				.taskCandidateGroup(userId)
				// �����������Ʋ�ѯ
				.taskNameLike("%"+s_name+"%") 
				// ���ش���ҳ�Ľ������
				.listPage(pageInfo.getPageIndex(), pageInfo.getPageSize()); 
		//������Ҫʹ��һ����������ת��һ����Ҫ��ת��JSON��ʽ
		List<MyTask> MyTaskList=new ArrayList<MyTask>();
		for(Task t:taskList){
			MyTask myTask=new MyTask();
			myTask.setId(t.getId());
			myTask.setName(t.getName());
			myTask.setCreateTime(t.getCreateTime());
			MyTaskList.add(myTask);
		}
		JsonConfig jsonConfig=new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result=new JSONObject();
		JSONArray jsonArray=JSONArray.fromObject(MyTaskList,jsonConfig);
		result.put("rows", jsonArray);
		result.put("total", total);
		ResponseUtil.write(response, result);
		return null;
	}
	/**
	 * ��ѯ��ǰ����ͼ
	 * @return
	 */
	@RequestMapping("/showCurrentView")
	public ModelAndView showCurrentView(HttpServletResponse response,String taskId){
		//��ͼ
		ModelAndView mav=new ModelAndView();
		
		Task task=taskService.createTaskQuery() // ���������ѯ
				.taskId(taskId) // ��������id��ѯ
				.singleResult(); 
		 // ��ȡ���̶���id
		String processDefinitionId=task.getProcessDefinitionId();
		ProcessDefinition processDefinition=repositoryService.createProcessDefinitionQuery() // �������̶����ѯ
				// �������̶���id��ѯ
				.processDefinitionId(processDefinitionId) 
				.singleResult(); 
		// ����id
//		mav.addObject("deploymentId",processDefinition.getDeploymentId()); 
//		mav.addObject("diagramResourceName", processDefinition.getDiagramResourceName()); // ͼƬ��Դ�ļ�����
		
	    ProcessDefinitionEntity	processDefinitionEntity=(ProcessDefinitionEntity) 
	    		repositoryService.getProcessDefinition(processDefinitionId); 
	    // ��ȡ����ʵ��id
	    String processInstanceId=task.getProcessInstanceId(); 
	    // ��������ʵ��id��ȡ����ʵ��
	    ProcessInstance pi=runtimeService.createProcessInstanceQuery() 
	    		.processInstanceId(processInstanceId)
	    		.singleResult();
	    
	    // ���ݻid��ȡ�ʵ��
	    ActivityImpl activityImpl=processDefinitionEntity.findActivity(pi.getActivityId()); 
	    //�����View��ͼ���ص���ʾҳ��
	    mav.addObject("x", activityImpl.getX()); // x����
	    mav.addObject("y", activityImpl.getY()); // y����
	    mav.addObject("width", activityImpl.getWidth()); // ���
	    mav.addObject("height", activityImpl.getHeight()); // �߶�
		mav.setViewName("page/currentView");
		InputStream inputStream=repositoryService.getResourceAsStream(processDefinition.getDeploymentId(), processDefinition.getDiagramResourceName());
		OutputStream out = null;
		try {
			out = response.getOutputStream();
			for(int b=-1;(b=inputStream.read())!=-1;){
				out.write(b);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally {
			if(out!=null){
				try {
					out.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if(inputStream!=null){
				try {
					inputStream.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return mav;
	}
	/**
	 * ��ѯ��ʷ��ע
	 * @param response
	 * @param taskId ����ID  
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping("/listHistoryComment")
	public String listHistoryComment(HttpServletResponse response,String taskId) throws Exception{
		if(taskId==null){
			taskId="";
		}
		HistoricTaskInstance hti=historyService.createHistoricTaskInstanceQuery()
				.taskId(taskId)
				.singleResult();
		JsonConfig jsonConfig=new JsonConfig();
		JSONObject result=new JSONObject();
		List<Comment> commentList=null;
		if(hti!=null){
		    commentList=taskService.getProcessInstanceComments(hti.getProcessInstanceId()); 
			// ����Ԫ�ط�ת
			Collections.reverse(commentList); 
			
			//���ڸ�ʽת��
			jsonConfig.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		}
		JSONArray jsonArray=JSONArray.fromObject(commentList,jsonConfig);
		result.put("rows", jsonArray);
		ResponseUtil.write(response, result);
		return null;
	}
	
	/**
	 * ����
	 * @param taskId ����id
	 * @param leaveDays �������
	 * @param comment ��ע��Ϣ
	 * @param state ���״̬ 1 ͨ�� 2 ����
	 * @param response
	 * @param session
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/audit_bz")
	public String audit_bz(String taskId,Integer leaveDays,String comment,Integer state,HttpServletResponse response,HttpSession session)throws Exception{
		//���ȸ���ID��ѯ����
		Task task=taskService.createTaskQuery() // ���������ѯ
		        .taskId(taskId) // ��������id��ѯ
		        .singleResult();
		Map<String,Object> variables=new HashMap<String,Object>();
		//ȡ�ý�ɫ�û������session����
		MemberShip currentMemberShip=(MemberShip) session.getAttribute("currentMemberShip");
		//ȡ���û�����ɫ��Ϣ
		User currentUser=currentMemberShip.getUser();
		Group currentGroup=currentMemberShip.getGroup();
		if(currentGroup.getName().equals("�ܲ�")||currentGroup.getName().equals("���ܲ�")){
			if(state==1){
				String leaveId=(String) taskService.getVariable(taskId, "leaveId");
				Leave leave=leaveService.findById(leaveId);
				leave.setState("���ͨ��");
				// ���������Ϣ
				leaveService.updateLeave(leave); 
				variables.put("msg", "ͨ��");
			}else{
				String leaveId=(String) taskService.getVariable(taskId, "leaveId");
				Leave leave=leaveService.findById(leaveId);
				leave.setState("���δͨ��");
				// ���������Ϣ
				leaveService.updateLeave(leave); 
				variables.put("msg", "δͨ��");
			}
		}
		if(state==1){
			variables.put("msg", "ͨ��");
		}else{
			String leaveId=(String) taskService.getVariable(taskId, "leaveId");
			Leave leave=leaveService.findById(leaveId);
			leave.setState("���δͨ��");
			// ���������Ϣ
			leaveService.updateLeave(leave); 
			variables.put("msg", "δͨ��");
		}
		// �������̱���
		variables.put("dasy", leaveDays); 
		 // ��ȡ����ʵ��id
		String processInstanceId=task.getProcessInstanceId();
		// �����û�id
		Authentication.setAuthenticatedUserId(currentUser.getFirstName()+currentUser.getLastName()+"["+currentGroup.getName()+"]"); 
		// �����ע��Ϣ
		taskService.addComment(taskId, processInstanceId, comment); 
		// �������
		taskService.complete(taskId, variables); 
		JSONObject result=new JSONObject();
		result.put("success", true);
		ResponseUtil.write(response, result);
		return null;
	}
	
	/**
	 * ��ԃ���������������ʷ���̱� :  act_hi_actinst
	 * @param response
	 * @param rows
	 * @param page
	 * @param s_name  
	 * @param groupId
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping("/finishedList")
	public String finishedList(HttpServletResponse response,String rows,String page,String s_name,String groupId) throws Exception{
		//ΪʲôҪ�����أ���Ϊ�����״����н����̨ʱ��
		//s_name�ض��ǵ���null�ģ����ֱ��������д����ѯ����оͻ����  % null %�����ͻᵼ�²�ѯ�������
		if(s_name==null){
			s_name="";
		}
		PageInfo pageInfo=new PageInfo();
		Integer pageSize=Integer.parseInt(rows);
		pageInfo.setPageSize(pageSize);
		if(page==null||page.equals("")){
			page="1";
		}
		pageInfo.setPageIndex((Integer.parseInt(page)-1)*pageSize);
											//����������ʷʵ����ѯ
		List<HistoricTaskInstance> histList=historyService.createHistoricTaskInstanceQuery()
				.taskCandidateGroup(groupId)//���ݽ�ɫ���Ʋ�ѯ
				.taskNameLike("%"+s_name+"%")
				.listPage(pageInfo.getPageIndex(), pageInfo.getPageSize());
		
		long histCount=historyService.createHistoricTaskInstanceQuery()
				.taskCandidateGroup(groupId)
				.taskNameLike("%"+s_name+"%")
				.count();
		List<MyTask> taskList=new ArrayList<MyTask>();
		//����ݳ�û���õ��ֶΣ���ø�ǰ��ҳ�����ɼ���ѹ��
		for(HistoricTaskInstance hti:histList){
			MyTask myTask=new MyTask();
			myTask.setId(hti.getId());
			myTask.setName(hti.getName());
			myTask.setCreateTime(hti.getCreateTime());
			myTask.setEndTime(hti.getEndTime());
			taskList.add(myTask);
		}
		JsonConfig jsonConfig=new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result=new JSONObject();
		JSONArray jsonArray=JSONArray.fromObject(taskList,jsonConfig);
		result.put("rows", jsonArray);
		result.put("total",histCount );
		ResponseUtil.write(response, result);
		return null;
	}
	/**
	 * ��������id��ѯ����ʵ���ľ���ִ�й���
	 * @param taskId
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/listAction")
	public String listAction(String taskId,HttpServletResponse response)throws Exception{
		HistoricTaskInstance hti=historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
		String processInstanceId=hti.getProcessInstanceId(); // ��ȡ����ʵ��id
		List<HistoricActivityInstance> haiList=historyService.createHistoricActivityInstanceQuery().processInstanceId(processInstanceId).list();
		JsonConfig jsonConfig=new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result=new JSONObject();
		JSONArray jsonArray=JSONArray.fromObject(haiList,jsonConfig);
		result.put("rows", jsonArray);
		ResponseUtil.write(response, result);
		return null;
	}
	
	@RequestMapping("/showHisCurrentView")
	public String showHisCurrentView(String taskId,HttpServletResponse response)throws Exception{
		HistoricTaskInstance historicTaskInstance = historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
		String processDefinitionId = historicTaskInstance.getProcessDefinitionId();
		String processInstanceId  = historicTaskInstance.getProcessInstanceId();
		String processKey = repositoryService.createProcessDefinitionQuery().processDefinitionId(processDefinitionId)
				.singleResult().getKey();
		BpmnModel model = repositoryService.getBpmnModel(repositoryService.createProcessDefinitionQuery()
				.processDefinitionId(processDefinitionId).singleResult().getId());
		// �������еĽڵ㲢�ǵ�ǰ��Ծ�Ľڵ�
		List<HistoricActivityInstance> highLightedActivitList = historyService.createHistoricActivityInstanceQuery()
				.processInstanceId(processInstanceId).orderByHistoricActivityInstanceId()
				.asc().list();
		// ��������id����
		List<String> highLightedWorkflows = new ArrayList<String>();
		// ������·id����
		for (HistoricActivityInstance tempActivity : highLightedActivitList) {
			String activityId = tempActivity.getActivityId();
			highLightedWorkflows.add(activityId);
		}
		ProcessDefinitionEntity definitionEntity = (ProcessDefinitionEntity) repositoryService
				.getProcessDefinition(processDefinitionId);

		List<String> highLightedFlows = getHighLightedFlows(model, definitionEntity, highLightedActivitList);
		ProcessDiagramGenerator diagramGenerator = processEngineConfiguration.getProcessDiagramGenerator();
		// �������������Ƶ����ߵ����� ����ǰ̨����
		InputStream in = diagramGenerator.generateDiagram(model, "png", highLightedWorkflows, highLightedFlows, processEngineConfiguration.getActivityFontName(), processEngineConfiguration.getLabelFontName(), processEngineConfiguration.getClassLoader(), 1.0);
		OutputStream out=response.getOutputStream();
		for(int b=-1;(b=in.read())!=-1;){
			out.write(b);
		}
		out.close();
		in.close();
		return null;
	}
	
	public List<String> getHighLightedFlows(BpmnModel bpmnModel, ProcessDefinitionEntity processDefinitionEntity,
			List<HistoricActivityInstance> historicActivityInstances) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss"); // 24Сʱ��
		List<String> highFlows = new ArrayList<String>();// ���Ա����������flowId
															// 6.0�汾�޸�
		for (int i = 0; i < historicActivityInstances.size() - 1; i++) {
			// ����ʷ���̽ڵ���б���
			// �õ��ڵ㶨�����ϸ��Ϣ
			FlowNode activityImpl = (FlowNode) bpmnModel.getMainProcess()
					.getFlowElement(historicActivityInstances.get(i).getActivityId());
			List<FlowNode> sameStartTimeNodes = new ArrayList<FlowNode>();// ���Ա��������ʼʱ����ͬ�Ľڵ�
			FlowNode sameActivityImpl1 = null;
			HistoricActivityInstance activityImpl_ = historicActivityInstances.get(i);// ��һ���ڵ�
			HistoricActivityInstance activityImp2_;
			for (int k = i + 1; k <= historicActivityInstances.size() - 1; k++) {
				activityImp2_ = historicActivityInstances.get(k);// ������1���ڵ�

				if (activityImpl_.getActivityType().equals("userTask")
						&& activityImp2_.getActivityType().equals("userTask")
						&& df.format(activityImpl_.getStartTime()).equals(df.format(activityImp2_.getStartTime()))) // ����usertask�������ڵ�������ڵ�Ŀ�ʼʱ����ͬ��˵��������ʵ�ĺ�̽ڵ�
				{

				} else {
					sameActivityImpl1 = (FlowNode) bpmnModel.getMainProcess()
							.getFlowElement(historicActivityInstances.get(k).getActivityId());// �ҵ������ں����һ���ڵ�
					break;
				}
			}
			sameStartTimeNodes.add(sameActivityImpl1); // �������һ���ڵ����ʱ����ͬ�ڵ�ļ�����
			for (int j = i + 1; j < historicActivityInstances.size() - 1; j++) {
				HistoricActivityInstance activityImpl1 = historicActivityInstances.get(j);// ������һ���ڵ�
				HistoricActivityInstance activityImpl2 = historicActivityInstances.get(j + 1);// �����ڶ����ڵ�

				if (df.format(activityImpl1.getStartTime()).equals(df.format(activityImpl2.getStartTime()))) {// �����һ���ڵ�͵ڶ����ڵ㿪ʼʱ����ͬ����
					FlowNode sameActivityImpl2 = (FlowNode) bpmnModel.getMainProcess()
							.getFlowElement(activityImpl2.getActivityId());
					sameStartTimeNodes.add(sameActivityImpl2);
				} else {// �в���ͬ����ѭ��
					break;
				}
			}
			List<SequenceFlow> pvmTransitions = activityImpl.getOutgoingFlows(); // ȡ���ڵ�����г�ȥ����
			for (SequenceFlow pvmTransition : pvmTransitions) {// �����е��߽��б���
				FlowNode pvmActivityImpl = (FlowNode) bpmnModel.getMainProcess()
						.getFlowElement(pvmTransition.getTargetRef());// ���ȡ�����ߵ�Ŀ��ڵ����ʱ����ͬ�Ľڵ��������ߵ�id�����и�����ʾ
				if (sameStartTimeNodes.contains(pvmActivityImpl)) {
					highFlows.add(pvmTransition.getId());
				}
			}
		}
		return highFlows;
	}
}
