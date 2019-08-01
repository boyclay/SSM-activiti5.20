package com.java.activiti.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.FlowNode;
import org.activiti.bpmn.model.Process;
import org.activiti.bpmn.model.SequenceFlow;
import org.activiti.bpmn.model.StartEvent;
import org.activiti.bpmn.model.UserTask;
import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.form.TaskFormData;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.impl.AbstractQuery;
import org.activiti.engine.impl.HistoricActivityInstanceQueryProperty;
import org.activiti.engine.impl.RepositoryServiceImpl;
import org.activiti.engine.impl.bpmn.behavior.ExclusiveGatewayActivityBehavior;
import org.activiti.engine.impl.bpmn.behavior.MultiInstanceActivityBehavior;
import org.activiti.engine.impl.bpmn.behavior.ParallelGatewayActivityBehavior;
import org.activiti.engine.impl.identity.Authentication;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.PvmActivity;
import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.delegate.ActivityBehavior;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.impl.pvm.process.ProcessDefinitionImpl;
import org.activiti.engine.impl.pvm.process.TransitionImpl;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.DelegationState;
import org.activiti.engine.task.Task;
import org.activiti.image.ProcessDiagramGenerator;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.java.activiti.convertor.CustomProcessDiagramGenerator;
import com.java.activiti.model.Leave;
import com.java.activiti.model.MemberShip;
import com.java.activiti.model.MyTask;
import com.java.activiti.model.PageInfo;
import com.java.activiti.service.LeaveService;
import com.java.activiti.util.DateJsonValueProcessor;
import com.java.activiti.util.ResponseUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

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
	
	@Resource
	private ApplicationContext applicationContext;//����������ڹ۲���ģʽ

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
	public String listHistoryCommentWithProcessInstanceId(HttpServletResponse response, String processInstanceId)
			throws Exception {
		if (processInstanceId == null) {
			return null;
		}
		List<Comment> commentList = taskService.getProcessInstanceComments(processInstanceId);
		// �ı�˳�򣬰�ԭ˳��ķ���˳�򷵻�list
		Collections.reverse(commentList); // ����Ԫ�ط�ת
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class,
				// ʱ���ʽת��
				new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result = new JSONObject();
		JSONArray jsonArray = JSONArray.fromObject(commentList, jsonConfig);
		result.put("rows", jsonArray);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * �ض�����˴���ҳ��
	 * 
	 * @param taskId
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/redirectPage")
	public String redirectPage(String taskId, HttpServletResponse response) throws Exception {
		TaskFormData formData = formService.getTaskFormData(taskId);
		String url = formData.getFormKey();
		System.out.println("*********************" + url);
		JSONObject result = new JSONObject();
		result.put("url", url);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * �������̷�ҳ��ѯ
	 * 
	 * @param response
	 * @param page
	 *            ��ǰҳ��
	 * @param rows
	 *            ÿҳ��ʾҳ��
	 * @param s_name
	 *            ��������
	 * @param userId
	 *            ����ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/taskPage")
	public String taskPage(HttpServletResponse response, String page, String rows, String s_name, String userId)
			throws Exception {
		if (s_name == null) {
			s_name = "";
		}
		PageInfo pageInfo = new PageInfo();
		Integer pageSize = Integer.parseInt(rows);
		pageInfo.setPageSize(pageSize);
		if (page == null || page.equals("")) {
			page = "1";
		}
		pageInfo.setPageIndex((Integer.parseInt(page) - 1) * pageInfo.getPageSize());
		// ��ȡ�ܼ�¼��
		System.out.println("�û�ID��" + userId + "\n" + "����:" + s_name);
		long total = taskService.createTaskQuery().taskAssignee(userId).taskNameLike("%" + s_name + "%").count(); // ��ȡ�ܼ�¼��
		// ���뷨�Ļ�������ȥ���ݿ�۲� ACT_RU_TASK �ı仯
		List<Task> taskList = taskService.createTaskQuery()
				// �����û�id��ѯ
				.taskAssignee(userId)
				// �����������Ʋ�ѯ
				.taskNameLike("%" + s_name + "%")
				// ���ش���ҳ�Ľ������
				.listPage(pageInfo.getPageIndex(), pageInfo.getPageSize());
		// ������Ҫʹ��һ����������ת��һ����Ҫ��ת��JSON��ʽ
		List<MyTask> MyTaskList = new ArrayList<MyTask>();
		for (Task t : taskList) {
			MyTask myTask = new MyTask();
			myTask.setId(t.getId());
			myTask.setName(t.getName());
			myTask.setCreateTime(t.getCreateTime());
			MyTaskList.add(myTask);
		}
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result = new JSONObject();
		JSONArray jsonArray = JSONArray.fromObject(MyTaskList, jsonConfig);
		result.put("rows", jsonArray);
		result.put("total", total);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * ��ѯ��ǰ����ͼ
	 * 
	 * @return
	 */
	@RequestMapping("/showCurrentView")
	public ModelAndView showCurrentView(HttpServletResponse response, String taskId) {
		// ��ͼ
		ModelAndView mav = new ModelAndView();

		Task task = taskService.createTaskQuery() // ���������ѯ
				.taskId(taskId) // ��������id��ѯ
				.singleResult();
		// ��ȡ���̶���id
		String processDefinitionId = task.getProcessDefinitionId();
		ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery() // �������̶����ѯ
				// �������̶���id��ѯ
				.processDefinitionId(processDefinitionId).singleResult();
		// ����id
		// mav.addObject("deploymentId",processDefinition.getDeploymentId());
		// mav.addObject("diagramResourceName",
		// processDefinition.getDiagramResourceName()); // ͼƬ��Դ�ļ�����

		ProcessDefinitionEntity processDefinitionEntity = (ProcessDefinitionEntity) repositoryService
				.getProcessDefinition(processDefinitionId);
		// ��ȡ����ʵ��id
		String processInstanceId = task.getProcessInstanceId();
		// ��������ʵ��id��ȡ����ʵ��
		ProcessInstance pi = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId)
				.singleResult();

		// ���ݻid��ȡ�ʵ��
		ActivityImpl activityImpl = processDefinitionEntity.findActivity(pi.getActivityId());
		// �����View��ͼ���ص���ʾҳ��
		mav.addObject("x", activityImpl.getX()); // x����
		mav.addObject("y", activityImpl.getY()); // y����
		mav.addObject("width", activityImpl.getWidth()); // ���
		mav.addObject("height", activityImpl.getHeight()); // �߶�
		mav.setViewName("page/currentView");
		InputStream inputStream = repositoryService.getResourceAsStream(processDefinition.getDeploymentId(),
				processDefinition.getDiagramResourceName());
		OutputStream out = null;
		try {
			out = response.getOutputStream();
			for (int b = -1; (b = inputStream.read()) != -1;) {
				out.write(b);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if (inputStream != null) {
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
	 * 
	 * @param response
	 * @param taskId
	 *            ����ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/listHistoryComment")
	public String listHistoryComment(HttpServletResponse response, String taskId) throws Exception {
		if (taskId == null) {
			taskId = "";
		}
		HistoricTaskInstance hti = historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
		JsonConfig jsonConfig = new JsonConfig();
		JSONObject result = new JSONObject();
		List<Comment> commentList = null;
		if (hti != null) {
			commentList = taskService.getProcessInstanceComments(hti.getProcessInstanceId());
			// ����Ԫ�ط�ת
			Collections.reverse(commentList);

			// ���ڸ�ʽת��
			jsonConfig.registerJsonValueProcessor(java.util.Date.class,
					new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		}
		JSONArray jsonArray = JSONArray.fromObject(commentList, jsonConfig);
		result.put("rows", jsonArray);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * ����
	 * 
	 * @param taskId
	 *            ����id
	 * @param leaveDays
	 *            �������
	 * @param comment
	 *            ��ע��Ϣ
	 * @param state
	 *            ���״̬ 1 ͨ�� 2 ����
	 * @param response
	 * @param session
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/audit_bz")
	public String audit_bz(String taskId, Integer leaveDays, String comment, Integer state,
			HttpServletResponse response, HttpSession session) throws Exception {
		/*
		 * ί�ɵ������ܽ��
		 */
		// ���ȸ���ID��ѯ����
		Task task = taskService.createTaskQuery() // ���������ѯ
				.taskId(taskId) // ��������id��ѯ
				.singleResult();
		Map<String, Object> variables = new HashMap<String, Object>();
		// ȡ�ý�ɫ�û������session����
		MemberShip currentMemberShip = (MemberShip) session.getAttribute("currentMemberShip");
		// �������̱���
		variables.put("dasy", leaveDays);
		// ��ȡ����ʵ��id
		String processInstanceId = task.getProcessInstanceId();
		String processDefinitionId = task.getProcessDefinitionId();
		// �����û�id
		Authentication.setAuthenticatedUserId(currentMemberShip.getUser().getFirstName()
				+ currentMemberShip.getUser().getLastName() + "[" + currentMemberShip.getGroup().getName() + "]");
		// �����ע��Ϣ
		taskService.addComment(taskId, processInstanceId, comment);//ͬ��ܾ����Ǿ͸��ݲ�ͬ�����߲�ͬ��֧���� �����ǲ��ص�ǰһ���ڵ�
		if (state == 1) {
			String leaveId = (String) taskService.getVariable(taskId, "leaveId");
			Leave leave = leaveService.findById(leaveId);
			// �������
			taskService.complete(taskId, variables);
			HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery()
					.processInstanceId(task.getProcessInstanceId()).singleResult();
			if (historicProcessInstance.getEndTime() != null) {
				leave.setState("���ͨ��");
				variables.put("msg", "ͨ��");
			} else {
				leave.setState("�����");
				variables.put("msg", "δͨ��");
			}
			// ���������Ϣ
			leaveService.updateLeave(leave);
		} else {
			ProcessDefinitionEntity definition = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
					.getDeployedProcessDefinition(task.getProcessDefinitionId());
			ActivityImpl currActivity = ((ProcessDefinitionImpl) definition).findActivity(task.getTaskDefinitionKey());
			List<PvmTransition> nextTransitionList = currActivity.getIncomingTransitions();// ��ȡ��������
			// �����ǰ��ĳ���
			List<PvmTransition> oriPvmTransitionList = new ArrayList<PvmTransition>();
			List<PvmTransition> pvmTransitionList = currActivity.getOutgoingTransitions();// ��ȡ���뷽��
			for (PvmTransition pvmTransition : pvmTransitionList) {
				oriPvmTransitionList.add(pvmTransition);
			}
			pvmTransitionList.clear();
			List<ActivityImpl> nextActivityImplList = new ArrayList<>();
			// �����³���
			List<TransitionImpl> newTransitions = new ArrayList<TransitionImpl>();
			for (PvmTransition nextTransition : nextTransitionList) {
				PvmActivity nextActivity = nextTransition.getSource();
				ActivityImpl nextActivityImpl = ((ProcessDefinitionImpl) definition).findActivity(nextActivity.getId());
				nextActivityImplList = removeDuplicate(
						getNextActivityImpl(nextActivity, nextActivityImpl, definition, nextActivityImplList));
				for (int i = 0; i < nextActivityImplList.size(); i++) {
					TransitionImpl newTransition = currActivity.createOutgoingTransition();
					newTransition.setDestination(nextActivityImplList.get(i));
					newTransitions.add(newTransition);
				}
			}
			taskService.complete(task.getId());// �����½��ķ�����������û���ж���
			// �ָ�����
			for (TransitionImpl transitionImpl : newTransitions) {
				currActivity.getOutgoingTransitions().remove(transitionImpl);
				transitionImpl.getDestination().getIncomingTransitions().remove(transitionImpl);
			}
			for (PvmTransition pvmTransition : oriPvmTransitionList) {
				pvmTransitionList.add(pvmTransition);
			}
			if(taskService.createTaskQuery().processInstanceId(processInstanceId).singleResult().getTaskDefinitionKey().equals(this.getElementType(processDefinitionId))){
				Leave leave=leaveService.findByProcessInstanceId(processInstanceId);
				leave.setState("�����޸���");
				leaveService.updateLeave(leave);
			}
		}
		JSONObject result = new JSONObject();
		result.put("success", true);
		ResponseUtil.write(response, result);
		return null;
	}

	private List<ActivityImpl> removeDuplicate(List<ActivityImpl> nextActivityImplList) {
		for (int i = 0; i < nextActivityImplList.size() - 1; i++) {
			for (int j = nextActivityImplList.size() - 1; j > i; j--) {
				if (nextActivityImplList.get(j).equals(nextActivityImplList.get(i))) {
					nextActivityImplList.remove(j);
				}
			}
		}
		return nextActivityImplList;
	}

	// ��ȡ�ǻ�ǩ�ڵ�
	public List<ActivityImpl> getNextActivityImpl(PvmActivity nextActivity, ActivityImpl nextActivityImpl,
			ProcessDefinitionEntity definition, List<ActivityImpl> nextActivityImplList) {
		ActivityBehavior activitybehaviour = nextActivityImpl.getActivityBehavior();
		if (activitybehaviour instanceof ExclusiveGatewayActivityBehavior
				|| activitybehaviour instanceof ParallelGatewayActivityBehavior
				|| activitybehaviour instanceof MultiInstanceActivityBehavior) {// �ж��ǲ�������
			for (int i = 0; i < nextActivityImpl.getIncomingTransitions().size(); i++) {
				nextActivity = nextActivityImpl.getIncomingTransitions().get(i).getSource();
				ActivityImpl newNextActivityImpl = ((ProcessDefinitionImpl) definition)
						.findActivity(nextActivity.getId());
				getNextActivityImpl(nextActivity, newNextActivityImpl, definition, nextActivityImplList);
			}
		} else {
			nextActivityImplList.add(nextActivityImpl);
		}
		return nextActivityImplList;
	}

	/**
	 * ��ԃ���������������ʷ���̱� : act_hi_actinst
	 * 
	 * @param response
	 * @param rows
	 * @param page
	 * @param s_name
	 * @param groupId
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/finishedList")
	public String finishedList(HttpServletResponse response, String rows, String page, String s_name, String userId,
			String status) throws Exception {
		// ΪʲôҪ�����أ���Ϊ�����״����н����̨ʱ��
		// s_name�ض��ǵ���null�ģ����ֱ��������д����ѯ����оͻ���� % null %�����ͻᵼ�²�ѯ�������
		if (s_name == null) {
			s_name = "";
		}
		PageInfo pageInfo = new PageInfo();
		Integer pageSize = Integer.parseInt(rows);
		pageInfo.setPageSize(pageSize);
		if (page == null || page.equals("")) {
			page = "1";
		}
		pageInfo.setPageIndex((Integer.parseInt(page) - 1) * pageSize);
		// ����������ʷʵ����ѯ
		List<HistoricTaskInstance> histList;
		long histCount;
		if (status.equals("1")) {
			histList = historyService.createHistoricTaskInstanceQuery().taskAssignee(userId)
					.taskNameLike("%" + s_name + "%").finished()
					.listPage(pageInfo.getPageIndex(), pageInfo.getPageSize());

			histCount = historyService.createHistoricTaskInstanceQuery().taskAssignee(userId)
					.taskNameLike("%" + s_name + "%").finished().count();
		} else {
			histList = historyService.createHistoricTaskInstanceQuery().taskAssignee(userId)
					.taskNameLike("%" + s_name + "%").listPage(pageInfo.getPageIndex(), pageInfo.getPageSize());

			histCount = historyService.createHistoricTaskInstanceQuery().taskAssignee(userId)
					.taskNameLike("%" + s_name + "%").count();
		}

		List<MyTask> taskList = new ArrayList<MyTask>();
		// ����ݳ�û���õ��ֶΣ���ø�ǰ��ҳ�����ɼ���ѹ��
		for (HistoricTaskInstance hti : histList) {
			MyTask myTask = new MyTask();
			myTask.setId(hti.getId());
			myTask.setName(hti.getName());
			myTask.setCreateTime(hti.getCreateTime());
			myTask.setEndTime(hti.getEndTime());
			taskList.add(myTask);
		}
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result = new JSONObject();
		JSONArray jsonArray = JSONArray.fromObject(taskList, jsonConfig);
		result.put("rows", jsonArray);
		result.put("total", histCount);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * ��������id��ѯ����ʵ���ľ���ִ�й���
	 * 
	 * @param taskId
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/listAction")
	public String listAction(String taskId, HttpServletResponse response) throws Exception {
		HistoricTaskInstance hti = historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
		String processInstanceId = hti.getProcessInstanceId(); // ��ȡ����ʵ��id
		List<HistoricActivityInstance> haiList = historyService.createHistoricActivityInstanceQuery()
				.processInstanceId(processInstanceId).list();
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result = new JSONObject();
		JSONArray jsonArray = JSONArray.fromObject(haiList, jsonConfig);
		result.put("rows", jsonArray);
		ResponseUtil.write(response, result);
		return null;
	}
	
	@RequestMapping("/showHisView")
	public String showHisView(String processInstanceId, HttpServletResponse response) throws Exception {
		HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
		String processDefinitionId = historicProcessInstance.getProcessDefinitionId();
		String processKey = repositoryService.createProcessDefinitionQuery().processDefinitionId(processDefinitionId)
				.singleResult().getKey();
		BpmnModel model = repositoryService.getBpmnModel(repositoryService.createProcessDefinitionQuery()
				.processDefinitionId(processDefinitionId).singleResult().getId());
		// �������еĽڵ㲢�ǵ�ǰ��Ծ�Ľڵ�
		List<HistoricActivityInstance> highLightedActivitList = historyService.createHistoricActivityInstanceQuery()
				.processInstanceId(processInstanceId).orderByHistoricActivityInstanceId().asc().list();
		// ��������id����
		List<String> highLightedWorkflows = new ArrayList<String>();
		// ������·id����
		for (HistoricActivityInstance tempActivity : highLightedActivitList) {
			String activityId = tempActivity.getActivityId();
			highLightedWorkflows.add(activityId);
		}
		ProcessDefinitionEntity definitionEntity = (ProcessDefinitionEntity) repositoryService
				.getProcessDefinition(processDefinitionId);

		
		AbstractQuery aq = (AbstractQuery) historyService.createHistoricActivityInstanceQuery()
				.processInstanceId(processInstanceId);
		List<HistoricActivityInstance> historicActivityInstanceList = aq
				.orderBy(new HistoricActivityInstanceQueryProperty("ID_+0")).asc().list();
		// ���Ѿ�ִ�еĽڵ�ID���������ʾ�ڵ㼯��
		List<String> highLightedActivitiIdList = new ArrayList<String>();
		for (HistoricActivityInstance historicActivityInstance : historicActivityInstanceList) {
			highLightedActivitiIdList.add(historicActivityInstance.getActivityId());
		}
		
		// ͨ������ʵ��ID��ȡ����������ִ�еĽڵ�
		List<Execution> runningActivityInstanceList = runtimeService.createExecutionQuery()
				.processInstanceId(processInstanceId).list();
		List<String> runningActivitiIdList = new ArrayList<String>();
		for (Execution execution : runningActivityInstanceList) {
			if (StringUtils.isNotEmpty(execution.getActivityId())) {
				runningActivitiIdList.add(execution.getActivityId());
			}
		}
		ProcessDiagramGenerator processDiagramGenerator = null;
		processDiagramGenerator = new CustomProcessDiagramGenerator();
		// ��ȡ�������������ߣ���Ҫ������ʾ���������ѷ�����ת����id����
		List<String> highLightedFlowIds = getHighLightedFlows(model, historicActivityInstanceList);
		// ʹ��Ĭ�����û������ͼ����������������׷��ͼƬ�ַ���
		InputStream imageStream = ((CustomProcessDiagramGenerator) processDiagramGenerator).generateDiagramCustom(
				model, "png", highLightedActivitiIdList, runningActivitiIdList, highLightedFlowIds,
				processEngineConfiguration.getActivityFontName(), processEngineConfiguration.getLabelFontName(),
				processEngineConfiguration.getActivityFontName(),null, 1.0);
		OutputStream out = response.getOutputStream();
		for (int b = -1; (b = imageStream.read()) != -1;) {
			out.write(b);
		}
		out.close();
		imageStream.close();
		return null;
	}

	@RequestMapping("/showHisCurrentView")
	public String showHisCurrentView(String taskId, HttpServletResponse response) throws Exception {
		HistoricTaskInstance historicTaskInstance = historyService.createHistoricTaskInstanceQuery().taskId(taskId)
				.singleResult();
		String processDefinitionId = historicTaskInstance.getProcessDefinitionId();
		String processInstanceId = historicTaskInstance.getProcessInstanceId();
		String processKey = repositoryService.createProcessDefinitionQuery().processDefinitionId(processDefinitionId)
				.singleResult().getKey();
		BpmnModel model = repositoryService.getBpmnModel(repositoryService.createProcessDefinitionQuery()
				.processDefinitionId(processDefinitionId).singleResult().getId());
		// �������еĽڵ㲢�ǵ�ǰ��Ծ�Ľڵ�
		List<HistoricActivityInstance> highLightedActivitList = historyService.createHistoricActivityInstanceQuery()
				.processInstanceId(processInstanceId).orderByHistoricActivityInstanceId().asc().list();
		// ��������id����
		List<String> highLightedWorkflows = new ArrayList<String>();
		// ������·id����
		for (HistoricActivityInstance tempActivity : highLightedActivitList) {
			String activityId = tempActivity.getActivityId();
			highLightedWorkflows.add(activityId);
		}
		ProcessDefinitionEntity definitionEntity = (ProcessDefinitionEntity) repositoryService
				.getProcessDefinition(processDefinitionId);

		
		AbstractQuery aq = (AbstractQuery) historyService.createHistoricActivityInstanceQuery()
				.processInstanceId(processInstanceId);
		List<HistoricActivityInstance> historicActivityInstanceList = aq
				.orderBy(new HistoricActivityInstanceQueryProperty("ID_+0")).asc().list();
		// ���Ѿ�ִ�еĽڵ�ID���������ʾ�ڵ㼯��
		List<String> highLightedActivitiIdList = new ArrayList<String>();
		for (HistoricActivityInstance historicActivityInstance : historicActivityInstanceList) {
			highLightedActivitiIdList.add(historicActivityInstance.getActivityId());
		}
		
		// ͨ������ʵ��ID��ȡ����������ִ�еĽڵ�
		List<Execution> runningActivityInstanceList = runtimeService.createExecutionQuery()
				.processInstanceId(processInstanceId).list();
		List<String> runningActivitiIdList = new ArrayList<String>();
		for (Execution execution : runningActivityInstanceList) {
			if (StringUtils.isNotEmpty(execution.getActivityId())) {
				runningActivitiIdList.add(execution.getActivityId());
			}
		}
		ProcessDiagramGenerator processDiagramGenerator = null;
		processDiagramGenerator = new CustomProcessDiagramGenerator();
		// ��ȡ�������������ߣ���Ҫ������ʾ���������ѷ�����ת����id����
		List<String> highLightedFlowIds = getHighLightedFlows(model, historicActivityInstanceList);
		// ʹ��Ĭ�����û������ͼ����������������׷��ͼƬ�ַ���
		InputStream imageStream = ((CustomProcessDiagramGenerator) processDiagramGenerator).generateDiagramCustom(
				model, "png", highLightedActivitiIdList, runningActivitiIdList, highLightedFlowIds,
				processEngineConfiguration.getActivityFontName(), processEngineConfiguration.getLabelFontName(),
				processEngineConfiguration.getActivityFontName(),null, 1.0);
		OutputStream out = response.getOutputStream();
		for (int b = -1; (b = imageStream.read()) != -1;) {
			out.write(b);
		}
		out.close();
		imageStream.close();
		return null;
	}
	
	public List<String> getHighLightedFlows(BpmnModel bpmnModel,
			List<HistoricActivityInstance> historicActivityInstanceList) {
		// �������������ߣ���Ҫ������ʾ
		List<String> highLightedFlowIdList = new ArrayList<>();
		// ȫ����ڵ�
		List<FlowNode> allHistoricActivityNodeList = new ArrayList<>();
		// ����ɵ���ʷ��ڵ�
		List<HistoricActivityInstance> finishedActivityInstanceList = new ArrayList<>();

		for (HistoricActivityInstance historicActivityInstance : historicActivityInstanceList) {
			// ��ȡ���̽ڵ�
			FlowNode flowNode = (FlowNode) bpmnModel.getMainProcess()
					.getFlowElement(historicActivityInstance.getActivityId());
			allHistoricActivityNodeList.add(flowNode);
			// ����ʱ�䲻Ϊ�գ���ǰ�ڵ����Ѿ����
			if (historicActivityInstance.getEndTime() != null) {
				finishedActivityInstanceList.add(historicActivityInstance);
			}
		}
		FlowNode currentFlowNode = null;
		FlowNode targetFlowNode = null;
		HistoricActivityInstance currentActivityInstance;
		// ��������ɵĻʵ������ÿ��ʵ����outgoingFlows���ҵ���ִ�е�
		for (int k = 0; k < finishedActivityInstanceList.size(); k++) {
			currentActivityInstance = finishedActivityInstanceList.get(k);
			// ��õ�ǰ���Ӧ�Ľڵ���Ϣ��outgoingFlows��Ϣ
			currentFlowNode = (FlowNode) bpmnModel.getMainProcess()
					.getFlowElement(currentActivityInstance.getActivityId());
			// ��ǰ�ڵ������������
			List<SequenceFlow> outgoingFlowList = currentFlowNode.getOutgoingFlows();

			/**
			 * ����outgoingFlows���ҵ�����ת�� ��������������Ϊ����ת��
			 * 1.��ǰ�ڵ��ǲ������ػ�������أ���ͨ��outgoingFlows�ܹ�����ʷ����ҵ���ȫ���ڵ��Ϊ����ת
			 * 2.��ǰ�ڵ���������������֮��ģ�ͨ��outgoingFlows���ҵ���ʱ���������ת�ڵ���Ϊ��Ч��ת
			 * (��2�������⣬�й����صģ���ֻ���Ʋ��ص������ߣ�ͨ��������һ����������û�и�����ʾ)
			 */
			if ("parallelGateway".equals(currentActivityInstance.getActivityType())
					|| "inclusiveGateway".equals(currentActivityInstance.getActivityType())) {
				// ������ʷ��ڵ㣬�ҵ�ƥ������Ŀ��ڵ��
				for (SequenceFlow outgoingFlow : outgoingFlowList) {
					// ��ȡ��ǰ�ڵ������߶�Ӧ���¼��ڵ�
					targetFlowNode = (FlowNode) bpmnModel.getMainProcess().getFlowElement(outgoingFlow.getTargetRef());
					// ����¼��ڵ������������ʷ�ڵ��У��򽫵�ǰ�ڵ�������߸�����ʾ
					if (allHistoricActivityNodeList.contains(targetFlowNode)) {
						highLightedFlowIdList.add(outgoingFlow.getId());
					}
				}
			} else {
				List<Map<String, Object>> tempMapList = new ArrayList<>();
				// ��ǰ�ڵ�ID
				String currentActivityId = currentActivityInstance.getActivityId();
				int size = historicActivityInstanceList.size();
				boolean ifStartFind = false;
				boolean ifFinded = false;
				HistoricActivityInstance historicActivityInstance;
				for (int i = 0; i < historicActivityInstanceList.size(); i++) {
					historicActivityInstance = historicActivityInstanceList.get(i);
					// logger.info("�ڡ�{}/{}������ʷ�ڵ�-ActivityId=[{}]", i + 1, size,
					// historicActivityInstance.getActivityId());
					// ���ѭ����ʷ�ڵ��е�id���ڵ�ǰ�ڵ�id���ӵ�ǰ��ʷ�ڵ�����Ⱥ�����Ƿ��е�ǰ�ڵ������ߵ��ڵĽڵ�
					// ��ʷ�ڵ�������Ҫ���ڵ����������ʷ�ڵ����ţ���ֹ��������һ���ڵ㾭��������ֻȡ��һ�ε������߸�����ʾ���ڶ��εĲ���ʾ
					if (i >= k && historicActivityInstance.getActivityId().equals(currentActivityId)) {
						// logger.info("��[{}]����ʷ�ڵ�͵�ǰ�ڵ�һ��-ActivityId=[{}]", i +
						// 1, historicActivityInstance
						// .getActivityId());
						ifStartFind = true;
						// ������ǰ�ڵ����������һ���ڵ�
						continue;
					}
					if (ifStartFind) {
						// logger.info("[��ʼ]-ѭ����ǰ�ڵ�-ActivityId=��{}��������������",
						// currentActivityId);

						ifFinded = false;
						for (SequenceFlow sequenceFlow : outgoingFlowList) {
							// �����ǰ�ڵ������߶�Ӧ���¼��ڵ�����������ʷ�ڵ��У�����������߽��и�����ʾ
							// �����⡿
							// logger.info("��ǰ�����ߵ��¼��ڵ�=[{}]",
							// sequenceFlow.getTargetRef());
							if (historicActivityInstance.getActivityId().equals(sequenceFlow.getTargetRef())) {
								// logger.info("��ǰ�ڵ�[{}]�������ʾ��������=[{}]",
								// currentActivityId, sequenceFlow.getId());
								highLightedFlowIdList.add(sequenceFlow.getId());
								// ��ʱĬ���ҵ��뵱ǰ�ڵ��������һ���ڵ㼴�˳�ѭ���������ж���������ʱ��ȫ����������ʾ
								ifFinded = true;
								break;
							}
						}
						// logger.info("[���]-ѭ����ǰ�ڵ�-ActivityId=��{}��������������",
						// currentActivityId);
					}
					if (ifFinded) {
						// ��ʱĬ���ҵ��뵱ǰ�ڵ��������һ���ڵ㼴�˳���ʷ�ڵ�ѭ���������ж���������ʱ��ȫ����������ʾ
						break;
					}
				}
			}
		}
		return highLightedFlowIdList;
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

	/**
	 * ί������
	 * 
	 * @param response
	 * @param processInstanceId
	 *            ����ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/delegateTask")
	public String delegateTask(HttpServletResponse response, String userId, String taskId,String comment,HttpSession session) throws Exception {
		JSONObject result = new JSONObject();
		try {
			String owner = taskService.createTaskQuery().taskId(taskId).singleResult().getOwner();
			if(owner!=null&&!("").equals(owner)){
				if(taskService.createTaskQuery().taskId(taskId).singleResult().getOwner().equals(userId)){
					throw new RuntimeException("ί���˲����Ǵ�����");//�������Ʒ�ֹί�������Լ��Ļ���������ִ�б��� Ҳ���Ը����Լ����뷨���ƴ����������ʾ
				}
			}
			taskService.delegateTask(taskId, userId);//���Զ��ί��  ����ί�ɵ��Լ�����  ��ʱû�д���
			Authentication.setAuthenticatedUserId(((MemberShip) session.getAttribute("currentMemberShip")).getUser().getFirstName()
					+ ((MemberShip) session.getAttribute("currentMemberShip")).getUser().getLastName() + "[" + ((MemberShip) session.getAttribute("currentMemberShip")).getGroup().getName() + "]");
			taskService.addComment(taskId, taskService.createTaskQuery().taskId(taskId).singleResult().getProcessInstanceId(), comment);
			result.put("success", true);
		} catch (Exception e) {
			result.put("success", false);
			e.printStackTrace();
		}
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * ί�����̷�ҳ��ѯ
	 * 
	 * @param response
	 * @param page
	 *            ��ǰҳ��
	 * @param rows
	 *            ÿҳ��ʾҳ��
	 * @param s_name
	 *            ��������
	 * @param userId
	 *            ����ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/delegateTaskPage")
	public String delegateTaskPage(HttpServletResponse response, String page, String rows, String s_name, String userId)
			throws Exception {
		if (s_name == null) {
			s_name = "";
		}
		PageInfo pageInfo = new PageInfo();
		Integer pageSize = Integer.parseInt(rows);
		pageInfo.setPageSize(pageSize);
		if (page == null || page.equals("")) {
			page = "1";
		}
		pageInfo.setPageIndex((Integer.parseInt(page) - 1) * pageInfo.getPageSize());
		// ��ȡ�ܼ�¼��
		System.out.println("�û�ID��" + userId + "\n" + "����:" + s_name);
		long total = taskService.createTaskQuery().taskOwner(userId).deploymentId("PENDING")
				.taskNameLike("%" + s_name + "%").count(); // ��ȡ�ܼ�¼��
		// ���뷨�Ļ�������ȥ���ݿ�۲� ACT_RU_TASK �ı仯
		List<Task> taskList = taskService.createTaskQuery().taskOwner(userId).taskNameLike("%" + s_name + "%")
				.listPage(pageInfo.getPageIndex(), pageInfo.getPageSize());
		List<MyTask> MyTaskList = new ArrayList<MyTask>();
		for (Task t : taskList) {
			MyTask myTask = new MyTask();
			myTask.setId(t.getId());
			myTask.setName(t.getName());
			myTask.setCreateTime(t.getCreateTime());
			myTask.setAssignee(t.getAssignee());
			myTask.setOwner(t.getOwner());
			MyTaskList.add(myTask);
		}
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result = new JSONObject();
		JSONArray jsonArray = JSONArray.fromObject(MyTaskList, jsonConfig);
		result.put("rows", jsonArray);
		result.put("total", total);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * ת������
	 * 
	 * @param response
	 *            ����ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/transferTask")
	public String transferTask(HttpServletResponse response, String userId, String taskId,String comment,HttpSession session) throws Exception {
		JSONObject result = new JSONObject();
		try {
			taskService.setAssignee(taskId, userId);
			Authentication.setAuthenticatedUserId(((MemberShip) session.getAttribute("currentMemberShip")).getUser().getFirstName()
					+ ((MemberShip) session.getAttribute("currentMemberShip")).getUser().getLastName() + "[" + ((MemberShip) session.getAttribute("currentMemberShip")).getGroup().getName() + "]");
			taskService.addComment(taskId, taskService.createTaskQuery().taskId(taskId).singleResult().getProcessInstanceId(), comment);
			result.put("success", true);
		} catch (Exception e) {
			result.put("success", false);
			e.printStackTrace();
		}
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * ָ�����̷�ҳ��ѯ
	 * 
	 * @param response
	 * @param page
	 *            ��ǰҳ��
	 * @param rows
	 *            ÿҳ��ʾҳ��
	 * @param s_name
	 *            ��������
	 * @param userId
	 *            ����ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/assignTaskPage")
	public String assignTaskPage(HttpServletResponse response, String page, String rows, String s_name, String userId)
			throws Exception {
		if (s_name == null) {
			s_name = "";
		}
		PageInfo pageInfo = new PageInfo();
		Integer pageSize = Integer.parseInt(rows);
		pageInfo.setPageSize(pageSize);
		if (page == null || page.equals("")) {
			page = "1";
		}
		pageInfo.setPageIndex((Integer.parseInt(page) - 1) * pageInfo.getPageSize());
		// ��ȡ�ܼ�¼��
		System.out.println("�û�ID��" + userId + "\n" + "����:" + s_name);
		long total = taskService.createTaskQuery().taskAssignee(userId).taskDelegationState(DelegationState.PENDING)
				.taskNameLike("%" + s_name + "%").count(); // ��ȡ�ܼ�¼��
		// ���뷨�Ļ�������ȥ���ݿ�۲� ACT_RU_TASK �ı仯
		List<Task> taskList = taskService.createTaskQuery().taskAssignee(userId)
				.taskDelegationState(DelegationState.PENDING).taskNameLike("%" + s_name + "%")
				.listPage(pageInfo.getPageIndex(), pageInfo.getPageSize());
		List<MyTask> MyTaskList = new ArrayList<MyTask>();
		for (Task t : taskList) {
			MyTask myTask = new MyTask();
			myTask.setId(t.getId());
			myTask.setName(t.getName());
			myTask.setCreateTime(t.getCreateTime());
			myTask.setAssignee(t.getAssignee());
			myTask.setOwner(t.getOwner());
			MyTaskList.add(myTask);
		}
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result = new JSONObject();
		JSONArray jsonArray = JSONArray.fromObject(MyTaskList, jsonConfig);
		result.put("rows", jsonArray);
		result.put("total", total);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * ί���������
	 * 
	 * @param response
	 *            ����ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/resolveTask")
	public String resolveTask(String taskId, Integer leaveDays, String comment, Integer state,
			HttpServletResponse response, HttpSession session) throws Exception {
		// ���ȸ���ID��ѯ����
		Task task = taskService.createTaskQuery() // ���������ѯ
				.taskId(taskId) // ��������id��ѯ
				.singleResult();
		Map<String, Object> variables = new HashMap<String, Object>();
		// ȡ�ý�ɫ�û������session����
		MemberShip currentMemberShip = (MemberShip) session.getAttribute("currentMemberShip");
		// �������̱���
		variables.put("dasy", leaveDays);
		// ��ȡ����ʵ��id
		String processInstanceId = task.getProcessInstanceId();
		// �����û�id
		Authentication.setAuthenticatedUserId(currentMemberShip.getUser().getFirstName()
				+ currentMemberShip.getUser().getLastName() + "[" + currentMemberShip.getGroup().getName() + "]");
		// �����ע��Ϣ
		taskService.addComment(taskId, processInstanceId, comment);
		JSONObject result = new JSONObject();
		try {
			taskService.resolveTask(taskId);
			result.put("success", true);
		} catch (Exception e) {
			result.put("success", false);
			e.printStackTrace();
		}
		ResponseUtil.write(response, result);
		return null;
	}
	
	/**
	 * ��ȡ���е�����ڵ�
	 * 
	 * @param response
	 *            ����ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getAllUserTask")
	public String getAllUserTask(String taskId,HttpServletResponse response) throws Exception {
		// ���ȸ���ID��ѯ����
		Task task = taskService.createTaskQuery() // ���������ѯ
				.taskId(taskId) // ��������id��ѯ
				.singleResult();
		BpmnModel bpmnModel = repositoryService.getBpmnModel(task.getProcessDefinitionId());
		Collection<FlowElement> flowElementList = bpmnModel.getProcesses().get(0).getFlowElements();
		List<UserTask> userTaskList = new ArrayList<>();
		for (FlowElement flowElement : flowElementList) {
			if (flowElement instanceof UserTask) {
				if(!((UserTask)flowElement).getId().equals(task.getTaskDefinitionKey())){//���ؽڵ㲻������Ϊ��ǰ�ڵ� ��������������ڵ� ҵ���߼��Լ�����
					userTaskList.add((UserTask)flowElement);
				}
			}
		}
		JSONArray jsonArray=new JSONArray();
		//��listתΪJSON
		JSONArray rows=JSONArray.fromObject(userTaskList);
		jsonArray.addAll(rows);
		ResponseUtil.write(response, jsonArray);
		return null;
	}
	
	/**
	 * ����ڵ㲵��
	 * 
	 * @param response
	 *            ����ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/anyRebut")
	public String anyRebut(String id,String taskId,String comment,HttpServletResponse response,HttpSession session) throws Exception {
		JSONObject result = new JSONObject();
		try {
			// ���ȸ���ID��ѯ����
			Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
			String processDefinitionId = task.getProcessDefinitionId();
			String processInstanceId = task.getProcessInstanceId();
			ProcessDefinitionEntity definition = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
					.getDeployedProcessDefinition(task.getProcessDefinitionId());
			ActivityImpl currActivity = ((ProcessDefinitionImpl) definition).findActivity(task.getTaskDefinitionKey());
			List<PvmTransition> nextTransitionList = currActivity.getIncomingTransitions();// ��ȡ��������
			// �����ǰ��ĳ���
			List<PvmTransition> oriPvmTransitionList = new ArrayList<PvmTransition>();
			List<PvmTransition> pvmTransitionList = currActivity.getOutgoingTransitions();// ��ȡ���뷽��
			for (PvmTransition pvmTransition : pvmTransitionList) {
				oriPvmTransitionList.add(pvmTransition);
			}
			pvmTransitionList.clear();
			// �����³���
			List<TransitionImpl> newTransitions = new ArrayList<TransitionImpl>();
			for (PvmTransition nextTransition : nextTransitionList) {
				ActivityImpl nextActivityImpl = ((ProcessDefinitionImpl) definition).findActivity(id);
					TransitionImpl newTransition = currActivity.createOutgoingTransition();
					newTransition.setDestination(nextActivityImpl);
					newTransitions.add(newTransition);
			}
			Authentication.setAuthenticatedUserId(((MemberShip) session.getAttribute("currentMemberShip")).getUser().getFirstName()
					+ ((MemberShip) session.getAttribute("currentMemberShip")).getUser().getLastName() + "[" + ((MemberShip) session.getAttribute("currentMemberShip")).getGroup().getName() + "]");
			taskService.addComment(taskId, taskService.createTaskQuery().taskId(taskId).singleResult().getProcessInstanceId(), comment);
			taskService.complete(task.getId());// �����½��ķ�����������û���ж���
			// �ָ�����
			for (TransitionImpl transitionImpl : newTransitions) {
				currActivity.getOutgoingTransitions().remove(transitionImpl);
				transitionImpl.getDestination().getIncomingTransitions().remove(transitionImpl);
			}
			for (PvmTransition pvmTransition : oriPvmTransitionList) {
				pvmTransitionList.add(pvmTransition);
			}
			if(taskService.createTaskQuery().processInstanceId(processInstanceId).singleResult().getTaskDefinitionKey().equals(this.getElementType(processDefinitionId))){
				Leave leave=leaveService.findByProcessInstanceId(processInstanceId);
				leave.setState("�����޸���");
				leaveService.updateLeave(leave);
			}
			result.put("success", true);
		} catch (Exception e1) {
			result.put("success", false);
			e1.printStackTrace();
		}
		ResponseUtil.write(response, result);
		return null;
	}
	
	public String getElementType(String processDefinitionId) {
		BpmnModel bpmnModel = repositoryService.getBpmnModel(processDefinitionId);
		Process process = bpmnModel.getProcesses().get(0);
		Collection<FlowElement> flowElements = process.getFlowElements();
		for (FlowElement flowElement : flowElements) {
			if (flowElement instanceof StartEvent) {
				StartEvent startEvent = (StartEvent) flowElement;
				return startEvent.getOutgoingFlows().get(0).getTargetRef();
			}
		}
		return null;
	}
	
	/**
	 * ǩ�������б�
	 * 
	 * @param response
	 * @param page
	 *            ��ǰҳ��
	 * @param rows
	 *            ÿҳ��ʾҳ��
	 * @param s_name
	 *            ��������
	 * @param userId
	 *            ����ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/claimTaskPage")
	public String claimTaskPage(HttpServletResponse response, String page, String rows, String s_name, String userId)
			throws Exception {
		if (s_name == null) {
			s_name = "";
		}
		PageInfo pageInfo = new PageInfo();
		Integer pageSize = Integer.parseInt(rows);
		pageInfo.setPageSize(pageSize);
		if (page == null || page.equals("")) {
			page = "1";
		}
		pageInfo.setPageIndex((Integer.parseInt(page) - 1) * pageInfo.getPageSize());
		// ��ȡ�ܼ�¼��
		System.out.println("�û�ID��" + userId + "\n" + "����:" + s_name);
		long total = taskService.createTaskQuery().taskCandidateUser(userId)
				.taskNameLike("%" + s_name + "%").count(); // ��ȡ�ܼ�¼�� 
		// ���뷨�Ļ�������ȥ���ݿ�۲� ACT_RU_TASK �ı仯
		List<Task> taskList = taskService.createTaskQuery().taskCandidateUser(userId).taskNameLike("%" + s_name + "%")
				.listPage(pageInfo.getPageIndex(), pageInfo.getPageSize());
		List<MyTask> MyTaskList = new ArrayList<MyTask>();
		for (Task t : taskList) {
			MyTask myTask = new MyTask();
			myTask.setId(t.getId());
			myTask.setName(t.getName());
			myTask.setCreateTime(t.getCreateTime());
			myTask.setAssignee(t.getAssignee());
			myTask.setOwner(t.getOwner());
			MyTaskList.add(myTask);
		}
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result = new JSONObject();
		JSONArray jsonArray = JSONArray.fromObject(MyTaskList, jsonConfig);
		result.put("rows", jsonArray);
		result.put("total", total);
		ResponseUtil.write(response, result);
		return null;
	}
	
	/**
	 * ǩ������
	 * 
	 * @param response
	 * @param userId
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/claimTask")
	public String claimTask(HttpServletResponse response,String taskId,String userId)
			throws Exception {
		JSONObject result = new JSONObject();
		try {
			taskService.claim(taskId, userId);
			result.put("success", true);
		} catch (Exception e) {
			result.put("success", false);
			e.printStackTrace();
		}
		ResponseUtil.write(response, result);
		return null;
	}
	
	/**
	 * ���� �˹��ܿ������Ʋ��� ����ͬ�� ��ʱ�����
	 * 
	 * @param response
	 * @param processInstanceId
	 *            ����ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/recall")
	public String recall(HttpServletResponse response,String processInstanceId){
		JSONObject result = new JSONObject();
		try {
			BpmnModel bpmnModel = repositoryService.getBpmnModel(historyService.createHistoricProcessInstanceQuery()
					.processInstanceId(processInstanceId).singleResult().getProcessDefinitionId());// ��ȡģ��
			Task task = taskService.createTaskQuery().processInstanceId(processInstanceId).orderByTaskId()
					.desc().list().get(0);// ����
			ProcessDefinitionEntity definition = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
					.getDeployedProcessDefinition(task.getProcessDefinitionId());
			ActivityImpl currActivity = ((ProcessDefinitionImpl) definition).findActivity(task.getTaskDefinitionKey());
			List<PvmTransition> nextTransitionList = currActivity.getIncomingTransitions();// ��ȡ��������
			// �����ǰ��ĳ���
			List<PvmTransition> oriPvmTransitionList = new ArrayList<PvmTransition>();
			List<PvmTransition> pvmTransitionList = currActivity.getOutgoingTransitions();// ��ȡ���뷽��
			for (PvmTransition pvmTransition : pvmTransitionList) {
				oriPvmTransitionList.add(pvmTransition);
			}
			pvmTransitionList.clear();
			List<ActivityImpl> nextActivityImplList = new ArrayList<>();
			// �����³���
			List<TransitionImpl> newTransitions = new ArrayList<TransitionImpl>();
			for (PvmTransition nextTransition : nextTransitionList) {
				PvmActivity nextActivity = nextTransition.getSource();
				ActivityImpl nextActivityImpl = ((ProcessDefinitionImpl) definition).findActivity(nextActivity.getId());
				nextActivityImplList = removeDuplicate(
						getNextActivityImpl(nextActivity, nextActivityImpl, definition, nextActivityImplList));
				for (int i = 0; i < nextActivityImplList.size(); i++) {
					TransitionImpl newTransition = currActivity.createOutgoingTransition();
					newTransition.setDestination(nextActivityImplList.get(i));
					newTransitions.add(newTransition);
				}
			}
			taskService.complete(task.getId());// �����½��ķ�����������û���ж���
			// �ָ�����
			for (TransitionImpl transitionImpl : newTransitions) {
				currActivity.getOutgoingTransitions().remove(transitionImpl);
				transitionImpl.getDestination().getIncomingTransitions().remove(transitionImpl);
			}
			for (PvmTransition pvmTransition : oriPvmTransitionList) {
				pvmTransitionList.add(pvmTransition);
			}
			if(taskService.createTaskQuery().processInstanceId(processInstanceId).singleResult().getTaskDefinitionKey().equals(this.getElementType(task.getProcessDefinitionId()))){
				Map<String,Object>varMap = new HashMap<>();
				varMap.put("outcome", "startRecall");
				taskService.complete(task.getId(),varMap);// �����½��ķ�����������û���ж���
			}
			result.put("success", true);
		} catch (Exception e) {
			result.put("success", false);
			e.printStackTrace();
		}
		ResponseUtil.write(response, result);
		return null;
	}
}
