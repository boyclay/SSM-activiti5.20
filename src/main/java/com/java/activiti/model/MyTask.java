package com.java.activiti.model;

import java.io.Serializable;
import java.util.Date;

/**
 * �Զ�������ʵ�� תjson��ʱ���õ�
 * @author user
 *
 */
public class MyTask implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -7204139637862487338L;
	private String id; // ����id
	private String name; // ��������
	private Date createTime;  // ��������
	private Date endTime; // ��������
	private String owner; // ί����
	private String assignee;//������
	
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
