package com.java.activiti.model;

import org.apache.ibatis.type.Alias;

/**
 * ��ɫʵ����չ
 * @author user
 *
 */
@Alias("Group")
public class Group {

	private String id; // ���� ��ɫ��
	private String name; // ����
	
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
	
	
}
