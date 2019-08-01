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
 * 历史流程批注管理
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/task")
public class TaskController {

	// 引入activiti自带的Service接口
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
	private ApplicationContext applicationContext;//这个可以用于观察者模式

	/**
	 * 查询历史流程批注
	 * 
	 * @param response
	 * @param processInstanceId
	 *            流程ID
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
		// 改变顺序，按原顺序的反向顺序返回list
		Collections.reverse(commentList); // 集合元素反转
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class,
				// 时间格式转换
				new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result = new JSONObject();
		JSONArray jsonArray = JSONArray.fromObject(commentList, jsonConfig);
		result.put("rows", jsonArray);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * 重定向审核处理页面
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
	 * 待办流程分页查询
	 * 
	 * @param response
	 * @param page
	 *            当前页数
	 * @param rows
	 *            每页显示页数
	 * @param s_name
	 *            流程名称
	 * @param userId
	 *            流程ID
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
		// 获取总记录数
		System.out.println("用户ID：" + userId + "\n" + "名称:" + s_name);
		long total = taskService.createTaskQuery().taskAssignee(userId).taskNameLike("%" + s_name + "%").count(); // 获取总记录数
		// 有想法的话，可以去数据库观察 ACT_RU_TASK 的变化
		List<Task> taskList = taskService.createTaskQuery()
				// 根据用户id查询
				.taskAssignee(userId)
				// 根据任务名称查询
				.taskNameLike("%" + s_name + "%")
				// 返回带分页的结果集合
				.listPage(pageInfo.getPageIndex(), pageInfo.getPageSize());
		// 这里需要使用一个工具类来转换一下主要是转成JSON格式
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
	 * 查询当前流程图
	 * 
	 * @return
	 */
	@RequestMapping("/showCurrentView")
	public ModelAndView showCurrentView(HttpServletResponse response, String taskId) {
		// 视图
		ModelAndView mav = new ModelAndView();

		Task task = taskService.createTaskQuery() // 创建任务查询
				.taskId(taskId) // 根据任务id查询
				.singleResult();
		// 获取流程定义id
		String processDefinitionId = task.getProcessDefinitionId();
		ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery() // 创建流程定义查询
				// 根据流程定义id查询
				.processDefinitionId(processDefinitionId).singleResult();
		// 部署id
		// mav.addObject("deploymentId",processDefinition.getDeploymentId());
		// mav.addObject("diagramResourceName",
		// processDefinition.getDiagramResourceName()); // 图片资源文件名称

		ProcessDefinitionEntity processDefinitionEntity = (ProcessDefinitionEntity) repositoryService
				.getProcessDefinition(processDefinitionId);
		// 获取流程实例id
		String processInstanceId = task.getProcessInstanceId();
		// 根据流程实例id获取流程实例
		ProcessInstance pi = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId)
				.singleResult();

		// 根据活动id获取活动实例
		ActivityImpl activityImpl = processDefinitionEntity.findActivity(pi.getActivityId());
		// 整理好View视图返回到显示页面
		mav.addObject("x", activityImpl.getX()); // x坐标
		mav.addObject("y", activityImpl.getY()); // y坐标
		mav.addObject("width", activityImpl.getWidth()); // 宽度
		mav.addObject("height", activityImpl.getHeight()); // 高度
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
	 * 查询历史批注
	 * 
	 * @param response
	 * @param taskId
	 *            流程ID
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
			// 集合元素反转
			Collections.reverse(commentList);

