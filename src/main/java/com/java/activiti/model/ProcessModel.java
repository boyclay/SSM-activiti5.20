package com.java.activiti.model;

import java.io.Serializable;

public class ProcessModel implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -7343063119070677576L;

	private String id; // ���� ��ɫ��
	
	private String processName; // ����
	
	private String processKey;//key
	
	private String processDescription;//����

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProcessName() {
		return processName;
	}

	public void setProcessName(String processName) {
		this.processName = processName;
	}

	public String getProcessKey() {
		return processKey;
	}

	public void setProcessKey(String processKey) {
		this.processKey = processKey;
	}

	public String getProcessDescription() {
		return processDescription;
	}

	public void setProcessDescription(String processDescription) {
		this.processDescription = processDescription;
	}
}
