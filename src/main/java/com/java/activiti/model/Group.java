package com.java.activiti.model;

import org.apache.ibatis.type.Alias;

/**
 * 角色实体扩展
 * @author user
 *
 */
@Alias("Group")
public class Group {

	private String id; // 主键 角色名
	private String name; // 名称
	
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
