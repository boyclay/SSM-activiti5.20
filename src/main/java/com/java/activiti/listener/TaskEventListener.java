package com.java.activiti.listener;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;

import org.activiti.bpmn.model.ActivitiListener;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.activiti.engine.impl.el.FixedValue;
import org.springframework.context.ApplicationContext;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.context.support.XmlWebApplicationContext;

public class TaskEventListener extends ActivitiListener implements  TaskListener {
	
	private static final long serialVersionUID = 4414906133225588900L;
	@Override
	public void notify(DelegateTask arg0) {
		String eventName = arg0.getEventName(); 
		if ("create".endsWith(eventName)) {
			System.out.println("create===========");  
		}else if ("assignment".endsWith(eventName)) {  
			ServletContext sc = ContextLoader.getCurrentWebApplicationContext().getServletContext();
			XmlWebApplicationContext wac = (XmlWebApplicationContext) WebApplicationContextUtils
					.getWebApplicationContext(sc);
			Class clazz = wac.getBean("userService").getClass();
			try {
				Map<String,String> map = new HashMap<>();
				map.put("userId", arg0.getAssignee());
				Method md = clazz.getDeclaredMethod("sendMail", Map.class);
				ReflectionUtils.invokeMethod(md,  wac.getBean("userService"), map);
			} catch (Exception e) {
				e.printStackTrace();
			}
			System.out.println("create");  
		}else if ("complete".endsWith(eventName)) {  
		System.out.println("complete===========");  
		}else if ("delete".endsWith(eventName)) {  
		System.out.println("delete=============");  
		}  
	}
}
