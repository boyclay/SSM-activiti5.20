package com.java.activiti.model;

import java.io.Serializable;
import java.util.Date;

/**
 * 自定义任务实体 转json的时候用到
 * @author user
 *
 */
public class MyTask implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -7204139637862487338L;
	private String id; // 任务id
	private String name; // 任务名称
	private Date createTime;  // 创建日期
	private Date endTime; // 结束日期
	private String owner; // 委托人
	private String assignee;//代理人
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Date getEndTime() {
		return endTime;
	}
	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public String getAssignee() {
		return assignee;
	}
	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}
}
