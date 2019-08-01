package com.java.activiti.event;

import org.springframework.context.ApplicationEvent;

public class CustomizeEvent extends ApplicationEvent {

	public CustomizeEvent(Object source) {
		super(source);
	}
}
