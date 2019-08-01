package com.java.activiti.service;

import java.util.List;
import java.util.Map;

import com.java.activiti.model.Leave;

public interface LeaveService {
	public List<Leave> leavePage(Map<String,Object> map);
	
	public int leaveCount(Map<String,Object> map);
	
	public int addLeave(Leave leave);
	public Leave findById(String id);
	
	public Leave findByProcessInstanceId(String processInstanceId);
	
	public int updateLeave(Leave leave);
	
	public int updateLeaveData(Leave leave);
	
	public Leave getLeaveByTaskId(String processInstanceId);
}