			// 日期格式转换
			jsonConfig.registerJsonValueProcessor(java.util.Date.class,
					new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		}
		JSONArray jsonArray = JSONArray.fromObject(commentList, jsonConfig);
		result.put("rows", jsonArray);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * 审批
	 * 
	 * @param taskId
	 *            任务id
	 * @param leaveDays
	 *            请假天数
	 * @param comment
	 *            批注信息
	 * @param state
	 *            审核状态 1 通过 2 驳回
	 * @param response
	 * @param session
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/audit_bz")
	public String audit_bz(String taskId, Integer leaveDays, String comment, Integer state,
			HttpServletResponse response, HttpSession session) throws Exception {
		/*
		 * 委派的任务不能解决
		 */
		// 首先根据ID查询任务
		Task task = taskService.createTaskQuery() // 创建任务查询
				.taskId(taskId) // 根据任务id查询
				.singleResult();
		Map<String, Object> variables = new HashMap<String, Object>();
		// 取得角色用户登入的session对象
		MemberShip currentMemberShip = (MemberShip) session.getAttribute("currentMemberShip");
		// 设置流程变量
		variables.put("dasy", leaveDays);
		// 获取流程实例id
		String processInstanceId = task.getProcessInstanceId();
		String processDefinitionId = task.getProcessDefinitionId();
		// 设置用户id
		Authentication.setAuthenticatedUserId(currentMemberShip.getUser().getFirstName()
				+ currentMemberShip.getUser().getLastName() + "[" + currentMemberShip.getGroup().getName() + "]");
		// 添加批注信息
		taskService.addComment(taskId, processInstanceId, comment);//同意拒绝都是就根据不同条件走不同分支而已 驳回是驳回到前一个节点
		if (state == 1) {
			String leaveId = (String) taskService.getVariable(taskId, "leaveId");
			Leave leave = leaveService.findById(leaveId);
			// 完成任务
			taskService.complete(taskId, variables);
			HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery()
					.processInstanceId(task.getProcessInstanceId()).singleResult();
			if (historicProcessInstance.getEndTime() != null) {
				leave.setState("审核通过");
				variables.put("msg", "通过");
			} else {
				leave.setState("审核中");
				variables.put("msg", "未通过");
			}
			// 更新审核信息
			leaveService.updateLeave(leave);
		} else {
			ProcessDefinitionEntity definition = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
					.getDeployedProcessDefinition(task.getProcessDefinitionId());
			ActivityImpl currActivity = ((ProcessDefinitionImpl) definition).findActivity(task.getTaskDefinitionKey());
			List<PvmTransition> nextTransitionList = currActivity.getIncomingTransitions();// 获取流出方向
			// 清除当前活动的出口
			List<PvmTransition> oriPvmTransitionList = new ArrayList<PvmTransition>();
			List<PvmTransition> pvmTransitionList = currActivity.getOutgoingTransitions();// 获取流入方向
			for (PvmTransition pvmTransition : pvmTransitionList) {
				oriPvmTransitionList.add(pvmTransition);
			}
			pvmTransitionList.clear();
			List<ActivityImpl> nextActivityImplList = new ArrayList<>();
			// 建立新出口
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
			taskService.complete(task.getId());// 驳回新建的方向连接线是没有判定的
			// 恢复方向
			for (TransitionImpl transitionImpl : newTransitions) {
				currActivity.getOutgoingTransitions().remove(transitionImpl);
				transitionImpl.getDestination().getIncomingTransitions().remove(transitionImpl);
			}
			for (PvmTransition pvmTransition : oriPvmTransitionList) {
				pvmTransitionList.add(pvmTransition);
			}
			if(taskService.createTaskQuery().processInstanceId(processInstanceId).singleResult().getTaskDefinitionKey().equals(this.getElementType(processDefinitionId))){
				Leave leave=leaveService.findByProcessInstanceId(processInstanceId);
				leave.setState("驳回修改中");
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

	// 获取非会签节点
	public List<ActivityImpl> getNextActivityImpl(PvmActivity nextActivity, ActivityImpl nextActivityImpl,
			ProcessDefinitionEntity definition, List<ActivityImpl> nextActivityImplList) {
		ActivityBehavior activitybehaviour = nextActivityImpl.getActivityBehavior();
		if (activitybehaviour instanceof ExclusiveGatewayActivityBehavior
				|| activitybehaviour instanceof ParallelGatewayActivityBehavior
				|| activitybehaviour instanceof MultiInstanceActivityBehavior) {// 判断是不是网关
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
	 * 查詢流程正常走完的历史流程表 : act_hi_actinst
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
		// 为什么要这样呢？因为程序首次运行进入后台时，
		// s_name必定是等于null的，如果直接这样填写进查询语句中就会出现 % null %这样就会导致查询结果有误
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
		// 创建流程历史实例查询
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
		// 这里递出没有用的字段，免得给前端页面做成加载压力
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
	 * 根据任务id查询流程实例的具体执行过程
	 * 
	 * @param taskId
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/listAction")
	public String listAction(String taskId, HttpServletResponse response) throws Exception {
		HistoricTaskInstance hti = historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
		String processInstanceId = hti.getProcessInstanceId(); // 获取流程实例id
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
		// 控制所有的节点并非当前活跃的节点
		List<HistoricActivityInstance> highLightedActivitList = historyService.createHistoricActivityInstanceQuery()
				.processInstanceId(processInstanceId).orderByHistoricActivityInstanceId().asc().list();
		// 高亮环节id集合
		List<String> highLightedWorkflows = new ArrayList<String>();
		// 高亮线路id集合
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
		// 将已经执行的节点ID放入高亮显示节点集合
		List<String> highLightedActivitiIdList = new ArrayList<String>();
		for (HistoricActivityInstance historicActivityInstance : historicActivityInstanceList) {
			highLightedActivitiIdList.add(historicActivityInstance.getActivityId());
		}
		
		// 通过流程实例ID获取流程中正在执行的节点
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
		// 获取已流经的流程线，需要高亮显示高亮流程已发生流转的线id集合
		List<String> highLightedFlowIds = getHighLightedFlows(model, historicActivityInstanceList);
		// 使用默认配置获得流程图表生成器，并生成追踪图片字符流
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
		// 控制所有的节点并非当前活跃的节点
		List<HistoricActivityInstance> highLightedActivitList = historyService.createHistoricActivityInstanceQuery()
				.processInstanceId(processInstanceId).orderByHistoricActivityInstanceId().asc().list();
		// 高亮环节id集合
		List<String> highLightedWorkflows = new ArrayList<String>();
		// 高亮线路id集合
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
		// 将已经执行的节点ID放入高亮显示节点集合
		List<String> highLightedActivitiIdList = new ArrayList<String>();
		for (HistoricActivityInstance historicActivityInstance : historicActivityInstanceList) {
			highLightedActivitiIdList.add(historicActivityInstance.getActivityId());
		}
		
		// 通过流程实例ID获取流程中正在执行的节点
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
		// 获取已流经的流程线，需要高亮显示高亮流程已发生流转的线id集合
		List<String> highLightedFlowIds = getHighLightedFlows(model, historicActivityInstanceList);
		// 使用默认配置获得流程图表生成器，并生成追踪图片字符流
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
		// 已流经的流程线，需要高亮显示
		List<String> highLightedFlowIdList = new ArrayList<>();
		// 全部活动节点
		List<FlowNode> allHistoricActivityNodeList = new ArrayList<>();
		// 已完成的历史活动节点
		List<HistoricActivityInstance> finishedActivityInstanceList = new ArrayList<>();

		for (HistoricActivityInstance historicActivityInstance : historicActivityInstanceList) {
			// 获取流程节点
			FlowNode flowNode = (FlowNode) bpmnModel.getMainProcess()
					.getFlowElement(historicActivityInstance.getActivityId());
			allHistoricActivityNodeList.add(flowNode);
			// 结束时间不为空，当前节点则已经完成
			if (historicActivityInstance.getEndTime() != null) {
				finishedActivityInstanceList.add(historicActivityInstance);
			}
		}
		FlowNode currentFlowNode = null;
		FlowNode targetFlowNode = null;
		HistoricActivityInstance currentActivityInstance;
		// 遍历已完成的活动实例，从每个实例的outgoingFlows中找到已执行的
		for (int k = 0; k < finishedActivityInstanceList.size(); k++) {
			currentActivityInstance = finishedActivityInstanceList.get(k);
			// 获得当前活动对应的节点信息及outgoingFlows信息
			currentFlowNode = (FlowNode) bpmnModel.getMainProcess()
					.getFlowElement(currentActivityInstance.getActivityId());
			// 当前节点的所有流出线
			List<SequenceFlow> outgoingFlowList = currentFlowNode.getOutgoingFlows();

			/**
			 * 遍历outgoingFlows并找到已流转的 满足如下条件认为已流转：
			 * 1.当前节点是并行网关或兼容网关，则通过outgoingFlows能够在历史活动中找到的全部节点均为已流转
			 * 2.当前节点是以上两种类型之外的，通过outgoingFlows查找到的时间最早的流转节点视为有效流转
			 * (第2点有问题，有过驳回的，会只绘制驳回的流程线，通过走向下一级的流程线没有高亮显示)
			 */
			if ("parallelGateway".equals(currentActivityInstance.getActivityType())
					|| "inclusiveGateway".equals(currentActivityInstance.getActivityType())) {
				// 遍历历史活动节点，找到匹配流程目标节点的
				for (SequenceFlow outgoingFlow : outgoingFlowList) {
					// 获取当前节点流程线对应的下级节点
					targetFlowNode = (FlowNode) bpmnModel.getMainProcess().getFlowElement(outgoingFlow.getTargetRef());
					// 如果下级节点包含在所有历史节点中，则将当前节点的流出线高亮显示
					if (allHistoricActivityNodeList.contains(targetFlowNode)) {
						highLightedFlowIdList.add(outgoingFlow.getId());
					}
				}
			} else {
				List<Map<String, Object>> tempMapList = new ArrayList<>();
				// 当前节点ID
				String currentActivityId = currentActivityInstance.getActivityId();
				int size = historicActivityInstanceList.size();
				boolean ifStartFind = false;
				boolean ifFinded = false;
				HistoricActivityInstance historicActivityInstance;
				for (int i = 0; i < historicActivityInstanceList.size(); i++) {
					historicActivityInstance = historicActivityInstanceList.get(i);
					// logger.info("第【{}/{}】个历史节点-ActivityId=[{}]", i + 1, size,
					// historicActivityInstance.getActivityId());
					// 如果循环历史节点中的id等于当前节点id，从当前历史节点继续先后查找是否有当前节点流程线等于的节点
					// 历史节点的序号需要大于等于已完成历史节点的序号，防止驳回重审一个节点经过两次是只取第一次的流出线高亮显示，第二次的不显示
					if (i >= k && historicActivityInstance.getActivityId().equals(currentActivityId)) {
						// logger.info("第[{}]个历史节点和当前节点一致-ActivityId=[{}]", i +
						// 1, historicActivityInstance
						// .getActivityId());
						ifStartFind = true;
						// 跳过当前节点继续查找下一个节点
						continue;
					}
					if (ifStartFind) {
						// logger.info("[开始]-循环当前节点-ActivityId=【{}】的所有流出线",
						// currentActivityId);

						ifFinded = false;
						for (SequenceFlow sequenceFlow : outgoingFlowList) {
							// 如果当前节点流程线对应的下级节点在其后面的历史节点中，则该条流程线进行高亮显示
							// 【问题】
							// logger.info("当前流出线的下级节点=[{}]",
							// sequenceFlow.getTargetRef());
							if (historicActivityInstance.getActivityId().equals(sequenceFlow.getTargetRef())) {
								// logger.info("当前节点[{}]需高亮显示的流出线=[{}]",
								// currentActivityId, sequenceFlow.getId());
								highLightedFlowIdList.add(sequenceFlow.getId());
								// 暂时默认找到离当前节点最近的下一级节点即退出循环，否则有多条流出线时将全部被高亮显示
								ifFinded = true;
								break;
							}
						}
						// logger.info("[完成]-循环当前节点-ActivityId=【{}】的所有流出线",
						// currentActivityId);
					}
					if (ifFinded) {
						// 暂时默认找到离当前节点最近的下一级节点即退出历史节点循环，否则有多条流出线时将全部被高亮显示
						break;
					}
				}
			}
		}
		return highLightedFlowIdList;
	}
	

	public List<String> getHighLightedFlows(BpmnModel bpmnModel, ProcessDefinitionEntity processDefinitionEntity,
			List<HistoricActivityInstance> historicActivityInstances) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss"); // 24小时制
		List<String> highFlows = new ArrayList<String>();// 用以保存高亮的线flowId
															// 6.0版本修改
		for (int i = 0; i < historicActivityInstances.size() - 1; i++) {
			// 对历史流程节点进行遍历
			// 得到节点定义的详细信息
			FlowNode activityImpl = (FlowNode) bpmnModel.getMainProcess()
					.getFlowElement(historicActivityInstances.get(i).getActivityId());
			List<FlowNode> sameStartTimeNodes = new ArrayList<FlowNode>();// 用以保存后续开始时间相同的节点
			FlowNode sameActivityImpl1 = null;
			HistoricActivityInstance activityImpl_ = historicActivityInstances.get(i);// 第一个节点
			HistoricActivityInstance activityImp2_;
			for (int k = i + 1; k <= historicActivityInstances.size() - 1; k++) {
				activityImp2_ = historicActivityInstances.get(k);// 后续第1个节点

				if (activityImpl_.getActivityType().equals("userTask")
						&& activityImp2_.getActivityType().equals("userTask")
						&& df.format(activityImpl_.getStartTime()).equals(df.format(activityImp2_.getStartTime()))) // 都是usertask，且主节点与后续节点的开始时间相同，说明不是真实的后继节点
				{

				} else {
					sameActivityImpl1 = (FlowNode) bpmnModel.getMainProcess()
							.getFlowElement(historicActivityInstances.get(k).getActivityId());// 找到紧跟在后面的一个节点
					break;
				}
			}
			sameStartTimeNodes.add(sameActivityImpl1); // 将后面第一个节点放在时间相同节点的集合里
			for (int j = i + 1; j < historicActivityInstances.size() - 1; j++) {
				HistoricActivityInstance activityImpl1 = historicActivityInstances.get(j);// 后续第一个节点
				HistoricActivityInstance activityImpl2 = historicActivityInstances.get(j + 1);// 后续第二个节点

				if (df.format(activityImpl1.getStartTime()).equals(df.format(activityImpl2.getStartTime()))) {// 如果第一个节点和第二个节点开始时间相同保存
					FlowNode sameActivityImpl2 = (FlowNode) bpmnModel.getMainProcess()
							.getFlowElement(activityImpl2.getActivityId());
					sameStartTimeNodes.add(sameActivityImpl2);
				} else {// 有不相同跳出循环
					break;
				}
			}
			List<SequenceFlow> pvmTransitions = activityImpl.getOutgoingFlows(); // 取出节点的所有出去的线
			for (SequenceFlow pvmTransition : pvmTransitions) {// 对所有的线进行遍历
				FlowNode pvmActivityImpl = (FlowNode) bpmnModel.getMainProcess()
						.getFlowElement(pvmTransition.getTargetRef());// 如果取出的线的目标节点存在时间相同的节点里，保存该线的id，进行高亮显示
				if (sameStartTimeNodes.contains(pvmActivityImpl)) {
					highFlows.add(pvmTransition.getId());
				}
			}
		}
		return highFlows;
	}

	/**
	 * 委派任务
	 * 
	 * @param response
	 * @param processInstanceId
	 *            流程ID
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
					throw new RuntimeException("委派人不能是代理人");//这样控制防止委派人是自己的话代办任务执行报错 也可以根据自己的想法控制代办任务的显示
				}
			}
			taskService.delegateTask(taskId, userId);//可以多次委派  避免委派的自己身上  暂时没有处理
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
	 * 委派流程分页查询
	 * 
	 * @param response
	 * @param page
	 *            当前页数
	 * @param rows
	 *            每页显示页数
	 * @param s_name
	 *            流程名称
	 * @param userId
	 *            流程ID
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
		// 获取总记录数
		System.out.println("用户ID：" + userId + "\n" + "名称:" + s_name);
		long total = taskService.createTaskQuery().taskOwner(userId).deploymentId("PENDING")
				.taskNameLike("%" + s_name + "%").count(); // 获取总记录数
		// 有想法的话，可以去数据库观察 ACT_RU_TASK 的变化
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
	 * 转办任务
	 * 
	 * @param response
	 *            流程ID
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
	 * 指派流程分页查询
	 * 
	 * @param response
	 * @param page
	 *            当前页数
	 * @param rows
	 *            每页显示页数
	 * @param s_name
	 *            流程名称
	 * @param userId
	 *            流程ID
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
		// 获取总记录数
		System.out.println("用户ID：" + userId + "\n" + "名称:" + s_name);
		long total = taskService.createTaskQuery().taskAssignee(userId).taskDelegationState(DelegationState.PENDING)
				.taskNameLike("%" + s_name + "%").count(); // 获取总记录数
		// 有想法的话，可以去数据库观察 ACT_RU_TASK 的变化
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
	 * 委派任务完成
	 * 
	 * @param response
	 *            流程ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/resolveTask")
	public String resolveTask(String taskId, Integer leaveDays, String comment, Integer state,
			HttpServletResponse response, HttpSession session) throws Exception {
		// 首先根据ID查询任务
		Task task = taskService.createTaskQuery() // 创建任务查询
				.taskId(taskId) // 根据任务id查询
				.singleResult();
		Map<String, Object> variables = new HashMap<String, Object>();
		// 取得角色用户登入的session对象
		MemberShip currentMemberShip = (MemberShip) session.getAttribute("currentMemberShip");
		// 设置流程变量
		variables.put("dasy", leaveDays);
		// 获取流程实例id
		String processInstanceId = task.getProcessInstanceId();
		// 设置用户id
		Authentication.setAuthenticatedUserId(currentMemberShip.getUser().getFirstName()
				+ currentMemberShip.getUser().getLastName() + "[" + currentMemberShip.getGroup().getName() + "]");
		// 添加批注信息
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
	 * 获取所有的任务节点
	 * 
	 * @param response
	 *            流程ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getAllUserTask")
	public String getAllUserTask(String taskId,HttpServletResponse response) throws Exception {
		// 首先根据ID查询任务
		Task task = taskService.createTaskQuery() // 创建任务查询
				.taskId(taskId) // 根据任务id查询
				.singleResult();
		BpmnModel bpmnModel = repositoryService.getBpmnModel(task.getProcessDefinitionId());
		Collection<FlowElement> flowElementList = bpmnModel.getProcesses().get(0).getFlowElements();
		List<UserTask> userTaskList = new ArrayList<>();
		for (FlowElement flowElement : flowElementList) {
			if (flowElement instanceof UserTask) {
				if(!((UserTask)flowElement).getId().equals(task.getTaskDefinitionKey())){//驳回节点不能设置为当前节点 可以是其他任意节点 业务逻辑自己控制
					userTaskList.add((UserTask)flowElement);
				}
			}
		}
		JSONArray jsonArray=new JSONArray();
		//将list转为JSON
		JSONArray rows=JSONArray.fromObject(userTaskList);
		jsonArray.addAll(rows);
		ResponseUtil.write(response, jsonArray);
		return null;
	}
	
	/**
	 * 任意节点驳回
	 * 
	 * @param response
	 *            流程ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/anyRebut")
	public String anyRebut(String id,String taskId,String comment,HttpServletResponse response,HttpSession session) throws Exception {
		JSONObject result = new JSONObject();
		try {
			// 首先根据ID查询任务
			Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
			String processDefinitionId = task.getProcessDefinitionId();
			String processInstanceId = task.getProcessInstanceId();
			ProcessDefinitionEntity definition = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
					.getDeployedProcessDefinition(task.getProcessDefinitionId());
			ActivityImpl currActivity = ((ProcessDefinitionImpl) definition).findActivity(task.getTaskDefinitionKey());
			List<PvmTransition> nextTransitionList = currActivity.getIncomingTransitions();// 获取流出方向
			// 清除当前活动的出口
			List<PvmTransition> oriPvmTransitionList = new ArrayList<PvmTransition>();
			List<PvmTransition> pvmTransitionList = currActivity.getOutgoingTransitions();// 获取流入方向
			for (PvmTransition pvmTransition : pvmTransitionList) {
				oriPvmTransitionList.add(pvmTransition);
			}
			pvmTransitionList.clear();
			// 建立新出口
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
			taskService.complete(task.getId());// 驳回新建的方向连接线是没有判定的
			// 恢复方向
			for (TransitionImpl transitionImpl : newTransitions) {
				currActivity.getOutgoingTransitions().remove(transitionImpl);
				transitionImpl.getDestination().getIncomingTransitions().remove(transitionImpl);
			}
			for (PvmTransition pvmTransition : oriPvmTransitionList) {
				pvmTransitionList.add(pvmTransition);
			}
			if(taskService.createTaskQuery().processInstanceId(processInstanceId).singleResult().getTaskDefinitionKey().equals(this.getElementType(processDefinitionId))){
				Leave leave=leaveService.findByProcessInstanceId(processInstanceId);
				leave.setState("驳回修改中");
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
	 * 签收任务列表
	 * 
	 * @param response
	 * @param page
	 *            当前页数
	 * @param rows
	 *            每页显示页数
	 * @param s_name
	 *            流程名称
	 * @param userId
	 *            流程ID
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
		// 获取总记录数
		System.out.println("用户ID：" + userId + "\n" + "名称:" + s_name);
		long total = taskService.createTaskQuery().taskCandidateUser(userId)
				.taskNameLike("%" + s_name + "%").count(); // 获取总记录数 
		// 有想法的话，可以去数据库观察 ACT_RU_TASK 的变化
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
	 * 签收任务
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
	 * 撤回 此功能可以类似驳回 异曲同工 暂时不理会
	 * 
	 * @param response
	 * @param processInstanceId
	 *            流程ID
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/recall")
	public String recall(HttpServletResponse response,String processInstanceId){
		JSONObject result = new JSONObject();
		try {
			BpmnModel bpmnModel = repositoryService.getBpmnModel(historyService.createHistoricProcessInstanceQuery()
					.processInstanceId(processInstanceId).singleResult().getProcessDefinitionId());// 获取模型
			Task task = taskService.createTaskQuery().processInstanceId(processInstanceId).orderByTaskId()
					.desc().list().get(0);// 任务
			ProcessDefinitionEntity definition = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService)
					.getDeployedProcessDefinition(task.getProcessDefinitionId());
			ActivityImpl currActivity = ((ProcessDefinitionImpl) definition).findActivity(task.getTaskDefinitionKey());
			List<PvmTransition> nextTransitionList = currActivity.getIncomingTransitions();// 获取流出方向
			// 清除当前活动的出口
			List<PvmTransition> oriPvmTransitionList = new ArrayList<PvmTransition>();
			List<PvmTransition> pvmTransitionList = currActivity.getOutgoingTransitions();// 获取流入方向
			for (PvmTransition pvmTransition : pvmTransitionList) {
				oriPvmTransitionList.add(pvmTransition);
			}
			pvmTransitionList.clear();
			List<ActivityImpl> nextActivityImplList = new ArrayList<>();
			// 建立新出口
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
			taskService.complete(task.getId());// 驳回新建的方向连接线是没有判定的
			// 恢复方向
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
				taskService.complete(task.getId(),varMap);// 驳回新建的方向连接线是没有判定的
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
