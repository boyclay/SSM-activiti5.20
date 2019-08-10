package com.java.activiti.model;

import java.io.Serializable;

public class RoleResources implements Serializable{
	
    private static final long serialVersionUID = -8559867942708057891L;
    
    private Integer roleId;//×éID
    
    private String resourcesId;//×ÊÔ´ID

	public Integer getRoleId() {
		return roleId;
	}

	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}

	public String getResourcesId() {
		return resourcesId;
	}

	public void setResourcesId(String resourcesId) {
		this.resourcesId = resourcesId;
	}
}